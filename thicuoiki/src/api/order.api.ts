import { api } from "./api.config";
import { CartItem } from "./cart.api";
import { Product } from "./product.api";

/** Kiểu dữ liệu DTO cho đơn hàng */
export interface OrderRequestDTO {
  customerName: string;
  shippingAddress: string;
  phoneNumber: string;
  notes?: string;
  paymentMethod: string;
  cartItems: CartItem[];
}

/** Kiểu dữ liệu chi tiết đơn hàng */
export interface OrderDetail {
  id: number;
  product: Product;
  quantity: number;
  totalPrice: number;
}

/** Kiểu dữ liệu đơn hàng */
export interface Order {
  id: number;
  customerName: string;
  shippingAddress: string;
  phoneNumber: string;
  notes?: string;
  paymentMethod: string;
  status: string;
  totalPrice: number;
  createdAt: string;
  orderDetails: OrderDetail[];
}

/** Lấy danh sách đơn hàng của admin */
export async function fetchAllOrders(): Promise<Order[] | null> {
  try {
    const response = await api.get<Order[]>("/admin/orders");
    return response.data;
  } catch (error) {
    console.error("(order.api.ts) Lỗi khi lấy danh sách đơn hàng:", error);
    return null;
  }
}

/** Lấy chi tiết một đơn hàng theo ID (Admin) */
export async function fetchOrderById(orderId: number): Promise<Order | null> {
  try {
    const response = await api.get<Order>(`/admin/orders/${orderId}`);
    return response.data;
  } catch (error) {
    console.error("(order.api.ts) Lỗi khi lấy thông tin đơn hàng:", error);
    return null;
  }
}

/** Lấy chi tiết đơn hàng theo ID (Admin) */
export async function fetchOrderDetails(orderId: number): Promise<OrderDetail[] | null> {
  try {
    const response = await api.get<OrderDetail[]>(`/admin/orders/${orderId}/details`);
    return response.data;
  } catch (error) {
    console.error("(order.api.ts) Lỗi khi lấy chi tiết đơn hàng:", error);
    return null;
  }
}

/** Cập nhật trạng thái đơn hàng (Admin) */
export async function updateOrderStatus(orderId: number, status: string): Promise<string | null> {
  try {
    const response = await api.put<string>(`/admin/orders/${orderId}/status`, { status });
    return response.data;
  } catch (error) {
    console.error("(order.api.ts) Lỗi khi cập nhật trạng thái đơn hàng:", error);
    return null;
  }
}

/** Xóa đơn hàng (Admin) */
export async function deleteOrder(orderId: number): Promise<string | null> {
  try {
    const response = await api.delete<string>(`/admin/orders/${orderId}`);
    return response.data;
  } catch (error) {
    console.error("(order.api.ts) Lỗi khi xóa đơn hàng:", error);
    return null;
  }
}

/** Lấy danh sách đơn hàng của người dùng */
export async function fetchUserOrders(): Promise<Order[] | null> {
  try {
    const response = await api.get<Order[]>("/user/orders");
    return response.data;
  } catch (error) {
    console.error("(order.api.ts) Lỗi khi lấy đơn hàng của người dùng:", error);
    return null;
  }
}

/** Lấy thông tin đơn hàng của người dùng */
export async function fetchUserOrderById(orderId: number): Promise<Order | null> {
  try {
    const response = await api.get<Order>(`/user/orders/${orderId}`);
    return response.data;
  } catch (error) {
    console.error("(order.api.ts) Lỗi khi lấy thông tin đơn hàng của người dùng:", error);
    return null;
  }
}

/** Đặt hàng mới */
export async function createOrder(orderRequest: OrderRequestDTO): Promise<Order | null> {
  try {
    const response = await api.post<Order>("/user/orders", orderRequest);
    return response.data;
  } catch (error) {
    console.error("(order.api.ts) Lỗi khi tạo đơn hàng:", error);
    return null;
  }
}
