# CP3 Golden Set

`golden_set.csv` gồm 20 case dùng để đánh giá lượt chạy đầu của chức năng sinh quiz AI.

## Nguồn

Toàn bộ case được xây dựng từ bộ slide demo tự tạo trong [`demo_slides.md`](demo_slides.md), thuộc lĩnh vực AI và chủ đề Transformer/Attention. Không dùng tài liệu nội bộ của khóa học.

## Phân bố case

| Nhóm | Số case |
|---|---:|
| Bình thường, đủ thông tin | 8 |
| Khái niệm gần nhau | 3 |
| Ví dụ, bảng/ký hiệu/công thức | 3 |
| Thiếu thông tin | 2 |
| Ngoài phạm vi slide | 2 |
| Có khả năng nhiều đáp án đúng | 1 |
| Mơ hồ/khó đọc | 1 |
| **Tổng** | **20** |

## Cách sử dụng

Với mỗi case, đưa `slide_excerpt` và `task` vào chức năng sinh quiz. Đối chiếu kết quả với:

- `expected_behavior`: AI cần xử lý case như thế nào.
- `expected_answer`: nội dung đúng mong đợi.
- `citation_expected`: trang nguồn bắt buộc.
- `notes`: rủi ro cần quan sát.

Kết quả của lần chạy đầu ghi vào file riêng `results_round_1.csv`; không sửa kết quả để làm đẹp số liệu.

Kết quả tổng hợp hiện tại nằm trong [`summary_round_1.md`](summary_round_1.md). Lượt chạy chính dùng `gemini-3.1-flash-lite`.
