import React, { useEffect, useState } from "react";
import { Table, Button, Space, Modal, Select, Form, InputNumber, message, Input } from "antd";
import { fetchProduct } from "../api/product.api";
import { fetchSupplier } from "../api/supplier.api";
import { fetchStockEntries, createStockEntry, updateStockEntry, deleteStockEntry } from "../api/stock_entry.api";

const { Option } = Select;

const StockEntryPage: React.FC = () => {
  const [stockEntries, setStockEntries] = useState([]);

  const [products, setProducts] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [searchId, setSearchId] = useState("");
  const [filteredEntries, setFilteredEntries] = useState([]);


  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteEntry, setDeleteEntry] = useState(null);

  const handleDeleteClick = (entry) => {
    setDeleteEntry(entry);
    setIsDeleteModalOpen(true);
  };
  
  useEffect(() => {
    loadStockEntries();
    loadProducts();
    loadSuppliers();
  }, []);

  const loadStockEntries = async () => {
    setLoading(true);
    const data = await fetchStockEntries();
    setStockEntries(data);
    setFilteredEntries(data);
    setLoading(false);
  };

  const loadProducts = async () => {
    const data = await fetchProduct();
    setProducts(data);
  };

  const loadSuppliers = async () => {
    const data = await fetchSupplier();
    setSuppliers(data);
  };

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      if (values.id) {
        await updateStockEntry(values.id, values);
        message.success("Cập nhật nhập kho thành công!");
      } else {
        await createStockEntry(values);
        message.success("Thêm nhập kho thành công!");
      }
      setIsModalOpen(false);
      loadStockEntries();
    } catch (error) {
      message.error("Có lỗi xảy ra, vui lòng thử lại!");
      console.error("Lỗi khi lưu nhập kho:", error);
    }
  };

  const handleEdit = (entry) => {
    form.setFieldsValue({
      id: entry.id,
      productId: entry.product?.id,
      supplierId: entry.supplier?.id,
      quantity: entry.quantity,
      price: entry.price,
    });
    setIsModalOpen(true);
  };

  // const handleDelete = async (id) => {
  //   try {
  //     await deleteStockEntry(id);
  //     message.success("Xóa nhập kho thành công!");
  //     loadStockEntries();
  //   } catch (error) {
  //     message.error("Lỗi khi xóa nhập kho!");
  //     console.error("Lỗi khi xóa:", error);
  //   }
  // };
  const confirmDelete = async () => {
    if (!deleteEntry) return;
  
    try {
      await deleteStockEntry(deleteEntry.id);
      message.success("Xóa nhập kho thành công!");
      loadStockEntries();
    } catch (error) {
      message.error("Lỗi khi xóa nhập kho!");
      console.error("Lỗi khi xóa:", error);
    }
  
    setIsDeleteModalOpen(false);
  };
  
  const columns = [
    { title: "ID", dataIndex: "id", key: "id", width: 80 },
    { title: "Tên sản phẩm", dataIndex: ["product", "name"], key: "product" },
    { title: "Nhà cung cấp", dataIndex: ["supplier", "name"], key: "supplier" },
    { title: "Số lượng", dataIndex: "quantity", key: "quantity", width: 120 },
    { title: "Giá nhập", dataIndex: "price", key: "price", width: 120 },
    { title: "Ngày nhập", dataIndex: "entryDate", key: "entryDate", width: 120 },
    {
      title: "Hành động",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Button onClick={() => handleEdit(record)}>Sửa</Button>
          <Button danger onClick={() => handleDeleteClick(record)}>Xóa</Button>
        </Space>
      ),
    },
  ];
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchId(value);
    if (!value) {
      setFilteredEntries(stockEntries);
    } else {
      setFilteredEntries(stockEntries.filter((entry) => entry.id.toString().includes(value)));
    }
  };
  return (
    <div>
      <Input
          placeholder="Nhập ID để tìm kiếm"
          value={searchId}
          onChange={handleSearch}
          style={{ width: 200 }}
        />
      <Button type="primary" onClick={() => { form.resetFields(); setIsModalOpen(true); }}>
        Thêm nhập kho
      </Button>

      <Table dataSource={filteredEntries} loading={loading} rowKey="id" columns={columns} />

      <Modal
        title={form.getFieldValue("id") ? "Chỉnh sửa nhập kho" : "Thêm nhập kho"}
        open={isModalOpen}
        onOk={handleSave}
        onCancel={() => { form.resetFields(); setIsModalOpen(false); }}
      >
        <Form layout="vertical" form={form}>
          <Form.Item name="id" hidden>
            <InputNumber />
          </Form.Item>

          <Form.Item label="Sản phẩm" name="productId" rules={[{ required: true, message: "Chọn sản phẩm!" }]}>
            <Select placeholder="Chọn sản phẩm">
              {products.map((product) => (
                <Option key={product.id} value={product.id}>{product.name}</Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item label="Nhà cung cấp" name="supplierId" rules={[{ required: true, message: "Chọn nhà cung cấp!" }]}>
            <Select placeholder="Chọn nhà cung cấp">
              {suppliers.map((supplier) => (
                <Option key={supplier.id} value={supplier.id}>{supplier.name}</Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item label="Số lượng" name="quantity" rules={[{ required: true, message: "Nhập số lượng!" }]}>
            <InputNumber min={1} style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item label="Giá nhập" name="price" rules={[{ required: true, message: "Nhập giá!" }]}>
            <InputNumber min={0} style={{ width: "100%" }} />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
  title="Xác nhận xóa nhập kho"
  open={isDeleteModalOpen}
  onOk={confirmDelete}
  onCancel={() => setIsDeleteModalOpen(false)}
  okText="Xóa"
  okType="danger"
  cancelText="Hủy"
>
  {deleteEntry && (
    <div>
      <p><b>Tên sản phẩm:</b> {deleteEntry.product?.name}</p>
      <p><b>Nhà cung cấp:</b> {deleteEntry.supplier?.name}</p>
      <p><b>Số lượng:</b> {deleteEntry.quantity}</p>
      <p><b>Giá nhập:</b> {deleteEntry.price}</p>
      <p style={{ color: "red", fontWeight: "bold" }}>Bạn có chắc chắn muốn xóa không?</p>
    </div>
  )}
</Modal>
    </div>
  );
};

export default StockEntryPage;
