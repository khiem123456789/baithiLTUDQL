import { Navigate } from "react-router-dom";
import App from "../App";
import { readRoles } from "../utils/localstorage"; // Hàm lấy vai trò từ localStorage
import AppUser from "../AppUser";

const PrivateRoute = () => {
    const token = localStorage.getItem("token"); // Kiểm tra token
    const role = readRoles() || "USER"; // Lấy vai trò, mặc định là USER

    if (!token) {
        return <Navigate to="/login" replace />;
    }

    return role === "ROLE_ADMIN" ? <App /> : <AppUser />;
};

export default PrivateRoute;
