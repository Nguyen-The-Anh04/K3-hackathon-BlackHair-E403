# VLearn AI Tutor — Prompt Pack tạo quiz ôn tập

**Phiên bản:** 1.0  
**Lát cắt:** Học viên chọn một bài giảng/phạm vi học, VLearn tạo bộ câu hỏi trắc nghiệm một đáp án đúng, chấm điểm, giải thích và trích dẫn nguồn.

## 1. Kết luận kiến trúc quan trọng

Prompt không thể tự đọc toàn bộ bài giảng nếu backend chỉ truyền trang hiện tại hoặc đoạn đang bôi đen. Với yêu cầu “tạo 10 câu ôn tập toàn bộ Day 1”, tầng retrieval phải cấp đủ nội dung của toàn bộ tài liệu hoặc các đoạn đại diện cho mọi phần chính.

**Tối thiểu backend cần truyền:**
- `material_id`, `material_title`, `scope_type`, `page_range` hoặc `section_ids`;
- outline/danh sách section của tài liệu;
- các source chunk có `source_id`, `page`, `chunk_id`, `section_title`, `text`;
- coverage report cho biết section nào đã có/thiếu dữ liệu.

Nếu coverage không đủ, model phải thu hẹp phạm vi hoặc hỏi lại, không được bịa cho đủ số câu.

## 2. Flow đề xuất

```text
User request
  → Scope Resolver
  → Context Builder/Retrieval
  → Quiz Generator
  → Code Validator (JSON, 4 lựa chọn, unique ID, citation tồn tại)
  → Semantic Critic (grounding, 1 đáp án đúng, distractor hợp lý)
  → Repair các câu fail, tối đa 2 vòng
  → UI hiển thị public_quiz
  → Backend chấm điểm bằng answer_key
  → Hiển thị explanation + citation
  → Session Summary tùy chọn
```

## 3. Dùng bản nào trong hackathon?

- **Nhanh nhất để đạt CP3:** `prompts/07_monolithic_hackathon_prompt.md` + JSON schema.
- **Ổn định hơn:** pipeline modular từ `01` đến `06`.
- **Không dùng LLM để tính điểm.** Điểm được tính bằng code: `correct_count / total_questions * 100`.
- Correct answer/explanation nằm ở backend; frontend chỉ nhận `public_quiz` trước khi học viên trả lời.

## 4. Biến đầu vào chung

- `{{user_request}}`: yêu cầu nguyên văn của học viên.
- `{{material_metadata}}`: metadata tài liệu.
- `{{requested_count}}`: mặc định 10, giới hạn prototype 5–20.
- `{{difficulty_mix}}`: mặc định 30% nhận biết, 40% thông hiểu, 20% vận dụng, 10% phân tích.
- `{{source_context}}`: các đoạn nguồn đã retrieve, có metadata đầy đủ.
- `{{coverage_report}}`: mức phủ theo section/page.
- `{{language}}`: `vi`.

## 5. Ngưỡng đề xuất

- Không sinh câu nếu citation không tồn tại trong source context.
- Không ép đủ số lượng nếu nguồn không đủ; trả `insufficient_grounding` và `safe_question_count`.
- Mọi câu phải có đúng 4 lựa chọn khác nhau và đúng 1 đáp án.
- Mỗi câu phải được hỗ trợ trực tiếp bởi ít nhất 1 source chunk.
- Với quiz 10 câu, nên phủ ít nhất 4 section chính nếu tài liệu có từ 4 section trở lên.
- Quality bar gợi ý: ≥85% case đạt toàn bộ tiêu chí; điều kiện cứng: 0 câu bịa citation, 0 câu có hơn một đáp án đúng.

## 6. File trong pack

- `prompts/00_system_prompt.md`: policy layer dùng chung.
- `prompts/01_scope_resolver.md`: chuẩn hóa yêu cầu và quyết định hỏi lại.
- `prompts/02_quiz_generator.md`: tạo quiz có grounding.
- `prompts/03_quiz_critic.md`: kiểm tra semantic.
- `prompts/04_quiz_repair.md`: sửa riêng câu fail.
- `prompts/05_answer_feedback.md`: phản hồi sau từng câu.
- `prompts/06_session_summary.md`: tổng kết cuối lượt.
- `prompts/07_monolithic_hackathon_prompt.md`: bản một-call dễ tích hợp.
- `schemas/`: JSON schema.
- `integration/`: contract retrieval/tool và checklist.
- `eval/`: rubric, golden-set template và version log.
