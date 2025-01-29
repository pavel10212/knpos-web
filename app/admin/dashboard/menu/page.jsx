"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useMotionValue } from "framer-motion";
import CategoryTabs from "@/components/menu/CategoryTabs";
import MenuCard from "@/components/menu/MenuCard";
import AddItemModal from "@/components/menu/AddItemModal";
import { S3 } from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";

const getUniqueCategories = (menuItems) => {
  const allCategories = Object.values(menuItems)
    .flat()
    .map((item) => item.category);

  return ["All", ...new Set(allCategories)];
};

const Menu = () => {
  const [menuItems, setMenuItems] = useState({});
  const [file, setFile] = useState(null);
  const [upload, setUpload] = useState(null);
  const progress = useMotionValue(0);

  const verifyAwsConfig = useCallback(() => {
    const config = {
      accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY,
      region: process.env.NEXT_PUBLIC_AWS_REGION,
      bucketName: process.env.NEXT_PUBLIC_BUCKET_NAME
    };

    const missingVars = Object.entries(config)
      .filter(([_, value]) => !value)
      .map(([key]) => key);

    if (missingVars.length > 0) {
      console.error('Missing AWS configuration:', missingVars);
      throw new Error(`Missing AWS configuration: ${missingVars.join(', ')}`);
    }

    return config;
  }, []);

  const fetchData = useCallback(async () => {
    try {
      const cachedData = sessionStorage.getItem("menuData");
      if (!cachedData) {
        const response = await fetch(
          `http://${process.env.NEXT_PUBLIC_IP}:3000/menu-get`
        );
        const data = await response.json();

        // Get just the menuItems array from the response
        const items = data.menuItems || [];

        // Group items by category
        const groupedData = items.reduce((acc, item) => {
          const category = item.category || 'Uncategorized';
          if (!acc[category]) {
            acc[category] = [];
          }
          // Add item without modifying the image URL
          acc[category].push(item);
          return acc;
        }, {});

        console.log('Grouped menu data:', groupedData);
        setMenuItems(groupedData);
        sessionStorage.setItem("menuData", JSON.stringify(groupedData));
      } else {
        setMenuItems(JSON.parse(cachedData));
      }
    } catch (error) {
      console.error("Error fetching menu data:", error);
      setMenuItems({});
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    return upload?.abort();
  }, [upload]);

  useEffect(() => {
    progress.set(0);
    setUpload(null);
  }, [file]);

  const handleFileChange = useCallback((e) => {
    e.preventDefault();
    setFile(e.target.files[0]);
  }, []);

  const handleUpload = useCallback(async (file) => {
    if (!file) {
      console.error('No file provided for upload');
      return null;
    }

    try {
      const config = verifyAwsConfig();

      const s3Client = new S3({
        credentials: {
          accessKeyId: config.accessKeyId,
          secretAccessKey: config.secretAccessKey,
        },
        region: config.region
      });

      const upload = new Upload({
        client: s3Client,
        params: {
          Bucket: config.bucketName,
          Key: `menu-items/${Date.now()}-${file.name}`,
          Body: file,
          ContentType: file.type,
        }
      });

      upload.on("httpUploadProgress", (p) => {
        console.log('Upload progress:', Math.round((p.loaded / p.total) * 100));
        progress.set(p.loaded / p.total);
      });

      const result = await upload.done();
      console.log('Upload successful:', result.Location);
      return result.Location;
    } catch (err) {
      console.error('Upload error:', err);
      alert(`Failed to upload image: ${err.message}`);
      return null;
    }
  }, [verifyAwsConfig]);

  const tabs = useMemo(() => getUniqueCategories(menuItems), [menuItems]);
  const [activeTab, setActiveTab] = useState("All");

  const [isAddItemModalOpen, setIsAddItemModalOpen] = useState(false);

  const [newItem, setNewItem] = useState({
    title: "",
    price: "",
    description: "",
    image: "",
    category: "",
  });

  const handleAddItem = useCallback(async (e) => {
    e.preventDefault();

    try {
      if (!newItem.image) {
        alert('Please select an image');
        return;
      }

      const imageUrl = await handleUpload(newItem.image);
      if (!imageUrl) {
        throw new Error('Failed to upload image');
      }

      // Ensure we're sending a plain URL string
      const menuItemData = {
        menu_item_name: newItem.title,
        price: newItem.price,
        description: newItem.description,
        category: newItem.category || activeTab,
        menu_item_image: imageUrl.toString() // Ensure it's a string
      };
      console.log('Sending data:', menuItemData); // Debug log
      const response = await fetch(
        `http://${process.env.NEXT_PUBLIC_IP}:3000/menu-insert`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(menuItemData),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to add item");
      }

      const [addedItem] = await response.json(); // Destructure first item from array
      console.log('Received response:', addedItem); // Debug log

      // Update the menuItems state properly
      setMenuItems((prevItems) => {
        const category = menuItemData.category;
        const newState = { ...prevItems };

        if (!newState[category]) {
          newState[category] = [];
        }

        // Make sure we're storing the plain URL
        const newItemEntry = {
          id: addedItem.menu_item_id, // Change this line
          menu_item_id: addedItem.menu_item_id,
          menu_item_name: menuItemData.menu_item_name,
          menu_item_image: menuItemData.menu_item_image, // Store the plain URL
          description: menuItemData.description,
          price: menuItemData.price,
          category: menuItemData.category,
        };

        newState[category] = [...(newState[category] || []), newItemEntry];

        // Store in session storage
        sessionStorage.setItem("menuData", JSON.stringify(newState));
        return newState;
      });

      // Reset form
      setNewItem({
        title: "",
        price: "",
        description: "",
        image: "",
        category: "",
      });
      setIsAddItemModalOpen(false);
      setFile(null);

    } catch (error) {
      console.error("Error adding menu item:", error);
    }
  }, [newItem, activeTab, handleUpload]);

  const handleDeleteItem = useCallback(async (itemId) => {
    try {
      const response = await fetch(
        `http://${process.env.NEXT_PUBLIC_IP}:3000/menu-delete/${itemId}`,
        { method: 'DELETE' }
      );

      if (!response.ok) throw new Error('Failed to delete item');

      setMenuItems((prevItems) => {
        const newState = { ...prevItems };
        Object.keys(newState).forEach((category) => {
          newState[category] = newState[category].filter(
            (item) => item.menu_item_id !== itemId
          );
        });
        sessionStorage.setItem("menuData", JSON.stringify(newState));
        return newState;
      });
    } catch (error) {
      console.error('Error deleting item:', error);
      alert('Failed to delete item');
    }
  }, []);

  const currentItems = useMemo(() => 
    Object.values(menuItems)
      .flat()
      .filter(
        (item) => activeTab === "All" || !activeTab || item.category === activeTab
      ), [menuItems, activeTab]
  );

  const isEmpty = useMemo(() => !currentItems || currentItems.length === 0, [currentItems]);

  const handleFirstItemAdd = useCallback(() => {
    // Open add item modal directly instead of category modal
    setNewItem({
      title: "",
      price: "",
      description: "",
      image: "",
      category: "" // Allow user to enter category directly
    });
    setIsAddItemModalOpen(true);
  }, []);

  // Add new category functionality
  const [newCategoryName, setNewCategoryName] = useState("");

  const handleAddCategory = useCallback(async () => {
    if (!newCategoryName.trim()) {
      alert('Please enter a category name');
      return;
    }

    try {
      // Add category to database
      const response = await fetch(
        `http://${process.env.NEXT_PUBLIC_IP}:3000/category-insert`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ category_name: newCategoryName }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to add category");
      }

      setActiveTab(newCategoryName);
      setIsNewCategoryModalOpen(false);
      setIsAddItemModalOpen(true); // Open add item modal after category is created
      setNewItem(prev => ({
        ...prev,
        category: newCategoryName
      }));
    } catch (error) {
      console.error("Error adding category:", error);
      alert("Failed to add category");
    }
  }, [newCategoryName]);

  const [isNewCategoryModalOpen, setIsNewCategoryModalOpen] = useState(false);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Menu</h1>

      {isEmpty ? (
        <div className="flex flex-col items-center justify-center h-[60vh]">
          <p className="text-gray-500 mb-4">Your menu is empty</p>
          <button
            onClick={handleFirstItemAdd}
            className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200 flex items-center gap-2"
          >
            <span>+</span> Add Menu Item
          </button>
        </div>
      ) : (
        // Show existing menu UI when not empty
        <>
          <div className="flex items-center space-x-2 mb-6">
            <div className="flex-grow flex items-center">
              <CategoryTabs
                tabs={tabs}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
              />
            </div>
            <button
              onClick={() => setIsNewCategoryModalOpen(true)}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200 flex items-center"
            >
              <span className="mr-2">+</span> New Category
            </button>
          </div>

          <div className="grid grid-cols-4 gap-4">
            {/* Always show the add button, regardless of active tab */}
            <div
              className="flex items-center justify-center border-2 border-dashed border-gray-400 rounded-lg h-72 hover:bg-gray-100 cursor-pointer bg-gray-50"
              onClick={() => {
                setNewItem((prev) => ({
                  ...prev,
                  category: activeTab === "All" ? "" : activeTab,
                }));
                setIsAddItemModalOpen(true);
              }}
            >
              <span className="text-4xl font-light text-gray-600">+</span>
            </div>

            {Array.isArray(currentItems) &&
              currentItems.map((item) => (
                <MenuCard
                  key={item.menu_item_id}
                  item={{
                    id: item.menu_item_id,
                    menu_item_name: item.menu_item_name,
                    menu_item_image: item.menu_item_image,
                    description: item.description,
                    price: item.price,
                    category: item.category,
                  }}
                  onDelete={handleDeleteItem}
                />
              ))}
          </div>
        </>
      )}

      <AddItemModal
        isOpen={isAddItemModalOpen}
        onClose={() => setIsAddItemModalOpen(false)}
        onSubmit={handleAddItem}
        newItem={newItem}
        setNewItem={setNewItem}
        activeTab={activeTab}
        progress={progress}
      />

      {/* Update Category Modal */}
      {isNewCategoryModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-6">Add New Category</h2>
            <input
              type="text"
              className="w-full p-2 border rounded mb-4"
              placeholder="Category Name"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => {
                  setNewCategoryName("");
                  setIsNewCategoryModalOpen(false);
                }}
                className="px-4 py-2 bg-gray-200 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleAddCategory}
                className="px-4 py-2 bg-blue-500 text-white rounded"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default React.memo(Menu);
