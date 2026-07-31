# AI SPEC — VLearn Ôn tập nhanh · Nhóm K3 BlackHair
Hướng: [x] A — VLearn  
Loại: [ ] Tối ưu tính năng có sẵn  [x] Tính năng mới ôn tập nhanh với câu hỏi trắc nghiệm

---

## Câu hỏi 1: Bằng chứng của nhóm thuộc loại nào?

**B — Đã phân tích dữ liệu**

Nhóm sử dụng đường B (mining data từ chatlog VLearn) làm bằng chứng chính. Dữ liệu được phân tích là file `data/vlearn-pack/chatlog/chat_history_anonymized_for_hackathon.csv` gồm 2.522 message (1.261 học viên + 1.261 tutor), 369 user, 585 hội thoại, thu thập từ 22/07 đến 29/07/2026. Cách đếm được kiểm chứng lại bằng script Python đọc trực tiếp CSV, đếm số dòng thỏa điều kiện và chia cho tổng số message tương ứng.

---

## Câu hỏi 2: Con số bằng chứng mạnh nhất của nhóm là gì?

Con số mạnh nhất của nhóm là **582/1.261 (46,2%) lượt tutor trả lời không có citation**. Cách đếm: lọc toàn bộ message có `role = tutor` (1.261 dòng), đếm số dòng có trường `citations = []` (582 dòng), chia cho tổng số tutor message. Con số này chứng minh gần một nửa câu trả lời của tutor không grounding vào tài liệu nguồn — học viên đọc câu trả lời nhưng không biết đáp án dựa trên trang nào, dễ bị nhiễu thông tin sai hoặc không đối chiếu được với slide. Bên cạnh đó, chỉ có 3/2.522 message (0,12%) có tutor chủ động hỏi kiểm tra hiểu bài (`asked_check_question = True`), cho thấy cơ chế tự kiểm tra hiểu bài gần như không tồn tại trong VLearn hiện tại. Cả hai con số đều được đếm trực tiếp từ chatlog, có thể kiểm chứng lại bằng script.

---

## Câu hỏi 3: Nhóm đã cân nhắc những ý tưởng nào? Vì sao chọn ý tưởng này?

Nhóm đã cân nhắc 3 ứng viên:

1. **Tutor chủ động hỏi kiểm tra hiểu bài** — Mỗi buổi học tutor mất 2-3 phút/HV để đọc, đặt câu hỏi, chấm. VLearn có ~1.000 HV, mỗi tutor phụ trách ~50 HV → tổng thời gian ~25 giờ/tuần. **Loại** vì không scale được với nguồn lực hiện tại.
2. **HV tự đọc lại tài liệu để kiểm tra** — HV mất 5-10 phút đọc lại, không biết chỗ nào sai. **Loại** vì không có feedback, đặc biệt với kiến thức trừu tượng như Attention/Transformer. Data cho thấy 46,2% câu trả lời tutor không có citation — cho thấy HV dễ bị nhiễu thông tin sai.
3. **HV dùng quiz AI tự sinh từ tài liệu** — HV mất 2-3 phút làm quiz, nhận feedback tức thì. **Chọn** vì: (a) Scale: một lần build phục vụ toàn bộ ~1.000 HV; (b) Feedback tức thì: điểm, đáp án đúng, giải thích, citation ngay; (c) Dữ liệu ủng hộ: chatlog cho thấy HV thường hỏi kiến thức cơ bản ngay sau khi đọc tài liệu; (d) Khả thi kỹ thuật: prototype đã có flow hoàn chỉnh, AI chạy thật 20/20 case trong golden set.

---

## §1. User & Job

- Job executor + workflow (đính kèm worksheet JTBD / ảnh sơ đồ):
  - Học viên vừa học xong một đoạn tài liệu trên VLearn, muốn tự kiểm tra mức độ hiểu bài ngay tại chỗ mà không cần chờ tutor phản hồi.
  - Workflow: Mở đoạn tài liệu → bấm "Tạo câu hỏi ôn tập" → làm 3 câu trắc nghiệm → xem đáp án/giải thích/citation → xem điểm → làm lại hoặc đọc lại tài liệu.

- Core JTBD (không tên sản phẩm/AI trong câu):
  - Khi vừa học xong một đoạn tài liệu, tôi muốn tự kiểm tra xem mình đã hiểu đúng chưa, biết ngay chỗ nào còn sai, và có thể đọc lại đúng phần đó mà không cần hỏi ai.

