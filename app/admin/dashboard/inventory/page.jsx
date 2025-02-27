"use client";
import React, { useEffect, useState } from "react";
import InventoryTable from "@/components/inventory/InventoryTable";
import AddProductModal from "@/components/inventory/AddProductModal";
import EditStockModal from "@/components/inventory/EditStockModal";
import DeleteConfirmationModal from "@/components/inventory/DeleteConfirmationModal";
import AddStockModal from "@/components/inventory/AddStockModal";
import {
  fetchInventoryData,
  createInventoryItem,
  updateInventoryItem,
  deleteInventoryItem,
  addInventoryStock
} from "@/services/dataService";
import { toast } from "sonner";

const Inventory = () => {
  const [inventoryItems, setInventoryItems] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddStockModalOpen, setIsAddStockModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [newProduct, setNewProduct] = useState({
    inventory_item_id: "",
    inventory_item_name: "",
    quantity: "",
    unit: "",
    max_quantity: "",
    cost_per_unit: "",
    category: "",
    sales_channel: "",
  });
  const [editStock, setEditStock] = useState("");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [lowStockFilter, setLowStockFilter] = useState(false);


  console.log("Inventory Items:", inventoryItems);

  // Filter items based on low stock status
  const filteredItems = lowStockFilter
    ? inventoryItems.filter(
      item => (item.quantity / item.max_quantity) * 100 <= 30
    )
    : inventoryItems;

  const loadData = async () => {
    try {
      const data = await fetchInventoryData();
      setInventoryItems(data);
    } catch (error) {
      toast.error("Failed to load inventory data");
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleDeleteClick = (productId) => {
    setProductToDelete(productId);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!productToDelete) return;

    try {
      await deleteInventoryItem(productToDelete);
      setInventoryItems(inventoryItems.filter(
        (item) => item.inventory_item_id !== productToDelete
      ));
      toast.success("Product deleted successfully");
    } catch (error) {
      toast.error("Failed to delete product. Please try again.");
    }

    setIsDeleteModalOpen(false);
    setProductToDelete(null);
  };

  const handleEditClick = (product) => {
    setSelectedProduct(product);
    setEditStock({ ...product });
    setIsEditModalOpen(true);
  };

  const handleAddStockClick = (product) => {
    setSelectedProduct(product);
    setIsAddStockModalOpen(true);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();

    const editPromise = updateInventoryItem(editStock, selectedProduct.inventory_item_id)
      .then((response) => {
        setInventoryItems(inventoryItems.map((item) =>
          item.inventory_item_id === selectedProduct.inventory_item_id
            ? { ...item, ...editStock }
            : item
        ));
        setIsEditModalOpen(false);
        return response;
      });

    toast.promise(editPromise, {
      loading: "Updating product...",
      success: "Product updated successfully",
      error: "Failed to update product"
    });
  };

  const handleAddStock = async (itemId, quantityToAdd) => {
    if (!itemId || quantityToAdd <= 0) return;

    // Create a promise that will be tracked by toast
    const addStockPromise = addInventoryStock(itemId, quantityToAdd)
      .then((response) => {
        setInventoryItems(inventoryItems.map((item) =>
          item.inventory_item_id === itemId
            ? { ...item, quantity: Number(item.quantity) + Number(quantityToAdd) }
            : item
        ));
        setIsAddStockModalOpen(false);
        return response;
      });

    // Use toast.promise correctly - pass the promise directly without awaiting it
    toast.promise(addStockPromise, {
      loading: "Adding stock...",
      success: "Stock added successfully",
      error: "Failed to add stock"
    });

    // Return the promise
    return addStockPromise;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const addProductPromise = createInventoryItem(newProduct)
      .then((addedInventoryItem) => {
        setInventoryItems([
          ...inventoryItems,
          ...addedInventoryItem,
        ]);
        setIsModalOpen(false);
        setNewProduct({
          inventory_item_id: "",
          inventory_item_name: "",
          quantity: "",
          unit: "",
          max_quantity: "",
          cost_per_unit: "",
          category: "",
          sales_channel: "",
        });
        return addedInventoryItem;
      });

    toast.promise(addProductPromise, {
      loading: "Adding new product...",
      success: "Product added successfully",
      error: "Failed to add new product",
    });
  };

  const lowStockCount = inventoryItems.filter(
    item => (item.quantity / item.max_quantity) * 100 <= 30
  ).length;

  return (
    <div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
            Inventory Management
          </h1>
          <div className="flex gap-3">
            <button
              onClick={() => setLowStockFilter(!lowStockFilter)}
              className={`inline-flex items-center px-4 py-2 border text-sm font-medium rounded-full shadow-sm ${lowStockFilter
                ? "bg-amber-100 text-amber-800 border-amber-300"
                : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                }`}
            >
              {lowStockFilter ? "Show All Items" : `Low Stock (${lowStockCount})`}
              {lowStockCount > 0 && !lowStockFilter && (
                <span className="ml-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-100 text-xs font-semibold text-red-800">
                  {lowStockCount}
                </span>
              )}
            </button>
            <button
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-full shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
            >
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
              New Product
            </button>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <InventoryTable
            data={filteredItems}
            onEdit={handleEditClick}
            onDelete={handleDeleteClick}
            onAddStock={handleAddStockClick}
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

      <AddStockModal
        isOpen={isAddStockModalOpen}
        onClose={() => setIsAddStockModalOpen(false)}
        onSubmit={handleAddStock}
        product={selectedProduct}
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
