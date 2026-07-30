# Demo slide source — AI: Transformer & Attention

Đây là bộ slide demo tự tạo để kiểm thử CP3. Mọi câu hỏi trong `golden_set.csv` chỉ được dựa trên nội dung dưới đây.

## [Trang 1] Token và ngữ cảnh

LLM xử lý văn bản theo các đơn vị gọi là token. Một câu được biểu diễn thành chuỗi token. Mô hình sử dụng ngữ cảnh của các token xung quanh để tạo biểu diễn cho token hiện tại.

## [Trang 2] Self-attention

Self-attention cho phép mô hình xác định mức độ liên quan giữa các token trong cùng một câu. Mỗi token được chiếu thành ba vector Query, Key và Value.

## [Trang 3] Query, Key và Value

Query thể hiện thông tin mà token hiện tại đang tìm kiếm. Key thể hiện đặc điểm để token khác được so sánh. Value là thông tin được tổng hợp sau khi tính mức độ liên quan. Attention score được tính từ Query và Key, sau đó dùng score để kết hợp các Value.

## [Trang 4] Ví dụ ngữ cảnh

Trong câu “Con mèo ngồi trên chiếc bàn vì nó mệt”, từ “nó” có thể liên quan đến “con mèo” dựa trên ngữ cảnh. Self-attention giúp mô hình xem xét mối liên hệ giữa “nó” và các token khác thay vì chỉ nhìn vào một token riêng lẻ.

## [Trang 5] Transformer và giới hạn

Transformer sử dụng attention để xử lý quan hệ giữa các token. Attention không tự đảm bảo mô hình hiểu đúng mọi kiến thức. LLM vẫn có thể tạo hallucination, đặc biệt khi thông tin không có trong ngữ cảnh đầu vào.

## [Trang 6] Công thức minh họa

Một dạng công thức attention được minh họa là: Attention(Q, K, V) = softmax(QKᵀ / √dₖ)V. Trong công thức này, Q, K, V là các ma trận Query, Key, Value; dₖ là số chiều của Key. Công thức chỉ là minh họa cho cách score được chuẩn hóa trước khi kết hợp Value.
