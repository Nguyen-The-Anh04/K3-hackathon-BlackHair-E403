# VLearn Quiz Generator — Project Notes

## 1. Ý tưởng dự án

Tạo chức năng ôn tập cho VLearn: từ đoạn tài liệu hoặc slide học viên vừa học, hệ thống tự tạo câu hỏi trắc nghiệm, chấm điểm, giải thích đáp án và trích dẫn nguồn.

## 2. Lát cắt MVP

> Một học viên vừa học xong một đoạn slide về AI muốn tự kiểm tra mức độ hiểu bài bằng 3 câu hỏi trắc nghiệm có giải thích và trích dẫn đúng trang nguồn, ngay tại nơi đang học.

### Phạm vi nên dùng trong hackathon

- Demo tập trung vào lĩnh vực **AI**.
- Học viên đưa bộ slide của mình vào hệ thống; AI chỉ được sử dụng kiến thức xuất hiện trong bộ slide đó.
- Không lấy thêm kiến thức bên ngoài slide để sinh câu hỏi, đáp án hoặc giải thích.
- Không phụ thuộc vào việc tải tài liệu nội bộ của khóa học.
- Một tài liệu hoặc một đoạn slide → 3 câu hỏi → chấm điểm → giải thích → citation.
- Chưa mở rộng sang mọi lĩnh vực, mọi loại câu hỏi hoặc hệ thống học tập cá nhân hóa.

## 3. Bằng chứng từ data VLearn

- Data có 1.261 lượt hỏi–đáp, 369 học viên và 585 cuộc hội thoại.
- Chỉ có `3/2.522` message có tutor chủ động hỏi kiểm tra hiểu bài.
- Trường `follow_ups` và `misconceptions` chưa được sử dụng.
- Khoảng `46,2%` câu trả lời không có citation.

Insight: VLearn đang trả lời câu hỏi của học viên nhưng chưa hỗ trợ tốt việc chủ động kiểm tra và củng cố mức độ hiểu bài.

## 4. Flow sản phẩm

1. Học viên tải bộ slide/PDF về AI lên hệ thống.
2. Hệ thống đọc nội dung và hiển thị tài liệu đã tải lên.
3. Học viên bấm **Tạo câu hỏi ôn tập**.
4. Chọn **Bắt đầu làm bài**.
5. Chọn đáp án cho từng câu hỏi.
6. Bấm **Kiểm tra đáp án**.
7. Xem trạng thái đúng/sai, đáp án đúng, giải thích và citation từ chính tài liệu đã tải lên.
8. Làm hết 3 câu và xem tổng điểm.
9. Chọn **Làm lại** hoặc **Tải tài liệu khác**.

## 5. Trạng thái hiện tại — CP2

Đã hoàn thành prototype tại thư mục `codebase/`.

- `codebase/index.html`: các màn hình của flow.
- `codebase/styles.css`: giao diện prototype.
- `codebase/app.js`: logic chuyển màn hình, chọn đáp án và tính điểm.
- `codebase/README.md`: hướng dẫn chạy.

CP2 hiện dùng câu hỏi, đáp án, giải thích và citation giả được hardcode trong `app.js`. Mục tiêu CP2 là chứng minh flow bấm được từ đầu đến cuối; chưa cần AI thật.

Branch/commit CP2 đã được merge vào `main`.

## 6. Việc cần làm tiếp theo — CP3

### Tích hợp AI thật

- Thay dữ liệu hardcode bằng lời gọi LLM.
- Gửi nội dung slide/đoạn tài liệu cùng hướng dẫn tạo câu hỏi.
- Ép AI trả về JSON có cấu trúc ổn định.
- Hiển thị loading, lỗi và trường hợp AI không tạo được câu hỏi.

Schema gợi ý:

```json
{
  "question": "...",
  "options": ["...", "...", "...", "..."],
  "correct_option": "B",
  "explanation": "...",
  "citation": "[Trang 12]",
  "confidence": 0.91
}
```

### Nguyên tắc sinh câu hỏi

- Chỉ hỏi những gì có căn cứ trong tài liệu.
- Mỗi câu chỉ có một đáp án đúng.
- Citation phải trỏ đúng trang hoặc đoạn nguồn.
- Giải thích phải ngắn, dễ hiểu và dựa trên tài liệu.
- Nếu không đủ thông tin, AI phải báo không thể tạo câu hỏi chắc chắn.

## 7. Input tài liệu

### Phạm vi ưu tiên

