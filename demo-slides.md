# Demo Slides — VLearn Quiz Generator
## Nhóm K3 BlackHair | CP5/CP6

---

## Slide 1: User & Job (45")

**Tiêu đề:** Học viên cần tự kiểm tra hiểu bài ngay tại chỗ

**Nội dung chính:**
- **Job executor:** Học viên vừa đọc xong đoạn tài liệu trên VLearn
- **Pain:** Không có cơ chế chủ động kiểm tra hiểu bài → phải tự đọc lại, đoán mò, hoặc hỏi tutor
- **Bằng chứng:** 
  - 582/1.261 (46,2%) câu trả lời tutor không có citation → học viên không biết đáp án dựa trên trang nào
  - Chỉ 3/2.522 message có tutor chủ động hỏi kiểm tra hiểu bài → cơ chế tự kiểm tra gần như không tồn tại

**Lát cắt MỘT CÂU:**
> Một học viên vừa đọc xong đoạn tài liệu về Attention trong Transformer bấm "Tạo câu hỏi ôn tập", AI quyết định sinh 3 câu trắc nghiệm có đáp án đúng, giải thích và citation từ chính đoạn tài liệu đó, học viên làm bài và nhận biết ngay chỗ nào còn hiểu sai.

**Automation:** Augment — AI sinh câu hỏi, học viên tự đọc, tự suy luận, tự quyết định đáp án. Lý do: sai kiến thức về Attention/Transformer có hậu quả lâu dài → không để AI tự động chấm và đóng bài.

---

## Slide 2: Vì sao chọn tính năng này (45")

**Tiêu đề:** Từ 3 ứng viên, chọn quiz AI tự sinh

**Bảng impact:**

| Ứng viên | Ai | Tần suất | Tốn gì mỗi lần | Khả thi | Impact |
|---|---|---|---|---|---|
| 1. Tutor hỏi kiểm tra | ~369 HV | 2 lần/tuần | 2-3 phút/HV | Thấp — không scale | Cao — nhưng không thể áp dụng |
| 2. HV tự đọc lại | ~369 HV | 2 lần/tuần | 5-10 phút/HV | Cao — tự làm | Thấp — không có feedback |
| **3. Quiz AI tự sinh** | **~369 HV** | **2 lần/tuần** | **2-3 phút/HV** | **Cao — prototype sẵn** | **Cao — có feedback, citation** |

**Ứng viên đã loại:**
- **Ứng viên 1:** Loại vì không scale — 1.000 HV × 2-3 phút = ~25 giờ/tuần cho tutor
- **Ứng viên 2:** Loại vì không có feedback — HV dễ bị nhiễu thông tin sai (46,2% câu trả lời không citation)

**Lý do chọn ứng viên 3:**
1. Scale: 1 lần build phục vụ ~1.000 HV
2. Feedback tức thì: điểm, đáp án đúng, giải thích, citation ngay
3. Dữ liệu ủng hộ: chatlog cho thấy HV thường hỏi kiến thức cơ bản ngay sau khi đọc tài liệu
4. Khả thi kỹ thuật: prototype đã có flow hoàn chỉnh, AI chạy thật 20/20 case

---

## Slide 3: Giải pháp & Demo Live (2')

**Tiêu đề:** Quiz AI sinh từ tài liệu — 1 câu hỏi = 1 citation

**Flow chính:**
1. Học viên mở tài liệu → bấm "Tạo câu hỏi ôn tập"
2. AI sinh 3 câu trắc nghiệm từ đoạn tài liệu đó
3. Học viên làm bài → xem kết quả đúng/sai, giải thích, citation [Trang X]
4. Làm lại hoặc đọc lại tài liệu

**Demo trực tiếp:**
- **Case chuẩn:** Chọn slide về Self-attention → tạo quiz → làm 3 câu → xem đáp án đúng + citation [Trang 2]
- **Case chỗ khó:** Chọn đoạn quá ngắn chỉ có từ "Token" → AI từ chối: "Tài liệu không đủ thông tin" → học viên hiểu rõ giới hạn

**Nguyên tắc đã áp dụng:**
1. **Human-in-the-loop:** Học viên tự đọc, tự chọn đáp án, AI chỉ sinh câu hỏi
2. **Transparency:** Citation bắt buộc [Trang X] — học viên biết đáp án dựa trên đâu
3. **Fail gracefully:** Tài liệu quá ngắn/ngoài phạm vi → AI từ chối rõ ràng, không bịa
4. **Grounded generation:** Prompt yêu cầu AI chỉ dùng thông tin trong tài liệu, temperature = 0.2

---

## Slide 4: Kết quả đo (45")

**Tiêu đề:** 17/20 (85%) — ĐẠT quality bar ≥80%

**Quality bar đã chốt (23:59 N1):**
> "Đạt khi ≥80% bộ 20 câu qua, VÀ 100% case loại ① (không đủ căn cứ) không bịa thông tin."

**Kết quả golden set (20 case):**

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

**Kết luận:** Tất cả chỉ số đều đạt quality bar. Một lỗi đáng ghi nhận: C02 (false negative — AI từ chối dù đủ thông tin). Nguyên nhân: prompt chưa rõ ràng về "thứ tự các bước". Sẽ cải thiện prompt ở phiên bản sau.

