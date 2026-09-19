export const locales = ["vi", "en"] as const;
export type Locale = (typeof locales)[number];

export function isLocale(value: string): value is Locale {
  return locales.includes(value as Locale);
}

export const dictionary = {
  vi: {
    nav: { home: "Trang chủ", algorithms: "Thuật toán", roadmap: "Lộ trình" },
    common: {
      explore: "Khám phá thuật toán", preview: "Xem bản thử nghiệm", search: "Tìm thuật toán...", all: "Tất cả",
      developing: "Đang phát triển", planned: "Đã lên kế hoạch", available: "Đã xuất bản",
      easy: "Cơ bản", intermediate: "Trung cấp", advanced: "Nâng cao", source: "Nguồn tham khảo",
      lastReviewed: "Kiểm duyệt gần nhất", noResults: "Không tìm thấy thuật toán phù hợp.",
    },
    home: {
      eyebrow: "Học thuật toán bằng trực giác", title: "Nhìn thấy từng bước. Hiểu sâu từng thuật toán.",
      description: "Một phòng thí nghiệm song ngữ cho cộng đồng Competitive Programming — kết hợp mô phỏng, code C++ và giải thích có kiểm chứng.",
      workflow: ["Chọn thuật toán", "Nhập dữ liệu", "Chạy từng bước", "Hiểu và luyện tập"],
      catalogTitle: "Bắt đầu từ những cấu trúc quan trọng", catalogDescription: "Ba bài đầu tiên sẽ đặt chuẩn cho toàn bộ hệ thống mô phỏng.",
      principlesTitle: "Được xây cho việc học thật",
      principles: [
        ["Nguồn minh bạch", "Mỗi bài ghi rõ nguồn chính, nguồn đối chiếu và ngày kiểm duyệt."],
        ["Hai ngôn ngữ đồng bộ", "Tiếng Việt và tiếng Anh dùng chung code, công thức và dữ liệu mô phỏng."],
        ["Điều khiển từng bước", "Tạm dừng, tiến, lùi và quan sát trạng thái thay đổi theo thời gian."],
      ],
      demoTitle: "Khung mô phỏng", demoDescription: "Chuỗi dưới đây chỉ kiểm tra bộ điều khiển của Giai đoạn 1, chưa phải bài thuật toán hoàn chỉnh.",
    },
    catalog: {
      eyebrow: "Thư viện kiến thức", title: "Danh mục thuật toán",
      description: "Tìm theo tên, chủ đề hoặc độ khó. Chỉ bài đã kiểm duyệt mới được đánh dấu là đã xuất bản.",
      filters: "Bộ lọc", status: "Trạng thái", category: "Chủ đề", showing: "kết quả",
    },
    detail: {
      overview: "Tổng quan", prerequisites: "Kiến thức cần biết",
      statusNotice: "Bài này đang trong roadmap. Nội dung và mô phỏng đầy đủ sẽ chỉ xuất bản sau khi vượt qua kiểm thử.",
      publishedNotice: "Bài học tương tác đã vượt qua kiểm thử và sẵn sàng để học.",
      back: "Quay lại danh mục",
    },
    footer: "Nền tảng trực quan hóa thuật toán dành cho cộng đồng CP.",
  },
  en: {
    nav: { home: "Home", algorithms: "Algorithms", roadmap: "Roadmap" },
    common: {
      explore: "Explore algorithms", preview: "View the preview", search: "Search algorithms...", all: "All",
      developing: "In development", planned: "Planned", available: "Published",
      easy: "Beginner", intermediate: "Intermediate", advanced: "Advanced", source: "References",
      lastReviewed: "Last reviewed", noResults: "No matching algorithms found.",
    },
    home: {
      eyebrow: "Build algorithmic intuition", title: "See every step. Understand every algorithm.",
      description: "A bilingual lab for competitive programmers, combining interactive simulations, C++ code, and verified explanations.",
      workflow: ["Choose", "Enter data", "Step through", "Understand & practice"],
      catalogTitle: "Start with essential structures", catalogDescription: "Our first three lessons will set the quality bar for every future visualization.",
      principlesTitle: "Built for genuine learning",
      principles: [
        ["Traceable sources", "Every lesson records its primary sources, cross-checks, and review date."],
        ["Synchronized languages", "Vietnamese and English share the same code, formulas, and simulation data."],
        ["Step-level control", "Pause, move forward or backward, and inspect state changes over time."],
      ],
      demoTitle: "Visualization framework", demoDescription: "This sequence only validates Phase 1 controls. It is not presented as a finished algorithm lesson.",
    },
    catalog: {
      eyebrow: "Knowledge library", title: "Algorithm catalog",
      description: "Search by name, topic, or difficulty. Only reviewed lessons are marked as published.",
      filters: "Filters", status: "Status", category: "Topic", showing: "results",
    },
    detail: {
      overview: "Overview", prerequisites: "Prerequisites",
      statusNotice: "This lesson is on the roadmap. Complete content and visualization will only be published after testing.",
      publishedNotice: "This interactive lesson has passed verification and is ready to use.",
      back: "Back to catalog",
    },
    footer: "An algorithm visualization platform for the CP community.",
  },
} as const;

export function getDictionary(locale: Locale) { return dictionary[locale]; }
