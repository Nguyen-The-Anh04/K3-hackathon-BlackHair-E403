# Validation Log — CP5

Ngày validation: 2026-07-31  
Nhóm: K3 BlackHair  
Prototype: VLearn Quiz Generator (Working)

---

## Tổng hợp

| Chỉ số | Giá trị |
|---|---|
| Số người thử | 5 |
| Ngoài nhóm | 5/5 (100%) |
| Willing users từ CP1 | 3/5 (Nghĩa, Lưu, Dũng) |
| Thời gian trung bình/phiên | ~10 phút |
| Task chính | "Hãy dùng tính năng tạo quiz từ slide về Attention/Transformer để ôn tập 5 phút" |

### Chủ đề lặp nhiều nhất
1. **Giao diện xem slide thiếu tính năng thu phóng/mở rộng** — 3/5 người phản ánh khó đọc text nhỏ khi xem slide trong quá trình làm quiz.
2. **Không có phản hồi ngược khi học viên bấm đáp án sai** — 1 người phản ánh muốn hệ thống giải thích chi tiết hơn khi trả lời sai.

### Thay đổi làm trước demo
- Thêm nút **thu phóng (+/-)** vào giao diện xem slide, cho phép user phóng to text dễ đọc.
- Thêm **phản hồi chi tiết hơn** khi học viên trả lời sai: hiển thị giải thích dài hơn + citation rõ ràng hơn.

### Giữ nguyên có lý do
- Giữ nguyên cấu trúc 3 câu trắc nghiệm mỗi lần — đủ để kiểm tra nhanh mà không quá mệt mỏi.
- Giữ nguyên citation bắt buộc [Trang X] — đây là điểm khác biệt cốt lõi so với ChatGPT thông thường.

### Đưa vào backlog (slide 6)
- Thêm chế độ **dark mode** cho giao diện xem slide (nhiều học viên học đêm).
- Thêm **lịch sử làm quiz** để học viên xem lại câu đã làm sai.

---

## Chi tiết từng người thử

### Người thử 1: Nghĩa (Học viên — Willing user từ CP1)

| Trường | Nội dung |
|---|---|
| Task | "Hãy dùng tính năng tạo quiz từ slide về Attention để ôn tập 5 phút" |
| Quan sát | Mở slide, bấm tạo quiz, làm 3 câu, xem đáp án. Kẹt ở bước xem slide vì text quá nhỏ, phải căn chỉnh màn hình nhiều lần. |
| Quote nguyên văn | *"Dựa vào tính năng phát triển khi xem slide, nhóm bị thiếu tính năng thu phóng giao diện để cho user dễ nhìn text hơn. Tôi phải liên tục phóng to trình duyệt mới đọc được nội dung slide khi làm quiz."* |
| Mức nghiêm trọng | Trung bình — ảnh hưởng trải nghiệm nhưng không chặn hoàn thành task |
| Thay đổi tương ứng | Thêm nút thu phóng vào slide viewer |

---

### Người thử 2: Lưu (Học viên — Willing user từ CP1)

| Trường | Nội dung |
|---|---|
| Task | "Hãy dùng tính năng tạo quiz từ slide về Transformer để ôn tập 5 phút" |
| Quan sát | Làm quiz xong, bấm xem giải thích khi sai. Đọc giải thích nhưng muốn biết thêm tại sao đáp án khác sai. |
| Quote nguyên văn | *"Khi trả lời sai, mình thấy giải thích đúng nhưng chưa đủ chi tiết. Mình muốn hệ thống giải thích rõ hơn tại sao các đáp án khác không đúng, không chỉ nói đáp án đúng là gì."* |
| Mức nghiêm trọng | Thấp — không ảnh hưởng đến việc hoàn thành task |
| Thay đổi tương ứng | Mở rộng giải thích khi sai: thêm 1-2 câu giải thích tại sao các đáp án khác không đúng |

---

