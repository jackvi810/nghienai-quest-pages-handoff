# Nghiên AI Quest Pages — gói bàn giao v1

Gói này là bản mã nguồn cô lập của hai trang Quest để developer tiếp tục phát triển:

- `/quests` — trang tổng hợp Quest.
- `/quests/build-your-first-ai-agent` — trang chi tiết campaign OpenClaw.

Đây là gói frontend tự chạy bằng dữ liệu mẫu. V1 không nối database, Supabase hoặc tài khoản người dùng.

## Chạy nhanh

Yêu cầu Node.js 20 trở lên.

```bash
npm ci
npm run dev -- --host 0.0.0.0
```

Mở:

```text
http://localhost:8080/quests
http://localhost:8080/quests/build-your-first-ai-agent
```

Build và preview:

```bash
npm run build
npm run preview
```

## Cấu trúc chính

```text
src/pages/Quests.tsx                 Hai route Hub và campaign detail
src/features/quests/                 Countdown, animation và treemap leaderboard
src/styles/quest.css                 Toàn bộ CSS Quest, có scope theo route
src/components/public/               Header/footer public dùng chung
src/assets/quests/                   Ảnh Quest, avatar, cộng đồng và logo đối tác
src/test/                            Test logic thời gian và treemap
e2e/                                 Test trình duyệt cho Hub/detail
docs/previews/                       Ảnh kiểm tra giao diện sau khi chạy QA
```

## Trạng thái và dữ liệu

- Nội dung Quest, số người tham gia, phần thưởng, thời gian và leaderboard là dữ liệu mẫu nằm trong `src/pages/Quests.tsx`.
- Tiến độ nhiệm vụ chi tiết được lưu cục bộ bằng khóa:

  ```text
  nghien-ai.quest.build-your-first-ai-agent.v1
  ```

- Trạng thái `Đã tham gia` chỉ tồn tại trong phiên hiện tại; reload sẽ trở về `Tham gia`.
- Để xóa tiến độ khi kiểm thử, chạy trong DevTools:

  ```js
  localStorage.removeItem("nghien-ai.quest.build-your-first-ai-agent.v1")
  location.reload()
  ```

- Dữ liệu chưa có cơ chế gửi bài thật, duyệt bài thật, payout hoặc đồng bộ tài khoản.

## Animation và tương tác

Xem chi tiết trong [MOTION-MAP.md](./MOTION-MAP.md). Các nhóm chính gồm carousel, countdown, đồng hồ lật giải thưởng, reveal khi cuộn, filter/search, treemap XP, task accordion, share menu và fireworks.

Mọi animation có nhánh `prefers-reduced-motion`; khi người dùng bật giảm chuyển động, autoplay/reveal mạnh/flip sẽ dừng nhưng nội dung và thao tác vẫn dùng được.

## Kiểm thử

```bash
npm test
npm run lint
npm run build
npm run test:e2e
```

Test trình duyệt tự khởi động máy chủ Vite ở cổng `4173` để không phụ thuộc vào máy chủ của app gốc. Các kích thước responsive chính: 1440, 1024, 768 và 390px.

## Lưu ý bàn giao

- Gói không chứa `.env`, khóa API, `node_modules` hoặc dữ liệu localStorage của máy người đóng gói.
- Không cần Supabase để chạy hai route này.
- ZIP và repository phải được tạo từ cùng một commit/tag. Mã commit và SHA-256 của ZIP được ghi ở `docs/RELEASE-METADATA.md`.
- Asset chi tiết nằm trong [ASSET-MANIFEST.md](./ASSET-MANIFEST.md).
- Checklist nghiệm thu nằm trong [QA-CHECKLIST.md](./QA-CHECKLIST.md).
