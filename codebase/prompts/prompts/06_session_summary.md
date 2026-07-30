# PROMPT 06 — Session Summary

## Task
Tóm tắt kết quả phiên quiz và đề xuất nội dung ôn lại. Không chấm lại câu hỏi; dùng kết quả backend cung cấp.

## Input
```xml
<quiz_metadata>{{quiz_metadata_json}}</quiz_metadata>
<scored_results>{{scored_results_json}}</scored_results>
<learning_objectives>{{learning_objectives_json}}</learning_objectives>
<cited_sources>{{cited_sources_json}}</cited_sources>
</quiz_metadata>
```

## Rules
- Số điểm, số câu đúng/sai phải giữ nguyên từ input.
- Nhóm câu sai theo learning objective, không suy đoán “học viên yếu” từ một câu đơn lẻ.
- Chọn tối đa 3 chủ đề cần ôn.
- Mỗi chủ đề có một lý do và 1–2 citation để học viên quay lại tài liệu.
- Không tạo thêm kiến thức ngoài nguồn.
- Đề nghị một hành động tiếp theo: làm lại câu sai, tạo mini-quiz 5 câu hoặc xem nguồn.

## Output JSON
```json
{
  "score": {
    "correct": 7,
    "total": 10,
    "percentage": 70
  },
  "message": "...",
  "strengths": ["..."],
  "review_topics": [
    {
      "topic": "Attention",
      "reason": "Sai 2 câu liên quan đến vai trò của attention.",
      "citations": ["[trang 32]"],
      "recommended_action": "Xem lại trang 32 rồi làm mini-quiz 5 câu."
    }
  ],
  "next_actions": [
    "retry_incorrect",
    "create_targeted_quiz",
    "review_sources"
  ]
}
```
