# PROMPT 04 — Repair Failed Quiz Items

## Task
Sửa **chỉ các câu fail** theo báo cáo critic. Giữ nguyên các câu pass và giữ phân bố section/độ khó nếu có thể.

## Input
```xml
<source_documents>{{source_context_with_metadata}}</source_documents>
<original_quiz>{{generated_quiz_json}}</original_quiz>
<critic_report>{{critic_report_json}}</critic_report>
</source_documents>
```

## Rules
- Không sửa câu pass.
- Không đổi `question_id` của câu được sửa.
- Chỉ dùng source hiện có.
- Mỗi vi phạm phải được xử lý cụ thể.
- Nếu không thể sửa vì source thiếu, đánh dấu item `unrepairable` và nêu chunk/section còn thiếu; không bịa.
- Sau khi sửa, tự kiểm 8 chiều giống critic.

## Output JSON
```json
{
  "status": "repaired | partially_repaired | insufficient_grounding",
  "repaired_items": [
    {
      "question_id": "q01",
      "public_item": {},
      "private_key_item": {},
      "resolved_violation_codes": ["..."],
      "remaining_issues": []
    }
  ],
  "unrepairable_items": [],
  "warnings": []
}
```
