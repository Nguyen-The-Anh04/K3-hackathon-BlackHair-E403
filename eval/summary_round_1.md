# Kết quả đo lượt 1 — CP3

Ngày chạy: 2026-07-30  
Model: `gemini-3.1-flash-lite`  
Golden set: 20 case

## Bảng tổng hợp

| Chỉ số | Kết quả lượt 1 | Quality bar | Ghi chú |
|---|---:|---:|---|
| API phản hồi | 20/20 (100%) | 100% | Không có lỗi quota/API |
| JSON hợp lệ | 20/20 (100%) | 100% | Gồm cả quiz và refusal |
| Quiz hợp lệ ở case cần sinh quiz | 14/15 (93,3%) | ≥90% | C02 là false negative: AI từ chối dù đủ thông tin |
| Đáp án đúng | 14/14 (100%) | ≥90% | Đối chiếu thủ công |
| Citation đúng | 14/14 (100%) | 100% | Đều trỏ đúng trang nguồn |
| Giải thích bám sát slide | 14/14 (100%) | ≥90% | Đối chiếu thủ công |
| Một đáp án đúng duy nhất | 14/14 (100%) | 100% | Case M01 được gộp thành một lựa chọn đúng |
| Không bịa ngoài slide | 20/20 (100%) | 100% | Quiz bám nguồn; case ngoài phạm vi/thiếu thông tin đều refusal |
| Xử lý đúng case thiếu thông tin | 2/2 (100%) | 100% | I01, I02 |
| Xử lý đúng case ngoài phạm vi | 2/2 (100%) | 100% | O01, O02 |
| Xử lý đúng case mơ hồ | 1/1 (100%) | — | A01 được từ chối đúng |

## Nhận xét

Model `gemini-3.1-flash-lite` đã phản hồi đủ cả 20 case và trả JSON hợp lệ. Chất lượng đầu ra đạt các quality bar chính. Một lỗi cần ghi nhận là C02: tài liệu có đủ thông tin về thứ tự tính attention score nhưng AI từ chối tạo câu hỏi, tức false negative chứ không phải hallucination.

Raw output và đánh giá từng case nằm trong [`results_round_1.csv`](results_round_1.csv). Đây là kết quả chính thức của model `gemini-3.1-flash-lite`.
