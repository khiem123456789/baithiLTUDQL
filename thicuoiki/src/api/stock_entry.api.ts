import { api, CommonParameters } from './api.config';
export interface StockEntry {
  id: number;
  quantity: number;
  price: number;
  product: {
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
      };
      status: string;
      updatedAt: string;
      addedAt: string;
      entryDate:string;
  };
  supplier: {
      id: number;
      name: string;
      address: string;
      phone: string;
      email: string;
  };
}

// DTO để gửi dữ liệu lên backend
export interface StockEntryDTO {
  productId: number;
  supplierId: number;
  quantity: number;
  price: number;
}

/** Lấy danh sách nhập kho */
export async function fetchStockEntries(params?: CommonParameters): Promise<StockEntry[]> {
    try {
        const response = await api.get<StockEntry[]>("/admin/stock_entry", { params });
        return response.data;
    } catch (error) {
        console.error("(stock_enty.api.ts)Lỗi khi lấy danh sách nhập kho:", error);
        return [];
    }
}

/** Thêm nhập kho */
export async function createStockEntry(data: StockEntryDTO): Promise<StockEntry | null> {
    try {
        const response = await api.post("/admin/stock_entry", data);
        return response.data;
    } catch (error) {
        console.error("(stock_enty.api.ts)Lỗi khi thêm nhập kho:", error);
        return null;
    }
}

/** Cập nhật nhập kho */
export async function updateStockEntry(id: number, data: StockEntryDTO): Promise<StockEntry | null> {
    try {
        const response = await api.put(`/admin/stock_entry/${id}`, data);
        return response.data;
    } catch (error) {
        console.error(`(stock_enty.api.ts)Lỗi khi cập nhật nhập kho ID ${id}:`, error);
        return null;
    }
}

/** Xóa nhập kho */
export async function deleteStockEntry(id: number): Promise<boolean> {
    try {
        await api.delete(`/admin/stock_entry/${id}`);
        return true;
    } catch (error) {
        console.error(`(stock_enty.api.ts)Lỗi khi xóa nhập kho ID ${id}:`, error);
        return false;
    }
}