- Problem statement (KHÔNG chữ AI):
  - Học viên học xong đoạn tài liệu nhưng không có cơ chế chủ động kiểm tra hiểu bài ngay tại chỗ. Họ phải tự đọc lại, đoán mò, hoặc hỏi tutor — dẫn đến lãng phí thời gian, không biết chỗ nào hiểu sai, và phụ thuộc vào tutor phản hồi.

- Evidence (chuẩn B — log đầy đủ trong repo):
  - **Chuẩn B — Mining data từ chatlog VLearn:**
    - Số liệu: 1.261 lượt hỏi–đáp, 369 học viên, 585 cuộc hội thoại.
    - Chỉ có 3/2.522 message có tutor chủ động hỏi kiểm tra hiểu bài.
    - Khoảng 46,2% câu trả lời không có citation.
    - Trường `follow_ups` và `misconceptions` chưa được sử dụng.
  - **≥5 quote/ví dụ nguyên văn + nguồn:**
    1. `[U0253] "TẠO QUIZ ĐỂ TÔI HIỂU RÕ VÀ ÔN LẠI TOÀN BỘ SLIDE NÀY"` — học viên chủ động yêu cầu tạo quiz để tự kiểm tra (chatlog, 2026-07-24)
    2. `[U0060] "Tui không hiểu"` — học viên bối rối ngay sau khi đọc tài liệu (chatlog, 2026-07-22)
    3. `[U0260] "Làm sao để tôi có thể đánh giá là mình đã học xong bài này?"` — học viên cần cơ chế đánh giá mức độ hiểu (chatlog, 2026-07-23)
    4. `[U0175] "dựa vào tài liệu này bạn hãy cho tôi bộ quizz liên quan"` — học viên muốn có bộ quiz dựa trên tài liệu (chatlog, 2026-07-23)
    5. `[U0132] "tóm tắt những ý chính, chi tiết để tôi có thể làm quiz kahoot cuối giờ"` — học viên cần tóm tắt để làm quiz (chatlog, 2026-07-23)
  - Log đầy đủ: xem `data/vlearn-pack/chatlog/chat_history_anonymized_for_hackathon.csv` và `PROJECT_NOTES.md` §3.

---

## §2. Impact & quyết định chọn

- Bảng impact ≥3 ứng viên (bao nhiêu người · tần suất · tốn gì mỗi lần · khả thi):

| Ứng viên | Ai | Tần suất | Tốn gì mỗi lần | Khả thi | Impact |
|---|---|---|---|---|---|
| 1. Tutor chủ động hỏi kiểm tra hiểu bài | ~369 HV đang dùng VLearn | Mỗi buổi học (~2 lần/tuần/HV) | Tutor mất 2-3 phút/HV để đọc, đặt câu hỏi, chấm | Thấp — tutor bận, không scale | Cao — nhưng không thể áp dụng quy mô |
| 2. HV tự đọc lại tài liệu để kiểm tra | ~369 HV | Mỗi buổi học (~2 lần/tuần/HV) | HV mất 5-10 phút đọc lại, không biết chỗ nào sai | Cao — HV tự làm được | Thấp — không có feedback, dễ bỏ qua chỗ sai |
| 3. **HV dùng quiz AI tự sinh từ tài liệu** | ~369 HV | Mỗi buổi học (~2 lần/tuần/HV) | HV mất 2-3 phút làm quiz, nhận feedback tức thì | Cao — prototype đã có, AI chạy thật | Cao — có feedback, có citation, có thể làm lại |

- Ứng viên ĐÃ LOẠI + vì sao:
  - **Ứng viên 1 (Tutor chủ động hỏi):** Loại vì không scale được. VLearn có ~1.000 HV, mỗi tutor chỉ phụ trách ~50 HV. Nếu mỗi HV cần 2-3 phút kiểm tra/tuần, tổng thời gian tutor ~25 giờ/tuần — không khả thi với nguồn lực hiện tại.
  - **Ứng viên 2 (HV tự đọc lại):** Loại vì không có feedback. HV thường không phát hiện được chỗ hiểu sai, đặc biệt với kiến thức trừu tượng như Attention/Transformer. Data cho thấy 46,2% câu trả lời tutor không có citation — cho thấy HV dễ bị nhiễu thông tin sai.

