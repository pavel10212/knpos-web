"use client";

import React, {useEffect, useRef, useState} from "react";
import {useParams} from "next/navigation";
import Head from "next/head";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MenuItemCard from "@/components/MenuItemCard";
import MenuItemModal from "@/components/MenuItemModal";
import {useCartStore, useDataStore} from "@/store/customerStore";
import {fetchCategoryData, fetchMenuData} from "@/services/dataService";
import InventoryItemCard from "@/components/InventoryItemCard";

export default function MenuPage() {
    const [dataItems, setDataItems] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedItem, setSelectedItem] = useState(null);
    const [error, setError] = useState(null);
    const [token, setToken] = useState(null);
    const categoryRefs = useRef({});
    const {addToCart} = useCartStore();
    const params = useParams();
    const setMenuItems = useDataStore((state) => state.setMenuItems);
    const setInventoryItems = useDataStore((state) => state.setInventoryItems);
    const setCategoryItems = useDataStore((state) => state.setCategoryItems);

    useEffect(() => {
        const dirtyToken = params.token;
        const cleanToken = dirtyToken.replace('token%3D', '');
        setToken(cleanToken);
        if (typeof window !== 'undefined') {
            sessionStorage.setItem('token', cleanToken);
        }
    }, [params.token]);


    const fetchData = async () => {
        if (!token) return;

        try {
            const data = await fetchMenuData(token);
            setDataItems(data || []);
            setMenuItems(data.menuItems || []);
            setInventoryItems(data.inventoryItems || []);
        } catch (error) {
            console.error("Error fetching menu data:", error);
            if (typeof window !== 'undefined') {
                sessionStorage.removeItem('token');
            }
            // Always show a friendly message, never show a connection error
            setError("Thank you for dining with us! We hope to see you again soon.");
        }
    };

    const fetchCategories = async () => {
        // Try to get categories from sessionStorage first
        if (typeof window !== 'undefined') {
            const cachedCategories = sessionStorage.getItem('categories');
            if (cachedCategories) {
                const parsedCategories = JSON.parse(cachedCategories);
                setCategories(parsedCategories);
                setCategoryItems(parsedCategories);
                return;
            }
        }

        try {
            const categoryData = await fetchCategoryData();
            setCategories(categoryData);
            setCategoryItems(categoryData);

            // Store in sessionStorage
            if (typeof window !== 'undefined') {
                sessionStorage.setItem('categories', JSON.stringify(categoryData));
            }
        } catch (error) {
            console.error("Error fetching categories:", error);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    useEffect(() => {
        if (token) {
            fetchData();
        }
    }, [token]);

    const handleCategoryClick = (categoryId) => {
        const headerHeight = document.querySelector("header").offsetHeight || 180;
        const categoryElement = categoryRefs.current[categoryId];

        if (categoryElement) {
            const elementPosition = categoryElement.getBoundingClientRect().top;
            const offsetPosition = window.scrollY + elementPosition - headerHeight;

            window.scrollTo({
                top: offsetPosition,
                behavior: "smooth",
            });
        }
    }

    return (
        <>
            {error ? (
                <div className="min-h-screen flex items-center justify-center bg-gray-50">
                    <div className="max-w-md w-full p-6 bg-white rounded-lg shadow-md">
                        <h2 className="text-2xl font-bold text-yellow-600 mb-4">Thank You!</h2>
                        <p className="text-gray-700 mb-4">{error}</p>
                        {error.includes("Thank you for dining with us") ? (
                            <p className="text-gray-600">
                                Your session has ended. We appreciate your business!
                            </p>
                        ) : (
                            <p className="text-gray-600">
                                Please ask your server for a new table link or check your URL.
                            </p>
                        )}
                    </div>
                </div>
            ) : (
                <div className="flex flex-col min-h-screen">
                    <Head>
                        <title>Menu - Restaurant</title>
                        <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
                        <meta name="description" content="View our menu and place orders!"/>
                    </Head>

                    <Header categories={categories} onCategoryClick={handleCategoryClick}/>
                    <main className="container mx-auto p-4 flex-grow pb-20 bg-white">
                        <h1 className="text-2xl font-semibold mb-4 text-center text-gray-800">
                            Choose the best dish for you
                        </h1>

                        <div className="mt-4 space-y-8 pb-4">
                            {categories.map((category) => (
                                <div
                                    key={category.category_id}
                                    ref={(el) => {
                                        if (el && !categoryRefs.current[category.category_id]) {
                                            categoryRefs.current[category.category_id] = el;
                                        }
                                    }}
                                    className="pt-4"
                                >
                                    <h2 className="text-xl font-bold text-gray-800 mb-4">{category.category_name}</h2>
                                    <div className="grid grid-cols-2 gap-4">
                                        {dataItems?.menuItems?.filter((item) => item.category_id === category.category_id)
                                            .map((item) => (
                                                <MenuItemCard
                                                    key={item.menu_item_id}
                                                    {...item}
                                                    item={item}
                                                    onClick={() => setSelectedItem(item)}
                                                />
                                            ))}
                                        {category.category_name.toLowerCase() === 'beverages' &&
                                            dataItems?.inventoryItems?.map((item) => (
                                                <InventoryItemCard
                                                    key={item.inventory_item_id}
                                                    name={item.inventory_item_name}
                                                    price={item.cost_per_unit}
                                                    onClick={() => setSelectedItem({
                                                        menu_item_id: `inventory-${item.inventory_item_id}`,
                                                        menu_item_name: item.inventory_item_name,
                                                        price: item.cost_per_unit,
                                                        isInventoryItem: true,
                                                        inventory_item_name: item.inventory_item_name,
                                                        cost_per_unit: item.cost_per_unit
                                                    })}
                                                />
                                            ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </main>

                    <Footer token={token}/>

                    {selectedItem && (
                        <MenuItemModal
                            item={selectedItem}
                            onClose={() => setSelectedItem(null)}
                            onAddToCart={addToCart}
                            isInventoryItem={selectedItem.menu_item_id?.toString().startsWith('inventory-')}
                        />
                    )}
                </div>
            )}
        </>
    );
}


