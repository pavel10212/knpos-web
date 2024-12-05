"use client";
import React, { useEffect, useState } from "react";
import InventoryTable from "@/components/inventory/InventoryTable";
import AddProductModal from "@/components/inventory/AddProductModal";
import EditStockModal from "@/components/inventory/EditStockModal";

const Inventory = () => {
  const [inventoryItems, setInventoryItems] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [newProduct, setNewProduct] = useState({
    inventory_item_id: '',
    inventory_item_name: '',
    quantity: '',
    unit: '',
    max_quantity: '',
    cost_per_unit: '',
    category: '',
    sales_channel: ''
  });
  const [editStock, setEditStock] = useState("");


  console.log(inventoryItems)



  const loadData = async () => {
    try {
      const cachedData = localStorage.getItem('inventoryData')
      if (!cachedData) {
        try {
          console.log('No cache, fetching from server');
          const response = await fetch(`http://${process.env.NEXT_PUBLIC_IP}:3000/inventory-get`);
          const data = await response.json();
          setInventoryItems(data);
          localStorage.setItem('inventoryData', JSON.stringify(data));
        } catch (error) {
          console.log("Could not fetch from server")
        }
      } else {
        console.log("Cache found, using that")
        setInventoryItems(JSON.parse(cachedData));
      }
    } catch (error) {
      console.log("Error fetching menu data: ", error);
    }
  }


  useEffect(() => {
    loadData()
  }, [])



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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://${process.env.NEXT_PUBLIC_IP}:3000/inventory-insert`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newProduct)
      });

      if (!response.ok) {
        throw new Error('Failed to insert product');
      }
      const addedInventoryItem = await response.json();

      const updatedInventoryItems = [...inventoryItems, ...addedInventoryItem];
      setInventoryItems(updatedInventoryItems);
      localStorage.setItem('inventoryData', JSON.stringify(updatedInventoryItems));

      setIsModalOpen();
      return addedInventoryItem;
    } catch (error) {
      console.error('Error inserting product:', error);
    }
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
        data={inventoryItems}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default Inventory;
