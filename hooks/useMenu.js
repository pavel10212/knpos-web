import {useState, useCallback, useMemo, useEffect} from "react";
import {toast} from "sonner";
import {
    fetchCategoryData,
    insertCategory,
    insertMenuItem,
    deleteMenuItem,
    updateMenuItem,
    deleteCategory, fetchAdminMenuData,
} from "@/services/dataService";
import {uploadFile} from "@/services/uploadService";

export const useMenu = () => {
    const [menuItems, setMenuItems] = useState([]);
    const [categoryItems, setCategoryItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("All");

    const fetchData = useCallback(async () => {
        try {
            setLoading(true);
            const [menuData, categoryData] = await Promise.all([
                fetchAdminMenuData(),
                fetchCategoryData(),
            ]);

            if (!menuData || !categoryData) {
                throw new Error("No data received");
            }

            setMenuItems(menuData);
            setCategoryItems(categoryData);
        } catch (error) {
            console.error("Data fetch error:", error);
            toast.error("Failed to load menu data");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const addItem = useCallback(async (newItem) => {
        try {
            const imageUrl = await uploadFile(newItem.image, newItem.onProgress);
            const menuItem = await insertMenuItem({...newItem, imageUrl});
            setMenuItems((prev) => [...prev, menuItem[0]]);
            return menuItem[0];
        } catch (error) {
            throw new Error("Failed to add item");
        }
    }, []);

    const deleteItem = useCallback(async (itemId) => {
        await deleteMenuItem(itemId);
        setMenuItems((prev) => prev.filter((item) => item.menu_item_id !== itemId));
    }, []);

    const editItem = useCallback(async (itemId, updatedItem) => {
        try {
            let imageUrl = updatedItem.imageUrl;

            // If there's a new image, upload it
            if (updatedItem.image instanceof File) {
                imageUrl = await uploadFile(updatedItem.image, updatedItem.onProgress);
            }

            const menuItem = await updateMenuItem({
                ...updatedItem,
                id: itemId,
                imageUrl,
            });

            setMenuItems((prev) =>
                prev.map((item) => (item.menu_item_id === itemId ? menuItem : item))
            );

            return menuItem;
        } catch (error) {
            throw new Error("Failed to update item");
        }
    }, []);

    const addCategory = useCallback(async (categoryName) => {
        try {
            const result = await insertCategory(categoryName);
            if (result && result[0]) {
                setCategoryItems((prev) => [...prev, result[0]]);
                setActiveTab(categoryName);
            }
        } catch (error) {
            console.error("Error adding category:", error);
            toast.error("Failed to add category");
        }
    }, []);

    const handleDeleteCategory = useCallback(async (categoryId) => {
        try {
            const result = await deleteCategory(categoryId);
            if (result) {
                setCategoryItems((prev) =>
                    prev.filter((cat) => cat.category_id !== categoryId)
                );
                setActiveTab("All");
                return true;
            }
            throw new Error("Failed to delete category");
        } catch (error) {
            console.error("Error deleting category:", error);
            throw error;
        }
    }, []);

    const tabs = useMemo(() => {
        const categoryNames = categoryItems.map((cat) => cat.category_name);
        return ["All", ...categoryNames];
    }, [categoryItems]);

    const currentItems = useMemo(() => {
        if (activeTab === "All") return menuItems;
        const categoryId = categoryItems.find(
            (cat) => cat.category_name === activeTab
        )?.category_id;
        return menuItems.filter((item) => item.category_id === categoryId);
    }, [menuItems, activeTab, categoryItems]);

    return {
        menuItems,
        categoryItems,
        loading,
        activeTab,
        setActiveTab,
        tabs,
        currentItems,
        addItem,
        deleteItem,
        addCategory,
        editItem,
        deleteCategory: handleDeleteCategory,
    };
};
