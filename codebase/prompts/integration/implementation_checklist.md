# Implementation Checklist

## Backend
- [ ] Resolve đúng material/day/page range.
- [ ] Retrieve theo outline để phủ toàn bài.
- [ ] Truyền metadata citation cùng text.
- [ ] Dùng structured output/JSON schema.
- [ ] Validate JSON bằng code.
- [ ] Chạy critic và repair tối đa 2 vòng.
- [ ] Lưu `private_answer_key` server-side.
- [ ] Tính điểm bằng code, không bằng LLM.
- [ ] Log prompt version, model, temperature, latency, status, failure code.

## Frontend
- [ ] Cho chọn số câu và phạm vi: đoạn/trang/bài.
- [ ] Hiển thị rõ “Câu hỏi tạo từ tài liệu X”.
- [ ] Chỉ cho chọn một option.
- [ ] Sau submit: đúng/sai, giải thích, citation có thể bấm về trang.
- [ ] Có “Báo câu hỏi sai/mơ hồ”.
- [ ] Có đường lui khi không đủ nguồn.
- [ ] Cho bỏ qua và quay lại.

## Safety/quality
- [ ] Source text được delimit và coi là untrusted data.
- [ ] Test prompt injection nằm trong slide/transcript.
- [ ] 0 fabricated citation.
- [ ] 0 multiple-correct question trong golden set.
- [ ] Không tự giảm quality bar sau khi đo.
