"""Minimal local backend for the CP3 real-AI prototype."""

import json
import os
import re
import unicodedata
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.error import HTTPError, URLError
from urllib.request import Request, urlopen

ROOT = Path(__file__).resolve().parent
HOST = "127.0.0.1"
PORT = int(os.getenv("PORT", "8000"))


def load_dotenv():
    """Load simple KEY=VALUE pairs without requiring python-dotenv."""
    env_file = ROOT / ".env"
    if not env_file.is_file():
        return
    for line in env_file.read_text(encoding="utf-8").splitlines():
        line = line.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        key, value = line.split("=", 1)
        os.environ.setdefault(key.strip(), value.strip().strip('"').strip("'"))


load_dotenv()
MODEL = os.getenv("GEMINI_MODEL", "gemini-3.1-flash-lite")
GENERIC_TASK_WORDS = {
    "hay", "hãy", "tao", "tạo", "cau", "câu", "hoi", "hỏi", "trac", "trắc",
    "nghiem", "nghiệm", "on", "ôn", "tap", "tập", "tu", "từ", "tai", "tài",
    "lieu", "liệu", "nay", "này", "cho", "toi", "tôi", "ve", "về", "mot", "một",
    "ba", "3", "bo", "bộ", "slide", "slides", "quiz", "mcq", "trong", "theo",
}
QUIZ_REQUEST_TERMS = ("quiz", "cau hoi", "trac nghiem", "on tap", "kiem tra", "mcq")


def make_prompt(source_text: str, count: int, task: str) -> str:
    return f"""Bạn là bộ sinh quiz cho ứng dụng học tập VLearn.

QUY TẮC BẮT BUỘC:
- Chỉ sử dụng thông tin xuất hiện trong TÀI LIỆU NGUỒN bên dưới.
- Không dùng kiến thức bên ngoài và không suy đoán.
- Tạo đúng {count} câu hỏi trắc nghiệm, mỗi câu có đúng 4 lựa chọn và đúng 1 đáp án.
- Giải thích ngắn gọn bằng tiếng Việt, chỉ dựa trên tài liệu.
- citation phải trỏ tới trang/đoạn có trong tài liệu. Nếu tài liệu không có số trang, dùng [Tài liệu nguồn].
- Nếu một ý không đủ căn cứ, không dùng ý đó để tạo câu hỏi.
- Nếu yêu cầu nằm ngoài tài liệu hoặc không đủ căn cứ, trả về questions rỗng và trường refusal.
- Không biến một yêu cầu ngoài tài liệu thành một quiz chung chung về chủ đề khác.

Trả về DUY NHẤT JSON hợp lệ, không markdown, theo schema:
{{"questions":[{{"question":"...","options":["...","...","...","..."],"correct_option":"A","explanation":"...","citation":"[Trang X]"}}]}}

YÊU CẦU CỦA NGƯỜI DÙNG:
{task}

TÀI LIỆU NGUỒN:
{source_text}
"""


def normalize_for_scope(text: str) -> str:
    text = unicodedata.normalize("NFD", text.lower())
    return "".join(char for char in text if unicodedata.category(char) != "Mn")


def is_quiz_request(task: str) -> bool:
    normalized = normalize_for_scope(task)
    return any(term in normalized for term in QUIZ_REQUEST_TERMS)


def find_out_of_scope_term(source_text: str, task: str):
    source = normalize_for_scope(source_text)
    task_tokens = re.findall(r"[a-z0-9]+", normalize_for_scope(task))
    source_tokens = set(re.findall(r"[a-z0-9]+", source))
    generic_tokens = {normalize_for_scope(word) for word in GENERIC_TASK_WORDS}
    # These are instructions about the quiz output, not source topics.
    generic_tokens.update({"giai", "thich"})
    for token in task_tokens:
        if len(token) < 4 or token in generic_tokens:
            continue
        if token not in source_tokens:
            return token
    return None


