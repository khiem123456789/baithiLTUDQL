import React, { useEffect, useState } from "react";
import { getCurrentUser } from "../api/auth.api";
import { fetchCustomerByUserId, updateCustomerForUser } from "../api/customer.api";
import { CustomerI } from "../api/customer.api";
import { Card, Spin, Typography, Button, Modal, Form, Input, message, Row, Table } from "antd";
import { LogoutOutlined, EditOutlined, ShoppingOutlined } from "@ant-design/icons";
import UserOrderPage from "./UserOrderPage";

const { Title, Text } = Typography;

const UserProfile: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [customer, setCustomer] = useState<CustomerI | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState<boolean>(false);
  const [form] = Form.useForm();

  useEffect(() => {
    async function fetchUserData() {
      try {
        setLoading(true);
        const userData = await getCurrentUser();
        setUser(userData);

        if (userData && userData.id) {
          const customerData = await fetchCustomerByUserId(userData.id);
          setCustomer(customerData);
        }
      } catch (error) {
        console.error("Lỗi khi tải thông tin user:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchUserData();
  }, []);

  const handleEdit = () => {
    if (customer) {
      form.setFieldsValue(customer);
      setIsModalOpen(true);
    }
  };

  const handleSave = async () => {
    try {
      const updatedData = await form.validateFields();
      if (customer) {
        const response = await updateCustomerForUser(customer.id, updatedData);
        if (response) {
          setCustomer(response);
          message.success("Cập nhật thông tin thành công!");
          setIsModalOpen(false);
        }
      }
    } catch (error) {
      console.error("Lỗi khi cập nhật thông tin:", error);
      message.error("Có lỗi xảy ra, vui lòng thử lại!");
    }
  };

  const handleLogout = async () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("userId");
    message.success("Đăng xuất thành công");
    window.location.href = "/login";
  };

  const handleViewOrders = async () => {
        setIsOrderModalOpen(true);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-2xl">
      <Row justify="space-between" align="middle" className="mb-4">
        <Title level={2}>Thông Tin Cá Nhân</Title>
        <Button type="primary" danger icon={<LogoutOutlined />} onClick={handleLogout}>
          Đăng Xuất
        </Button>
      </Row>

      {user && (
        <Card title="Thông Tin User" bordered={false} className="mb-4 shadow-md">
          <p><Text strong>Username:</Text> {user.username}</p>
          <p><Text strong>Email:</Text> {user.email}</p>
          <p><Text strong>Vai trò:</Text> {user.authorities?.map((role: any) => role.authority).join(", ")}</p>
        </Card>
      )}

      {customer ? (
        <Card
          title="Thông Tin Khách Hàng"
          extra={
            <>
              <Button icon={<EditOutlined />} onClick={handleEdit} className="mr-2">Chỉnh Sửa</Button>
              <Button icon={<ShoppingOutlined />} onClick={handleViewOrders}>Xem Đơn Hàng</Button>
            </>
          }
          bordered={false}
          className="shadow-md"
        >
          <p><Text strong>Họ Tên:</Text> {customer.fullName}</p>
          <p><Text strong>Địa Chỉ:</Text> {customer.address}</p>
          <p><Text strong>Số Điện Thoại:</Text> {customer.phone}</p>
          <p><Text strong>Tổng Chi Tiêu:</Text> {customer.totalSpent} VND</p>
        </Card>
      ) : (
        <Text type="secondary">Không có thông tin khách hàng.</Text>
      )}

      <Modal title="Danh Sách Đơn Hàng" open={isOrderModalOpen} onCancel={() => setIsOrderModalOpen(false)} footer={null} centered>
        <UserOrderPage/>
      </Modal>

      <Modal
  title="Chỉnh Sửa Thông Tin"
  open={isModalOpen}
  onCancel={() => setIsModalOpen(false)}
  onOk={handleSave}
  centered
>
  <Form form={form} layout="vertical">
    <Form.Item
      label="Họ Tên"
      name="fullName"
      rules={[{ required: true, message: "Vui lòng nhập họ tên!" }]}
    >
      <Input />
    </Form.Item>

    <Form.Item
      label="Địa Chỉ"
      name="address"
      rules={[{ required: true, message: "Vui lòng nhập địa chỉ!" }]}
    >
      <Input />
    </Form.Item>

    <Form.Item
      label="Số Điện Thoại"
      name="phone"
      rules={[
        { required: true, message: "Vui lòng nhập số điện thoại!" },
        { pattern: /^[0-9]{10}$/, message: "Số điện thoại không hợp lệ!" },
      ]}
    >
      <Input />
    </Form.Item>
  </Form>
</Modal>
    </div>
  );
};

export default UserProfile;