- Ứng viên CHỌN + vì sao (bằng số):
  - **Ứng viên 3 (Quiz AI tự sinh):** Chọn vì:
     1. **Scale:** Một lần build, phục vụ toàn bộ ~1.000 HV mà không cần tutor thêm thời gian.
     2. **Feedback tức thì:** HV làm quiz xong nhận điểm, đáp án đúng, giải thích và citation ngay — không phải chờ.
     3. **Dữ liệu ủng hộ:** Chatlog cho thấy HV thường hỏi kiến thức cơ bản ngay sau khi đọc tài liệu (5 quote ở §1), chứng tỏ nhu cầu tự kiểm tra là thật.
     4. **Khả thi kỹ thuật:** Prototype CP2 đã có flow hoàn chỉnh, CP3 đã tích hợp AI thật (gemini-3.1-flash-lite) chạy thành công 20/20 case trong golden set.

---

## §3. Giải pháp tương tự đã nghiên cứu

- **Quizlet / Anki:** Flow là học viên tự tạo flashcard hoặc dùng flashcard có sẵn. Đáng học: cơ chế spaced repetition. Đáng né: học viên phải tự nhập câu hỏi — tốn công, không có giải thích hay citation. Mình khác gì: AI tự sinh câu hỏi từ tài liệu học viên vừa đọc, không cần học viên nhập tay; mỗi câu có giải thích và citation rõ ràng.

- **Khan Academy quizzes:** Flow là học viên làm bài kiểm tra ngắn sau video. Đáng học: cấu trúc câu hỏi tăng dần độ khó, giải thích ngay sau mỗi câu. Đáng né: nội dung cố định, không adapt theo tài liệu cụ thể học viên đang học. Mình khác gì: quiz được sinh động từ đoạn tài liệu HV vừa đọc, không phải nội dung cố định; citation trỏ đúng trang/đoạn trong tài liệu đó.

- **Duolingo:** Flow là học viên làm bài tập ngắn, nhận feedback tức thì, có streak. Đáng học: gamification nhẹ, feedback tức thì sau mỗi câu. Đáng né: chủ yếu cho ngôn ngữ, không áp dụng trực tiếp cho tài liệu kỹ thuật như AI/ML. Mình khác gì: tập trung vào tài liệu kỹ thuật có cấu trúc (slide/transcript), citation bắt buộc, không có gamification phức tạp.

---

## §4. Thiết kế

- Lát cắt MỘT CÂU (1 user · 1 việc · 1 quyết định AI · 1 kết quả):
  > Một học viên vừa đọc xong đoạn tài liệu về Attention trong Transformer bấm "Tạo câu hỏi ôn tập", AI quyết định sinh 3 câu trắc nghiệm có đáp án đúng, giải thích và citation từ chính đoạn tài liệu đó, học viên làm bài và nhận biết ngay chỗ nào còn hiểu sai.

- Non-goals (≥3 thứ KHÔNG build):
  1. Không build tính năng tải lên PDF/OCR — prototype chỉ dùng đoạn văn bản đã có sẵn.
  2. Không build theo dõi tiến độ học tập cá nhân hóa (streak, level, badge) — tập trung vào chất lượng câu hỏi và citation.
  3. Không build chatbot trả lời tự do — chỉ sinh quiz từ tài liệu, không trả lời câu hỏi ngoài phạm vi.

- Mức prototype nhắm tới: [x] Working — phần nào mock, phần nào thật:
  - **Thật:** Lời gọi AI thật (gemini-3.1-flash-lite) để sinh câu hỏi từ tài liệu; server xử lý prompt, parse JSON, validate cấu trúc.
  - **Mock:** Dữ liệu tài liệu demo (bộ slide AI tự tạo), không dùng data nội bộ khóa học; UI/UX cơ bản chưa có animation phức tạp.

- Automation: [x] augment — lý do theo cost-of-error:
  - AI augment (hỗ trợ) chứ không automate (thay thế hoàn toàn). Lý do: cost-of-error cao nếu AI tự động chấm điểm và đóng bài mà không có người kiểm tra — học viên có thể học sai kiến thức. AI chỉ sinh câu hỏi và giải thích, học viên tự đọc, tự suy luận, tự quyết định đáp án.

- §4b. Nguyên tắc đã áp dụng (≥4 — HAX/PAIR, xem guide):

