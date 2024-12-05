const AddProductModal = ({
  isOpen,
  onClose,
  onSubmit,
  newProduct,
  setNewProduct,
}) => {
  if (!isOpen) return null;

  const fieldLabels = {
    'inventory_item_name': 'Product name',
    'quantity': 'Quantity',
    'unit': 'Unit(eg. kg, litre)',
    'max_quantity': 'Max Quantity',
    'cost_per_unit': 'Cost per unit',
    'category': 'Category',
    'sales_channel': 'Sales Channel',
  };

  const integerOnlyFields = ['quantity', 'max_quantity'];
  const decimalFields = ['cost_per_unit'];

  const formatFieldName = (field) => {
    return fieldLabels[field]
  };

  const getInputType = (field) => {
    if (integerOnlyFields.includes(field) || decimalFields.includes(field)) {
      return 'number';
    }
    return 'text';
  };

  const getInputStep = (field) => {
    if (decimalFields.includes(field)) {
      return '0.01';
    }
    return '1';
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-lg w-full max-w-md shadow-xl">
        <h2 className="text-xl font-bold mb-6 text-gray-800">
          Add New Product
        </h2>
        <form onSubmit={onSubmit}>
          <div className="space-y-4">
            {[
              "inventory_item_name",
              "quantity",
              "unit",
              "max_quantity",
              "cost_per_unit",
              "category",
              "sales_channel",
            ].map((field) => (
              <div key={field}>
                <label className="block text-sm font-medium text-gray-800 mb-1">
                  {formatFieldName(field)}
                </label>
                <input
                  type={getInputType(field)}
                  step={getInputStep(field)}
                  min="0"
                  className="text-black mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  value={newProduct[field]}
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, [field]: e.target.value })
                  }
                  required
                />
              </div>
            ))}
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
              Add Product
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProductModal;
