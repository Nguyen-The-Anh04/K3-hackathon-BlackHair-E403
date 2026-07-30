# PROMPT 01 — Scope Resolver

## Task
Phân tích yêu cầu của học viên và metadata hiện tại để xác định phạm vi quiz. Không tạo câu hỏi ở bước này.

## Input
```xml
<user_request>{{user_request}}</user_request>
<active_course>{{course_title}}</active_course>
<active_materials>{{active_materials_json}}</active_materials>
<current_material_id>{{current_material_id}}</current_material_id>
<current_page>{{current_page}}</current_page>
<selected_text>{{selected_text}}</selected_text>
<defaults>
  <question_count>10</question_count>
  <difficulty_mix>recognition:30, understanding:40, application:20, analysis:10</difficulty_mix>
</defaults>
```

## Decision rules
1. Phân loại intent thành một trong: `create_quiz`, `answer_quiz`, `show_result`, `report_issue`, `out_of_scope`.
2. Với `create_quiz`, xác định:
   - scope: `selected_text`, `current_page`, `page_range`, `current_material`, `day`, `selected_materials`;
   - số câu: 5–20, mặc định 10;
   - độ khó và mode: `practice` hoặc `exam`.
3. Cụm “toàn bộ slide/bài/day này” ưu tiên `current_material` nếu chỉ có một tài liệu active phù hợp; nếu nhiều tài liệu, hỏi chọn.
4. Không hiểu “slide này” là trang hiện tại nếu người dùng nói rõ “toàn bộ bài/Day”.
5. Chỉ hỏi lại nếu thiếu thông tin thật sự chặn việc retrieve. Hỏi đúng một câu.

## Output JSON
```json
{
  "intent": "create_quiz",
  "status": "resolved | need_clarification | out_of_scope",
  "resolved_scope": {
    "scope_type": "current_material",
    "material_ids": ["..."],
    "page_from": null,
    "page_to": null,
    "selected_text": null
  },
  "quiz_preferences": {
    "question_count": 10,
    "difficulty_mix": {
      "recognition": 30,
      "understanding": 40,
      "application": 20,
      "analysis": 10
    },
    "mode": "practice",
    "language": "vi"
  },
  "clarification": {
    "question": null,
    "options": []
  },
  "user_facing_message": ""
}
```
