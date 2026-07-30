# Runtime prompt của VLearn Quiz Prototype

Thư mục này chỉ chứa các tệp đang phù hợp với code hiện tại.

## Tệp đang dùng

| Tệp | Vai trò |
|---|---|
| `quiz_generation_prompt.md` | Prompt duy nhất được `server.py` nạp khi khởi động |
| `quiz_response.schema.json` | Hợp đồng JSON khớp với dữ liệu backend/frontend hiện tại |
| `README.md` | Hướng dẫn và phạm vi |

## Luồng thực tế của prototype

```text
app.js gửi source_text + task + count=3
        ↓
server.py kiểm tra input và out-of-scope cơ bản
        ↓
server.py nạp quiz_generation_prompt.md
        ↓
Gemini tạo questions hoặc refusal
        ↓
server.py kiểm tra: đúng số câu, 4 lựa chọn, đáp án A–D
        ↓
app.js hiển thị quiz, tự chấm điểm, hiện giải thích và citation
```

Frontend hiện sử dụng các trường:

```json
{
  "question": "...",
  "options": ["...", "...", "...", "..."],
  "correct_option": "A",
  "explanation": "...",
  "citation": "[Trang 1]"
}
```

Backend chuyển chúng thành:

```json
{
  "text": "...",
  "options": ["...", "...", "...", "..."],
  "correct": 0,
  "explanation": "...",
  "citation": "[Trang 1]"
}
```

## Placeholder của prompt

Không đổi tên ba placeholder sau nếu chưa sửa `server.py`:

- `{{QUESTION_COUNT}}`
- `{{USER_TASK}}`
- `{{SOURCE_TEXT}}`

## Vì sao đã bỏ các tệp cũ?

Bộ prompt ban đầu mô tả một kiến trúc lớn hơn prototype đã build, gồm scope resolver bằng LLM, critic, repair, answer-feedback prompt, session-summary prompt, tool contracts và schema public/private. Code hiện tại không gọi các thành phần đó.

Các nội dung đã bỏ khỏi `codebase/prompts/`:

- thư mục `prompts/prompts/` nhiều bước;
- `eval/` lồng bên trong prompt;
- `integration/`;
- các schema không được frontend/backend dùng;
- file consolidated trùng lặp.

Golden set chính vẫn nằm ở thư mục gốc `eval/`, không đặt lẫn với runtime prompt.

## Chỉnh prompt

1. Sửa `quiz_generation_prompt.md`.
2. Giữ nguyên các placeholder.
3. Khởi động lại `python server.py` để nạp phiên bản mới.
4. Chạy `python eval/run_current_prompt.py` để đánh giá cùng prompt đang dùng.
