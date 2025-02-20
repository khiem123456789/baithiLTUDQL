import { useState } from "react";
import { getCurrentUser, login } from "../api/auth.api";
import { useNavigate, Link } from "react-router-dom";
import { Form, Input, Button, Typography, message, Card, Flex } from "antd";
import { readRoles } from "../utils/localstorage";

const { Title, Text } = Typography;

function Login() {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const onFinish = async (values: { username: string; password: string }) => {
        setLoading(true);
        try {
            const response = await login(values);
            if (response) {
                localStorage.setItem("token", response);
                message.success("Đăng nhập thành công!");
                const user= await getCurrentUser();
                console.log("User info:", user);

                const role = user.roles.length > 0 ? user.roles[0].name : null;
                if (role === "ADMIN") {
                    navigate("/page/admin");
                } else {
                    navigate("/page");
                }
            }
        } catch {
            message.error("Tên đăng nhập hoặc mật khẩu không đúng!");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Flex justify="center" align="center" style={{ height: "100vh"}}>
            <Card style={{ width: 400 }}>
                <Title level={2} style={{ textAlign: "center" }}>
                    Đăng nhập
                </Title>
                <Form layout="vertical" onFinish={onFinish}>
                    <Form.Item
                        label="Tên đăng nhập"
                        name="username"
                        rules={[{ required: true, message: "Vui lòng nhập tên đăng nhập!" }]}
                    >
                        <Input placeholder="Nhập tên đăng nhập" />
                    </Form.Item>

                    <Form.Item
                        label="Mật khẩu"
                        name="password"
                        rules={[{ required: true, message: "Vui lòng nhập mật khẩu!" }]}
                    >
                        <Input.Password placeholder="Nhập mật khẩu" />
                    </Form.Item>

                    <Button type="primary" htmlType="submit" loading={loading} block>
                        Đăng nhập
                    </Button>
                </Form>

                <Text style={{ display: "block", textAlign: "center", marginTop: 10 }}>
                    Chưa có tài khoản? <Link to="/register">Đăng ký ngay</Link>
                </Text>
            </Card>
        </Flex>
    );
}

export default Login;
