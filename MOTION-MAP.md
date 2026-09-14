# Bản đồ UI/UX và animation

## `/quests` — Quest Hub

| Khu vực | Hành vi | Nguồn triển khai |
|---|---|---|
| Bốn số liệu đầu trang | Reveal nhẹ khi vào viewport; count-up chạy một lần | `useQuestHubMotion.ts` |
| Quest nổi bật | Carousel kéo, click hai phía, phím mũi tên, tự chuyển 10 giây; chỉ số ảnh và countdown | Embla trong `Quests.tsx` |
| Countdown | Đồng hồ chung theo giây; trạng thái tự chuyển giữa `Sắp mở`, `Đang diễn ra`, `Đã kết thúc` | `questHubTime.ts` |
| Giải thưởng | Các chữ số `15.000.000đ` lật lần lượt tại giây 00 và 30; dừng khi tab ẩn hoặc ra khỏi viewport | `PrizeFlipDisplay` trong `Quests.tsx` |
| Khám phá Quest | Filter, tìm kiếm và danh sách thay đổi bằng opacity/dịch chuyển ngắn; giữ layout | Framer Motion + `LayoutGroup` |
| Dành cho bạn | Rail nhiệm vụ phản ánh localStorage; ô task chuyển sang check bằng spring nhỏ | Framer Motion |
| Bảng xếp hạng | D3 treemap 100 thành viên; diện tích theo XP, năm mức màu; click/Enter chọn thành viên | `leaderboardHeatmap.ts`, `QuestLeaderboardHeatmap.tsx` |
| Đối tác | Ảnh và logo reveal theo viewport; dải logo chạy chậm và dừng khi hover/focus | `useQuestHubMotion.ts`, CSS |

## `/quests/build-your-first-ai-agent` — Quest detail

| Khu vực | Hành vi |
|---|---|
| Hero | Reveal nội dung và ảnh theo thứ tự; carousel tự chuyển 10 giây, kéo, click và bàn phím |
| Tham gia | Fireworks chạy một lần trong phiên khi bấm tham gia; trạng thái không lưu qua reload |
| Chia sẻ | Menu mở dưới nút; chọn X, Facebook hoặc sao chép link; đóng bằng Escape/click ngoài |
| Nhiệm vụ | Accordion mở/đóng; trạng thái submit, quiz, upload, social proof và XP lưu localStorage |
| Tiến độ | Donut, rail và trạng thái task cập nhật theo dữ liệu local |
| Campaign dossier | Các phần hướng dẫn mở/đóng; có thao tác mở tất cả/đóng tất cả |
| Sponsor strip | Logo OpenClaw và ba liên kết icon-only với hover/focus |
| Quest liên quan | Reveal theo viewport và hover nhẹ |

## Quy tắc chuyển động

- Motion là lớp hỗ trợ đọc và phản hồi thao tác, không phải nội dung bắt buộc.
- Không có hiệu ứng glow, particle hoặc pointer lens.
- `prefers-reduced-motion` tắt autoplay, marquee, flip và reveal mạnh.
- Dữ liệu vẫn phải hiển thị đầy đủ trước khi animation bắt đầu.
- Khi sửa animation, kiểm tra đồng thời desktop, mobile, resize và tab visibility.
