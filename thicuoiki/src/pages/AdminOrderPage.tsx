import React, { useEffect, useState } from "react";
import { Table, Button, Modal, message, Select, Space, Input } from "antd";
import { fetchAllOrders, fetchOrderById, updateOrderStatus, deleteOrder, Order } from "../api/order.api";

const AdminOrderPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [searchId, setSearchId] = useState("");

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    const data = await fetchAllOrders();
    if (data) {
      setOrders(data);
      setFilteredOrders(data);
    } else {
      message.error("Không thể tải danh sách đơn hàng.");
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchId(value);
    if (!value) {
      setFilteredOrders(orders);
    } else {
      setFilteredOrders(orders.filter((order) => order.id.toString().includes(value)));
    }
  };

  const handleViewOrder = async (orderId: number) => {
    const order = await fetchOrderById(orderId);
    if (order) {
      setSelectedOrder(order);
      setIsModalVisible(true);
    } else {
      message.error("Không thể lấy chi tiết đơn hàng.");
    }
  };

  const handleUpdateStatus = async (orderId: number, status: string) => {
    const response = await updateOrderStatus(orderId, status);
    if (response) {
      message.success("Cập nhật trạng thái thành công!");
      loadOrders();
    } else {
      message.error("Lỗi khi cập nhật trạng thái.");
    }
  };

  const handleDeleteOrder = async (orderId: number) => {
    const response = await deleteOrder(orderId);
    if (response) {
      message.success("Xóa đơn hàng thành công!");
      loadOrders();
    } else {
      message.error("Lỗi khi xóa đơn hàng.");
    }
  };

  const columns = [
    { title: "ID", dataIndex: "id", key: "id" },
    { title: "Khách hàng", dataIndex: "customerName", key: "customerName" },
    { title: "Trạng thái", dataIndex: "status", key: "status" },
    { title: "Tổng tiền", dataIndex: "totalPrice", key: "totalPrice" },
    {
      title: "Hành động",
      key: "actions",
      render: (_, record: Order) => (
        <Space>
          <Button onClick={() => handleViewOrder(record.id)}>Xem</Button>
          <Select defaultValue={record.status} onChange={(status) => handleUpdateStatus(record.id, status)}>
            <Select.Option value="PENDING">Chờ xử lý</Select.Option>
            <Select.Option value="SHIPPED">Đang giao</Select.Option>
            <Select.Option value="DELIVERED">Đã giao</Select.Option>
          </Select>
          <Button danger onClick={() => handleDeleteOrder(record.id)}>Xóa</Button>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <h2>Quản lý đơn hàng</h2>
      <Space style={{ marginBottom: 16 }}>
        <Input
          placeholder="Nhập ID để tìm kiếm"
          value={searchId}
          onChange={handleSearch}
          style={{ width: 200 }}
        />
      </Space>
      <Table dataSource={filteredOrders} columns={columns} rowKey="id" />
      <Modal title="Chi tiết đơn hàng" open={isModalVisible} onCancel={() => setIsModalVisible(false)} footer={null}>
        {selectedOrder && (
          <div>
            <p><b>Tên khách hàng:</b> {selectedOrder.customerName}</p>
            <p><b>Địa chỉ:</b> {selectedOrder.shippingAddress}</p>
            <p><b>Số điện thoại:</b> {selectedOrder.phoneNumber}</p>
            <p><b>Tổng tiền:</b> {selectedOrder.totalPrice} VND</p>
            <h4>Chi tiết sản phẩm:</h4>
            <ul>
              {selectedOrder.orderDetails.map((item) => (
                <li key={item.id}>{item.product.name} - {item.quantity} x {item.price} VND</li>
              ))}
            </ul>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default AdminOrderPage;