Ưu tiên bộ slide/PDF về AI có lớp text hoặc nội dung slide dạng text, do học viên cung cấp hoặc được phép sử dụng. Pipeline dự kiến:

> Upload slide/PDF → trích xuất nội dung theo từng trang → chia nội dung → tạo câu hỏi chỉ từ slide → chấm điểm + giải thích + citation.

### OCR

Không triển khai OCR trong hackathon 1,5 ngày nếu chưa hoàn thành flow AI cơ bản. OCR dễ phát sinh lỗi với tiếng Việt, font và bố cục slide.

Có thể hiển thị fallback:

> PDF này chưa có lớp text và hiện chưa được hỗ trợ. Vui lòng dùng PDF có thể chọn/bôi đen văn bản.

OCR là hướng phát triển sau hackathon cho PDF dạng ảnh/scan.

### Nguồn tài liệu demo thay thế

- PDF/slide tự tạo về kiến thức AI để demo.
- Tài liệu công khai có giấy phép phù hợp.
- Bộ dữ liệu giả gồm các đoạn slide AI và số trang giả lập.
- Không dùng tài liệu nội bộ của khóa nếu không có quyền tải xuống hoặc chia sẻ.

## 8. Bốn lớp rủi ro cần xử lý

1. **Nguồn sự thật:** AI không được bịa kiến thức ngoài slide.
2. **Thiếu thông tin:** đoạn quá ngắn hoặc không đủ căn cứ thì báo rõ hoặc yêu cầu chọn thêm nội dung.
3. **Ngoài phạm vi:** không tạo câu hỏi về chủ đề không xuất hiện trong tài liệu.
4. **Đặc thù giáo dục:** không tạo câu hỏi mơ hồ, nhiều đáp án đúng hoặc giải thích sai.

## 9. Quality bar đề xuất

- Ít nhất 90% câu hỏi có đáp án đúng được xác minh.
- 100% câu hỏi có citation hợp lệ.
- 0 câu hỏi có nhiều đáp án đúng.
- Ít nhất 80% người thử hiểu được giải thích.
- Ít nhất 3 học viên ngoài nhóm đồng ý thử prototype.

## 10. Golden set và validation

Golden set tối thiểu 20 case, gồm:

- Đoạn tài liệu rõ ràng, đủ thông tin.
- Đoạn tài liệu quá ngắn.
- Nội dung có nhiều khái niệm gần nhau.
- Nội dung có bảng, công thức hoặc ví dụ.
- Câu hỏi ngoài phạm vi tài liệu.
- Trường hợp không thể xác định đáp án duy nhất.

Vòng validation nên ghi lại ít nhất 5 feedback có tên người thử, gồm:

- Có hiểu cách bắt đầu không?
- Câu hỏi có đúng nội dung vừa học không?
- Đáp án và giải thích có dễ hiểu không?
- Citation có tạo niềm tin không?
- Họ có muốn dùng lại tính năng không?

## 11. Demo checklist

- [ ] Mở được prototype từ `codebase/index.html`.
- [ ] Bấm được từ tài liệu đến tổng kết.
- [ ] Có thể chọn đáp án và xem đúng/sai.
- [ ] Có giải thích và citation hiển thị.
- [ ] Có màn hình điểm cuối.
- [ ] Có ít nhất một case trả lời sai để demo.
- [ ] Nói rõ CP2 dùng mock data.
- [ ] Nếu đã có AI, trình bày AI thật ở quyết định trung tâm.
- [ ] Chuẩn bị một ảnh collage duy nhất gồm: tài liệu → bắt đầu quiz → câu hỏi → kết quả.

## 12. Mô tả ngắn cho BTC

Học viên tải một bộ slide/PDF về AI lên hệ thống và bấm **Tạo câu hỏi ôn tập**. Sau khi chọn đáp án cho 3 câu hỏi, hệ thống hiển thị kết quả đúng/sai, đáp án đúng, giải thích và trích dẫn trang nguồn từ chính tài liệu đã tải lên. Cuối flow, học viên nhận tổng điểm và có thể làm lại hoặc tải tài liệu khác.

## 13. Lưu ý bảo mật

- Không commit API key hoặc file `.env`.
- Không đưa nguyên data pack vào repo public hoặc công cụ bên ngoài.
- Chỉ sử dụng data được cấp cho phạm vi hackathon hoặc dữ liệu giả.
- Không cố suy ngược danh tính từ các mã đã ẩn danh.
