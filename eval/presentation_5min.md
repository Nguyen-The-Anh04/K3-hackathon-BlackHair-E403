# VLearn Quiz Generator — 5-minute demo

> Đối tượng: ban giám khảo / người nghe demo sản phẩm  
> Thông điệp chính: **Sau khi học slide, học viên có thể tự kiểm tra mức hiểu bài ngay trên chính tài liệu — có đáp án, giải thích và nguồn để kiểm chứng.**

---

## Slide 1 — Học xong nhưng chưa biết mình hiểu đến đâu

### Nội dung trên slide

**VLearn Quiz Generator**  
Biến slide vừa học thành một bài quiz có căn cứ.

`Upload slide → Tạo quiz → Làm bài → Kiểm chứng nguồn`

### Speaker notes — 25 giây

“Vấn đề chúng tôi chọn rất đơn giản: học viên vừa xem xong một bộ slide nhưng chưa biết mình thực sự hiểu bài đến đâu. VLearn Quiz Generator biến chính bộ slide đó thành một bài quiz ngắn, có giải thích và citation để người học tự kiểm tra ngay.”

---

## Slide 2 — VLearn hiện trả lời câu hỏi, nhưng chưa chủ động kiểm tra hiểu bài

### Nội dung trên slide

Từ chatlog VLearn được cung cấp:

- **1.261** lượt hỏi–đáp
- **369** học viên, **585** cuộc hội thoại
- Chỉ **3/2.522** message chủ động hỏi kiểm tra hiểu bài
- **46,2%** câu trả lời không có citation

### Kết luận lớn

Khoảng trống không phải là “thêm một chatbot”, mà là **tạo một vòng lặp ôn tập có kiểm chứng**.

### Speaker notes — 45 giây

“Chúng tôi bắt đầu từ dữ liệu thật của VLearn. Tutor hiện tại làm tốt việc trả lời câu hỏi, nhưng gần như chưa chủ động kiểm tra người học có hiểu hay chưa: chỉ 3 trên 2.522 message làm việc đó. Ngoài ra citation cũng chưa ổn định. Vì vậy, chúng tôi không mở rộng thành một hệ thống adaptive learning lớn; chúng tôi chọn một lát cắt nhỏ nhưng đo được: tạo 3 câu quiz bám đúng slide.”

---

## Slide 3 — Một lát cắt ngắn, rõ và có thể kiểm chứng

### Nội dung trên slide

1. Học viên upload PDF/TXT/MD.
2. Hệ thống đọc nội dung theo trang.
3. AI quyết định: đủ căn cứ để hỏi hay phải từ chối.
4. Trả về câu hỏi, 4 lựa chọn, đáp án, giải thích và citation.
5. Học viên làm bài và xem điểm.

### Nguyên tắc

**Chỉ dùng kiến thức xuất hiện trong tài liệu nguồn.**

### Speaker notes — 50 giây

“Flow của sản phẩm chỉ có một nhiệm vụ. Tài liệu được đọc theo từng trang, sau đó AI tạo câu hỏi dựa trên phần text đó. Nếu tài liệu thiếu thông tin hoặc yêu cầu nằm ngoài phạm vi, hệ thống phải từ chối thay vì đoán. Khi có câu hỏi, người học chọn đáp án, nhận giải thích và có thể bấm citation để quay về trang nguồn.”

---

## Slide 4 — AI không chỉ sinh câu hỏi; AI phải biết khi nào không nên sinh

### Nội dung trên slide

### Happy path

Tài liệu đủ rõ → 3 câu hỏi → 4 lựa chọn → chấm điểm → citation.

### Safety path

- Thiếu thông tin → từ chối và yêu cầu thêm nội dung.
- Ngoài phạm vi slide → không bịa kiến thức.
- Yêu cầu mơ hồ → cần hỏi lại.
- Yêu cầu làm bài thi → không cung cấp đáp án trực tiếp.

### Speaker notes — 55 giây

“Điểm AI quan trọng nhất không phải là viết câu hỏi nghe hay. Đó là quyết định có đủ căn cứ hay không. Prompt yêu cầu JSON cố định, đúng số câu, 4 lựa chọn và citation. Scope guard xử lý sơ bộ chủ đề ngoài tài liệu; backend tiếp tục validate output trước khi gửi về giao diện. Đây là cách chúng tôi giảm hallucination và lỗi học sai.”

---

## Slide 5 — Demo trong 60 giây

### Nội dung trên slide

**Tài liệu demo: Transformer & Attention**

1. Upload slide PDF.
2. Nhập: “Tạo 3 câu hỏi ôn tập từ slide này”.
3. Chọn một đáp án.
4. Xem đúng/sai + giải thích.
5. Bấm citation hoặc dùng phím `←` `→` để chuyển trang.

### Câu nói khi demo

“Tôi cố tình chọn một câu trả lời sai để cho thấy hệ thống không chỉ hiển thị đáp án đúng, mà còn giải thích vì sao và đưa người học quay lại đúng trang nguồn.”

### Speaker notes — 60 giây

Mở `codebase/server.py` và chạy server theo hướng dẫn trong `codebase/README.md`. Mở giao diện, upload PDF demo, tạo quiz, trả lời sai một câu, bấm citation, rồi dùng phím mũi tên trái/phải. Không giải thích code trong lúc demo; chỉ nói theo trải nghiệm người học.

---

## Slide 6 — Kết quả thật và bước tiếp theo

### Nội dung trên slide

### Vòng đo cuối

- **24/35 case đạt — 68,6%**
- API phản hồi: **33/35 — 94,3%**
- Case thiếu thông tin: **2/2**
- Case mơ hồ: **1/2**
- Yêu cầu bị cấm: **0/2**
- Quota Gemini lỗi ở `O02`, `M01`

### Quality bar

**≥80% — hiện còn thiếu 11,4 điểm phần trăm.**

### Bước tiếp theo

1. Hỏi lại yêu cầu mơ hồ thay vì tự đoán.
2. Từ chối rõ yêu cầu làm bài thi.
3. Retry/backoff và quota dự phòng.

### Speaker notes — 45 giây

“Chúng tôi ghi nhận kết quả thật, không làm đẹp số liệu. Vòng cuối đạt 68,6%, thấp hơn quality bar 80%. Các lỗi chính đã rõ: xử lý yêu cầu mơ hồ, yêu cầu làm bài thi và quota API. Điều này cho thấy prototype đã chứng minh được flow và điểm đo, nhưng chưa nên gọi là production-ready. Bước tiếp theo là sửa đúng ba nhóm lỗi này.”

---

## Phân bổ thời gian

| Slide | Thời lượng |
|---|---:|
| 1. Mở bài | 0:25 |
| 2. Bằng chứng | 0:45 |
| 3. Giải pháp | 0:50 |
| 4. AI & an toàn | 0:55 |
| 5. Demo | 1:00 |
| 6. Kết quả & chốt | 0:45 |
| **Tổng** | **4:40** |

## Nguồn nội bộ

- `PROJECT_NOTES.md`
- `spec.md`
- `data/vlearn-pack/chatlog/DATA_DICTIONARY.md`
- `eval/summary_round_final.md`
- `eval/demo_slides.md`
