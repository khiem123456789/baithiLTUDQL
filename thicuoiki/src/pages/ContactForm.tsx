import React from "react";
import "../styles/ContactForm.css";
import { Form, Input, Button, Row, Col, Typography } from "antd";

const { Title, Text } = Typography;

const ContactForm = () => {
    return (
        <Row gutter={[32, 32]} style={{ maxWidth: "1200px", margin: "auto", padding: "20px" }}>
            {/* Form Liên Hệ */}
            <Col xs={24} md={12}>
                <Title level={4}>THÔNG TIN LIÊN HỆ</Title>
                <Text>Gửi thông tin liên hệ với chúng tôi</Text>
                <Form layout="vertical">
                    <Form.Item label="Địa chỉ email" name="email" rules={[{ required: true, message: "Vui lòng nhập email" }]}>
                        <Input placeholder="Nhập địa chỉ email" />
                    </Form.Item>
                    <Form.Item label="Họ & tên" name="name" rules={[{ required: true, message: "Vui lòng nhập họ tên" }]}>
                        <Input placeholder="Nhập họ tên của bạn" />
                    </Form.Item>
                    <Form.Item label="Điện thoại của bạn" name="phone" rules={[{ required: true, message: "Vui lòng nhập số điện thoại" }]}>
                        <Input placeholder="Mời nhập điện thoại" />
                    </Form.Item>
                    <Form.Item label="Địa chỉ đầy đủ" name="address" rules={[{ required: true, message: "Vui lòng nhập địa chỉ" }]}>
                        <Input placeholder="Nhập đầy đủ thông tin địa chỉ" />
                    </Form.Item>
                    <Form.Item label="Nội dung" name="message">
                        <Input.TextArea rows={4} placeholder="Nhập nội dung yêu cầu" />
                    </Form.Item>
                    <Button type="primary" danger>Gửi tin</Button>
                </Form>
            </Col>

            {/* Thông Tin Công Ty */}
            <Col xs={24} md={12}>
                <Title level={4}>CÔNG TY TNHH DỊCH VỤ TANG LỄ THIÊN ĐỨC</Title>
                <Text>Mọi chi tiết vui lòng liên hệ qua số điện thoại <b>0902.99.40.99</b></Text>
                <ul>
                    <li>Cơ sở 1: 64/2 Tân Chánh Hiệp 17, P. Tân Chánh Hiệp, Quận 12, TP Hồ Chí Minh</li>
                    <li>Cơ sở 2: Sau lưng khu phần mềm Quang Trung, Quận 12, TP Hồ Chí Minh</li>
                    <li>Cơ sở 3: A03 Đường Tân Thới Hiệp 21, P. Tân Thới Hiệp, Quận 12, TP Hồ Chí Minh</li>
                </ul>
                <Text>MST: 0317385697</Text><br />
                <Text>CHỦ SỞ HỮU: NGUYỄN VĂN ĐỨC</Text><br />
                <Text>Hotline: <b>0902.99.40.99</b></Text><br />
                <Text>Email: nguyenvduc456123@gmail.com</Text><br />
                <Text>Website: <a href="https://traiothienduc.com">traiothienduc.com</a></Text>
            </Col>
        </Row>
    );
};

export default ContactForm;
