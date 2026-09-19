import type { Locale } from "@/lib/i18n";

export type Difficulty = "easy" | "intermediate" | "advanced";
export type AlgorithmStatus = "planned" | "developing" | "available";
export type Category = "fundamentals" | "data-structures" | "mathematics" | "graphs" | "strings";
type LocalizedText = Record<Locale, string>;

export interface AlgorithmSource {
  name: string;
  url: string;
  role: "primary" | "cross-check" | "practice";
}

export interface Algorithm {
  slug: string;
  title: LocalizedText;
  description: LocalizedText;
  category: Category;
  difficulty: Difficulty;
  status: AlgorithmStatus;
  prerequisites: LocalizedText[];
  sources: AlgorithmSource[];
  lastReviewed: string | null;
}

export const categoryLabels: Record<Category, LocalizedText> = {
  fundamentals: { vi: "Nền tảng", en: "Fundamentals" },
  "data-structures": { vi: "Cấu trúc dữ liệu", en: "Data structures" },
  mathematics: { vi: "Toán học", en: "Mathematics" },
  graphs: { vi: "Đồ thị", en: "Graphs" },
  strings: { vi: "Chuỗi", en: "Strings" },
};

const cpAlgorithms = (path: string): AlgorithmSource => ({
  name: "CP-Algorithms",
  url: `https://cp-algorithms.com/${path}`,
  role: "primary",
});

export const algorithms: Algorithm[] = [
  {
    slug: "segment-tree",
    title: { vi: "Cây phân đoạn", en: "Segment Tree" },
    description: { vi: "Truy vấn và cập nhật thông tin trên các đoạn của mảng trong thời gian logarithm.", en: "Query and update information over array intervals in logarithmic time." },
    category: "data-structures", difficulty: "intermediate", status: "available",
    prerequisites: [{ vi: "Đệ quy", en: "Recursion" }, { vi: "Cây nhị phân", en: "Binary trees" }],
    sources: [cpAlgorithms("data_structures/segment_tree.html")], lastReviewed: "2026-09-19",
  },
  {
    slug: "fenwick-tree",
    title: { vi: "Cây Fenwick", en: "Fenwick Tree" },
    description: { vi: "Một cấu trúc gọn nhẹ cho tổng tiền tố và cập nhật điểm.", en: "A compact structure for prefix queries and point updates." },
    category: "data-structures", difficulty: "intermediate", status: "available",
    prerequisites: [{ vi: "Biểu diễn nhị phân", en: "Binary representation" }],
    sources: [cpAlgorithms("data_structures/fenwick.html")], lastReviewed: "2026-09-19",
  },
  {
    slug: "sieve-of-eratosthenes",
    title: { vi: "Sàng Eratosthenes", en: "Sieve of Eratosthenes" },
    description: { vi: "Tìm tất cả số nguyên tố không vượt quá một giới hạn.", en: "Find every prime number up to a chosen limit." },
    category: "mathematics", difficulty: "easy", status: "available",
    prerequisites: [{ vi: "Ước và bội", en: "Factors and multiples" }],
    sources: [cpAlgorithms("algebra/sieve-of-eratosthenes.html")], lastReviewed: "2026-09-19",
  },
  {
    slug: "binary-search",
    title: { vi: "Tìm kiếm nhị phân", en: "Binary Search" },
    description: { vi: "Thu hẹp không gian tìm kiếm bằng cách loại một nửa sau mỗi bước.", en: "Halve the search space after every comparison." },
    category: "fundamentals", difficulty: "easy", status: "planned",
    prerequisites: [{ vi: "Mảng đã sắp xếp", en: "Sorted arrays" }],
    sources: [cpAlgorithms("num_methods/binary_search.html")], lastReviewed: null,
  },
  {
    slug: "disjoint-set-union",
    title: { vi: "Disjoint Set Union", en: "Disjoint Set Union" },
    description: { vi: "Theo dõi và hợp nhất các thành phần liên thông hiệu quả.", en: "Track and merge connected components efficiently." },
    category: "data-structures", difficulty: "intermediate", status: "planned",
    prerequisites: [{ vi: "Cây", en: "Trees" }],
    sources: [cpAlgorithms("data_structures/disjoint_set_union.html")], lastReviewed: null,
  },
  {
    slug: "breadth-first-search",
    title: { vi: "Tìm kiếm theo chiều rộng", en: "Breadth-First Search" },
    description: { vi: "Duyệt đồ thị theo từng lớp bằng hàng đợi.", en: "Traverse a graph layer by layer with a queue." },
    category: "graphs", difficulty: "easy", status: "planned",
    prerequisites: [{ vi: "Hàng đợi", en: "Queues" }],
    sources: [cpAlgorithms("graph/breadth-first-search.html")], lastReviewed: null,
  },
  {
    slug: "dijkstra",
    title: { vi: "Thuật toán Dijkstra", en: "Dijkstra's Algorithm" },
    description: { vi: "Tìm đường đi ngắn nhất từ một nguồn trên đồ thị trọng số không âm.", en: "Find shortest paths from one source in a non-negative weighted graph." },
    category: "graphs", difficulty: "intermediate", status: "planned",
    prerequisites: [{ vi: "Hàng đợi ưu tiên", en: "Priority queues" }],
    sources: [cpAlgorithms("graph/dijkstra.html")], lastReviewed: null,
  },
  {
    slug: "knuth-morris-pratt",
    title: { vi: "Thuật toán KMP", en: "Knuth–Morris–Pratt" },
    description: { vi: "Tìm mẫu trong chuỗi mà không quay lại những ký tự đã biết.", en: "Search for a pattern without rechecking known characters." },
    category: "strings", difficulty: "intermediate", status: "planned",
    prerequisites: [{ vi: "Chuỗi", en: "Strings" }],
    sources: [cpAlgorithms("string/prefix-function.html")], lastReviewed: null,
  },
];

export function findAlgorithm(slug: string) {
  return algorithms.find((algorithm) => algorithm.slug === slug);
}
