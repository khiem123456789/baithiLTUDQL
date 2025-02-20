import React, { useEffect, useState } from "react";
import { Table, Button, Space, Input, Modal, TableColumnType,message  } from "antd";
import { Category, fetchCategories, createCategory, updateCategory, deleteCategory } from "../api/category.api";

const CategoryPage: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentCategory, setCurrentCategory] = useState<Partial<Category>>({ name: "" });
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);

  const CategoryTableColumnsType: TableColumnType<Category>[] = [
    {
      title: "Mã danh mục",
      dataIndex: "id",
      key: "id",
      width: 100,
    },
    {
      title: "Tên danh mục",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Hành động",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Button onClick={() => handleEdit(record)}>Sửa</Button>
          <Button danger onClick={() => showDeleteModal(record)}>Xóa</Button>
        </Space>
      ),
    },
  ];

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    setLoading(true);
    try {
      const data = await fetchCategories();
      setCategories(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Lỗi khi lấy danh mục:", error);
    }
    setLoading(false);
  };

  const handleSave = async () => {
    if (currentCategory.id) {
      await updateCategory(currentCategory.id, { name: currentCategory.name! });
    } else {
      await createCategory({ name: currentCategory.name! });
    }
    setIsModalOpen(false);
    loadCategories();
  };

  const handleEdit = (category: Category) => {
    setCurrentCategory(category);
    setIsModalOpen(true);
  };

  const showDeleteModal = (category: Category) => {
    setCategoryToDelete(category);
    setIsDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    if (categoryToDelete) {
      try {
        await deleteCategory(categoryToDelete.id);
        message.success("Xóa danh mục thành công!");
        setIsDeleteModalOpen(false);
        loadCategories();
      } catch (error: any) {
        console.error("Lỗi khi xóa danh mục:", error);
        if (error.response?.status === 400) {
          message.error(error.response.data.message);
        } else {
          message.error("Không thể xóa danh mục này. Danh mục đang được sử dụng ở nơi khác.");
        }
      }
    }
  };

  return (
    <div>
      <Button type="primary" onClick={() => setIsModalOpen(true)}>
        Thêm danh mục
      </Button>
      <Table
        dataSource={categories}
        loading={loading}
        rowKey="id"
        columns={CategoryTableColumnsType}
      />
      
      {/* Modal thêm/sửa danh mục */}
      <Modal
        title={currentCategory.id ? "Chỉnh sửa danh mục" : "Thêm danh mục"}
        open={isModalOpen}
        onOk={handleSave}
        onCancel={() => setIsModalOpen(false)}
      >
        <Input
          placeholder="Nhập tên danh mục"
          value={currentCategory.name}
          onChange={(e) => setCurrentCategory({ ...currentCategory, name: e.target.value })}
        />
      </Modal>

      {/* Modal xác nhận xóa */}
      <Modal
        title="Xác nhận xóa"
        open={isDeleteModalOpen}
        onOk={handleDelete}
        onCancel={() => setIsDeleteModalOpen(false)}
        okText="Xóa"
        okButtonProps={{ danger: true }}
      >
        <p>Bạn có chắc chắn muốn xóa danh mục <b>{categoryToDelete?.name}</b> không?</p>
      </Modal>
    </div>
  );
};

export default CategoryPage;