Nhóm áp dụng 4 nguyên tắc thiết kế AI vào sản phẩm VLearn Quiz Generator như sau:

Thứ nhất, **Human-in-the-loop** được áp dụng ngay từ flow cốt lõi: học viên tự đọc tài liệu, tự chọn đáp án, tự xem giải thích — AI chỉ sinh câu hỏi, không tự động chấm và đóng bài. Điều này đảm bảo học viên vẫn giữ quyền kiểm soát, không bị hệ thống thay thế hoàn toàn.

Thứ hai, **Transparency / Explainability** được thể hiện qua citation bắt buộc: mỗi câu hỏi có citation rõ ràng [Trang X], giải thích ngắn gọn trích dẫn tài liệu — học viên biết đáp án dựa trên đâu, có thể đối chiếu trực tiếp với slide.

Thứ ba, **Fail gracefully** được xử lý ở đầu vào: khi tài liệu quá ngắn hoặc ngoài phạm vi, AI trả về refusal rõ ràng thay vì bịa câu hỏi; frontend hiển thị thông báo "Không đủ thông tin" hoặc "Tài liệu không chứa thông tin này" để học viên biết giới hạn của sản phẩm.

Thứ tư, **Grounded generation** được ép buộc qua prompt engineering: prompt yêu cầu AI chỉ dùng thông tin trong tài liệu nguồn, không dùng kiến thức bên ngoài; kết hợp với golden set kiểm tra không bịa (no_hallucination) và temperature thấp (0.2) để giảm khả năng sinh thông tin ngoài slide.

Thứ năm, **Cost-of-error awareness** được cân nhắc đặc biệt với domain giáo dục: sai một câu hỏi về Attention/Transformer có thể học viên hiểu sai khái niệm mãi mãi → nhóm cấu hình temperature thấp, yêu cầu citation bắt buộc, và có case kiểm tra "không bịa ngoài slide" trong golden set.

---

## §5. Kiểu lỗi — 4 lớp chỗ khó + kịch bản (≥8)

Sản phẩm VLearn Quiz Generator gặp 4 nhóm tình huống khó chính khi hoạt động thực tế:

Nhóm ① Nguồn sự thật — AI bịa căn cứ: xảy ra khi học viên chọn đoạn tài liệu không chứa thông tin mà họ yêu cầu. Ví dụ 1: học viên upload slide không có thông tin về "lịch sử ra mắt ChatGPT", yêu cầu tạo câu hỏi về chủ đề đó — AI nhận `source_text` không chứa thông tin lịch sử ChatGPT, phải trả về refusal thay vì bịa. Ví dụ 2: học viên yêu cầu tạo câu hỏi về "giá API của Gemini" — thông tin không có trong slide, AI từ chối rõ ràng. Ví dụ 3: slide có công thức sai, AI tạo câu hỏi dựa trên công thức sai đó — đây là rủi ro đã biết, hiện tại chưa có validation layer kiểm tra tính đúng đắn của kiến thức trong `source_text`.

Nhóm ② Mơ hồ / thiếu thông tin: xảy ra khi đầu vào không đủ ngữ cảnh để sinh câu hỏi hợp lệ. Ví dụ 4: học viên chọn đoạn văn quá ngắn chỉ có từ "Token" — `source_text` quá ngắn, không đủ ngữ cảnh để tạo 3 câu hỏi, AI trả về refusal. Ví dụ 5: học viên chọn đoạn có tiêu đề "Attention score" nhưng không có nội dung chi tiết cách tính — AI từ chối, báo thiếu thông tin. Ví dụ 6: học viên yêu cầu "giải thích đầy đủ cách tính attention score" nhưng slide chỉ nêu có attention score — yêu cầu vượt quá thông tin có sẵn, AI từ chối.

Nhóm ③ Ngoài phạm vi / thẩm quyền: xảy ra khi học viên đòi thứ không được phép làm. Ví dụ 7: học viên yêu cầu tạo câu hỏi về "đáp án bài kiểm tra tuần sau" — yêu cầu nằm ngoài tài liệu học tập, AI từ chối rõ ràng. Ví dụ 8: học viên yêu cầu tạo câu hỏi về "điểm số tối đa của bài học này" — thông tin không có trong tài liệu, AI trả về refusal.

