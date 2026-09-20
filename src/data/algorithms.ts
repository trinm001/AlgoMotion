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

{ slug: "binary-heap", title: { vi: "Heap nhị phân", en: "Binary Heap" }, description: { vi: "Duy trì phần tử ưu tiên bằng cây nhị phân hoàn chỉnh lưu trong mảng.", en: "Maintain the priority element in a complete binary tree stored as an array." }, category: "data-structures", difficulty: "intermediate", status: "available", prerequisites: [{ vi: "Mảng", en: "Arrays" }, { vi: "Cây nhị phân", en: "Binary trees" }], sources: [{ name: "C++ working draft — priority queue", url: "https://eel.is/c++draft/priority.queue", role: "primary" }], lastReviewed: "2026-09-20", },
  {
    slug: "elementary-sorting",
    title: { vi: "Sắp xếp cơ bản", en: "Elementary Sorting" },
    description: { vi: "So sánh Bubble Sort, Selection Sort và Insertion Sort qua từng phép đổi chỗ.", en: "Compare Bubble, Selection, and Insertion Sort one operation at a time." },
    category: "fundamentals", difficulty: "easy", status: "available",
    prerequisites: [{ vi: "Mảng", en: "Arrays" }, { vi: "Vòng lặp", en: "Loops" }],
    sources: [{ name: "Wikipedia — Sorting algorithm", url: "https://en.wikipedia.org/wiki/Sorting_algorithm", role: "primary" }], lastReviewed: "2026-09-20",
  },
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
    category: "fundamentals", difficulty: "easy", status: "available",
    prerequisites: [{ vi: "Mảng đã sắp xếp", en: "Sorted arrays" }],
    sources: [cpAlgorithms("num_methods/binary_search.html")], lastReviewed: "2026-09-20",
  },
  {
    slug: "prefix-sum",
    title: { vi: "Tổng tiền tố", en: "Prefix Sum" },
    description: { vi: "Tiền xử lý tổng tích lũy để trả lời truy vấn tổng đoạn trong O(1).", en: "Precompute cumulative sums to answer range-sum queries in O(1)." },
    category: "fundamentals", difficulty: "easy", status: "available",
    prerequisites: [{ vi: "Mảng", en: "Arrays" }, { vi: "Chỉ số nửa mở", en: "Half-open indices" }],
    sources: [{ name: "Wikipedia — Prefix sum", url: "https://en.wikipedia.org/wiki/Prefix_sum", role: "primary" }], lastReviewed: "2026-09-20",
  },
  {
    slug: "disjoint-set-union",
    title: { vi: "Disjoint Set Union", en: "Disjoint Set Union" },
    description: { vi: "Theo dõi và hợp nhất các thành phần liên thông hiệu quả.", en: "Track and merge connected components efficiently." },
    category: "data-structures", difficulty: "intermediate", status: "available",
    prerequisites: [{ vi: "Cây", en: "Trees" }],
    sources: [cpAlgorithms("data_structures/disjoint_set_union.html")], lastReviewed: "2026-09-20",
  },

  { slug: "trie", title: { vi: "Cây Trie", en: "Trie" }, description: { vi: "Lưu và truy vấn chuỗi theo từng ký tự trên cây tiền tố.", en: "Store and query strings one character at a time in a prefix tree." }, category: "data-structures", difficulty: "intermediate", status: "available", prerequisites: [{ vi: "Chuỗi", en: "Strings" }, { vi: "Cây", en: "Trees" }], sources: [cpAlgorithms("string/aho_corasick.html")], lastReviewed: "2026-09-20", },

  { slug: "sparse-table", title: { vi: "Sparse Table", en: "Sparse Table" }, description: { vi: "Tiền xử lý truy vấn minimum trên mảng tĩnh trong O(1).", en: "Precompute constant-time range minimum queries on a static array." }, category: "data-structures", difficulty: "intermediate", status: "available", prerequisites: [{ vi: "Lũy thừa hai", en: "Powers of two" }, { vi: "Logarithm", en: "Logarithms" }], sources: [cpAlgorithms("data_structures/sparse-table.html")], lastReviewed: "2026-09-20", },
  {
    slug: "breadth-first-search",
    title: { vi: "BFS và DFS", en: "BFS and DFS" },
    description: { vi: "So sánh duyệt theo lớp bằng queue và duyệt sâu bằng stack.", en: "Compare layer-order queue traversal with depth-first stack traversal." },
    category: "graphs", difficulty: "easy", status: "available",
    prerequisites: [{ vi: "Hàng đợi và ngăn xếp", en: "Queues and stacks" }],
    sources: [cpAlgorithms("graph/breadth-first-search.html"), { name: "CP-Algorithms — DFS", url: "https://cp-algorithms.com/graph/depth-first-search.html", role: "cross-check" }], lastReviewed: "2026-09-20",
  },
  {
    slug: "dijkstra",
    title: { vi: "Thuật toán Dijkstra", en: "Dijkstra's Algorithm" },
    description: { vi: "Tìm đường đi ngắn nhất từ một nguồn trên đồ thị trọng số không âm.", en: "Find shortest paths from one source in a non-negative weighted graph." },
    category: "graphs", difficulty: "intermediate", status: "available",
    prerequisites: [{ vi: "Hàng đợi ưu tiên", en: "Priority queues" }],
    sources: [cpAlgorithms("graph/dijkstra.html")], lastReviewed: "2026-09-20",
  },
  {
    slug: "bellman-ford",
    title: { vi: "Bellman–Ford", en: "Bellman–Ford" },
    description: { vi: "Tìm đường đi ngắn nhất với cạnh âm và phát hiện chu trình âm.", en: "Find shortest paths with negative edges and detect negative cycles." },
    category: "graphs", difficulty: "intermediate", status: "available",
    prerequisites: [{ vi: "Nới lỏng cạnh", en: "Edge relaxation" }],
    sources: [cpAlgorithms("graph/bellman_ford.html")], lastReviewed: "2026-09-20",
  },
  {
    slug: "minimum-spanning-tree",
    title: { vi: "Cây khung nhỏ nhất", en: "Minimum Spanning Tree" },
    description: { vi: "So sánh Kruskal và Prim khi chọn các cạnh có tổng trọng số nhỏ nhất.", en: "Compare Kruskal and Prim while selecting minimum-total-weight edges." },
    category: "graphs", difficulty: "intermediate", status: "available",
    prerequisites: [{ vi: "Heap và DSU", en: "Heap and DSU" }],
    sources: [cpAlgorithms("graph/mst_kruskal.html"), { name: "CP-Algorithms — Prim", url: "https://cp-algorithms.com/graph/mst_prim.html", role: "cross-check" }], lastReviewed: "2026-09-20",
  },
  {
    slug: "lowest-common-ancestor",
    title: { vi: "LCA với Binary Lifting", en: "LCA with Binary Lifting" },
    description: { vi: "Tìm tổ tiên chung gần nhất bằng bảng tổ tiên theo lũy thừa hai.", en: "Find the lowest common ancestor with a power-of-two ancestor table." },
    category: "graphs", difficulty: "advanced", status: "available",
    prerequisites: [{ vi: "Cây và biểu diễn nhị phân", en: "Trees and binary representation" }],
    sources: [cpAlgorithms("graph/lca_binary_lifting.html")], lastReviewed: "2026-09-20",
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