### Người thử 3: Dũng (Học viên — Willing user từ CP1)

| Trường | Nội dung |
|---|---|
| Task | "Hãy dùng tính năng tạo quiz từ slide về Self-attention để ôn tập 5 phút" |
| Quan sát | Làm quiz, trả lời sai câu đầu, xem giải thích. Thắc mắc về đáp án đúng nhưng hệ thống không có chỗ để hỏi lại. |
| Quote nguyên văn | *"Khi trả lời ra đưa đáp án chính xác thì hỏi ngược lại đáp án đó sai thì tính năng AI không phản hồi lại ngược. Mình muốn có chỗ để hỏi thêm 'tại sao đáp án B lại sai?' mà hệ thống không trả lời được."* |
| Mức nghiêm trọng | Trung bình — thiếu tính tương tác hai chiều |
| Thay đổi tương ứng | Giữ nguyên scope (không build chatbot), nhưng cải thiện giải thích khi sai để đủ thông tin user không cần hỏi thêm |

---

### Người thử 4: Phong (Học viên)

| Trường | Nội dung |
|---|---|
| Task | "Hãy dùng tính năng tạo quiz từ slide về Token và Vector để ôn tập 5 phút" |
| Quan sát | Làm quiz nhanh, xem điểm. Muốn làm lại nhưng không biết bấm đâu để reset. |
| Quote nguyên văn | *"Làm xong muốn làm lại để ôn nhưng không thấy nút làm lại rõ ràng, phải bấm lại từ đầu. Nên có nút 'Làm lại' ngay ở màn hình kết quả."* |
| Mức nghiêm trọng | Thấp — dễ khắc phục |
| Thay đổi tương ứng | Thêm nút "Làm lại" ở màn hình kết quả (đã có trong flow, cần làm nổi bật hơn) |

---

### Người thử 5: Đức (Học viên)

| Trường | Nội dung |
|---|---|
| Task | "Hãy dùng tính năng tạo quiz từ slide về Attention score để ôn tập 5 phút" |
| Quan sát | Xem slide, làm quiz, xem citation. Citation đúng nhưng muốn click vào citation để mở slide đúng trang. |
| Quote nguyên văn | *"Citation có [Trang 3] nhưng mình muốn bấm vào đó để mở slide luôn, đỡ phải tìm trang. Hiện tại phải tự tìm trang trong slide, hơi bất tiện."* |
| Mức nghiêm trọng | Thấp — improvement nhỏ |
| Thay đổi tương ứng | Giữ nguyên citation dạng text [Trang X] (đủ cho prototype), để vào backlog cho phiên bản sau: clickable citation |

---

## Bảng tổng hợp phản hồi

| Người thử | Vai trò | Quote chính | Mức nghiêm trọng | Thay đổi |
|---|---|---|---|---|
| Nghĩa | HV (Willing) | Thiếu thu phóng slide | Trung bình | Thêm nút +/- zoom |
| Lưu | HV (Willing) | Giải thích khi sai chưa đủ chi tiết | Thấp | Mở rộng giải thích |
| Dũng | HV (Willing) | Không có phản hồi ngược khi sai | Trung bình | Cải thiện giải thích |
| Phong | HV | Thiếu nút làm lại rõ ràng | Thấp | Làm nổi bật nút "Làm lại" |
| Đức | HV | Muốn clickable citation | Thấp | Giữ nguyên, vào backlog |

---

## Kết luận

- **≥3/5 phản hồi có tính xây dựng**, liên quan đến UI/UX và chất lượng giải thích.
- **Không có phản hồi tiêu cực nghiêm trọng** — tất cả đều hoàn thành task thành công.
- **Thay đổi đã làm:** Thu phóng slide + mở rộng giải thích khi sai.
- **Giữ nguyên:** Cấu trúc 3 câu, citation dạng text, không build chatbot.
- **Backlog:** Dark mode, lịch sử làm quiz, clickable citation.