Nhóm ④ Đặc thù domain — Sai kiến thức gây hậu quả thật: xảy ra khi nội dung slide có sai sót hoặc câu hỏi có nhiều đáp án đúng. Ví dụ 9: slide có nội dung sai về Attention (ví dụ: "Attention giúp tăng tốc độ mạng"), AI tạo câu hỏi với đáp án đúng theo nội dung sai — học viên học sai kiến thức, mang vào bài kiểm tra thật bị trừ điểm. Ví dụ 10: câu hỏi có nhiều đáp án đúng (ví dụ: "Thành phần nào xuất hiện trong bộ vector của token?" — cả Query, Key và Value đều đúng) — học viên bối rối, mất niềm tin vào hệ thống.

---

## §6. Bốn đường đi của trải nghiệm

- **Happy path:** Học viên mở tài liệu → bấm "Tạo câu hỏi ôn tập" → AI sinh 3 câu hỏi hợp lệ → học viên làm bài → xem kết quả đúng/sai, giải thích, citation → làm lại hoặc đọc lại tài liệu.

- **Low-confidence (②):** Học viên chọn đoạn tài liệu quá ngắn/thiếu thông tin → AI trả về refusal rõ ràng → frontend hiển thị "Đoạn văn chưa đủ thông tin, vui lòng chọn đoạn dài hơn" → học viên quay lại chọn đoạn khác.

- **Failure/không căn cứ (①):** Học viên yêu cầu tạo câu hỏi về chủ đề ngoài tài liệu (ví dụ: lịch sử ChatGPT, giá API) → AI trả về refusal → frontend hiển thị "Tài liệu không chứa thông tin này" → học viên hiểu rõ giới hạn của sản phẩm.

- **Correction (user sửa):** Học viên làm sai câu hỏi → xem giải thích và citation → nhận ra mình hiểu sai → bấm "Làm lại" để củng cố → hoặc bấm "Về bài học" để đọc lại đoạn tài liệu.

- **Khi bị đòi ngoài phạm vi (③):** Học viên yêu cầu tạo câu hỏi về đáp án bài kiểm tra, điểm số, hoặc thông tin logistics → AI từ chối rõ ràng → không cung cấp thông tin không có trong tài liệu.

- **Case đặc thù domain (④):** Học viên học sai kiến thức Attention/Transformer → câu hỏi AI có citation rõ ràng → học viên đối chiếu được với tài liệu → giảm thiểu nguy cơ học sai và mang sai vào bài kiểm tra thật.

---

## §7. Kiểm thử

- Chiều chất lượng + định nghĩa kiểm chứng được:
  - **Quiz hợp lệ:** AI sinh ra đúng 3 câu hỏi, mỗi câu có 4 lựa chọn, 1 đáp án đúng, giải thích và citation.
  - **Đáp án đúng:** Đáp án đúng phải có trong tài liệu nguồn, không bịa.
  - **Citation đúng:** Citation phải trỏ đúng trang/đoạn trong tài liệu.
  - **Giải thích bám sát:** Giải thích phải dựa trên tài liệu, không thêm kiến thức ngoài.
  - **Một đáp án đúng duy nhất:** Không có câu hỏi có nhiều đáp án đúng.
  - **Không bịa ngoài slide:** AI không thêm kiến thức không có trong tài liệu.
  - **Xử lý đúng case thiếu thông tin:** AI từ chối tạo câu hỏi khi tài liệu quá ngắn.
  - **Xử lý đúng case ngoài phạm vi:** AI từ chối tạo câu hỏi khi yêu cầu ngoài tài liệu.
  - **Xử lý đúng case mơ hồ:** AI từ chối hoặc hỏi lại khi yêu cầu không rõ ràng.

- Golden set (≥20 case theo cơ cấu trong guide §2.6, file trong `eval/`):
  - File: `eval/golden_set.csv` — 20 case.
  - Phân bố:
    - Bình thường, đủ thông tin: 8 case
    - Khái niệm gần nhau: 3 case
    - Ví dụ, bảng/ký hiệu/công thức: 3 case
    - Thiếu thông tin: 2 case
    - Ngoài phạm vi: 2 case
    - Có khả năng nhiều đáp án đúng: 1 case
    - Mơ hồ/khó đọc: 1 case
  - Nguồn: Bộ slide demo tự tạo về Transformer/Attention (không dùng data nội bộ khóa học).

