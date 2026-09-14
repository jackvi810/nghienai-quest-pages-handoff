# Checklist nghiệm thu gói Quest

## Cài đặt và build

- [ ] `npm ci` chạy được từ thư mục gói.
- [ ] `npm test` đạt.
- [ ] `npm run lint` không có lỗi trong gói cô lập.
- [ ] `npm run build` đạt.
- [ ] Không có `.env`, khóa API hoặc `node_modules` trong ZIP.

## Quest Hub `/quests`

- [ ] Bốn số liệu hiển thị đúng và không tràn ở 1440, 1024, 768, 390px.
- [ ] Ảnh Quest nổi bật giữ đúng tỷ lệ và không đè lên panel cam.
- [ ] Carousel hoạt động bằng kéo, click và phím mũi tên.
- [ ] Countdown có ngày, giờ, phút, giây và đổi trạng thái theo mốc thời gian.
- [ ] Đồng hồ lật giải thưởng chạy tại giây 00/30, dừng khi tab ẩn và có fallback giảm chuyển động.
- [ ] Filter và tìm kiếm cập nhật danh sách mà không làm layout nhảy bất thường.
- [ ] Heatmap có đúng 100 tile, tile có diện tích khác nhau theo XP và không tràn ngang.
- [ ] Click, Enter và Tab chọn được thành viên; phần chi tiết cập nhật đúng.
- [ ] Avatar, ảnh Quest, ảnh cộng đồng và logo đối tác tải được.

## Quest detail `/quests/build-your-first-ai-agent`

- [ ] Hero carousel hoạt động bằng kéo, click và phím mũi tên.
- [ ] Nút tham gia chạy fireworks và reload trở về trạng thái chưa tham gia.
- [ ] Nút chia sẻ mở menu; Escape/click ngoài đóng menu; copy link có phản hồi.
- [ ] Accordion, quiz, upload, social proof và task submit hoạt động.
- [ ] Tiến độ task lưu và khôi phục bằng localStorage.
- [ ] XP badge, progress rail, sponsor strip và leaderboard hiển thị đầy đủ.
- [ ] Không xuất hiện markup heatmap của Hub trên route chi tiết.

## Accessibility và motion

- [ ] Có thể dùng toàn bộ thao tác quan trọng bằng bàn phím.
- [ ] `aria-label` của heatmap chứa hạng, tên, XP và tiến độ.
- [ ] `prefers-reduced-motion` tắt autoplay, reveal mạnh và flip.
- [ ] Không có chữ bị cắt hoặc ảnh bị vỡ ở breakpoint chính.
