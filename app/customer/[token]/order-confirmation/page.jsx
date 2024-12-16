"use client";

import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { useCartStore } from '@/store/customerStore';


export default function OrderConfirmation() {
  const router = useRouter()
  const searchParams = useSearchParams();
  const { cart } = useCartStore();
  const total = parseFloat(searchParams.get('total') || '0');
  const VAT = 0;
  const totalWithVAT = total + VAT;
  const orderNumber = cart.length;

  return (
    <div className="bg-gray-50 min-h-screen p-4">
      <div className="container mx-auto max-w-2xl">
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-green-600 mb-2">Order Confirmed!</h1>
            <p className="text-gray-600">Thank you for your order.</p>
            <p className="text-lg font-semibold mt-2">{orderNumber === 1 ? 'First' : orderNumber === 2 ? 'Second' : `${orderNumber}th`} Order</p>
          </div>

          <div className="border-t border-gray-200 pt-4 space-y-2">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span>{total.toFixed(2)} THB</span>
            </div>
            <div className="flex justify-between">
              <span>VAT (20%):</span>
              <span>{VAT.toFixed(2)} THB</span>
            </div>
            <div className="flex justify-between font-bold text-lg pt-2 border-t">
              <span>Total:</span>
              <span>{totalWithVAT.toFixed(2)} THB</span>
            </div>
          </div>

          <div className="block text-center mt-6">
            <button onClick={() => router.back()} className="bg-yellow-500 text-white px-6 py-2 rounded-full">
              Return to Menu
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
