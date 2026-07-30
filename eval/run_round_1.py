"""Run the first real-AI evaluation over every golden-set case."""

import csv
import json
import os
import time
from pathlib import Path
from urllib.error import HTTPError, URLError
from urllib.request import Request, urlopen

import sys

EVAL_DIR = Path(__file__).resolve().parent
ROOT = EVAL_DIR.parent
sys.path.insert(0, str(ROOT / "codebase"))
import server  # noqa: E402


INPUT = EVAL_DIR / "golden_set.csv"
OUTPUT = EVAL_DIR / "results_round_1.csv"


def prompt_for_case(row):
    return f"""Bạn là hệ thống tạo quiz bám nguồn cho VLearn.
Chỉ sử dụng TÀI LIỆU NGUỒN bên dưới, không dùng kiến thức bên ngoài.
YÊU CẦU CỦA CASE: {row['task']}

Trả về duy nhất JSON hợp lệ theo schema:
{{"questions":[{{"question":"...","options":["...","...","...","..."],"correct_option":"A","explanation":"...","citation":"[Trang X]"}}]}}

Nếu yêu cầu không đủ thông tin hoặc nằm ngoài tài liệu, vẫn trả về JSON với questions là [] và thêm trường "refusal" giải thích ngắn gọn.

TÀI LIỆU NGUỒN:
{row['slide_excerpt']}
"""


def call_case(row):
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key or api_key == "your_gemini_api_key_here":
        raise RuntimeError("GEMINI_API_KEY chưa được cấu hình.")
    endpoint = f"https://generativelanguage.googleapis.com/v1beta/models/{server.MODEL}:generateContent?key={api_key}"
    payload = {
        "contents": [{"parts": [{"text": prompt_for_case(row)}]}],
        "generationConfig": {"temperature": 0.2, "responseMimeType": "application/json"},
    }
    request = Request(endpoint, data=json.dumps(payload).encode("utf-8"), headers={"Content-Type": "application/json"}, method="POST")
    last_error = None
    for attempt in range(3):
        try:
            with urlopen(request, timeout=60) as response:
                result = json.loads(response.read().decode("utf-8"))
            text = result["candidates"][0]["content"]["parts"][0]["text"]
            return json.loads(text)
        except HTTPError as error:
            detail = error.read().decode("utf-8", errors="replace")
            last_error = f"HTTP {error.code}: {detail[:400]}"
            if error.code not in (429, 500, 502, 503, 504):
                break
            time.sleep(2 ** attempt)
        except (URLError, KeyError, IndexError, TypeError, json.JSONDecodeError) as error:
            last_error = str(error)
            break
    raise RuntimeError(last_error or "Unknown API error")


def main():
    rows = list(csv.DictReader(INPUT.open(encoding="utf-8", newline="")))
    fieldnames = [
        "case_id", "category", "ai_output", "valid_question", "answer_correct",
        "citation_correct", "explanation_grounded", "single_correct_answer",
        "no_hallucination", "insufficient_case_handled", "error", "review_notes",
    ]
    with OUTPUT.open("w", encoding="utf-8", newline="") as stream:
        writer = csv.DictWriter(stream, fieldnames=fieldnames)
        writer.writeheader()
        for index, row in enumerate(rows, start=1):
            print(f"[{index}/{len(rows)}] {row['case_id']}", flush=True)
            result = {}
            error = ""
            try:
                result = call_case(row)
            except Exception as exc:  # keep every case in the table, including failures
                error = str(exc)
            writer.writerow({
                "case_id": row["case_id"],
                "category": row["category"],
                "ai_output": json.dumps(result, ensure_ascii=False),
                "valid_question": "REVIEW",
                "answer_correct": "REVIEW",
                "citation_correct": "REVIEW",
                "explanation_grounded": "REVIEW",
                "single_correct_answer": "REVIEW",
                "no_hallucination": "REVIEW",
                "insufficient_case_handled": "REVIEW",
                "error": error,
                "review_notes": "Đánh giá thủ công sau khi chạy lượt 1.",
            })
            stream.flush()
            time.sleep(0.5)
    print(f"Wrote {len(rows)} rows to {OUTPUT}")


if __name__ == "__main__":
    main()
