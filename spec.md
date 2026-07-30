# AI SPEC — Quiz ôn tập từ slide · Nhóm Black Hair · Zone [X]

Hướng: [x] A — VLearn  [ ] B — Trợ lý Học viên  [ ] C — Làn mở  
Loại: [ ] Tối ưu tính năng có sẵn  [x] Tính năng mới

> Trạng thái tại CP4: prototype working ở mức local; AI thật đã tích hợp với `gemini-3.1-flash-lite`. Tài liệu đầu vào hiện là text demo về AI/Transformer; upload PDF/OCR chưa hoàn thành.

## §1. User & Job

- **Job executor + workflow:** Học viên đang học nội dung AI/ML/DL: tải bộ slide lên → chọn/yêu cầu ôn tập → làm câu hỏi → xem điểm, giải thích và trang nguồn → quay lại phần chưa hiểu.
- **Core JTBD:** Tự kiểm tra mình đã hiểu đúng kiến thức trong bộ slide vừa học trước khi chuyển sang nội dung tiếp theo.
- **Problem statement:** Sau khi đọc slide, học viên khó biết mình đã hiểu đúng các khái niệm và công thức hay chưa; việc tự kiểm tra thường phụ thuộc vào việc hỏi lại, đọc lại hoặc bỏ qua.
- **Evidence:**
  - Data dictionary của chatlog có `1.261` cặp student–tutor, `369` user và `585` conversation.
  - Tutor chỉ chủ động hỏi kiểm tra hiểu bài ở `3/2.522` message; `follow_ups` và `misconceptions` đều là `0/1.261`.
  - `46,2%` câu trả lời không có citation.
  - Nguồn: [`data/vlearn-pack/chatlog/DATA_DICTIONARY.md`](data/vlearn-pack/chatlog/DATA_DICTIONARY.md) và CSV trong cùng thư mục.
  - **10 ví dụ quan sát thực tế:** đã đưa vào `eval/golden_set.csv`, có mã turn/message ẩn danh `T1201/M2413`, `T0191/M1168`, `T0668/M1293`, `T0521/M1603`, `T0714/M1258`, `T0122/M2504`, `T0658/M2043`, `T0849/M0003`, `T0351/M1182`, `T0089/M2326`. Chỉ lưu trích ngắn và mã nguồn, không đưa nguyên data pack vào repo.

## §2. Impact & quyết định chọn

| Ứng viên | Bằng chứng/quy mô | Tần suất | Tổn thất mỗi lần | Khả thi trong hackathon |
|---|---:|---:|---|---|
| Quiz ôn tập từ slide | 1.261 lượt hỏi–đáp quan sát; chỉ 3 lượt check understanding | Sau mỗi buổi học/đoạn slide | Học viên không phát hiện lỗ hổng, có thể học sai | Cao: có thể demo bằng text/PDF mẫu |
| Tutor hỏi tiếp để kiểm tra hiểu bài | `asked_check_question=True` chỉ 3/2.522 message | Hiện rất hiếm | Bỏ lỡ cơ hội phát hiện hiểu lầm | Trung bình: cần thiết kế hội thoại mới |
| Tóm tắt toàn bộ slide | Nhiều prompt thực tế dạng “tóm tắt slide” trong golden set quan sát | Nhiều lần trong chatlog | Tốn thời gian đọc lại, nhưng khó đo mức hiểu | Cao nhưng ít khác biệt và khó chứng minh impact |

- **Ứng viên đã loại:**
  - Tự động tóm tắt toàn bộ slide: giải quyết việc đọc nhanh nhưng không kiểm tra học viên có hiểu đúng.
  - Tutor hỏi tiếp trong mọi cuộc hội thoại: chưa có flow rõ và dễ gây phiền; khó hoàn thành trong 1,5 ngày.
  - Adaptive learning dài hạn: cần lịch sử học tập, tracking và nhiều vòng validation.
- **Ứng viên chọn:** Quiz 3 câu từ slide. Lý do: bám trực tiếp job “tự kiểm tra hiểu bài”, có thể đo bằng golden set, có thể demo trong 5 phút và có điểm kiểm soát rõ nhất là grounding/citation.

## §3. Giải pháp tương tự đã nghiên cứu

- **Tutor VLearn hiện tại:** flow hỏi–đáp theo đoạn slide, có citation nhưng chưa chủ động kiểm tra hiểu bài; đáng học là đặt câu hỏi trong ngữ cảnh tài liệu, đáng né là citation không ổn định và gần như không có follow-up/check question.
- **Quiz/flashcard pattern:** đáng học là câu hỏi ngắn, feedback ngay sau mỗi câu và tổng điểm; đáng né là câu hỏi không có nguồn hoặc đáp án mơ hồ. Prototype của nhóm khác ở chỗ mọi câu hỏi/giải thích phải bám bộ slide đầu vào.
- **Trạng thái:** phần benchmark sản phẩm bên ngoài chưa hoàn tất; cần bổ sung tên sản phẩm, flow và nguồn tham khảo trước CP5 nếu sử dụng trong slide demo.

