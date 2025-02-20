import { api, APIResponseType, CommonParameters } from "./api.config";

export interface Category {
  id: number;
  name: string;
}

/** Lấy danh sách danh mục */
export async function fetchCategories(params?: CommonParameters): Promise<Category[]> {
  const response = await api.get("/category",{
    params: params,
  });

  return response.data;
}

/** Thêm danh mục mới */
export async function createCategory(data: { name: string }): Promise<Category> {
  const response = await api.post<APIResponseType>("/category", data);
  return response.data.data;
}

/** Cập nhật danh mục */
export async function updateCategory(id: number, data: { name: string }): Promise<Category> {
  const response = await api.put<APIResponseType>(`/category/${id}`, data);
  return response.data.data;
}

/** Xóa danh mục */
export async function deleteCategory(id: number): Promise<void> {
  await api.delete<APIResponseType>(`/category/${id}`);
}
