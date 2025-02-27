import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

const AddStockModal = ({ isOpen, onClose, onSubmit, product }) => {
    const [quantity, setQuantity] = useState(0);

    if (!isOpen || !product) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        if (quantity > product.max_quantity - product.quantity) {
            alert("Cannot add more stock than the maximum capacity.");
            return;
        }
        onSubmit(product.inventory_item_id, Number(quantity));
        setQuantity(1);
    };

    const handleClose = () => {
        setQuantity(0);
        onClose();
    }

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            >
                <motion.div
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.95, opacity: 0 }}
                    className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden"
                >
                    <div className="p-6 bg-gradient-to-r from-green-600 to-emerald-600">
                        <h2 className="text-2xl font-bold text-white">
                            Add Stock: {product.inventory_item_name}
                        </h2>
                    </div>

                    <form onSubmit={handleSubmit} className="p-6 space-y-6">
                        <div>
                            <div className="mb-4">
                                <p className="text-gray-700">
                                    Current quantity: <span className="font-semibold">{product.quantity} {product.unit}s</span>
                                </p>
                                <p className="text-gray-700">
                                    Maximum capacity: <span className="font-semibold">{product.max_quantity} {product.unit}s</span>
                                </p>
                            </div>

                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Quantity to Add
                            </label>
                            <div className="flex items-center">

                                <input
                                    type="number"
                                    value={quantity}
                                    onChange={(e) => setQuantity(e.target.value)}
                                    className="w-full px-4 py-2 text-center text-gray-700 border-y border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
                                    required
                                />
                            </div>

                            <div className="mt-4">
                                <p className="text-gray-700">
                                    New total: <span className="font-semibold">{Number(product.quantity) + Number(quantity)} {product.unit}</span>
                                </p>
                            </div>
                        </div>

                        <div className="flex justify-end gap-4 pt-4 border-t">
                            <button
                                type="button"
                                onClick={() => handleClose()}
                                className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="px-6 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200"
                            >
                                Add Stock
                            </button>
                        </div>
                    </form>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default AddStockModal;
