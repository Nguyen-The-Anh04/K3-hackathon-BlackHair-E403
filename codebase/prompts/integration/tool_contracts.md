# Retrieval / Tool Contracts

## Vì sao cần thay đổi retrieval hiện tại?
Trong ảnh lỗi, tutor đang ở trang 32 nhưng học viên yêu cầu “10 câu ôn tập của slide Day 1”. Nếu hệ thống chỉ gửi trang 32 hoặc top-k chunk theo câu “tạo quiz”, model không có đủ coverage để tạo bộ quiz toàn bài. Prompt không thể khắc phục thiếu dữ liệu này.

## Contract tối thiểu

### 1. `resolve_material_scope`
**Input**
```json
{
  "course_id": "...",
  "current_material_id": "...",
  "user_request": "...",
  "current_page": 32
}
```
**Output**
```json
{
  "scope_type": "current_material",
  "material_ids": ["material_ms2039d0_hnxpxy"],
  "page_range": null,
  "needs_clarification": false
}
```

### 2. `get_material_outline`
Trả danh sách section và page range. Đây là bước quan trọng để bảo đảm coverage toàn bài, không chỉ semantic top-k.
```json
{
  "material_id": "...",
  "sections": [
    {"section_id": "s01", "title": "Bức tranh AI", "page_from": 5, "page_to": 9},
    {"section_id": "s02", "title": "Lịch sử AI", "page_from": 10, "page_to": 20}
  ]
}
```

### 3. `get_chunks_by_sections`
Lấy 2–4 chunk đại diện cho mỗi section hoặc lấy toàn bộ text nếu tài liệu đủ ngắn.
```json
{
  "material_id": "...",
  "section_ids": ["s01", "s02"],
  "max_chunks_per_section": 4
}
```

### 4. `get_exact_source_chunks`
Dùng để kiểm lại citation trước khi chốt câu.
```json
{
  "source_ids": ["material:p32:c2"]
}
```

## Nếu chỉ có tool `search_slides`
Không nên gọi một lần với query “tạo quiz Day 1”. Hãy:
1. lấy outline hoặc list page;
2. query theo từng section chính;
3. gộp và deduplicate chunk;
4. tạo `coverage_report`;
5. mới gọi generator.

## Coverage report
```json
{
  "requested_scope": "current_material",
  "total_sections": 8,
  "covered_sections": 8,
  "missing_sections": [],
  "coverage_ratio": 1.0,
  "source_chunk_count": 27
}
```

## Code validations trước/hoặc sau LLM
- JSON parse được và khớp schema.
- Số câu đúng yêu cầu.
- Mỗi câu có A/B/C/D đúng một lần.
- `correct_option_id` nằm trong options.
- Không có option text trùng nhau sau normalize.
- Mọi source_id trong answer key tồn tại trong retrieved context.
- Public quiz không chứa `correct_option_id`, explanation hoặc supporting quote.
- Phân bố đáp án đúng không lệch quá mạnh; với 10 câu, mỗi chữ nên xuất hiện 2–3 lần nếu chất lượng nội dung cho phép.
