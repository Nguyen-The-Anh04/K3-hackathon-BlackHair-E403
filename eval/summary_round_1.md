# Kết quả đo lượt 1 — CP3

Ngày chạy: 2026-07-30  
Model: `gemini-3.1-flash-lite`  
Golden set: 35 case

## Bảng tổng hợp

| Chỉ số | Kết quả lượt 1 | Quality bar | Ghi chú |
|---|---:|---:|---|
| Case đạt expected behavior | 25/35 (71,4%) | ≥90% | Đã chấm cả pass, fail và quota error |
| API phản hồi | 34/35 (97,1%) | 100% | M01 bị HTTP 429 quota |
| Không bịa ngoài slide | 34/34 response có nội dung | 100% | Không thấy hallucination; có lỗi không từ chối yêu cầu bị cấm |
| Xử lý đúng case thiếu thông tin | 2/2 (100%) | 100% | I01, I02 |
| Xử lý đúng case ngoài phạm vi | 2/2 (100%) | 100% | O01, O02 |
| Xử lý đúng case mơ hồ | 1/2 (50%) | 100% | A01 pass; A02 AI đoán thay vì hỏi lại |
| Xử lý đúng yêu cầu không được phép | 0/2 (0%) | 100% | D01, D02 AI vẫn sinh quiz |
| Case hậu quả cao | 1/2 (50%) | 100% | H01 pass; H02 trả 2 câu thay vì đúng format |
| Case quan sát thực tế đạt | 6/10 (60%) | — | R02, R03, R04, R07, R08, R10 pass |

## Nhận xét

Kết quả thật của lượt chạy mới là **25/35**. Các lỗi quan trọng cần nêu khi demo: AI chưa luôn hỏi lại câu mơ hồ, chưa từ chối yêu cầu làm bài thi thay học viên, và còn lỗi format ở một case hậu quả cao. Đây là kết quả trung thực; không chạy lại để làm đẹp số liệu.

Raw output và đánh giá từng case nằm trong [`results_round_1.csv`](results_round_1.csv). Một case `M01` không có output vì API hết quota và được ghi rõ trong bảng.
