import { Link, Outlet } from "react-router-dom";
import React, { useState } from "react";
import { Layout, Menu, Button, Modal, Space, Typography } from "antd";
import { UserOutlined, ShoppingCartOutlined, AppstoreOutlined, HomeOutlined } from "@ant-design/icons";
import { readRoles } from "./utils/localstorage";
import UserProfile from "./pages/UserProfile";
import CartPage from "./pages/CartPage";

const { Header, Sider, Content } = Layout;
const { Title } = Typography;

// Lấy quyền người dùng
const role = readRoles() || "ROLE_USER";
const menuItems = [
  { key: "item01", label: "Sản phẩm", icon: <AppstoreOutlined />, href: "/page/admin/product", roles: ["ROLE_ADMIN"] },
  { key: "item02", label: "Khách hàng", icon: <UserOutlined />, href: "/page/admin/customer", roles: ["ROLE_ADMIN"] },
  { key: "item03", label: "Danh mục", icon: <ShoppingCartOutlined />, href: "/page/admin/category", roles: ["ROLE_ADMIN"] },
  { key: "item04", label: "Nhà cung cấp", icon: <ShoppingCartOutlined />, href: "/page/admin/supplier", roles: ["ROLE_ADMIN"] },
  { key: "item05", label: "Kho hàng", icon: <ShoppingCartOutlined />, href: "/page/admin/stockentry", roles: ["ROLE_ADMIN"] },
  { key: "item07", label: "Đơn hàng", icon: <AppstoreOutlined />, href: "/page/admin/order", roles: ["ROLE_ADMIN"] },
  { key: "item08", label: "Home", icon: <HomeOutlined />, href: "/page/admin/homeadmin", roles: ["ROLE_ADMIN"] },
];

// Lọc menu theo quyền user
const filteredMenuItems = menuItems.filter(item => (item.roles ?? []).includes(role));

// Thiết lập CSS
const layoutStyle = { width: "100vw", height: "100vh" };
const headerStyle = { textAlign: "right", color: "#fff", height: 64, paddingInline: 48, lineHeight: "64px", backgroundColor: "#4096ff" };
const siderStyle = { backgroundColor: "#001529", color: "#fff", paddingTop: 20 };
const contentStyle = { minHeight: "100vh", padding: "24px", background: "#f0f2f5", display: "flex", justifyContent: "center", alignItems: "center" };

function App() {
  const [isModalOpen, setIsModalOpen] = useState([false, false]);

  const toggleModal = (idx: number, target: boolean) => {
    setIsModalOpen((prev) => {
      const newState = [...prev];
      newState[idx] = target;
      return newState;
    });
  };

  return (
    <>
      <Layout style={layoutStyle}>
        {/* HEADER */}
        <Header style={headerStyle}>
          <Space>
            <Button type="primary" icon={<ShoppingCartOutlined />} onClick={() => toggleModal(1, true)} />
            <Button type="primary" onClick={() => toggleModal(0, true)}>
              <UserOutlined />
            </Button>
          </Space>
        </Header>

        <Layout>
          {/* SIDEBAR */}
          <Sider width="20%" style={siderStyle}>
            <Title level={4} style={{ color: "white", textAlign: "center", marginBottom: 20 }}>
              Admin Panel
            </Title>
            <Menu theme="dark" defaultSelectedKeys={["item01"]} mode="inline">
              {filteredMenuItems.map((item) => (
                <Menu.Item key={item.key} icon={item.icon}>
                  <Link to={item.href}>{item.label}</Link>
                </Menu.Item>
              ))}
            </Menu>
          </Sider>

          {/* CONTENT */}
          <Content style={contentStyle}>
            <Outlet />
          </Content>
        </Layout>
      </Layout>

      {/* MODAL PROFILE */}
      <Modal title="Thông tin tài khoản" open={isModalOpen[0]} onOk={() => toggleModal(0, false)} onCancel={() => toggleModal(0, false)} width={800}>
        <UserProfile />
      </Modal>

      {/* MODAL CART */}
      <Modal title="Giỏ hàng của bạn" open={isModalOpen[1]} onOk={() => toggleModal(1, false)} onCancel={() => toggleModal(1, false)}>
      <CartPage isModalOpenCart={isModalOpen[1]}  />
      </Modal>
    </>
  );
}

export default App;
