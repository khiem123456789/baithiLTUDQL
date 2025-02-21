import React, { useState } from "react";
import { Row, Col, Card, Typography, Button, Modal } from "antd";
import { motion } from "framer-motion";
import "../styles/Services.css";

const { Title, Text, Paragraph } = Typography;

// Danh sách dịch vụ
const services = [
    {
        title: "Dịch Vụ Hỏa Táng",
        description: "Hỏa táng chuyên nghiệp, đảm bảo trang nghiêm.",
        details: "Dịch vụ hỏa táng giúp giảm tác động môi trường và tiết kiệm diện tích đất nghĩa trang. Chúng tôi cung cấp quy trình hỏa táng an toàn, hợp vệ sinh và đảm bảo sự trang nghiêm cho người đã khuất.",
        price: "10.000.000 VNĐ",
        duration: "2 giờ",
        image: "/images/tải xuống.jpg"
    },
    {
        title: "Dịch Vụ An Táng",
        description: "Tổ chức tang lễ theo phong tục truyền thống.",
        details: "Chúng tôi hỗ trợ tổ chức lễ an táng theo các nghi thức truyền thống và tôn giáo khác nhau, đảm bảo sự trang trọng và chu toàn cho người thân của bạn.",
        price: "20.000.000 VNĐ",
        duration: "4 giờ",
        image: "/images/tải xuống (1).jpg"
    },
    {
        title: "Dịch Vụ Trang Trí Tang Lễ",
        description: "Trang trí hoa và vật phẩm phù hợp.",
        details: "Dịch vụ trang trí tang lễ của chúng tôi bao gồm hoa tươi, phông nền, băng rôn và các vật phẩm khác nhằm tạo không gian trang nghiêm, ấm cúng.",
        price: "5.000.000 VNĐ",
        duration: "1 giờ",
        image: "/images/tải xuống (2).jpg"
    },
    {
        title: "Nhà Quàn & Lễ Tang",
        description: "Cung cấp không gian tổ chức lễ tang.",
        details: "Chúng tôi cung cấp phòng tang lễ rộng rãi, trang nghiêm với đầy đủ tiện nghi để gia đình có thể tổ chức lễ viếng, cầu siêu, tưởng niệm một cách trọn vẹn.",
        price: "15.000.000 VNĐ",
        duration: "24 giờ",
        image: "/images/images.jpg"
    },
    {
        title: "Dịch Vụ Phật Giáo",
        description: "Tổ chức lễ theo nghi thức Phật Giáo.",
        details: "Chúng tôi hỗ trợ tổ chức lễ tang theo nghi thức Phật giáo bao gồm tụng kinh, cầu siêu, cúng dường và các nghi lễ khác để tiễn đưa người đã khuất.",
        price: "12.000.000 VNĐ",
        duration: "3 giờ",
        image: "/images/tải xuống (3).jpg"
    },
    {
        title: "Dịch Vụ Công Giáo",
        description: "Tổ chức lễ theo nghi thức Công Giáo.",
        details: "Dịch vụ tổ chức tang lễ theo Công Giáo bao gồm Thánh lễ an táng, cầu nguyện và thực hiện các nghi thức tôn giáo nhằm tiễn đưa người thân về nơi an nghỉ cuối cùng.",
        price: "12.000.000 VNĐ",
        duration: "3 giờ",
        image: "/images/images (1).jpg"
    },
];

const Services = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedService, setSelectedService] = useState(null);

    // Mở modal với thông tin dịch vụ
    const showModal = (service) => {
        setSelectedService(service);
        setIsModalOpen(true);
    };

    // Đóng modal
    const handleCancel = () => {
        setIsModalOpen(false);
    };

    return (
        <div className="services-container">
            <Title level={2} className="services-title">Dịch Vụ Mai Táng</Title>
            <Text className="services-subtitle">Chuyên Nghiệp - Uy Tín - Trọn Gói</Text>

            <Row gutter={[24, 24]}>
                {services.map((service, index) => (
                    <Col xs={24} sm={12} md={8} key={index}>
                        <motion.div
                            initial={{ opacity: 0, x: index % 2 === 0 ? -100 : 100 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8 }}
                            viewport={{ once: true }}
                        >
                            <Card
                                hoverable
                                cover={<img alt={service.title} src={service.image} className="service-image" />}
                                className="service-card"
                                onClick={() => showModal(service)}
                            >
                                <Title level={4}>{service.title}</Title>
                                <Text>{service.description}</Text>
                            </Card>
                        </motion.div>
                    </Col>
                ))}
            </Row>

            {/* Modal Chi Tiết Dịch Vụ */}
            <Modal title={selectedService?.title} open={isModalOpen} onCancel={handleCancel} footer={null}>
                {selectedService && (
                    <>
                        <img src={selectedService.image} alt={selectedService.title} style={{ width: "100%", borderRadius: "8px", marginBottom: "16px" }} />
                        <Paragraph><b>Mô tả:</b> {selectedService.details}</Paragraph>
                        <Paragraph><b>Giá tham khảo:</b> {selectedService.price}</Paragraph>
                        <Paragraph><b>Thời gian thực hiện:</b> {selectedService.duration}</Paragraph>
                        <Paragraph>
                            <b>Thông tin liên hệ:</b><br />
                            📞 Hotline: 0909 999 999<br />
                            📧 Email: dichvumaitang@example.com<br />
                            📍 Địa chỉ: 123 Đường An Bình, Quận 1, TP. HCM
                        </Paragraph>
                    </>
                )}
            </Modal>
        </div>
    );
};

export default Services;
