import { Menu } from "antd";
import { Link } from "react-router-dom";
import {
  UserOutlined,
  ShoppingCartOutlined,
  AppstoreOutlined,

} from "@ant-design/icons";

const items = [
  {
    key: "item01",
    label: "Quản lý sản phẩm",
    icon: <AppstoreOutlined />,
    href: "/product",
  },
  {
    key: "item02",
    label: "Quản lý người dùng",
    icon: <UserOutlined />,
    href: "/listuser",
  },
  {
    key: "item03",
    label: "Quản lý danh mục",
    icon: <ShoppingCartOutlined />,
    href: "/category",
  },
];

export default function Sidenav() {
  return (
    <Menu theme="light" defaultSelectedKeys={["item01"]} mode="inline">
      {items.map((item) => (
        <Menu.Item key={item.key} icon={item.icon}>
          <Link to={item.href}>{item.label}</Link>
        </Menu.Item>
      ))}
    </Menu>
  );
}
