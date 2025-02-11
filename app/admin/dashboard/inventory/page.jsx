"use client";
import React, { useEffect, useState } from "react";
import InventoryTable from "@/components/inventory/InventoryTable";
import AddProductModal from "@/components/inventory/AddProductModal";
import EditStockModal from "@/components/inventory/EditStockModal";
import DeleteConfirmationModal from "@/components/inventory/DeleteConfirmationModal";
import { fetchInventoryData } from '@/services/dataService';
import { toast } from "sonner";

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
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);

  console.log(inventoryItems)

  const loadData = async () => {
    try {
      const data = await fetchInventoryData();
      setInventoryItems(data);
    } catch (error) {
      toast.error('Failed to load inventory data');
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const handleDeleteClick = (productId) => {
    setProductToDelete(productId);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!productToDelete) return;

    const updatedInventoryItems = inventoryItems.filter((item) => item.inventory_item_id !== productToDelete);
    const previousItems = [...inventoryItems];
    setInventoryItems(updatedInventoryItems);
    sessionStorage.setItem('inventoryData', JSON.stringify(updatedInventoryItems));
    setIsDeleteModalOpen(false);
    setProductToDelete(null);

    try {
      const response = await fetch(`http://${process.env.NEXT_PUBLIC_IP}:3000/inventory-delete`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id: productToDelete })
      });

      if (!response.ok) {
        throw new Error('Failed to delete product');
      }
      toast.success('Product deleted successfully');
    } catch (error) {
      console.error('Error deleting product:', error);
      setInventoryItems(previousItems);
      sessionStorage.setItem('inventoryData', JSON.stringify(previousItems));
      toast.error('Failed to delete product. Please try again.');
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://${process.env.NEXT_PUBLIC_IP}:3000/inventory-update`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...editStock,
          inventory_item_id: selectedProduct.inventory_item_id
        })
      });

      if (!response.ok) {
        throw new Error('Failed to update product');
      }

      const updatedInventoryItems = inventoryItems.map((item) =>
        item.inventory_item_id === selectedProduct.inventory_item_id ? editStock : item
      );
      setInventoryItems(updatedInventoryItems);
      sessionStorage.setItem('inventoryData', JSON.stringify(updatedInventoryItems));
      setIsEditModalOpen(false);
      toast.success('Product updated successfully');
    } catch (error) {
      console.error('Error updating product:', error);
      toast.error('Failed to update product');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const addProductPromise = new Promise(async (resolve, reject) => {
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
        sessionStorage.setItem('inventoryData', JSON.stringify(updatedInventoryItems));
        setIsModalOpen(false);

        resolve(addedInventoryItem);
      } catch (error) {
        reject(error);
      }
    });

    toast.promise(addProductPromise, {
      loading: 'Adding new product...',
      success: 'Product added successfully',
      error: 'Failed to add new product'
    });

    return addProductPromise;
  };

  const handleEdit = (product) => {
    setSelectedProduct(product);
    setEditStock(product);
    setIsEditModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
            Inventory Management
          </h1>
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-full shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            New Product
          </button>
        </div>

        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <InventoryTable
            data={inventoryItems}
            onEdit={handleEdit}
            onDelete={handleDeleteClick}
          />
        </div>
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

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
};

export default Inventory;
