import React, { useEffect, useState } from "react";
import { Card, Row, Col, Image, Typography, Button, Input, Select, Space, InputNumber, message } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { fetchProduct,Product} from "../api/product.api";
import { fetchCategories, Category } from "../api/category.api";
import { addToCart } from "../api/cart.api";

const { Title, Text } = Typography;
const { Option } = Select;

const ProductUserPage = () => {
    const [selectedQuantities, setSelectedQuantities] = useState<{ [key: number]: number }>({});
    const [products, setProducts] = useState<Product[]>([]);  
    const [filteredProducts, setFilteredProducts] = useState<Product[]>([]); 
    const [categories, setCategories] = useState<Category[]>([]); 
    const [searchTerm, setSearchTerm] = useState(""); 
    const [selectedCategory, setSelectedCategory] = useState<number | null>(null); 

    useEffect(() => {
        fetchProduct().then((data) => {
            setProducts(data);
        });

        fetchCategories().then((data) => {
            setCategories(data);
        });
    }, []);

    useEffect(() => {
        let filtered = products;

        if (searchTerm.trim() !== "") {
            filtered = filtered.filter((product) =>
                product.name.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        if (selectedCategory) {
            filtered = filtered.filter((product) => product.category.id === selectedCategory);
        }

        setFilteredProducts(filtered);
    }, [searchTerm, selectedCategory, products]);

    const handleQuantityChange = (productId: number, quantity: number | null) => {
        if (quantity !== null) {
            setSelectedQuantities((prev) => ({ ...prev, [productId]: quantity }));
        }
    };

    const handleAddToCart = async (productId: number) => {
        const quantity = selectedQuantities[productId] || 1;
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

    return (
        <div style={{ padding: "20px", background: "#fff" }}>
            {/* Thanh tìm kiếm */}
            <Input
                placeholder="Tìm kiếm sản phẩm..."
                prefix={<SearchOutlined />}
                style={{ width: 400, marginBottom: "20px" }}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />

            {/* Bộ lọc danh mục */}
            <div style={{ marginBottom: "20px" }}>
                <Text strong>Chọn danh mục:</Text>
                <Select
                    style={{ width: 200, marginLeft: 10 }}
                    placeholder="Tất cả danh mục"
                    allowClear
                    onChange={(value) => setSelectedCategory(value || null)}
                >
                    {categories.map((category) => (
                        <Option key={category.id} value={category.id}>
                            {category.name}
                        </Option>
                    ))}
                </Select>
            </div>

            {/* Danh sách sản phẩm */}
            <Row gutter={[16, 16]}>
                {filteredProducts.map((product) => (
                    <Col xs={24} sm={12} md={8} lg={6} xl={4} key={product.id}>
                        <Card hoverable>
                            <Image src={product.image} alt={product.name} width="100%" height={200} />
                            <Title level={5} style={{ marginTop: 10 }}>{product.name}</Title>
                            <Text strong style={{ color: "red" }}>{product.price.toLocaleString()}đ</Text>
                            <div style={{ marginTop: 10 }}>
                                <Space>
                                    <InputNumber
                                        min={1}
                                        defaultValue={1}
                                        value={selectedQuantities[product.id] || 1}
                                        onChange={(value) => handleQuantityChange(product.id, value)}
                                        style={{ width: 80, marginRight: 10 }}
                                    />
                                    <Button onClick={() => handleAddToCart(product.id)} type="primary">
                                        Thêm vào giỏ
                                    </Button>
                                    <Button type="primary">Xem chi tiết</Button>
                                </Space>
                            </div>
                        </Card>
                    </Col>
                ))}
            </Row>
        </div>
    );
};

export default ProductUserPage;
