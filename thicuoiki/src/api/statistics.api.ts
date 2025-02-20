import { api } from "./api.config";

/** Thống kê tổng quan */
export interface OverviewStats {
  totalOrders: number;
  totalCustomers: number;
  totalRevenue: number;
}

export async function fetchOverviewStats(): Promise<OverviewStats | null> {
  try {
    const response = await api.get<OverviewStats>("/statistics/overview");
    return response.data;
  } catch (error) {
    console.error("(statistics.api.ts) Lỗi khi lấy thống kê tổng quan:", error);
    return null;
  }
}

/** Thống kê doanh thu theo danh mục */
export interface RevenueByCategory {
  categoryName: string;
  totalRevenue: number;
}

export async function fetchRevenueByCategory(): Promise<RevenueByCategory[]> {
  try {
    const response = await api.get<RevenueByCategory[]>("/statistics/revenue-by-category");
    return response.data;
  } catch (error) {
    console.error("(statistics.api.ts) Lỗi khi lấy doanh thu theo danh mục:", error);
    return [];
  }
}

/** Thống kê số lượng sản phẩm bán ra */
export interface ProductSales {
  productName: string;
  quantitySold: number;
}

export async function fetchProductSales(): Promise<ProductSales[]> {
  try {
    const response = await api.get<ProductSales[]>("/statistics/product-sales");
    return response.data;
  } catch (error) {
    console.error("(statistics.api.ts) Lỗi khi lấy số lượng sản phẩm bán ra:", error);
    return [];
  }
}

// /** Lọc đơn hàng theo ngày */
// export interface OrderStats {
//   orderId: number;
//   customerName: string;
//   totalPrice: number;
//   status: string;
//   createdDate: string;
// }

// export async function fetchOrdersByDate(date: string): Promise<OrderStats[]> {
//   try {
//     const response = await api.get<OrderStats[]>("/statistics/orders/by-date", {
//       params: { date },
//     });
//     return response.data;
//   } catch (error) {
//     console.error(`(statistics.api.ts) Lỗi khi lấy đơn hàng ngày ${date}:`, error);
//     return [];
//   }
// }
//
// /** Lọc đơn hàng theo tháng và năm */
// export async function fetchOrdersByMonthYear(month: number, year: number): Promise<OrderStats[]> {
//   try {
//     const response = await api.get<OrderStats[]>("/statistics/orders/by-month-year", {
//       params: { month, year },
//     });
//     return response.data;
//   } catch (error) {
//     console.error(`(statistics.api.ts) Lỗi khi lấy đơn hàng tháng ${month}/${year}:`, error);
//     return [];
//   }
// }

// /** Lọc đơn hàng theo năm */
// export async function fetchOrdersByYear(year: number): Promise<OrderStats[]> {
//   try {
//     const response = await api.get<OrderStats[]>("/statistics/orders/by-year", {
//       params: { year },
//     });
//     return response.data;
//   } catch (error) {
//     console.error(`(statistics.api.ts) Lỗi khi lấy đơn hàng năm ${year}:`, error);
//     return [];
//   }
// }
