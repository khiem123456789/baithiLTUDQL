import React, { useEffect, useState } from "react";
import { Table, Button, Modal, message } from "antd";
import { fetchUserOrders, fetchUserOrderById, Order } from "../api/order.api";

const UserOrderPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    const data = await fetchUserOrders();
    console.log("Fetched orders:", data);
    if (data) setOrders(data);
    else message.error("Không thể tải danh sách đơn hàng.");
  };

  const handleViewOrder = async (orderId: number) => {
    const order = await fetchUserOrderById(orderId);
    if (order) {
      setSelectedOrder(order);
      setIsModalVisible(true);
    } else {
      message.error("Không thể lấy chi tiết đơn hàng.");
    }
  };

  const columns = [
    { title: "ID", dataIndex: "id", key: "id" },
    { title: "Khách hàng", dataIndex: "customerName", key: "customerName" },
    { title: "Tổng tiền", dataIndex: "totalPrice", key: "totalPrice" },
    { title: "Trạng thái", dataIndex: "status", key: "status" },
    {
      title: "Hành động",
      key: "actions",
      render: (_, record: Order) => <Button onClick={() => handleViewOrder(record.id)}>Xem</Button>,
    },
  ];

  return (
    <div>
      <h2>Đơn hàng của tôi</h2>
      <Table dataSource={orders} columns={columns} rowKey="id" />
      <Modal title="Chi tiết đơn hàng" open={isModalVisible} onCancel={() => setIsModalVisible(false)} footer={null}>
        {selectedOrder && (
          <div>
            <p><b>Địa chỉ:</b> {selectedOrder.shippingAddress}</p>
            <p><b>Tổng tiền:</b> {selectedOrder.totalPrice} VND</p>
            <h4>Chi tiết sản phẩm:</h4>
            <ul>
              {selectedOrder.orderDetails.map((item) => (
                <li key={item.id}>{item.product.id}: {item.product.name} - {item.quantity} x {item.product.price} VND = {item.totalPrice}</li>
              ))}
            </ul>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default UserOrderPage;
