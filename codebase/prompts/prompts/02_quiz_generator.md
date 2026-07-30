# PROMPT 02 — Grounded Quiz Generator

## Task
Tạo một bộ câu hỏi trắc nghiệm ôn tập từ source context. Mỗi câu có đúng 1 đáp án đúng trong 4 phương án, giải thích và citation. Không dùng kiến thức ngoài nguồn.

## Input
```xml
<quiz_request>
{{resolved_quiz_request_json}}
</quiz_request>

<material_metadata>
{{material_metadata_json}}
</material_metadata>

<coverage_report>
{{coverage_report_json}}
</coverage_report>

<source_documents>
{{source_context_with_metadata}}
</source_documents>
```

## Source format kỳ vọng
Mỗi chunk có dạng:
```json
{
  "source_id": "material_ms2039d0_hnxpxy:p32:c2",
  "material_id": "material_ms2039d0_hnxpxy",
  "material_title": "day01_302.pdf",
  "section_title": "Attention",
  "page": 32,
  "chunk_id": "p32-c2",
  "text": "..."
}
```

## Quy trình thực hiện
1. Kiểm tra coverage: liệu source context có đủ phần chính và đủ bằng chứng để tạo số câu yêu cầu không.
2. Lập danh sách learning objective từ source, không thêm kiến thức ngoài.
3. Phân bổ số câu theo section và độ khó; tránh để một section chiếm quá 40% trừ khi phạm vi chỉ có section đó.
4. Viết câu hỏi, đáp án đúng và 3 distractor cùng chủ đề.
5. Tự kiểm từng câu theo checklist:
   - answerable solely from source;
   - exactly one correct option;
   - four unique options;
   - citation exists;
   - supporting quote proves the key;
   - no duplicate learning objective;
   - distractors plausible and clearly wrong;
   - wording unambiguous.
6. Nếu không đủ căn cứ, không tạo câu yếu để đủ số lượng.

## Yêu cầu distractor
- Ưu tiên lấy từ khái niệm gần, bước lân cận, hiểu lầm thường gặp hoặc đảo quan hệ nguyên nhân–kết quả.
- Không thay một từ vô nghĩa để tạo đáp án sai.
- Không dùng kiến thức ngoài tài liệu.
- Nếu một distractor cũng có thể đúng trong bối cảnh khác, sửa câu hỏi để ràng buộc ngữ cảnh hoặc thay distractor.

## Tách dữ liệu public/private
- `public_quiz` được gửi cho frontend trước khi học viên trả lời; không chứa đáp án đúng.
- `private_answer_key` chỉ lưu backend; không gửi frontend trước khi submit.
- `question_id` phải khớp giữa hai phần.

## Output
Chỉ trả JSON hợp lệ theo `quiz_generation_response.schema.json`.

## Status rules
- `ready`: tạo đủ số câu và tất cả câu đạt tự kiểm.
- `need_clarification`: phạm vi chưa đủ rõ.
- `insufficient_grounding`: phạm vi rõ nhưng source không đủ; trả `safe_question_count` và `missing_coverage`.
- `source_conflict`: nguồn mâu thuẫn ở nội dung cốt lõi.
