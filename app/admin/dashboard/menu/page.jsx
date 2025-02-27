"use client";

import React, { useState, useEffect } from "react";
import { useMotionValue } from "framer-motion";
import { useLoading } from "@/components/common/LoadingContext";
import CategoryTabs from "@/components/menu/CategoryTabs";
import MenuCard from "@/components/menu/MenuCard";
import AddItemModal from "@/components/menu/AddItemModal";
import { useMenu } from "@/hooks/useMenu";
import { toast } from "sonner";

const Menu = () => {
  const progress = useMotionValue(0);
  const { setIsLoading } = useLoading();
  const [isAddItemModalOpen, setIsAddItemModalOpen] = useState(false);
  const [isNewCategoryModalOpen, setIsNewCategoryModalOpen] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newItem, setNewItem] = useState({
    title: "",
    price: "",
    description: "",
    image: "",
    category: "",
  });
  const [editingItem, setEditingItem] = useState(null);

  const {
    activeTab,
    setActiveTab,
    tabs,
    currentItems,
    categoryItems,
    addItem,
    deleteItem,
    addCategory,
    editItem,
    deleteCategory,
  } = useMenu(setIsLoading); // Pass setIsLoading to useMenu hook

  const handleAddItem = async (e) => {
    e.preventDefault();
    if (!newItem.category) {
      toast.error("Please select a category");
      return;
    }

    setIsLoading(true);
    toast.promise(
      addItem({ ...newItem, onProgress: (p) => progress.set(p) })
        .then(() => {
          setIsAddItemModalOpen(false);
          setNewItem({
            title: "",
            price: "",
            description: "",
            image: "",
            category: "",
          });
        })
        .finally(() => setIsLoading(false)),
      {
        loading: "Saving menu item...",
        success: "Menu item added successfully",
        error: "Failed to add menu item",
      }
    );
  };

  const handleEditItem = async (e) => {
    e.preventDefault();
    if (!newItem.category) {
      toast.error("Please select a category");
      return;
    }

    setIsLoading(true);
    toast.promise(
      editItem(editingItem.menu_item_id, {
        ...newItem,
        onProgress: (p) => progress.set(p),
      })
        .then(() => {
          setIsAddItemModalOpen(false);
          setEditingItem(null);
          setNewItem({
            title: "",
            price: "",
            description: "",
            image: "",
            category: "",
          });
        })
        .finally(() => setIsLoading(false)),
      {
        loading: "Updating menu item...",
        success: "Menu item updated successfully",
        error: "Failed to update menu item",
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
      imageUrl: item.menu_item_image,
    });
    setIsAddItemModalOpen(true);
  };

  const handleAddCategory = async () => {
    if (!newCategoryName.trim()) {
      toast.error("Category name cannot be empty");
      return;
    }

    setIsLoading(true);
    toast.promise(
      addCategory(newCategoryName)
        .then(() => {
          setNewCategoryName("");
          setIsNewCategoryModalOpen(false);
        })
        .finally(() => setIsLoading(false)),
      {
        loading: "Adding category...",
        success: "Category added successfully",
        error: "Failed to add category",
      }
    );
  };

  const handleDeleteCategory = async (categoryId, categoryName) => {
    if (categoryName === "All") return;

    if (
      confirm(
        `Are you sure you want to delete the category "${categoryName}"? All items under this category will be deleted.`
      )
    ) {
      setIsLoading(true);
      toast.promise(
        deleteCategory(categoryId).finally(() => setIsLoading(false)),
        {
          loading: "Deleting category...",
          success: "Category deleted successfully",
          error: "Failed to delete category",
        }
      );
    }
  };

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header section */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
            Menu Management
          </h1>
          <button
            onClick={() => setIsNewCategoryModalOpen(true)}
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
            New Category
          </button>
        </div>

        <div className="mb-8">
          <div className="flex flex-wrap gap-2">
            {tabs.map((tab) => {
              const category = categoryItems.find(
                (cat) => cat.category_name === tab
              );
              return (
                <div key={tab} className="relative group">
                  <button
                    className={`px-4 py-2 ${
                      activeTab === tab
                        ? "bg-blue-500 text-white"
                        : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                    } rounded-lg transition-colors duration-200`}
                    onClick={() => setActiveTab(tab)}
                  >
                    {tab}
                  </button>
                  {tab !== "All" && (
                    <button
                      onClick={() =>
                        handleDeleteCategory(category.category_id, tab)
                      }
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                    >
                      <svg
                        className="w-3 h-3"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {/* Add New Item Card */}
          <div
            onClick={() => setIsAddItemModalOpen(true)}
            className="group relative bg-white rounded-2xl shadow-sm hover:shadow-lg p-6 border-2 border-dashed border-gray-300 hover:border-blue-500 transition-all duration-200 cursor-pointer flex flex-col items-center justify-center min-h-[350px]"
          >
            <div className="rounded-full bg-indigo-100 p-4 group-hover:bg-indigo-200 transition-colors duration-200">
              <svg
                className="w-8 h-8 text-blue-600"
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
            </div>
            <p className="mt-4 text-lg font-medium text-gray-900">
              Add New Item
            </p>
            <p className="mt-1 text-sm text-gray-500">
              Click to add a new menu item
            </p>
          </div>

          {currentItems.map((item) => (
            <MenuCard
              key={item.menu_item_id}
              item={item}
              onEdit={() => handleStartEdit(item)}
              onDelete={() =>
                toast.promise(deleteItem(item.menu_item_id), {
                  loading: "Deleting item...",
                  success: "Item deleted successfully",
                  error: "Failed to delete item",
                })
              }
            />
          ))}
        </div>
      </div>

      <AddItemModal
        isOpen={isAddItemModalOpen}
        onClose={() => {
          setIsAddItemModalOpen(false);
          setEditingItem(null);
          setNewItem({
            title: "",
            price: "",
            description: "",
            image: "",
            category: "",
          });
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
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Create New Category
            </h2>
            <input
              type="text"
              className="w-full p-4 border border-gray-300 rounded-xl mb-6 focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm text-gray-900 placeholder-gray-400"
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
                className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 shadow-sm transition-colors duration-200"
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
