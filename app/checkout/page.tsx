"use client";

import { useCart } from "@/app/context/CartContext";

export default function CheckoutPage() {
  const { cart } = useCart();

  const totalPrice = cart.reduce(
    (total, item) => total + Number(item.price || 0) * item.quantity,
    0
  );

  if (cart.length === 0) {
    return (
      <main className="min-h-screen flex items-center justify-center p-6 bg-gray-100">
        <div className="bg-white shadow-md rounded-xl p-10 text-center max-w-md w-full">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">
            Your cart is empty
          </h2>
          <p className="text-gray-500">Start adding items to checkout.</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-xl p-10">
        <h1 className="text-4xl font-bold text-gray-800 mb-10">Checkout</h1>

        <div className="space-y-6">
          {cart.map((item) => (
            <div
              key={item.name}
              className="flex justify-between items-start bg-gray-50 border border-gray-200 p-5 rounded-xl hover:shadow-sm transition"
            >
              <div>
                <h2 className="text-lg font-semibold text-gray-800">
                  {item.name}
                </h2>
                <p className="text-sm text-gray-500">
                  Quantity: {item.quantity}
                </p>
              </div>
              <p className="text-lg font-medium text-green-600">
                ${(Number(item.price) * item.quantity).toFixed(2)}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-10 border-t pt-6 flex justify-between items-center text-xl font-semibold text-gray-700 bg-gradient-to-r from-gray-100 to-gray-50 p-4 rounded-xl">
          <span>Total:</span>
          <span className="text-blue-600">${totalPrice.toFixed(2)}</span>
        </div>

        <button
          onClick={() => alert("Thank you for your purchase!")}
          className="mt-8 w-full bg-blue-600 text-white py-4 text-lg font-bold rounded-xl hover:bg-blue-700 active:scale-95 transition"
        >
          Confirm Purchase
        </button>
      </div>
    </main>
  );
}
