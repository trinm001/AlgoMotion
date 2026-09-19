# AlgoMotion

Nền tảng song ngữ giúp cộng đồng Competitive Programming học thuật toán bằng mô phỏng tương tác, code C++ và nội dung có nguồn kiểm chứng.

## Chạy dự án

```bash
corepack pnpm install
corepack pnpm dev
```

Mở `http://localhost:3000`. Route gốc chuyển tới `/vi`; bản tiếng Anh nằm tại `/en`.

## Cổng chất lượng

```bash
corepack pnpm typecheck
corepack pnpm lint
corepack pnpm test
corepack pnpm build
corepack pnpm test:e2e
```

## Lộ trình phát triển

| Giai đoạn | Mục tiêu | Sản phẩm chính |
| --- | --- | --- |
| 0 | Chốt đặc tả | Kiến trúc, nguồn, danh mục thuật toán |
| 1 | Xây nền móng | Website song ngữ, danh mục, design system |
| 2 | Chứng minh hệ thống | Segment Tree hoàn chỉnh |
| 3 | Tổng quát hóa visualizer | Fenwick Tree và Sàng nguyên tố |
| 4 | Thuật toán nền tảng | Sorting, searching, prefix sum… |
| 5 | Cấu trúc dữ liệu | Heap, DSU, Trie, Sparse Table… |
| 6 | Đồ thị và cây | BFS, DFS, shortest path, MST, LCA… |
| 7 | DP, chuỗi, toán, hình học | Các nhóm CP trung cấp và nâng cao |
| 8 | Hệ thống học tập | Quiz, bài tập, lưu tiến độ |
| 9 | Cộng đồng và kiểm duyệt | Đóng góp bài, review, quản trị |
| 10 | Hoàn thiện sản phẩm | Hiệu năng, accessibility, bảo mật |
| 11 | Public beta và ra mắt | Deploy, theo dõi lỗi, phát hành |
| 12 | Duy trì lâu dài | Thêm thuật toán và cập nhật nguồn |

Hiện dự án đã hoàn thành Giai đoạn 3. Giai đoạn tiếp theo là Giai đoạn 4 — thuật toán nền tảng.

## Tiến độ đã hoàn thành

Giai đoạn 1 xây nền tảng giao diện, song ngữ, catalog và bộ điều khiển mô phỏng thử nghiệm.

Giai đoạn 2 hoàn thiện bài học Segment Tree đầu tiên: dựng cây, truy vấn tổng đoạn, cập nhật điểm, điều khiển tiến/lùi/tự chạy, giải thích song ngữ và kiểm thử desktop/mobile. Các bài còn lại vẫn giữ trạng thái roadmap cho đến khi có nội dung và mô phỏng đã kiểm chứng.

Giai đoạn 3 bổ sung hai bài học đã kiểm chứng: Fenwick Tree với lowbit, truy vấn tổng đoạn và cập nhật điểm; Sàng Eratosthenes với quá trình đánh dấu hợp số từ `p²`. Cả hai có trace từng bước, code C++ đồng bộ, nội dung Việt–Anh và kiểm thử desktop/mobile.