---

## Slide 5: User thật nói gì (45")

**Tiêu đề:** 5 học viên đã thử — phản hồi xây dựng

**Validation log:** `validation/feedback_log.md` — 5 người thử, ≥3 willing users từ CP1

**Quote nguyên văn:**

> *"Dựa vào tính năng phát triển khi xem slide, nhóm bị thiếu tính năng thu phóng giao diện để cho user dễ nhìn text hơn."*
> — **Nghĩa** (Học viên, Willing user)

> *"Khi trả lời ra đưa đáp án chính xác thì hỏi ngược lại đáp án đó sai thì tính năng AI không phản hồi lại ngược. Mình muốn có chỗ để hỏi thêm 'tại sao đáp án B lại sai?'"*
> — **Dũng** (Học viên, Willing user)

**Thay đổi đã làm từ feedback:**
1. ✅ Thêm nút thu phóng (+/-) vào slide viewer
2. ✅ Mở rộng giải thích khi sai: thêm 1-2 câu giải thích tại sao các đáp án khác không đúng
3. ✅ Làm nổi bật nút "Làm lại" ở màn hình kết quả

**Giữ nguyên có lý do:**
- Cấu trúc 3 câu trắc nghiệm — đủ kiểm tra nhanh, không quá mệt mỏi
- Citation dạng text [Trang X] — đủ cho prototype, clickable citation để vào backlog

---

## Slide 6: Nếu có thêm 1 tuần (30")

**Tiêu đề:** 2-3 việc ưu tiên + 1 bài học lớn

**Ưu tiên 1: Cải thiện prompt để giảm false negative**
- Case C02 cho thấy AI từ chối dù đủ thông tin → cần prompt rõ ràng hơn về "thứ tự các bước"
- Dự kiến: thêm ví dụ vào prompt, giảm temperature từ 0.2 xuống 0.1

**Ưu tiên 2: Thêm chế độ dark mode + clickable citation**
- Dark mode: học viên học đêm, feedback từ Đức
- Clickable citation: bấm [Trang X] để mở slide đúng trang

**Ưu tiên 3: Mở rộng golden set lên 30+ case**
- Hiện tại 20 case, đủ cho prototype
- Thêm case từ chatlog thật (≥10 case) để tăng độ phủ 4 lớp chỗ khó

**Bài học lớn nhất:**
> "Validation với user thật phát hiện vấn đề mà golden set không bắt được — UI/UX khó dùng dù AI chạy đúng. Đừng chỉ đo bằng máy, cần quan sát người thật dùng."

**Backlog:**
- Dark mode
- Lịch sử làm quiz
- Clickable citation
- Gamification nhẹ (streak, điểm thưởng)

---

## Demo Script (5 phút trình bày + 5 phút Q&A)

### Phần 1: Trình bày (5 phút)

| Thời gian | Nội dung | Người nói |
|---|---|---|
| 0:00-0:45 | Slide 1: User & Job — pain, bằng chứng, lát cắt | Nguyễn Thế Anh |
| 0:45-1:30 | Slide 2: Vì sao chọn — bảng impact, ứng viên loại | Trần Quốc Hùng |
| 1:30-3:30 | Slide 3: Giải pháp & demo live — case chuẩn + case chỗ khó | Nguyễn Đức Sơn |
| 3:30-4:15 | Slide 4: Kết quả đo — % vs quality bar, failure đáng kể | Nguyễn Đức Sơn |
| 4:15-4:45 | Slide 5: User thật nói gì — quote, thay đổi | BlackHair |
| 4:45-5:00 | Slide 6: Nếu có thêm 1 tuần — backlog, bài học | BlackHair |

### Phần 2: Q&A (5 phút)

**Câu hỏi dự phòng cho giám khảo:**
1. "Tại sao chọn augment thay vì automate?" → Cost-of-error cao nếu AI tự động chấm điểm, học viên có thể học sai kiến thức mãi mãi.
2. "Failure nguy hiểm nhất là gì?" → AI bịa câu hỏi ngoài slide, học viên học sai kiến thức Attention/Transformer.
3. "Làm sao đảm bảo AI không bịa?" → Prompt yêu cầu chỉ dùng tài liệu nguồn, temperature = 0.2, golden set kiểm tra no_hallucination, citation bắt buộc.
4. "Tại sao không build chatbot?" → Non-goal: chỉ sinh quiz từ tài liệu, không trả lời câu hỏi ngoài phạm vi. Scope hackathon 1,5 ngày.
5. "Nếu học viên chọn đoạn tài liệu sai?" → AI từ chối rõ ràng: "Tài liệu không chứa thông tin này" — không bịa.

**Thẻ giám khảo:** Sẵn sàng chạy 1 case lạ tại chỗ — có thể yêu cầu tạo quiz từ đoạn tài liệu bất kỳ.

### Phần 3: Vibe-coding check

Mỗi thành viên phải giải thích được phần có tên mình:
- **Nguyễn Thế Anh:** Spec, quality bar, 4 lớp chỗ khó
- **Trần Quốc Hùng:** Evidence, mining chatlog, quote
- **Nguyễn Đức Sơn:** Prompt, golden set, kết quả đo
- **BlackHair:** Code, UI/UX, validation log
