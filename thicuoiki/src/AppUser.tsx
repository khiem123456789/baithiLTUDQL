import React, { useEffect, useState } from "react";
import { Card, Row, Col, Image, Typography, Button, Layout, Input, Menu, Modal, message, Space, InputNumber, Select } from "antd";

import { AppstoreOutlined, ShoppingCartOutlined, UserOutlined } from "@ant-design/icons";
import UserProfile from "./pages/UserProfile";
import CartPage from "./pages/CartPage";

import { Navigate, Outlet, Link } from "react-router-dom";
import Home from "./pages/Home";
import { readRoles } from "./utils/localstorage";

const { Header, Content } = Layout;
const { Title, Text } = Typography;
const { Option } = Select;

const AppUser = () => {
    const [isModalOpen, setIsModalOpen] = useState([false, false]);


    const toggleModal = (idx: number, target: boolean) => {
        setIsModalOpen((prev) => {
            const newState = [...prev];
            newState[idx] = target;
            return newState;
        });
    };
    // Lấy quyền người dùng
    const role = readRoles() || "ROLE_USER";

    const menuItems = [
        { key: "item01", label: "Trang chủ",  href: "/page/home", roles: ["ROLE_USER"] },
        { key: "item02", label: "Sản phẩm",  href: "/page/product", roles: ["ROLE_USER"] },
        { key: "item03", label: "Giới Thiệu",  href: "/page/about", roles: ["ROLE_USER"] },
        { key: "item04", label: "Quan Tài Hỏa Táng", href: "/page/cremation-coffin", roles: ["ROLE_USER"] },
        { key: "item05", label: "Quan Tài Đại Táng", href: "/page/burial-coffin", roles: ["ROLE_USER"] },
        { key: "item06", label: "Hu Đề Cốt", href: "/page/urn", roles: ["ROLE_USER"] },
        { key: "item07", label: "Tang Lễ Phật Giáo", href: "/page/buddhist-funeral", roles: ["ROLE_USER"] },
        { key: "item08", label: "Tang Lễ Công Giáo", href: "/page/catholic-funeral", roles: ["ROLE_USER"] },
        { key: "item09", label: "Quy Trình Sản Xuất Quan Tài", href: "/page/coffin-production", roles: ["ROLE_USER"] },
       
      ];
      
      // Lọc menu theo quyền user
      const filteredMenuItems = menuItems.filter(item => (item.roles ?? []).includes(role));
    return (
        <Layout>
            {/* Header */}
            <Header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "#000", padding: "0 20px" }}>
                <div style={{ color: "#fff", fontSize: "20px", fontWeight: "bold" }}>LOGO</div>
                <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
                    <Button type="primary" icon={<ShoppingCartOutlined />} onClick={() => toggleModal(1, true)} />
                    <Button type="primary" onClick={() => toggleModal(0, true)}>
                        <UserOutlined />
                    </Button>
                    <Text style={{ color: "#fff", fontSize: "16px" }}>0902.99.40.99</Text>
                </div>
            </Header>

            {/* Thanh menu */}
            <Menu mode="horizontal" theme="dark" style={{ display: "flex", justifyContent: "center" }}>
            {filteredMenuItems.map((item) => (
                <Menu.Item key={item.key}>
                  <Link to={item.href}>{item.label}</Link>
                </Menu.Item>
              ))}
                
               
            </Menu>

            

            {/* Danh sách sản phẩm */}
            <Content style={{ padding: "20px", background: "#fff" }}>
                <Navigate to={"/page/product"}/>
                <Outlet/>
            </Content>

            {/* MODAL PROFILE */}
            <Modal title="Thông tin tài khoản" open={isModalOpen[0]} onOk={() => toggleModal(0, false)} onCancel={() => toggleModal(0, false)} width={800}>
                <UserProfile/>
            </Modal>

            {/* MODAL CART */}
            <Modal title="Giỏ hàng của bạn" open={isModalOpen[1]} onOk={() => toggleModal(1, false)} onCancel={() => toggleModal(1, false)}>
                <CartPage isModalOpenCart={isModalOpen[1]}/>
            </Modal>
        </Layout>
    );
};

export default AppUser;
