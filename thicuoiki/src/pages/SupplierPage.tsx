import React, { useEffect, useState } from "react";
import { Table, Button, Space, Input, Modal, Form, message } from "antd";
import { Supplier, fetchSupplier, createSupplier, updateSupplier, deleteSupplier } from "../api/supplier.api";

const SupplierPage: React.FC = () => {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentSupplier, setCurrentSupplier] = useState<Partial<Supplier>>({});
  const [searchText, setSearchText] = useState("");
  const [form] = Form.useForm();

  useEffect(() => {
    loadSuppliers();
  }, []);

  const loadSuppliers = async () => {
    setLoading(true);
    try {
      const data = await fetchSupplier();
      setSuppliers(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách nhà cung cấp:", error);
    }
    setLoading(false);
  };

  const handleSave = async () => {
    try {
        const values = await form.validateFields();
        if (currentSupplier.id) {
          await updateSupplier(currentSupplier.id, values);
          message.success("Cập nhật nhà cung cấp thành công!");
        } else {
          await createSupplier(values);
          message.success("Thêm nhà cung cấp thành công!");
        }
        setIsModalOpen(false);
        loadSuppliers();
      } catch (error: any) {
        if (error.response?.status === 400) {
          message.error(error.response.data.message); // Hiển thị thông báo từ backend
        } else {
          message.error("Có lỗi xảy ra. Vui lòng thử lại!");
        }
      }
  };

  const handleEdit = (supplier: Supplier) => {
    setCurrentSupplier(supplier);
    form.setFieldsValue(supplier);
    setIsModalOpen(true);
  };

  const confirmDelete = (supplier: Supplier) => {
    setCurrentSupplier(supplier);
    setIsDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    if (currentSupplier.id) {
      await deleteSupplier(currentSupplier.id);
      message.success("Xóa nhà cung cấp thành công!");
      loadSuppliers();
    }
    setIsDeleteModalOpen(false);
  };

  const filteredSuppliers = suppliers.filter(s =>
    s.name.toLowerCase().includes(searchText.toLowerCase()) ||
    s.id.toString().includes(searchText)
  );

  return (
    <div>
      <Space style={{ marginBottom: 16 }}>
        <Input
          placeholder="Tìm kiếm theo ID hoặc Tên"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          style={{ width: 250 }}
        />
        <Button type="primary" onClick={() => { setCurrentSupplier({}); form.resetFields(); setIsModalOpen(true); }}>
          Thêm nhà cung cấp
        </Button>
      </Space>
      <Table
        dataSource={filteredSuppliers}
        loading={loading}
        rowKey="id"
        columns={[
          { title: "ID", dataIndex: "id", key: "id", width: 80 },
          { title: "Tên", dataIndex: "name", key: "name" },
          { title: "Địa chỉ", dataIndex: "address", key: "address" },
          { title: "Số điện thoại", dataIndex: "phone", key: "phone" },
          { title: "Email", dataIndex: "email", key: "email" },
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
        title={currentSupplier.id ? "Chỉnh sửa nhà cung cấp" : "Thêm nhà cung cấp"}
        open={isModalOpen}
        onOk={handleSave}
        onCancel={() => setIsModalOpen(false)}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="name" label="Tên nhà cung cấp" rules={[{ required: true, message: "Vui lòng nhập tên" }]}> 
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
          <Form.Item name="email" label="Email"> 
            <Input type="email" />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="Xác nhận xóa"
        open={isDeleteModalOpen}
        onOk={handleDelete}
        onCancel={() => setIsDeleteModalOpen(false)}
      >
        <p>Bạn có chắc chắn muốn xóa nhà cung cấp này không?</p>
        <p><strong>Tên:</strong> {currentSupplier.name}</p>
        <p><strong>Email:</strong> {currentSupplier.email}</p>
      </Modal>
    </div>
  );
};

export default SupplierPage;
