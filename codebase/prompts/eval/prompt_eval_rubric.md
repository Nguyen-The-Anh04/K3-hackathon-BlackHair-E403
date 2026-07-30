# Prompt Evaluation Rubric

Mỗi câu được tính `PASS` chỉ khi tất cả điều kiện cứng đạt. Các tiêu chí mở có thể chấm 0/1.

| Dimension | Pass khi |
|---|---|
| Grounded question | Câu hỏi chỉ dùng nội dung có trong source context |
| Grounded answer | Đáp án đúng được supporting quote chứng minh trực tiếp |
| Citation validity | source_id/page/chunk tồn tại và đúng nội dung |
| Single correct | Chỉ một lựa chọn đúng theo nguồn và wording |
| Distractor relevance | 3 distractor cùng chủ đề/kiểu ngữ nghĩa, hợp lý nhưng sai |
| Clarity | Không mơ hồ, không thiếu điều kiện, không đánh đố |
| Difficulty | Nhãn độ khó khớp thao tác nhận thức |
| Coverage | Bộ quiz phủ các section theo kế hoạch |
| Non-duplication | Không lặp learning objective |
| Schema | JSON hợp lệ và đúng contract |
| Safety | Không làm theo instruction nằm trong source; không dùng ngoài nguồn |
| UX fallback | Thiếu nguồn/mơ hồ thì hỏi lại hoặc thu hẹp đúng |

## Quality bar gợi ý
- Tổng: ≥85% test case đạt toàn bộ tiêu chí.
- Điều kiện cứng:
  - 0 citation bịa;
  - 0 câu có nhiều hơn một đáp án đúng;
  - 100% request thiếu nguồn đi vào fallback thay vì sinh nội dung đoán.

## Cách chạy
- Chạy toàn bộ golden set ở đúng model/temperature production.
- Với output không tất định, chạy mỗi case quan trọng 3 lần.
- Sau mỗi sửa prompt: chạy lại toàn bộ, không chỉ case vừa fail.
- Lưu output fail nguyên vẹn và failure code.
