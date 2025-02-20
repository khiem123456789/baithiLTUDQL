import { api, CommonParameters } from "./api.config";

export interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
  quantity: number;
  image: string;
  woodType: string;
  size: string;
  category: { 
    id: number;
    name: string;
   };  // Fix lỗi categoryId
  status: string;
  updatedAt: string;
  addedAt: string;
}

/** Lấy danh sách sản phẩm */
export async function fetchProduct(params?: CommonParameters): Promise<Product[]> {
  try {
    const response = await api.get<Product[]>("/product", { params });
    return response.data;
  } catch (error) {
    console.error("(product.api.ts)Lỗi khi lấy danh sách sản phẩm:", error);
    return [];
  }
}

/** Thêm sản phẩm mới */
export async function createProduct(data: Partial<Product>): Promise<Product | null> {
  try {
    const response = await api.post("/product", data);
    return response.data.data;
  } catch (error) {
    console.error("(product.api.ts)Lỗi khi thêm sản phẩm:", error);
    return null;
  }
}

/** Cập nhật sản phẩm */
export async function updateProduct(id: number, data: Partial<Product>): Promise<Product | null> {
  try {
    const response = await api.put(`/product/${id}`, data);
    return response.data.data;
  } catch (error) {
    console.error(`(product.api.ts)Lỗi khi cập nhật sản phẩm ID ${id}:`, error);
    return null;
  }
}

/** Xóa sản phẩm */
export async function deleteProduct(id: number): Promise<boolean> {
  try {
    await api.delete(`/product/${id}`);
    return true;
  } catch (error) {
    console.error(`(product.api.ts)Lỗi khi xóa sản phẩm ID ${id}:`, error);
    return false;
  }
}
