# VLearn Ôn tập nhanh — CP2 prototype

Prototype CP3 cho flow: tài liệu mẫu → gọi AI thật → làm 3 câu trắc nghiệm → xem đáp án/giải thích/citation → tổng kết → làm lại.

## Chạy thử CP3

Không mở trực tiếp `index.html` vì frontend cần gọi backend. Dùng PowerShell:

Điền API key và model vào file `.env`, sau đó chạy:

```powershell
python server.py
```

Sau đó mở `http://127.0.0.1:8000`.

Backend mặc định dùng `gemini-3.1-flash-lite`. Không commit API key hoặc file `.env`.

## Phạm vi CP3

- Câu hỏi được sinh bằng lời gọi Gemini thật ở `/api/generate-quiz`.
- Backend kiểm tra schema: đúng 3 câu, mỗi câu 4 lựa chọn và đáp án A–D.
- Màn hình cấu hình có ô để Labcoach nhập yêu cầu lạ; AI có thể từ chối nếu yêu cầu nằm ngoài tài liệu.
- Tài liệu hiện là text mẫu về AI/Attention; upload PDF sẽ làm ở bước tiếp theo.
