import { api, APIResponseType, CommonParameters } from "./api.config";

export interface Supplier {
  id: number;
  name: string;
  address: string;
  phone: string;
  email: string;
}

/** Lấy danh sách nhà cung cấp */
export async function fetchSupplier(params?: CommonParameters): Promise<Supplier[]> {

  try {
    const response = await api.get("/admin/supplier", {
      params: params,
    });
    return response.data;
  } catch (error) {
    console.error("(supplier.api.ts)Lỗi khi lấy danh sách nhà cung cấp:", error);
    return [];
  }

}

/** Thêm nhà cung cấp mới */
export async function createSupplier(data: Partial<Supplier>): Promise<Supplier| null> {
  
  try {
    const response = await api.post<APIResponseType>("/admin/supplier", data);
  return response.data.data;
  } catch (error) {
    console.error("(supplier.api.ts)Lỗi khi thêm nhà cung cấp:", error);
    return null;
  }
}

/** Cập nhật nhà cung cấp */
export async function updateSupplier(id: number, data: Partial<Supplier>): Promise<Supplier| null> {
  
  try {
    const response = await api.put<APIResponseType>(`/admin/supplier/${id}`, data);
  return response.data.data;
  } catch (error) {
    console.error("(supplier.api.ts)Lỗi khi cập nhật nhà cung cấp:", error);
    return null;
  }
}

/** Xóa nhà cung cấp */
export async function deleteSupplier(id: number): Promise<void> {
  
  try {
    await api.delete<APIResponseType>(`/admin/supplier/${id}`);
  } catch (error) {
    console.error("(supplier.api.ts)Lỗi khi xóa nhà cũng cấp:", error);
  }
}
