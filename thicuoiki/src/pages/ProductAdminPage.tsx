import React, { useEffect, useState } from "react";
import { Table, Button, Space, Input, Modal, InputNumber, Select, Form, message } from "antd";
import { Product, fetchProduct, createProduct, updateProduct, deleteProduct } from "../api/product.api";
import { Category, fetchCategories } from "../api/category.api";
import moment from "moment";
import { addToCart } from "../api/cart.api";
import { readRoles } from "../utils/localstorage";

const { Option } = Select;

const ProductAdminPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState<string>("");

  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const [selectedQuantities, setSelectedQuantities] = useState<{ [key: number]: number }>({});


  const [currentProduct, setCurrentProduct] = useState<Partial<Product>>({
    name: "",
    price: 0,
    description: "",
    quantity: 0,
    image: "",
    woodType: "",
    size: "",
    category: { id: 1, name: "" },
    status: "available",
  });

  useEffect(() => {
    loadProducts();
    loadCategories();
  }, []);

  const loadProducts = async () => {
    setLoading(true);
    try {
      const data = await fetchProduct();
      let filteredProducts = Array.isArray(data) ? data : [];

      if (searchTerm) {
        filteredProducts = filteredProducts.filter(
          (product) =>
            product.id.toString().includes(searchTerm) ||
            product.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }

      setProducts(filteredProducts);
    } catch (error) {
      console.error("Lỗi khi lấy sản phẩm:", error);
    }
    setLoading(false);
  };

  const loadCategories = async () => {
    try {
      const data = await fetchCategories();
      setCategories(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Lỗi khi lấy danh mục:", error);
    }
  };

  const handleSave = async () => {
    if (!currentProduct.name || !currentProduct.price) {
      alert("Tên sản phẩm và giá không được để trống!");
      return;
    }

    if (currentProduct.id) {
      await updateProduct(currentProduct.id, currentProduct);
    } else {
      await createProduct(currentProduct);
    }

    setCurrentProduct({
      name: "",
      price: 0,
      description: "",
      quantity: 0,
      image: "",
      woodType: "",
      size: "",
      category: { id: categories[0]?.id || 1, name: "" },
      status: "available",
    });

    setIsModalOpen(false);
    loadProducts();
  };

  const confirmDelete = (product: Product) => {
    setSelectedProduct(product);
    setIsConfirmModalOpen(true);
  };

  const handleEdit = (product: Product) => {
    setCurrentProduct(product);
    setIsModalOpen(true);
  };

  const handleDelete = async () => {
    if (selectedProduct) {
      try {
        await deleteProduct(selectedProduct.id);
        setIsConfirmModalOpen(false);
        loadProducts();
      } catch (error: any) {
        console.error("Lỗi khi xóa sản phẩm:", error);
        if (error.response?.status === 400) {
          message.error(error.response.data.message);
        } else {
          message.error("Không thể xóa sản phẩm này. Sản phẩm đang được sử dụng ở nơi khác.");
        }
      }
    }
  };

  const handleDetail = (product: Product) => {
    setCurrentProduct(product);
    setIsDetailModalOpen(true);
  };

  const handleAddToCart = async (productId: number) => {
    const quantity = selectedQuantities[productId] || 1; // Nếu chưa chọn, mặc định là 1
    try {
      const response = await addToCart({ productId, quantity });
      if (response) {
        message.success("Sản phẩm đã được thêm vào giỏ hàng!");
      } else {
        message.error("Thêm sản phẩm vào giỏ hàng thất bại.");
      }
    } catch (error) {
      message.error("Có lỗi xảy ra khi thêm vào giỏ hàng.");
    }
  };
  const handleQuantityChange = (productId: number, quantity: number | null) => {
    if (quantity !== null) {
      setSelectedQuantities((prev) => ({ ...prev, [productId]: quantity }));
    }
  };
  const role = readRoles() || "USER";
  const columns = [
    { title: "Mã sản phẩm", dataIndex: "id", key: "id", width: 100 },
    { title: "Tên sản phẩm", dataIndex: "name", key: "name" },
    { title: "Giá", dataIndex: "price", key: "price" },
    { title: "Số lượng", dataIndex: "quantity", key: "quantity" },
    { title: "Loại gỗ", dataIndex: "woodType", key: "woodType" },
    { title: "Kích thước", dataIndex: "size", key: "size" },
    { title: "Danh mục", dataIndex: ["category", "name"], key: "category" },
    { title: "Trạng thái", dataIndex: "status", key: "status" },
    {
      title: "Hình ảnh",
      dataIndex: "image",
      key: "image",
      render: (image) =>
        image ? <img src={image} alt="Sản phẩm" style={{ width: 50, height: 50, objectFit: "cover" }} /> : "Không có ảnh",
    },
    {
      title: "Hành động",
      key: "actions",
      render: (_, record: Product) => (
        <Space>
          <Button onClick={() => handleEdit(record)}>Sửa</Button>
          <Button danger onClick={() => confirmDelete(record)}>Xóa</Button>
          <Button onClick={() => handleDetail(record)}>Chi tiết</Button>
          <Space>
          <InputNumber
            min={1}
            defaultValue={1}
            value={selectedQuantities[record.id] || 1}
            onChange={(value) => handleQuantityChange(record.id, value)}
            style={{ width: 80, marginRight: 10 }}
          />
          <Button onClick={() => handleAddToCart(record.id)} type="primary">
            Thêm vào giỏ
          </Button>
        </Space>
        </Space>
      ),
    },
  ];

  return (
    <div>
      {/* Thanh tìm kiếm */}
      <Space style={{ marginBottom: 16 }}>
        <Input
          placeholder="Tìm kiếm theo mã hoặc tên sản phẩm..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ width: 300 }}
        />
        <Button type="primary" onClick={loadProducts}>Tìm kiếm</Button>
        {/* <Button onClick={() => { setSearchTerm(""); loadProducts(); }}>Xóa tìm kiếm</Button> */}
      </Space>

      <Button type="primary" onClick={() => setIsModalOpen(true)}>Thêm sản phẩm</Button>
      <Table dataSource={products} loading={loading} rowKey="id" columns={columns} />

      {/* Modal thêm/sửa sản phẩm */}
      <Modal
        title={currentProduct.id ? "Chỉnh sửa sản phẩm" : "Thêm sản phẩm"}
        open={isModalOpen}
        onOk={handleSave}
        onCancel={() => setIsModalOpen(false)}
      >
        <Form layout="vertical">
          <Form.Item label="Tên sản phẩm">
            <Input
              value={currentProduct.name}
              onChange={(e) => setCurrentProduct({ ...currentProduct, name: e.target.value })}
            />
          </Form.Item>

          <Form.Item label="Giá">
            <InputNumber
              min={0}
              value={currentProduct.price}
              onChange={(value) => setCurrentProduct({ ...currentProduct, price: value || 0 })}
              style={{ width: "100%" }}
            />
          </Form.Item>

          <Form.Item label="Số lượng">
            <InputNumber
              min={0}
              value={currentProduct.quantity}
              onChange={(e) => setCurrentProduct({ ...currentProduct, quantity: e || 0 })}
            />
          </Form.Item>

          <Form.Item label="Loại gỗ">
            <Input
              value={currentProduct.woodType}
              onChange={(e) => setCurrentProduct({ ...currentProduct, woodType: e.target.value })}
            />
          </Form.Item>

          <Form.Item label="Kích thước">
            <Input
              value={currentProduct.size}
              onChange={(e) => setCurrentProduct({ ...currentProduct, size: e.target.value })}
            />
          </Form.Item>

          <Form.Item label="Danh mục">
            <Select
              value={currentProduct.category?.id}
              onChange={(value) => setCurrentProduct({ ...currentProduct, category: { id: value, name: categories.find(c => c.id === value)?.name || "" } })}
              style={{ width: "100%" }}
            >
              {categories.map((category) => (
                <Option key={category.id} value={category.id}>
                  {category.name}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item label="Trạng thái">
            <Select
              value={currentProduct.status}
              onChange={(value) => setCurrentProduct({ ...currentProduct, status: value })}
              style={{ width: "100%" }}
            >
              <Option value="available">Còn hàng</Option>
              <Option value="out_of_stock">Hết hàng</Option>
            </Select>
          </Form.Item>

          {/* Hiển thị ảnh cũ */}
          {currentProduct.image && (
            <div style={{ marginBottom: "10px", textAlign: "center" }}>
              <img src={currentProduct.image} alt="Ảnh sản phẩm" style={{ width: 100, height: 100, objectFit: "cover" }} />
            </div>
          )}

          {/* Trường nhập URL ảnh mới */}
          <Form.Item label="Link ảnh mới">
            <Input
              value={currentProduct.image}
              onChange={(e) => setCurrentProduct({ ...currentProduct, image: e.target.value })}
            />
          </Form.Item>

        </Form>
      </Modal>

      {/* Modal chi tiết sản phẩm */}
      <Modal
        title="Chi tiết sản phẩm"
        open={isDetailModalOpen}
        onCancel={() => setIsDetailModalOpen(false)}
        footer={null}
      >
        <div style={{ textAlign: "center", marginBottom: "20px" }}>
          {/* Hiển thị ảnh sản phẩm nếu có */}
          {currentProduct.image ? (
            <img
              src={currentProduct.image}
              alt="Ảnh sản phẩm"
              style={{ width: "100%", maxHeight: "300px", objectFit: "cover", borderRadius: "10px" }}
            />
          ) : (
            <p>Không có ảnh</p>
          )}
        </div>

        <p><strong>Mã sản phẩm:</strong> {currentProduct.id}</p>
        <p><strong>Tên sản phẩm:</strong> {currentProduct.name}</p>
        <p><strong>Giá:</strong> {currentProduct.price} VND</p>
        <p><strong>Mô tả:</strong> {currentProduct.description}</p>
        <p><strong>Số lượng:</strong> {currentProduct.quantity}</p>
        <p><strong>Loại gỗ:</strong> {currentProduct.woodType}</p>
        <p><strong>Kích thước:</strong> {currentProduct.size}</p>
        <p><strong>Danh mục:</strong> {currentProduct.category?.name}</p>
        <p><strong>Trạng thái:</strong> {currentProduct.status === "available" ? " Còn hàng" : "Hết hàng"}</p>
        <p><strong>Ngày tạo:</strong> {moment(currentProduct.addedAt).format("DD/MM/YYYY HH:mm")}</p>
        <p><strong>Ngày cập nhật:</strong> {moment(currentProduct.updatedAt).format("DD/MM/YYYY HH:mm")}</p>
      </Modal>

      <Modal title="Xác nhận xóa" open={isConfirmModalOpen} onOk={handleDelete} onCancel={() => setIsConfirmModalOpen(false)}>
        <p>Bạn có chắc chắn muốn xóa sản phẩm này không?</p>
        <p><strong>{selectedProduct?.name}</strong></p>
      </Modal>
    </div>
  );
};

export default ProductAdminPage;