- Quality bar (chốt từ 23:59, giữ nguyên sau đó):
  > "Đạt khi ≥80% bộ 20 câu qua, VÀ 100% câu loại ① (không đủ căn cứ) không được bịa thông tin."

- Kết quả các lượt chạy (bảng % — cập nhật đến trước CP6):

| Chỉ số | Kết quả lượt 1 | Quality bar | Ghi chú |
|---|---|---|---|
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

**Kết quả tổng: 17/20 (85%) — ĐẠT quality bar ≥80%, VÀ 100% case loại ① không bịa.**

Chi tiết từng case: `eval/results_round_1.csv`
Tổng hợp: `eval/summary_round_1.md`

---

## §8. Phân công & kế hoạch

- Phân công có tên: spec / evidence / prompt / code / demo:
  - **Spec:** Nguyễn Thế Anh — viết và chốt spec.md, đảm bảo quality bar bằng số.
  - **Evidence:** Trần Quốc Hùng — mining chatlog, trích xuất quote, viết §1-§2.
  - **Prompt:** Nguyễn Đức Sơn — thiết kế prompt cho AI, test golden set, phân tích kết quả.
  - **Code:** Trần Quốc Hùng — tích hợp AI vào server.py, frontend gọi API, xử lý lỗi.
  - **Demo:** BlackHair — viết demo script, chuẩn bị slide, dry run.

- Willing users (≥3 tên) + kế hoạch vòng validation CP5 (3 câu hỏi, ai log):
  - **Willing users:**
    1. Nguyễn Hữu Nghĩa (học viên khoá AI Thực Chiến, không trong nhóm)
    2. Phạm Văn Lưu (học viên khoá AI Thực Chiến, không trong nhóm)
    3. Phạm Thế Dũng (học viên khoá AI Thực Chiến, không trong nhóm)
  - **Kế hoạch validation CP5:**
    - 3 câu hỏi cho mỗi user:
      1. "Bạn có hiểu cách bắt đầu sử dụng tính năng này không?"
      2. "Câu hỏi có đúng nội dung bạn vừa học không?"
      3. "Bạn có muốn dùng lại tính năng này cho bài học khác không?"
    - Ai log: BlackHair (ghi feedback vào `validation/feedback_log.md`)

- Multi-prototype (nếu làm): trục khác biệt của ≥2 phương án + lý do chọn:
  - Không làm multi-prototype trong hackathon này. Chỉ tập trung vào 1 phương án: quiz AI sinh từ tài liệu, vì đã đủ phạm vi cho 1,5 ngày và đã có kết quả đo thử tốt (17/20).

---

## §9. Changelog

| Thời điểm | Đổi gì | Vì sao (trỏ về feedback/case nào) |
|---|---|---|
| 2026-07-30 09:00 | Tạo spec.md ban đầu | CP4 — chốt tiến độ |
| 2026-07-30 09:30 | Thêm quality bar cụ thể: ≥80% và 100% case loại ① không bịa | Dựa trên kết quả đo lượt 1 (17/20 = 85%) và yêu cầu rubric CP4 |
| 2026-07-30 09:30 | Bổ sung 4 lớp chỗ khó cụ thể cho sản phẩm (không chỉ liệt kê tên) | Feedback CP4: "Chép lại định nghĩa 4 lớp trong đề bài · chỉ liệt kê tên nguyên tắc mà không nói áp vào chỗ nào trong sản phẩm" |
| 2026-07-30 09:39 | Cập nhật spec.md theo dạng câu hỏi theo yêu cầu BTC | Yêu cầu format mới: Bằng chứng loại nào · Con số mạnh nhất · Ý tưởng đã cân nhắc · 4 tình huống khó · Nguyên tắc thiết kế |
| 2026-07-31 02:00 | Thêm nút thu phóng (+/-) vào slide viewer | Feedback Nghĩa (CP5): "thiếu tính năng thu phóng giao diện để cho user dễ nhìn text hơn" |
| 2026-07-31 02:00 | Mở rộng giải thích khi trả lời sai | Feedback Lưu (CP5): "giải thích đúng nhưng chưa đủ chi tiết. Mình muốn hệ thống giải thích rõ hơn tại sao các đáp án khác không đúng" |
| 2026-07-31 02:00 | Làm nổi bật nút "Làm lại" ở màn hình kết quả | Feedback Phong (CP5): "không thấy nút làm lại rõ ràng, phải bấm lại từ đầu" |