## §4. Thiết kế

- **Lát cắt một câu:** Học viên tải bộ slide AI và nhập yêu cầu ôn tập; AI quyết định yêu cầu có đủ căn cứ trong slide để tạo quiz hay phải từ chối; hệ thống trả 3 câu hỏi trắc nghiệm kèm điểm, giải thích và citation theo trang.
- **Non-goals:**
  1. Không dùng kiến thức bên ngoài slide hoặc web để bổ sung đáp án.
  2. Chưa hỗ trợ OCR cho PDF dạng ảnh/scan.
  3. Chưa xây lịch sử điểm, adaptive learning hoặc ngân hàng câu hỏi dài hạn.
  4. Không làm bài kiểm tra thay học viên và không cung cấp đáp án cho bài thi đang diễn ra.
  5. Không hỗ trợ mọi domain ngoài phạm vi AI/ML/DL ở bản demo.
- **Mức prototype:** [ ] Sketch  [ ] Mock  [x] Working
  - Mock: tài liệu đầu vào hiện là text demo về AI/Transformer; chưa có upload PDF hoàn chỉnh.
  - Thật: lời gọi Gemini, kiểm tra JSON, tạo câu hỏi/đáp án/giải thích/citation, chấm điểm và scope guard.
- **Automation:** [ ] augment  [x] conditional  [ ] automate
  - AI chỉ tự tạo quiz khi có căn cứ; yêu cầu thiếu thông tin, ngoài slide hoặc bị cấm phải từ chối. Người học vẫn là người quyết định đáp án và chịu trách nhiệm học lại phần sai. Cost-of-error cao vì một câu hỏi/giải thích sai có thể làm học viên học sai kiến thức.

### §4b. Nguyên tắc đã áp dụng

| Nguyên tắc | Áp cụ thể vào prototype |
|---|---|
| G1 — Làm rõ hệ thống làm được gì | Màn hình ghi rõ quiz được tạo từ tài liệu nguồn; không dùng kiến thức ngoài slide. |
| G2 — Làm rõ làm tốt đến đâu | Mỗi kết quả hiển thị citation; quality bar yêu cầu không hallucination. |
| G10 — Thu hẹp phạm vi khi nghi ngờ | Scope guard/refusal khi yêu cầu không có chủ đề trong slide hoặc tài liệu không đủ. |
| G8 — Gạt bỏ dễ dàng | Người dùng có thể quay về bài học, làm lại hoặc nhập yêu cầu khác. |
| G9 — Sửa dễ dàng | Labcoach có thể sửa yêu cầu trong ô input và gửi lại. |
| G11 — Giải thích vì sao | Feedback hiển thị đáp án đúng, giải thích và trang nguồn. |

## §5. Kiểu lỗi — 4 lớp chỗ khó + kịch bản

| Lớp chỗ khó | Kịch bản | Case kiểm thử |
|---|---|---|
| Nguồn sự thật | Slide chỉ có “Token”, không đủ để tạo 3 câu | I01 |
| Nguồn sự thật | Yêu cầu công thức nhưng đoạn nguồn chỉ có tiêu đề | I02 |
| Mơ hồ/thiếu thông tin | “Hãy tạo câu hỏi hay” nhưng không nói muốn kiểm tra khía cạnh nào | A02 |
| Mơ hồ/thiếu thông tin | Đại từ “nó” chỉ “có thể” liên quan đến con mèo, không được khẳng định tuyệt đối | A01 |
| Ngoài phạm vi/thẩm quyền | Đòi làm bài kiểm tra cuối kỳ thay học viên | D01 |
| Ngoài phạm vi/thẩm quyền | Đòi đáp án trực tiếp cho bài thi đang diễn ra | D02 |
| Đặc thù domain | Công thức Attention phải giữ đúng chuyển vị và căn bậc hai | H01 |
| Đặc thù domain | Không được gán nhầm vai trò Query, Key, Value | H02 |
| Nguồn sự thật | Hỏi về lịch sử ChatGPT không có trong slide | O01 |
| Nguồn sự thật | Hỏi giá API Gemini không có trong slide | O02 |
| Input người dùng thực tế | Tin nhắn cụt “tóm tắt” | R01 |
| Input người dùng thực tế | Lỗi chính tả/trộn tiếng Anh như “slice”, “full màn”, “sota” | R03, R06, R10 |

## §6. Bốn đường đi của trải nghiệm

