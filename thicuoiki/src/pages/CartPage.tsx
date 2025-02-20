import React, { useEffect, useState } from "react";
import { Table, Button, Space, message, InputNumber, Modal, Form, Input, Select } from "antd";
import { fetchCart, removeFromCart, clearCart, CartItem, updateCartItemQuantity } from "../api/cart.api";
import { fetchCustomerByUserId } from "../api/customer.api";
import { createOrder, OrderRequestDTO } from "../api/order.api";
import { getCurrentUser } from "../api/auth.api";

const { Option } = Select;

const CartPage: React.FC<{ isModalOpenCart: boolean }> = ({ isModalOpenCart }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [totalCartPrice, setTotalCartPrice] = useState<number>(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [customerInfo, setCustomerInfo] = useState({
    fullName: "",
    address: "",
    phone: "",
    paymentMethod: "COD",
    notes: "",
  });

  useEffect(() => {
    if (isModalOpenCart) {
      loadCart();
      loadCustomerInfo();
    }
  }, [isModalOpenCart]);

  const loadCart = async () => {
    try {
      const data = await fetchCart();
      if (data) {
        setCartItems(data.cartItems);
        setTotalCartPrice(data.totalCartPrice);
      }
    } catch {
      message.error("Có lỗi khi tải giỏ hàng.");
    }
  };

  const loadCustomerInfo = async () => {
    try {
      await getCurrentUser();
      const userId = localStorage.getItem("userId");
      if (userId) {
        const customer = await fetchCustomerByUserId(parseInt(userId));
        if (customer) {
          setCustomerInfo((prev) => ({
            ...prev,
            fullName: customer.fullName,
            address: customer.address,
            phone: customer.phone,
          }));
        }
      }
    } catch {
      message.error("Không thể tải thông tin khách hàng.");
    }
  };

  const handleOrder = () => {
    setIsModalOpen(true);
  };

  const handleModalOk = async () => {
    if (!customerInfo.fullName || !customerInfo.address || !customerInfo.phone) {
      message.error("Vui lòng điền đầy đủ thông tin.");
      return;
    }

    setLoading(true);
    const orderRequest: OrderRequestDTO = {
      customerName: customerInfo.fullName,
      shippingAddress: customerInfo.address,
      phoneNumber: customerInfo.phone,
      notes: customerInfo.notes,
      paymentMethod: customerInfo.paymentMethod,
      cartItems,
    };

    try {
      const order = await createOrder(orderRequest);
      if (order) {
        message.success("Đặt hàng thành công!");
        await clearCart();
        setCartItems([]);
        setTotalCartPrice(0);
        setIsModalOpen(false);
      } else {
        message.error("Đặt hàng thất bại.");
      }
    } catch {
      message.error("Lỗi khi đặt hàng.");
    } finally {
      setLoading(false);
    }
  };

  const handleModalCancel = () => {
    setIsModalOpen(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomerInfo({ ...customerInfo, [e.target.name]: e.target.value });
  };

  const handlePaymentMethodChange = (value: string) => {
    setCustomerInfo({ ...customerInfo, paymentMethod: value });
  };

  const handleQuantityChange = async (value: number | null, record: CartItem) => {
    if (value && value > 0) {
      await updateCartItemQuantity({ productId: record.product.id, quantity: value });
      loadCart();
    }
  };

  const handleRemoveItem = async (productId: number) => {
    await removeFromCart(productId);
    loadCart();
  };

  const columns = [
    { title: "Id sản phẩm", dataIndex: ["product", "id"], key: "id" },
    { title: "Tên sản phẩm", dataIndex: ["product", "name"], key: "name" },
    { title: "Giá", dataIndex: "totalPrice", key: "price" },
    {
      title: "Số lượng",
      dataIndex: "quantity",
      key: "quantity",
      render: (text: number, record: CartItem) => (
        <InputNumber
          min={1}
          value={text}
          onChange={(value) => handleQuantityChange(value, record)}
        />
      ),
    },
    {
      title: "Hành động",
      key: "actions",
      render: (_, record: CartItem) => (
        <Space>
          <Button onClick={() => handleRemoveItem(record.product.id)} danger>Xóa</Button>
        </Space>
      ),
    },
  ];

  const handleClearCart= async() => {
      await clearCart(); 
      loadCart(); 
    }

  return (
    <div>
      <Button onClick={handleClearCart} danger style={{ marginBottom: 16 }}>
        Xóa toàn bộ giỏ hàng
      </Button>
      <Table dataSource={cartItems} columns={columns} rowKey="id" />
      <div style={{ marginTop: 16, fontSize: 18 }}>
        <strong>Tổng tiền: {totalCartPrice.toLocaleString()} VND</strong>
      </div>
      <Button 
        type="primary" 
        onClick={handleOrder} 
        style={{ marginTop: 16 }} 
        disabled={cartItems.length === 0}
      >
        Đặt hàng
      </Button>

      <Modal
        title="Thông tin đặt hàng"
        open={isModalOpen}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
        confirmLoading={loading}
      >
        <Form layout="vertical">
          <Form.Item label="Họ và tên">
            <Input name="fullName" value={customerInfo.fullName} onChange={handleInputChange} />
          </Form.Item>
          <Form.Item label="Địa chỉ">
            <Input name="address" value={customerInfo.address} onChange={handleInputChange} />
          </Form.Item>
          <Form.Item label="Số điện thoại">
            <Input name="phone" value={customerInfo.phone} onChange={handleInputChange} />
          </Form.Item>
          <Form.Item label="Phương thức thanh toán">
            <Select value={customerInfo.paymentMethod} onChange={handlePaymentMethodChange}>
              <Option value="COD">Thanh toán khi nhận hàng (COD)</Option>
              <Option value="BankTransfer">Chuyển khoản ngân hàng</Option>
              <Option value="EWallet">Ví điện tử (Momo, ZaloPay...)</Option>
            </Select>
          </Form.Item>
          <Form.Item label="Ghi chú (nếu có)">
            <Input.TextArea name="notes" value={customerInfo.notes} onChange={handleInputChange} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default CartPage;
