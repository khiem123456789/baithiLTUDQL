import { api } from "./api.config";
import { Product } from "./product.api";

/** Kiểu dữ liệu DTO cho thêm sản phẩm vào giỏ hàng */
export interface CartRequestDTO {
  productId: number;
  quantity: number;
}

/** Kiểu dữ liệu DTO cho xóa nhiều sản phẩm */
export interface RemoveSelectedDTO {
  productIds: number[];
}

/** Kiểu dữ liệu của CartItem */
export interface CartItem {
    id: number;
    product: Product;
    quantity: number;
    totalPrice: number;
  }
  
  /** Kiểu dữ liệu phản hồi khi lấy giỏ hàng */
  export interface CartResponse {
    cartItems: CartItem[];
    totalCartPrice: number;
  }

/** Lấy danh sách sản phẩm trong giỏ hàng */
export async function fetchCart(): Promise<CartResponse | null> {
  try {
    const response = await api.get<CartResponse>("/cart");
    return response.data;
  } catch (error) {
    console.error("(cart.api.ts) Lỗi khi lấy giỏ hàng:", error);
    return null;
  }
}

/** Thêm sản phẩm vào giỏ hàng */
export async function addToCart(data: CartRequestDTO): Promise<string | null> {
  try {
    const response = await api.post<string>("/cart", data);
    return response.data;
  } catch (error) {
    console.error("(cart.api.ts) Lỗi khi thêm vào giỏ hàng:", error);
    return null;
  }
}

/** Xóa danh sách sản phẩm được chọn khỏi giỏ hàng */
export async function removeSelectedFromCart(data: RemoveSelectedDTO): Promise<string | null> {
  try {
    const response = await api.post<string>("/cart/removeSelected", data);
    return response.data;
  } catch (error) {
    console.error("(cart.api.ts) Lỗi khi xóa sản phẩm đã chọn:", error);
    return null;
  }
}

/** Xóa một sản phẩm khỏi giỏ hàng */
export async function removeFromCart(productId: number): Promise<string | null> {
  try {
    const response = await api.delete<string>(`/cart/remove/${productId}`);
    return response.data;
  } catch (error) {
    console.error("(cart.api.ts) Lỗi khi xóa sản phẩm khỏi giỏ hàng:", error);
    return null;
  }
}



/** Xóa toàn bộ giỏ hàng */
export async function clearCart(): Promise<string | null> {
  try {
    const response = await api.delete<string>("/cart/clear");
    return response.data;
  } catch (error) {
    console.error("(cart.api.ts) Lỗi khi làm trống giỏ hàng:", error);
    return null;
  }
}

/** Cập nhật số lượng sản phẩm trong giỏ hàng */
export async function updateCartItemQuantity(data: CartRequestDTO): Promise<string | null> {
  try {
    const response = await api.put<string>("/cart/update", data);
    return response.data;
  } catch (error) {
    console.error("(cart.api.ts) Lỗi khi cập nhật số lượng sản phẩm:", error);
    return null;
  }
}

