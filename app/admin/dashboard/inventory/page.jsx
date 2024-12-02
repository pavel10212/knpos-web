"use client";
import React, { useState } from "react";
import InventoryTable from "@/components/inventory/InventoryTable";
import AddProductModal from "@/components/inventory/AddProductModal";
import EditStockModal from "@/components/inventory/EditStockModal";
const sampleData = [
  {
    id: "P001",
    product: "Coca-Cola",
    category: "Drinks",
    channel: "Store Front",
    stock: 150,
    maxCapacity: 200,
  },
  {
    id: "P002",
    product: "Sprite",
    category: "Drinks",
    channel: "Vending Machine",
    stock: 85,
    maxCapacity: 200,
  },
  {
    id: "P003",
    product: "Salted Peanuts",
    category: "Snacks",
    channel: "Store Front",
    stock: 200,
    maxCapacity: 200,
  },
  {
    id: "P004",
    product: "Mixed Nuts",
    category: "Snacks",
    channel: "Vending Machine",
    stock: 45,
    maxCapacity: 200,
  },
];

const Inventory = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [newProduct, setNewProduct] = useState({
    id: "",
    product: "",
    category: "",
    channel: "",
    stock: "",
    maxCapacity: "",
  });
  const [editStock, setEditStock] = useState("");

  const handleDelete = (productId) => {
    console.log("Deleting product:", productId);
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    console.log(
      "Updating stock for product:",
      selectedProduct.id,
      "New stock:",
      editStock
    );
    setIsEditModalOpen(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("New product:", newProduct);
    setIsModalOpen(false);
  };

  const handleEdit = (product) => {
    setSelectedProduct(product);
    setEditStock(product.stock.toString());
    setIsEditModalOpen(true);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Inventory Report</h1>
        <button
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors duration-200"
          onClick={() => setIsModalOpen(true)}
        >
          + New Product
        </button>
      </div>

      <AddProductModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
        newProduct={newProduct}
        setNewProduct={setNewProduct}
      />

      <EditStockModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSubmit={handleEditSubmit}
        selectedProduct={selectedProduct}
        editStock={editStock}
        setEditStock={setEditStock}
      />

      <InventoryTable
        data={sampleData}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default Inventory;
