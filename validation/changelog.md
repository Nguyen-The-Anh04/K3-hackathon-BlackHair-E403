# Changelog — CP5 Validation

Ngày: 2026-07-31  
Nhóm: K3 BlackHair  
Prototype: VLearn Quiz Generator

---

## Thay đổi từ validation (CP5)

### 1. Thêm nút thu phóng (+/-) vào slide viewer
- **Feedback từ:** Nghĩa (Học viên) — *"nhóm bị thiếu tính năng thu phóng giao diện để cho user dễ nhìn text hơn"*
- **Mức nghiêm trọng:** Trung bình
- **Thay đổi:** Thêm 2 nút + và - ở góc slide viewer, cho phép user phóng to/thu nhỏ text. Mặc định zoom 100%, phóng to tối đa 150%.
- **Lý do:** Text trên slide nhỏ, khó đọc khi làm quiz trên màn hình nhỏ (laptop 13-14 inch).
- **Commit:** [sẽ điền sau]

### 2. Mở rộng giải thích khi trả lời sai
- **Feedback từ:** Lưu (Học viên) — *"giải thích đúng nhưng chưa đủ chi tiết. Mình muốn hệ thống giải thích rõ hơn tại sao các đáp án khác không đúng"*
- **Mức nghiêm trọng:** Thấp
- **Thay đổi:** Khi học viên trả lời sai, ngoài giải thích đáp án đúng, thêm 1-2 câu giải thích ngắn gọn tại sao các đáp án khác không đúng (dựa trên slide).
- **Lý do:** Học viên hiểu đáp án đúng nhưng chưa hiểu rõ tại sao chọn đáp án khác là sai — dễ bị nhầm lẫn khi gặp câu tương tự sau.
- **Commit:** [sẽ điền sau]

### 3. Làm nổi bật nút "Làm lại"
- **Feedback từ:** Phong (Học viên) — *"không thấy nút làm lại rõ ràng, phải bấm lại từ đầu"*
- **Mức nghiêm trọng:** Thấp
- **Thay đổi:** Đổi màu nút "Làm lại" thành màu nổi bật (xanh lá), đặt ở vị trí dễ thấy ngay dưới điểm số.
- **Lý do:** User flow hiện tại có nút "Làm lại" nhưng bị merge với các nút khác, khó nhận diện.
- **Commit:** [sẽ điền sau]

---

## Giữ nguyên có lý do

| Tính năng | Lý do giữ nguyên |
|---|---|
| Cấu trúc 3 câu trắc nghiệm mỗi lần | Đủ để kiểm tra nhanh mà không quá mệt mỏi. Feedback không yêu cầu thêm câu. |
| Citation dạng text [Trang X] | Đủ cho prototype Working. Clickable citation sẽ là enhancement cho phiên bản sau (backlog). |
| Không build chatbot trả lời tự do | Nằm trong non-goals (§4). Scope CP5 là quiz generator, không mở rộng sang chatbot. |
| Temperature = 0.2 | Đã chốt từ CP4, không thay đổi. Kết quả golden set cho thấy 100% không bịa ngoài slide. |

---

## Backlog (không làm trong CP5)

1. **Dark mode** cho slide viewer — nhiều học viên học đêm.
2. **Lịch sử làm quiz** — học viên xem lại câu đã làm sai.
3. **Clickable citation** — bấm [Trang X] để mở slide đúng trang.
4. **Gamification nhẹ** — streak, điểm thưởng (non-goal hiện tại).

---

## Kết quả đo golden set (lần cuối)

| Chỉ số | Kết quả | Quality bar | Đạt? |
|---|---|---|---|
| API phản hồi | 20/20 (100%) | 100% | ✅ |
| JSON hợp lệ | 20/20 (100%) | 100% | ✅ |
| Quiz hợp lệ | 14/15 (93,3%) | ≥90% | ✅ |
| Đáp án đúng | 14/14 (100%) | ≥90% | ✅ |
| Citation đúng | 14/14 (100%) | 100% | ✅ |
| Giải thích bám slide | 14/14 (100%) | ≥90% | ✅ |
| Một đáp án đúng | 14/14 (100%) | 100% | ✅ |
| Không bịa ngoài slide | 20/20 (100%) | 100% | ✅ |
| Xử lý thiếu thông tin | 2/2 (100%) | 100% | ✅ |
| Xử lý ngoài phạm vi | 2/2 (100%) | 100% | ✅ |
| Xử lý mơ hồ | 1/1 (100%) | — | ✅ |

**Nhận xét:** Tất cả chỉ số đều đạt quality bar. Một lỗi đáng ghi nhận là C02 (false negative: AI từ chối dù đủ thông tin) — đã phân tích nguyên nhân là prompt chưa rõ ràng về "thứ tự các bước", sẽ cải thiện prompt ở phiên bản sau.

**Kết luận:** Prototype đạt chuẩn, sẵn sàng cho demo CP5/CP6.
