import axios from "axios";
import { api } from "./api.config";

export interface UserData{
    username: string;
    password: string;
    phone: string;
    email: string;
}

export interface LoginData{
    username: string;
    password: string;
}
export interface AuthResponse {
    token: string;
}

/**
 * Hàm lấy thông tin người dùng hiện tại
 * @returns Thông tin người dùng (username, roles, v.v.)
 */
export async function getCurrentUser() {
    try {
        const token = localStorage.getItem("token");
        if (!token) {
            throw new Error("Token không tồn tại. Vui lòng đăng nhập lại.");
        }

        const response = await api.get("/auth/me", {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        const user = response.data;
        localStorage.setItem("userId", user.id.toString()); // Lưu userId vào localStorage
        return user; // Trả về thông tin người dùng
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error("Lỗi khi lấy thông tin người dùng:", error.response?.data || error.message);
        } else {
            console.error("Lỗi không xác định:", error);
        }
        throw new Error("Không thể lấy thông tin người dùng.");
    }
}

// /**
//  * Hàm đăng nhập
//  * @param data Thông tin đăng nhập (username, password)
//  * @returns Token JWT nếu đăng nhập thành công
//  */
export async function login(data: LoginData): Promise<string> {
    try {
        //console.log(" Sending login request:", data);
        const response = await api.post<AuthResponse>("/auth/login", data);
        
        const token = response.data?.token;
        //console.log("API response:", response.data);

        // Kiểm tra nếu token tồn tại thì lưu vào localStorage
        if (token) {
            localStorage.setItem("token", token);
            // console.log("Token saved:", token);
        } else {
            console.warn("No token received from server.");
        }

        // Giải mã JWT để lấy role
        const decodedToken = JSON.parse(atob(token.split(".")[1]));
        const roles = decodedToken.roles;  // ["ROLE_ADMIN"] hoặc ["ROLE_USER"]
        localStorage.setItem("role", roles[0]);
        console.log("role",roles)
        
        return token;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error("Login failed:", error.response?.data || error.message);
        } else {
            console.error("An unexpected error occurred:", error);
        }
        throw new Error("Invalid username or password");
    }
}
/**
 * Hàm đăng ký
 * @param data Thông tin người dùng cần đăng ký
 * @returns Chuỗi thông báo từ server
 */
export async function register(data: UserData): Promise<string> {
    try {
        const response = await api.post<string>("/auth/register", data);
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            throw new Error(error.response.data.message);
        } else {
            throw new Error("Registration failed. Please try again!");
        }
    }
}