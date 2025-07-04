"use client";

import { useCart } from "@/app/context/CartContext";

export default function CheckoutPage() {
  const { cart } = useCart();

  // Calculate total price safely by coercing price to number
  const totalPrice = cart.reduce(
    (total, item) => total + Number(item.price || 0) * item.quantity,
    0
  );

  if (cart.length === 0) {
    return (
      <main className="min-h-screen flex items-center justify-center p-8">
        <p className="text-gray-500 text-lg">Your cart is empty.</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen max-w-4xl mx-auto p-8 bg-white shadow-md rounded-md mt-10">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>

      {/* Cart items list */}
      <div className="space-y-4 mb-8">
        {cart.map((item) => (
          <div
            key={item.name}
            className="flex justify-between items-center border-b pb-2"
          >
            <div>
              <p className="font-medium text-gray-900">{item.name}</p>
              <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
            </div>
            <p className="font-semibold text-green-600">
              ${(Number(item.price) * item.quantity).toFixed(2)}
            </p>
          </div>
        ))}
      </div>

      {/* Total Price */}
      <div className="flex justify-between font-semibold text-xl border-t pt-4 mb-8">
        <span>Total:</span>
        <span>${totalPrice.toFixed(2)}</span>
      </div>

      {/* Confirm Purchase Button */}
      <button
        onClick={() => alert("Thank you for your purchase!")}
        className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 transition"
      >
        Confirm Purchase
      </button>
    </main>
  );
}
