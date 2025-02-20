/* eslint-disable @typescript-eslint/no-explicit-any */
import axios, { AxiosError } from "axios";
import { readAccessToken } from "../utils/localstorage";
import { message } from "antd";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

/** CẤU HÌNH API */
export const api = axios.create({
  baseURL: import.meta.env.VITE_BASE_API_URL || "http://localhost:8080/api",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});


/**
 * CẤU HÌNH CẤU TRÚC TRẢ VỀ TỪ API
 * API gửi đi thành công ko bị lỗi
 * */
export type APIResponseType = {
  message: string;
  statusCode: number;
  data: any[] | any;
};

/**
 * CẤU HÌNH CẤU TRÚC TRẢ VỀ KHI GẶP LỖI
 * API gửi đi ko thành công
 */
interface ErrorResponse {
  message: string;
  errors: {
    [key: string]: string[];
  };
}

/**
 * CẤU HÌNH CÁC PARAMETERS THƯỜNG DÙNG KHI [GET]
 */
export interface CommonParameters {
  limit: number;
  offset: number;
}

/**
 * CẤU HÌNH REQUEST HEADERS
 * MỌI REQUEST ĐỀU ĐÍNH KÈM ACCESS TOKEN
 * */
api.interceptors.request.use(
  (config) => {
    const token = readAccessToken();
    if (token) {
      const decoded = jwtDecode(token);
      const currentTime = Date.now() / 1000;
      if (decoded.exp < currentTime) {
        localStorage.removeItem("token");
        localStorage.removeItem("roles");


        window.location.href = "/login";
        return Promise.reject("Token hết hạn, vui lòng đăng nhập lại!");
      }
      //console.log("Access Token:", token);
      //config.headers.Authorization = `Bearer ${readAccessToken()}`;
      config.headers.Authorization = `Bearer ${token}`;
    }


    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * CẤU HÌNH RESPONSE
 */
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ErrorResponse>) => {
    const { status, response } = error;
    let errorMessage = error.message;

    if (response) {
     
      if (status === 404) {
        errorMessage = response.data.message;
      } else if (status === 422) {
        const { errors } = response.data;
        const errorList = [];
        for (const key in errors) {
          errorList.push(errors[key]);
        }
        errorMessage = errorList.join(" ");
      }
    }

    message.error(errorMessage);

    return Promise.reject(error);
  }
);
