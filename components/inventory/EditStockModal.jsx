const EditStockModal = ({
  isOpen,
  onClose,
  onSubmit,
  selectedProduct,
  editStock,
  setEditStock,
}) => {
  if (!isOpen || !selectedProduct) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-lg w-full max-w-md shadow-xl">
        <h2 className="text-xl font-bold mb-6 text-gray-800">
          Edit Stock Level - {selectedProduct.product}
        </h2>
        <form onSubmit={onSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-800 mb-1">
                Stock Level
              </label>
              <input
                type="number"
                className="text-black mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                value={editStock}
                onChange={(e) => setEditStock(e.target.value)}
                required
              />
            </div>
          </div>
          <div className="mt-6 flex justify-end space-x-3">
            <button
              type="button"
              className="px-4 py-2 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 transition-colors duration-200"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200"
            >
              Update Stock
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditStockModal;
