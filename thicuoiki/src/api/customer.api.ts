import axios from "axios";
import { api, APIResponseType, CommonParameters } from "./api.config";

export interface Customer {
  id: number;
  fullName: string;
  address: string;
  phone: string;
  userId: number;
}
export interface CustomerI {
  id: number;
  fullName: string;
  address: string;
  phone: string;
  userId: number;
  totalSpent: number;
}
/** Lấy thông tin khách hàng theo userId (dành cho User) */
export async function fetchCustomerByUserId(userId: number): Promise<CustomerI | null> {
  try {
    const response = await api.get<CustomerI>(`/user/customer/${userId}`);
    return response.data;
  } catch (error) {
    console.error("(customer.api.ts) Lỗi khi lấy thông tin khách hàng:", error);
    return null;
  }
}

/** Cập nhật thông tin khách hàng của chính User */
export async function updateCustomerForUser(id: number, data: Partial<Customer>): Promise<Customer | null> {
  try {
    const response = await api.put<Customer>(`/user/customer/${id}`, data);
    return response.data;
  } catch (error) {
    console.error("(customer.api.ts) Lỗi khi cập nhật thông tin khách hàng:", error);
    return null;
  }
}

/** Lấy danh sách khách hàng (dành cho Admin) */
export async function fetchAllCustomers(params?: CommonParameters): Promise<CustomerI[]> {
  try {
    const response = await api.get<CustomerI[]>("/admin/customer", { params });
    return response.data;
  } catch (error) {
    console.error("(customer.api.ts) Lỗi khi lấy danh sách khách hàng:", error);
    return [];
  }
}

/** Thêm mới khách hàng (dành cho Admin) */
export async function createCustomer(data: Partial<Customer>): Promise<Customer | null> {
  try {
    const response = await api.post<APIResponseType>("/admin/customer", data);
    return response.data.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message);
    } else {
      console.error("(customer.api.ts) Lỗi khi thêm khách hàng:", error);
      throw new Error("Create new customer failed. Please try again!");
    }
  }
}

/** Cập nhật thông tin khách hàng (dành cho Admin) */
export async function updateCustomer(id: number, data: Partial<Customer>): Promise<Customer | null> {
  try {
    const response = await api.put<APIResponseType>(`/admin/customer/${id}`, data);
    return response.data.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message);
    } else {
      console.error("(customer.api.ts) Lỗi khi cập nhật khách hàng:", error);
      throw new Error("Update failed. Please try again!");
    }
  }
}

/** Xóa khách hàng (dành cho Admin) */
export async function deleteCustomer(id: number): Promise<void> {
  try {
    await api.delete<APIResponseType>(`/admin/customer/${id}`);
  } catch (error) {
    console.error("(customer.api.ts) Lỗi khi xóa khách hàng:", error);
  }
}