- **Happy path:** Học viên có slide → nhập yêu cầu hợp lệ → AI gọi Gemini → trả 3 câu hỏi có 4 lựa chọn → học viên chọn đáp án → nhận đúng/sai, giải thích, citation và tổng điểm.
- **Low-confidence (②):** Input ngắn/mơ hồ hoặc slide không đủ căn cứ → hiển thị refusal/yêu cầu làm rõ, không tự đoán.
- **Failure/không căn cứ (①):** Chủ đề không xuất hiện trong slide → scope guard hoặc AI trả refusal; không tạo câu hỏi từ kiến thức bên ngoài.
- **Correction:** Người dùng sửa yêu cầu, chọn lại phạm vi/tải tài liệu phù hợp và gửi lại.
- **Ngoài phạm vi (③):** Đòi làm bài thi/đưa đáp án trực tiếp → từ chối và giải thích giới hạn sản phẩm.
- **Case đặc thù domain (④):** Công thức, Query/Key/Value và citation trang phải được kiểm tra chặt; sai sẽ được ghi là fail dù câu hỏi nhìn có vẻ hợp lệ.

## §7. Kiểm thử

- **Chiều chất lượng:** grounding, citation, tính đúng của đáp án, giải thích, duy nhất một đáp án đúng, xử lý refusal, xử lý input thực tế và format JSON.
- **Định nghĩa kiểm chứng:** một case đạt khi output đúng `expected_behavior`, không dùng kiến thức ngoài slide, citation đúng trang và không vi phạm ràng buộc của case.
- **Golden set:** 35 case trong [`eval/golden_set.csv`](eval/golden_set.csv), gồm 8 normal, 3 close concepts, 3 example, 2 insufficient, 2 out-of-scope, 2 ambiguous, 2 disallowed, 2 high-consequence, 1 multiple-correct và 10 observed từ chatlog.
- **Quality bar chốt tại CP4:** “Đạt khi **≥90%** case qua bộ thử, và **AI không được bịa kiến thức hoặc trích dẫn ngoài bộ slide dù chỉ một lần**.”
- **Kết quả lượt chạy đầu:** `25/35 = 71,4%`; API phản hồi `34/35`, một case lỗi quota `429`. Chi tiết đầy đủ, gồm cả fail, ở [`eval/results_round_1.csv`](eval/results_round_1.csv); tổng hợp ở [`eval/summary_round_1.md`](eval/summary_round_1.md).
- **Khoảng cách so với chuẩn:** `90% - 71,4% = 18,6 điểm phần trăm`. Lỗi chính: chưa luôn hỏi lại input mơ hồ, chưa từ chối yêu cầu bị cấm và một case format không đúng.

## §8. Phân công & kế hoạch

- **Phân công:**
  - Spec/evidence: **Nguyễn Thế Anh** — viết và chốt `spec.md`, đảm bảo quality bar bằng số.
  - Evidence: **Trần Quốc Hùng** — mining chatlog, trích xuất quote, viết §1–§2.
  - Prompt/evaluation: **Nguyễn Đức Sơn** — thiết kế prompt, test golden set, phân tích kết quả.
  - Code/backend/frontend: **Trần Quốc Hùng** — tích hợp AI vào `server.py`, frontend gọi API, xử lý lỗi.
  - Demo: **BlackHair** — viết demo script, chuẩn bị slide, dry run.
- **Willing users:**
  - **Nguyễn Hữu Nghĩa** — học viên khóa AI Thực Chiến, không trong nhóm.
  - **Phạm Văn Lưu** — học viên khóa AI Thực Chiến, không trong nhóm.
  - **Phạm Thế Dũng** — học viên khóa AI Thực Chiến, không trong nhóm.
- **Kế hoạch validation CP5:** cho từng người dùng thử một bộ slide AI và flow tạo 3 câu hỏi; ghi tối thiểu 5 feedback mẫu có tên. Ba câu hỏi validation: (1) bạn có hiểu cách tải slide và bắt đầu ôn tập không, (2) câu hỏi/đáp án/giải thích có bám đúng slide không, (3) citation có tạo niềm tin và bạn có muốn dùng lại không. **Nguyễn Thế Anh** phụ trách tổng hợp feedback log và changelog.
- **Multi-prototype:** chưa làm multi-prototype; đang ưu tiên một flow working có AI thật và đo được.

## §9. Changelog

| Thời điểm | Đổi gì | Vì sao |
|---|---|---|
| 2026-07-30 | Tạo flow CP2 tài liệu → quiz → feedback → điểm | Đạt yêu cầu “bấm được” trước khi tích hợp AI. |
| 2026-07-30 | Tích hợp Gemini thật qua backend, ép JSON và citation | CP3 yêu cầu AI chạy thật tại quyết định trung tâm. |
| 2026-07-30 | Đổi model sang `gemini-3.1-flash-lite` | Model phù hợp hơn với quota free hiện có. |
| 2026-07-30 | Thêm golden set và chạy lượt đầu | Cần đo được chất lượng thay vì chỉ demo happy path. |
| 2026-07-30 | Mở rộng golden set lên 35 case, gồm 10 case quan sát chatlog | Bổ sung 4 lớp chỗ khó và input gần với người dùng thật. |
| 2026-07-30 | Thêm scope guard và ô nhập yêu cầu Labcoach | Phát hiện yêu cầu ngoài slide, hỗ trợ demo câu lạ và giảm hallucination. |
