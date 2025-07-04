"use client";

import { useCart } from "@/app/context/CartContext";
import { X, ShoppingCart } from "lucide-react";
import { useState, useEffect, useRef } from "react";

export default function CartMenu() {
  const { cart, removeFromCart, addToCart } = useCart();

  const [isOpen, setIsOpen] = useState(false);
  const drawerRef = useRef<HTMLDivElement>(null);

  // Close cart when clicking outside drawer
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        drawerRef.current &&
        !drawerRef.current.contains(event.target as Node) &&
        (event.target as HTMLElement).id !== "cart-toggle-btn"
      ) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  // Quantity change handler
  const handleQuantityChange = (name: string, newQuantity: number) => {
    if (newQuantity < 1) return;

    const existingItem = cart.find((item) => item.name === name);
    if (!existingItem) return;

    const diff = newQuantity - existingItem.quantity;
    if (diff === 0) return;

    addToCart({ name, price: existingItem.price, quantity: diff });
  };

  // Calculate total price safely by coercing price to number
  const totalPrice = cart.reduce(
    (total, item) => total + Number(item.price || 0) * item.quantity,
    0
  );

  return (
    <>
      {/* Floating Cart Icon Button */}
      <button
        id="cart-toggle-btn"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle cart"
        className="fixed bottom-6 right-6 z-50 p-4 rounded-full bg-blue-600 text-white shadow-lg hover:bg-blue-700 transition"
      >
        <ShoppingCart className="w-6 h-6" />
        {cart.length > 0 && (
          <span className="absolute top-1 right-1 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 bg-red-600 rounded-full">
            {cart.reduce((sum, item) => sum + item.quantity, 0)}
          </span>
        )}
      </button>

      {/* Sliding Cart Drawer */}
      <div
        ref={drawerRef}
        className={`fixed top-0 right-0 h-full w-96 bg-white shadow-xl z-40 transform transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        } flex flex-col`}
      >
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold">🛒 Your Cart</h2>
          <button
            onClick={() => setIsOpen(false)}
            aria-label="Close cart"
            className="text-gray-600 hover:text-gray-900"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-grow overflow-auto p-4 space-y-4">
          {cart.length === 0 ? (
            <p className="text-center text-gray-500">Your cart is empty.</p>
          ) : (
            cart.map((item) => (
              <div
                key={item.name}
                className="flex items-center justify-between border-b pb-2"
              >
                <div className="flex flex-col">
                  <p className="font-medium text-gray-900">{item.name}</p>
                  <p className="text-green-600 font-semibold">${item.price}</p>
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="number"
                    min={1}
                    value={item.quantity}
                    onChange={(e) =>
                      handleQuantityChange(item.name, Number(e.target.value))
                    }
                    className="w-16 text-center border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                    aria-label={`Quantity for ${item.name}`}
                  />

                  <button
                    onClick={() => removeFromCart(item.name)}
                    className="text-red-500 hover:text-red-600 text-xs font-semibold"
                    aria-label={`Remove ${item.name} from cart`}
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Fixed footer with total and checkout button */}
        <div className="border-t p-4 bg-white sticky bottom-0 left-0 w-full z-50 flex flex-col gap-2">
          <div className="flex justify-between items-center font-semibold text-lg">
            <span>Total:</span>
            <span>${totalPrice.toFixed(2)}</span>
          </div>
          <button
            onClick={() => alert("Proceed to checkout")}
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
          >
            Checkout
          </button>
        </div>
      </div>

      {/* Optional: Add backdrop overlay */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-black bg-opacity-30 z-30"
          aria-hidden="true"
        />
      )}
    </>
  );
}