def call_gemini(source_text: str, count: int, task: str):
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        raise RuntimeError("Chưa có GEMINI_API_KEY trong biến môi trường.")
    endpoint = f"https://generativelanguage.googleapis.com/v1beta/models/{MODEL}:generateContent?key={api_key}"
    payload = {
        "contents": [{"parts": [{"text": make_prompt(source_text, count, task)}]}],
        "generationConfig": {"temperature": 0.2, "responseMimeType": "application/json"},
    }
    request = Request(endpoint, data=json.dumps(payload).encode("utf-8"), headers={"Content-Type": "application/json"}, method="POST")
    try:
        with urlopen(request, timeout=60) as response:
            result = json.loads(response.read().decode("utf-8"))
    except HTTPError as error:
        detail = error.read().decode("utf-8", errors="replace")
        raise RuntimeError(f"Gemini API trả lỗi HTTP {error.code}: {detail[:500]}") from error
    except URLError as error:
        raise RuntimeError(f"Không kết nối được tới Gemini API: {error.reason}") from error
    try:
        raw_text = result["candidates"][0]["content"]["parts"][0]["text"]
        parsed = json.loads(raw_text)
    except (KeyError, IndexError, TypeError, json.JSONDecodeError) as error:
        raise RuntimeError("AI trả về dữ liệu không đúng JSON mong đợi.") from error

    # Some Gemini responses follow the prompt schema while others return the
    # questions array directly. Normalize both forms before validating them.
    if isinstance(parsed, list):
        questions = parsed
        refusal = None
    elif isinstance(parsed, dict):
        questions = parsed.get("questions")
        refusal = parsed.get("refusal")
    else:
        raise RuntimeError("AI trả về JSON không phải object hoặc array.")
    if questions == [] and refusal:
        return {"questions": [], "refusal": str(refusal)}
    if not isinstance(questions, list) or len(questions) != count:
        raise RuntimeError(f"AI không trả về đúng {count} câu hỏi.")
    normalized = []
    for item in questions:
        if not isinstance(item, dict):
            raise RuntimeError("Một câu hỏi AI không có dạng object hợp lệ.")
        options = item.get("options")
        answer = str(item.get("correct_option", "")).strip().upper()
        if not isinstance(options, list) or len(options) != 4 or answer not in "ABCD":
            raise RuntimeError("Một câu hỏi AI không có đúng 4 lựa chọn hoặc đáp án hợp lệ.")
        normalized.append({
            "text": str(item.get("question", "")).strip(),
            "options": [str(option).strip() for option in options],
            "correct": ord(answer) - ord("A"),
            "explanation": str(item.get("explanation", "")).strip(),
            "citation": str(item.get("citation", "[Tài liệu nguồn]")).strip(),
        })
    return {"questions": normalized}


class Handler(BaseHTTPRequestHandler):
    def send_json(self, status, payload):
        body = json.dumps(payload, ensure_ascii=False).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.send_header("Access-Control-Allow-Origin", "*")
        self.end_headers()
        self.wfile.write(body)

    def do_OPTIONS(self):
        self.send_response(204)
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.send_header("Access-Control-Allow-Methods", "POST, OPTIONS")
        self.end_headers()

    def do_POST(self):
        if self.path != "/api/generate-quiz":
            self.send_json(404, {"error": "Endpoint không tồn tại."})
            return
        try:
            length = int(self.headers.get("Content-Length", "0"))
            body = json.loads(self.rfile.read(length).decode("utf-8"))
            source_text = str(body.get("source_text", "")).strip()
            count = int(body.get("count", 3))
            task = str(body.get("task", "Tạo 3 câu hỏi trắc nghiệm ôn tập từ tài liệu này.")).strip()
            if not source_text:
                raise ValueError("Nội dung tài liệu đang trống.")
            if not task:
                raise ValueError("Yêu cầu kiểm thử đang trống.")
            if count < 1 or count > 10:
                raise ValueError("Số câu hỏi phải nằm trong khoảng từ 1 đến 10.")
            if not is_quiz_request(task):
                self.send_json(200, {
                    "questions": [],
                    "refusal": "Mình chỉ hỗ trợ tạo câu hỏi trắc nghiệm ôn tập dựa trên tài liệu được cung cấp.",
                    "model": MODEL,
                })
                return
            out_of_scope_term = find_out_of_scope_term(source_text, task)
            if out_of_scope_term:
                self.send_json(200, {
                    "questions": [],
                    "refusal": f"Yêu cầu có chủ đề '{out_of_scope_term}' không xuất hiện trong tài liệu được cung cấp.",
                    "model": MODEL,
                })
                return
            result = call_gemini(source_text, count, task)
            self.send_json(200, {**result, "model": MODEL})
        except (ValueError, RuntimeError, json.JSONDecodeError) as error:
            self.send_json(400, {"error": str(error)})
        except Exception as error:
            self.send_json(500, {"error": f"Lỗi backend không mong đợi: {error}"})

    def do_GET(self):
        relative = "index.html" if self.path in ("/", "") else self.path.lstrip("/")
        file_path = (ROOT / relative).resolve()
        if ROOT not in file_path.parents and file_path != ROOT:
            self.send_error(403)
            return
        if not file_path.is_file():
            self.send_error(404)
            return
        content_type = "text/html; charset=utf-8"
        if file_path.suffix == ".js": content_type = "text/javascript; charset=utf-8"
        elif file_path.suffix == ".css": content_type = "text/css; charset=utf-8"
        body = file_path.read_bytes()
        self.send_response(200)
        self.send_header("Content-Type", content_type)
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)


if __name__ == "__main__":
    print(f"VLearn CP3 server: http://{HOST}:{PORT}")
    print(f"Gemini model: {MODEL}")
    ThreadingHTTPServer((HOST, PORT), Handler).serve_forever()
