"use client";

import React, { useState, useEffect } from "react";
import { useLoading } from "@/components/common/LoadingContext";
import { fetchAdminSettings, updateAdminSettings, createAdminSettings } from "@/services/dataService";
import { toast } from "sonner";

const Settings = () => {
  const { setIsLoading } = useLoading();
  const [settings, setSettings] = useState({
    admin_password: "",
    vat_percentage: "7",
    service_charge_percentage: "10",
    restaurant_name: "My Restaurant",
    restaurant_address: "",
    restaurant_phone: "",
    restaurant_email: "",
  });
  const [confirmPassword, setConfirmPassword] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [isPasswordChange, setIsPasswordChange] = useState(false);
  const [hasInitialSettings, setHasInitialSettings] = useState(false);

  useEffect(() => {
    const loadSettings = async () => {
      setIsLoading(true);
      try {
        const data = await fetchAdminSettings();
        
        if (data && data.length > 0) {
          const settingsObj = {};
          data.forEach(setting => {
            settingsObj[setting.setting_key] = setting.setting_value;
          });
          setSettings(prevSettings => ({
            ...prevSettings,
            ...settingsObj
          }));
          setHasInitialSettings(true);
        }
      } catch (error) {
        console.error("Failed to load settings:", error);
        toast.error(`Failed to load settings: ${error.message}`);
      } finally {
        setIsLoading(false);
      }
    };

    loadSettings();
  }, [setIsLoading]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSettings(prevSettings => ({
      ...prevSettings,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Validate password match if changing password
      if (isPasswordChange) {
        if (settings.admin_password !== confirmPassword) {
          toast.error("Passwords do not match");
          return;
        }
      }

      // Format settings for API
      const settingsArray = Object.entries(settings).map(([key, value]) => ({
        setting_key: key,
        setting_value: value
      }));

      // Either update or create settings based on whether we have initial settings
      if (hasInitialSettings) {
        await updateAdminSettings(settingsArray);
      } else {
        await createAdminSettings(settingsArray);
        setHasInitialSettings(true);
      }

      toast.success("Settings saved successfully");
      setIsPasswordChange(false);
      setConfirmPassword("");
      setCurrentPassword("");
    } catch (error) {
      console.error("Failed to save settings:", error);
      toast.error("Failed to save settings");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordChangeClick = () => {
    setIsPasswordChange(true);
  };

  const handleCancelPasswordChange = () => {
    setIsPasswordChange(false);
    setConfirmPassword("");
  };

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight mb-8">
          Settings
        </h1>
        
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden p-6">
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-gray-900">Restaurant Information</h2>
              
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label htmlFor="restaurant_name" className="block text-sm font-medium text-gray-900">
                    Restaurant Name
                  </label>
                  <input
                    type="text"
                    name="restaurant_name"
                    id="restaurant_name"
                    value={settings.restaurant_name}
                    onChange={handleChange}
                    className="mt-1 block w-full text-gray-700 p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div>
                  <label htmlFor="restaurant_phone" className="block text-sm font-medium text-gray-900">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    name="restaurant_phone"
                    id="restaurant_phone"
                    value={settings.restaurant_phone}
                    onChange={handleChange}
                    className="mt-1 block w-full text-gray-700 p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div className="sm:col-span-2">
                  <label htmlFor="restaurant_address" className="block text-sm font-medium text-gray-900">
                    Address
                  </label>
                  <input
                    type="text"
                    name="restaurant_address"
                    id="restaurant_address"
                    value={settings.restaurant_address}
                    onChange={handleChange}
                    className="mt-1 block w-full text-gray-700 p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div>
                  <label htmlFor="restaurant_email" className="block text-sm font-medium text-gray-900">
                    Email
                  </label>
                  <input
                    type="email"
                    name="restaurant_email"
                    id="restaurant_email"
                    value={settings.restaurant_email}
                    onChange={handleChange}
                    className="mt-1 block w-full text-gray-700 p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            </div>
            
            <div className="border-t border-gray-200 pt-6 space-y-6">
              <h2 className="text-xl font-bold text-gray-900">Financial Settings</h2>
              
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label htmlFor="vat_percentage" className="block text-sm font-medium text-gray-900">
                    VAT Percentage (%)
                  </label>
                  <input
                    type="number"
                    name="vat_percentage"
                    id="vat_percentage"
                    value={settings.vat_percentage}
                    onChange={handleChange}
                    min="0"
                    max="100"
                    step="0.1"
                    className="mt-1 block w-full text-gray-700 p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div>
                  <label htmlFor="service_charge_percentage" className="block text-sm font-medium text-gray-900">
                    Service Charge (%)
                  </label>
                  <input
                    type="number"
                    name="service_charge_percentage"
                    id="service_charge_percentage"
                    value={settings.service_charge_percentage}
                    onChange={handleChange}
                    min="0"
                    max="100"
                    step="0.1"
                    className="mt-1 block w-full text-gray-700 p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            </div>
            
            <div className="border-t border-gray-200 pt-6 space-y-6">
              <h2 className="text-xl font-bold text-gray-900">Admin Security</h2>
              
              {!isPasswordChange ? (
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-900">Admin Password: ••••••••</span>
                  <button
                    type="button"
                    onClick={handlePasswordChangeClick}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Change Password
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label htmlFor="admin_password" className="block text-sm font-medium text-gray-900">
                      New Password
                    </label>
                    <input
                      type="password"
                      name="admin_password"
                      id="admin_password"
                      value={settings.admin_password}
                      onChange={handleChange}
                      className="mt-1 block w-full text-gray-700 p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="confirm_password" className="block text-sm font-medium text-gray-900">
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      name="confirm_password"
                      id="confirm_password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="mt-1 block w-full text-gray-700 p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  
                  <div className="flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={handleCancelPasswordChange}
                      className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
            
            <div className="flex justify-end">
              <button
                type="submit"
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-full shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Save Settings
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Settings;
