import React, { useEffect, useState } from "react";
import { Table, Button, Space, Input, Modal, Form, message } from "antd";
import { Customer, fetchAllCustomers, createCustomer, updateCustomer, deleteCustomer } from "../api/customer.api";

const CustomerPage: React.FC = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentCustomer, setCurrentCustomer] = useState<Partial<Customer>>({});
  const [searchText, setSearchText] = useState("");
  const [form] = Form.useForm();

  useEffect(() => {
    loadCustomers();
  }, []);

  const loadCustomers = async () => {
    setLoading(true);
    try {
      const data = await fetchAllCustomers();
      setCustomers(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách khách hàng:", error);
    }
    setLoading(false);
  };

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      if (currentCustomer.id) {
        await updateCustomer(currentCustomer.id, values);
        message.success("Cập nhật khách hàng thành công!");
      } else {
        await createCustomer(values);
        message.success("Thêm khách hàng thành công!");
      }
      setIsModalOpen(false);
      loadCustomers();
    } catch (error: any) {
      message.error("Có lỗi xảy ra. Vui lòng thử lại!");
    }
  };

  const handleEdit = (customer: Customer) => {
    setCurrentCustomer(customer);
    form.setFieldsValue(customer);
    setIsModalOpen(true);
  };

  const confirmDelete = (customer: Customer) => {
    setCurrentCustomer(customer);
    setIsDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    if (currentCustomer.id) {
      await deleteCustomer(currentCustomer.id);
      message.success("Xóa khách hàng thành công!");
      loadCustomers();
    }
    setIsDeleteModalOpen(false);
  };

  const filteredCustomers = customers.filter(c =>
    (c.fullName?.toLowerCase() || "").includes(searchText.toLowerCase()) ||
    (c.id?.toString() || "").includes(searchText) ||
    (c.phone?.toString() || "").includes(searchText)
  );

  return (
    <div>
      <Space style={{ marginBottom: 16 }}>
        <Input
          placeholder="Tìm kiếm theo ID, Tên, Số điện thoại"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          style={{ width: 250 }}
        />
        <Button type="primary" onClick={() => { setCurrentCustomer({}); form.resetFields(); setIsModalOpen(true); }}>
          Thêm khách hàng
        </Button>
      </Space>
      <Table
        dataSource={filteredCustomers}
        loading={loading}
        rowKey="id"
        columns={[
          { title: "ID", dataIndex: "id", key: "id", width: 80 },
          { title: "Tên", dataIndex: "fullName", key: "fullName" },
          { title: "Địa chỉ", dataIndex: "address", key: "address" },
          { title: "Số điện thoại", dataIndex: "phone", key: "phone" },
          { title: "Tổng tiền chi", dataIndex: "totalSpent", key: "totalSpent" },
          {
            title: "Hành động",
            key: "actions",
            render: (_, record) => (
              <Space>
                <Button onClick={() => handleEdit(record)}>Sửa</Button>
                <Button danger onClick={() => confirmDelete(record)}>Xóa</Button>
              </Space>
            ),
          },
        ]}
      />

      <Modal
        title={currentCustomer.id ? "Chỉnh sửa khách hàng" : "Thêm khách hàng"}
        open={isModalOpen}
        onOk={handleSave}
        onCancel={() => setIsModalOpen(false)}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="fullName" label="Tên khách hàng" rules={[{ required: true, message: "Vui lòng nhập tên" }]}>
            <Input />
          </Form.Item>
          <Form.Item name="address" label="Địa chỉ">
            <Input />
          </Form.Item>
          <Form.Item name="phone" label="Số điện thoại" rules={[
            { required: true, message: "Vui lòng nhập số điện thoại" },
            { pattern: /^[0-9]{10}$/, message: "Số điện thoại phải có đúng 10 chữ số" }
          ]}>
            <Input />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="Xác nhận xóa"
        open={isDeleteModalOpen}
        onOk={handleDelete}
        onCancel={() => setIsDeleteModalOpen(false)}
      >
        <p>Bạn có chắc chắn muốn xóa khách hàng này không?</p>
        <p><strong>Tên:</strong> {currentCustomer.fullName}</p>
        <p><strong>Số điện thoại:</strong> {currentCustomer.phone}</p>
        <p><strong>Địa chỉ:</strong> {currentCustomer.address}</p>
      </Modal>
    </div>
  );
};

export default CustomerPage;
