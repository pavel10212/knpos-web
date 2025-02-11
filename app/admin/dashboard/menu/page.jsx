"use client";

import React, { useState, useEffect } from "react";
import { useMotionValue } from "framer-motion";
import CategoryTabs from "@/components/menu/CategoryTabs";
import MenuCard from "@/components/menu/MenuCard";
import AddItemModal from "@/components/menu/AddItemModal";
import { useMenu } from "@/hooks/useMenu";
import { toast } from "sonner";
import LoadingSpinner from "@/components/common/LoadingSpinner";

const Menu = () => {
  const progress = useMotionValue(0);
  const [isAddItemModalOpen, setIsAddItemModalOpen] = useState(false);
  const [isNewCategoryModalOpen, setIsNewCategoryModalOpen] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newItem, setNewItem] = useState({
    title: "", price: "", description: "", image: "", category: ""
  });
  const [editingItem, setEditingItem] = useState(null);

  const {
    loading,
    activeTab,
    setActiveTab,
    tabs,
    currentItems,
    categoryItems,
    addItem,
    deleteItem,
    addCategory,
    editItem
  } = useMenu();

  const handleAddItem = async (e) => {
    e.preventDefault();
    if (!newItem.category) {
      toast.error('Please select a category');
      return;
    }

    toast.promise(
      addItem({ ...newItem, onProgress: (p) => progress.set(p) })
        .then(() => {
          setIsAddItemModalOpen(false);
          setNewItem({ title: "", price: "", description: "", image: "", category: "" });
        }),
      {
        loading: 'Saving menu item...',
        success: 'Menu item added successfully',
        error: 'Failed to add menu item'
      }
    );
  };

  const handleEditItem = async (e) => {
    e.preventDefault();
    if (!newItem.category) {
      toast.error('Please select a category');
      return;
    }

    toast.promise(
      editItem(editingItem.menu_item_id, { 
        ...newItem,
        onProgress: (p) => progress.set(p) 
      })
        .then(() => {
          setIsAddItemModalOpen(false);
          setEditingItem(null);
          setNewItem({ title: "", price: "", description: "", image: "", category: "" });
        }),
      {
        loading: 'Updating menu item...',
        success: 'Menu item updated successfully',
        error: 'Failed to update menu item'
      }
    );
  };

  const handleStartEdit = (item) => {
    setEditingItem(item);
    setNewItem({
      title: item.menu_item_name,
      price: item.price.toString(),
      description: item.description,
      category: item.category_id.toString(),
      imageUrl: item.menu_item_image
    });
    setIsAddItemModalOpen(true);
  };

  const handleAddCategory = async () => {
    if (!newCategoryName.trim()) {
      toast.error('Category name cannot be empty');
      return;
    }

    toast.promise(
      addCategory(newCategoryName).then(() => {
        setNewCategoryName("");
        setIsNewCategoryModalOpen(false);
      }),
      {
        loading: 'Adding category...',
        success: 'Category added successfully',
        error: 'Failed to add category'
      }
    );
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header section */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
            Menu Management
          </h1>
          <button
            onClick={() => setIsNewCategoryModalOpen(true)}
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-full shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            New Category
          </button>
        </div>

        <div className="mb-8">
          <CategoryTabs
            tabs={tabs}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {/* Add New Item Card */}
          <div
            onClick={() => setIsAddItemModalOpen(true)}
            className="group relative bg-white rounded-2xl shadow-sm hover:shadow-lg p-6 border-2 border-dashed border-gray-300 hover:border-indigo-500 transition-all duration-200 cursor-pointer flex flex-col items-center justify-center min-h-[350px]"
          >
            <div className="rounded-full bg-indigo-100 p-4 group-hover:bg-indigo-200 transition-colors duration-200">
              <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
            <p className="mt-4 text-lg font-medium text-gray-900">Add New Item</p>
            <p className="mt-1 text-sm text-gray-500">Click to add a new menu item</p>
          </div>

          {currentItems.map((item) => (
            <MenuCard
              key={item.menu_item_id}
              item={item}
              onEdit={() => handleStartEdit(item)}
              onDelete={() => toast.promise(
                deleteItem(item.menu_item_id),
                {
                  loading: 'Deleting item...',
                  success: 'Item deleted successfully',
                  error: 'Failed to delete item'
                }
              )}
            />
          ))}
        </div>
      </div>

      <AddItemModal
        isOpen={isAddItemModalOpen}
        onClose={() => {
          setIsAddItemModalOpen(false);
          setEditingItem(null);
          setNewItem({ title: "", price: "", description: "", image: "", category: "" });
        }}
        onSubmit={editingItem ? handleEditItem : handleAddItem}
        isEditing={!!editingItem}
        categories={categoryItems}
        newItem={newItem}
        setNewItem={setNewItem}
        progress={progress}
      />

      {/* New Category Modal */}
      {isNewCategoryModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-8 w-full max-w-md shadow-xl transform transition-all">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Create New Category</h2>
            <input
              type="text"
              className="w-full p-4 border border-gray-300 rounded-xl mb-6 focus:ring-2 focus:ring-indigo-500 focus:border-transparent shadow-sm text-gray-900 placeholder-gray-400"
              placeholder="Enter category name..."
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
            />
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setIsNewCategoryModalOpen(false)}
                className="px-6 py-3 text-gray-700 hover:bg-gray-100 rounded-xl transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                onClick={handleAddCategory}
                className="px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 shadow-sm transition-colors duration-200"
              >
                Create Category
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default React.memo(Menu);