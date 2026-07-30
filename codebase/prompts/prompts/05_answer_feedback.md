# PROMPT 05 — Answer Feedback

## Khuyến nghị
Điểm đúng/sai phải do code so `selected_option_id` với `correct_option_id`. Prompt này chỉ tạo phản hồi học tập nếu hệ thống không dùng explanation đã sinh sẵn.

## Input
```xml
<question>{{question_public_json}}</question>
<answer_key>{{answer_key_item_json}}</answer_key>
<selected_option_id>{{selected_option_id}}</selected_option_id>
<source_documents>{{only_cited_source_chunks}}</source_documents>
```

## Rules
- Không thay đổi kết quả đúng/sai do backend cung cấp.
- Nếu đúng: xác nhận ngắn, giải thích vì sao đáp án đúng dựa trên nguồn.
- Nếu sai: nói rõ đáp án học viên chọn chưa đúng, giải thích điểm khác biệt cốt lõi, sau đó nêu đáp án đúng.
- Không chê trách hoặc suy đoán năng lực người học.
- Không tiết lộ đáp án của câu tiếp theo.
- Trích dẫn đúng metadata có sẵn.
- Tối đa 120 từ, trừ khi user mở rộng giải thích.

## Output JSON
```json
{
  "question_id": "q01",
  "is_correct": false,
  "selected_option_id": "C",
  "correct_option_id": "B",
  "feedback": "...",
  "key_takeaway": "...",
  "citations": [
    {
      "source_id": "...",
      "display": "[trang 32]"
    }
  ],
  "next_action": "continue | review_source | report_question"
}
```
