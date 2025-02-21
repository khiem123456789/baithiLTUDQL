import React from "react";
import { Button, Card } from "antd";
import { PhoneOutlined } from "@ant-design/icons";
import "../styles/Home.css";

const Home: React.FC = () => {
  return (
    <div className="home-container">
      {/* Banner Full Màn Hình */}
      <div className="banner">
        <div className="banner-content">
          <h1>DỊCH VỤ TANG LỄ THIỆN ĐỨC</h1>
          <p>GIỮ TRỌN CHỮ ĐỨC - GÓI TRỌN CHỮ TÂM</p>
          <Button type="primary" className="call-button" icon={<PhoneOutlined />}>
            Gọi ngay: 0902.99.40.99
          </Button>
        </div>
      </div>

      {/* Giới thiệu Full Màn Hình */}
      <div className="intro-section">
        <Card className="intro-card">
          <h2>Về Chúng Tôi</h2>
          <p>
            Trại hòm <strong>THIỆN ĐỨC</strong> phục vụ theo phương châm{" "}
            <strong>"TẬN TÂM - CHU ĐÁO - CHẤT LƯỢNG"</strong>. Chúng tôi cam kết
            mang đến dịch vụ tang lễ chuyên nghiệp, trang trọng và chu đáo.
          </p>
        </Card>
      </div>
    </div>
  );
};

export default Home;
