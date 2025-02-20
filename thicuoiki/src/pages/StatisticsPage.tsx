import { useEffect, useState } from "react";
import { Card, Table, Typography, Spin } from "antd";
import {
  fetchOverviewStats,
  fetchRevenueByCategory,
  fetchProductSales,
  fetchOrdersByMonthYear,
  OverviewStats,
  RevenueByCategory,
  ProductSales,
  OrderStats,
} from "../api/statistics.api";

const { Title } = Typography;

const StatisticsPage: React.FC = () => {
  const [overviewStats, setOverviewStats] = useState<OverviewStats | null>(null);
  const [revenueByCategory, setRevenueByCategory] = useState<RevenueByCategory[]>([]);
  const [productSales, setProductSales] = useState<ProductSales[]>([]);
  const [orders, setOrders] = useState<OrderStats[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function loadStats() {
      setLoading(true);
      try {
        const [overview, revenue, sales, ordersData] = await Promise.all([
          fetchOverviewStats(),
          fetchRevenueByCategory(),
          fetchProductSales(),
          //fetchOrdersByMonthYear(2, 2024), // Lọc theo tháng 2/2024 (có thể sửa lại)
        ]);

        setOverviewStats(overview);
        setRevenueByCategory(revenue);
        setProductSales(sales);
        //setOrders(ordersData);
      } catch (error) {
        console.error("Lỗi khi tải thống kê:", error);
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <Title level={2}>📊 Bảng Thống Kê</Title>

      {loading ? (
        <Spin size="large" />
      ) : (
        <>
          {/* Thống kê tổng quan */}
          <Card title="📈 Thống kê tổng quan" style={{ marginBottom: 20 }}>
            <p>🛒 Tổng số đơn hàng: {overviewStats?.totalOrders}</p>
            <p>👤 Tổng số khách hàng: {overviewStats?.totalCustomers}</p>
            <p>💰 Tổng doanh thu: {overviewStats?.totalRevenue.toLocaleString()} VNĐ</p>
          </Card>

          {/* Doanh thu theo danh mục */}
          <Card title="📦 Doanh thu theo danh mục" style={{ marginBottom: 20 }}>
            <Table
              dataSource={revenueByCategory}
              columns={[
                { title: "Danh mục", dataIndex: "categoryName", key: "categoryName" },
                { title: "Doanh thu (VNĐ)", dataIndex: "totalRevenue", key: "totalRevenue", render: (text) => text.toLocaleString() },
              ]}
              rowKey="categoryName"
            />
          </Card>

          {/* Sản phẩm bán chạy */}
          <Card title="🔥 Sản phẩm bán chạy nhất" style={{ marginBottom: 20 }}>
            <Table
              dataSource={productSales}
              columns={[
                { title: "Tên sản phẩm", dataIndex: "productName", key: "productName" },
                { title: "Số lượng bán", dataIndex: "quantitySold", key: "quantitySold" },
              ]}
              rowKey="productName"
            />
          </Card>
        </>
      )}
    </div>
  );
};

export default StatisticsPage;
