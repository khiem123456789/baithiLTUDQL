import { useState } from "react";
import { login, register } from "../api/auth.api";
import { useNavigate } from "react-router-dom";

function AuthForm() {
    const [isRegister, setIsRegister] = useState(false); // Chế độ Đăng ký/Đăng nhập
    const [formData, setFormData] = useState({
        username: "",
        password: "",
        email: "",
        phone: "",
    });
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [message, setMessage] = useState("");
    const navigate = useNavigate(); // Điều hướng trang

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage(""); // Reset message
        setErrors({}); // Xóa lỗi cũ

        try {
            if (isRegister) {
                console.log("Registering with data:", formData);
                const response = await register(formData);
                console.log("Register response:", response);

                setMessage("🎉 Registration successful! Please login.");
                setIsRegister(false); // Chỉ chuyển sang đăng nhập khi đăng ký thành công
            } else {
                console.log("Logging in with:", { username: formData.username, password: formData.password });
                const response = await login({ username: formData.username, password: formData.password });

                if (response) {
                    localStorage.setItem("token", response); // Lưu token vào localStorage
                    navigate("/page"); // Chuyển hướng sau khi đăng nhập thành công
                }
            }
        } catch (err: any) {
            console.error("Error:", err);

            // Nếu là lỗi từ API, cập nhật lỗi cho từng trường
            if (err.response?.data?.message) {
                const errorMessage = err.response.data.message;
                let newErrors: { [key: string]: string } = {};

                if (errorMessage.includes("Username")) newErrors.username = errorMessage;
                if (errorMessage.includes("Email")) newErrors.email = errorMessage;
                if (errorMessage.includes("Phone")) newErrors.phone = errorMessage;

                setErrors(newErrors);
                setMessage(""); // Không hiển thị lỗi chung nếu đã có lỗi cụ thể

                // Không chuyển sang login nếu có lỗi
                return;
            }

            setMessage("❌ " + (err.message || "Something went wrong!"));
        }
    };

    return (
        <div style={{ maxWidth: "400px", margin: "auto", textAlign: "center" }}>
            <h2>{isRegister ? "Register" : "Login"}</h2>
            {message && <p style={{ color: message.startsWith("❌") ? "red" : "green" }}>{message}</p>}
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                <input
                    type="text"
                    name="username"
                    placeholder="Username"
                    value={formData.username}
                    onChange={handleChange}
                    required
                />
                {errors.username && <p style={{ color: "red", fontSize: "14px" }}>{errors.username}</p>}

                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                />

                {isRegister && (
                    <>
                        <input
                            type="email"
                            name="email"
                            placeholder="Email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                        {errors.email && <p style={{ color: "red", fontSize: "14px" }}>{errors.email}</p>}

                        <input
                            type="text"
                            name="phone"
                            placeholder="Phone"
                            value={formData.phone}
                            onChange={handleChange}
                            required
                        />
                        {errors.phone && <p style={{ color: "red", fontSize: "14px" }}>{errors.phone}</p>}
                    </>
                )}

                <button type="submit" style={{ padding: "10px", cursor: "pointer" }}>
                    {isRegister ? "Register" : "Login"}
                </button>
            </form>

            <button onClick={() => setIsRegister(!isRegister)} style={{ marginTop: "10px", cursor: "pointer" }}>
                {isRegister ? "Switch to Login" : "Switch to Register"}
            </button>
        </div>
    );
}

export default AuthForm;
