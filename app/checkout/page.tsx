"use client";

import { useCart } from "@/app/context/CartContext";
import { useState } from "react";

export default function CheckoutPage() {
  const { cart } = useCart();

  const [form, setForm] = useState({
    name: "",
    address: "",
    phone: "",
  });

  const totalPrice = cart.reduce(
    (total, item) => total + Number(item.price || 0) * item.quantity,
    0
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    alert(
      `Order Confirmed!\n\nName: ${form.name}\nAddress: ${form.address}\nPhone: ${form.phone}\nTotal: $${totalPrice.toFixed(
        2
      )}`
    );
  };

  if (cart.length === 0) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
        <div className="text-center bg-white shadow-lg rounded-xl p-10">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">
            Your cart is empty
          </h2>
          <p className="text-gray-500">Add some items to begin checkout.</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 p-6 sm:p-10">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* LEFT: Product Table */}
        <div className="lg:col-span-2 bg-white rounded-3xl shadow-xl p-6 sm:p-10 overflow-x-auto">
          <h1 className="text-4xl font-bold text-gray-800 mb-8">Your Order</h1>

          <table className="min-w-full bg-white">
            <thead className="bg-gray-100 text-gray-700 text-sm uppercase tracking-wider border-b">
              <tr>
                <th className="text-left px-6 py-4">Product</th>
                <th className="text-center px-6 py-4">Quantity</th>
                <th className="text-right px-6 py-4">Price</th>
                <th className="text-right px-6 py-4">Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {cart.map((item) => {
                const subtotal = Number(item.price) * item.quantity;
                return (
                  <tr
                    key={item.name}
                    className="border-b hover:bg-gray-50 transition"
                  >
                    <td className="px-6 py-4 text-gray-800 font-medium">
                      {item.name}
                    </td>
                    <td className="px-6 py-4 text-center text-gray-600">
                      {item.quantity}
                    </td>
                    <td className="px-6 py-4 text-right text-gray-600">
                      ${Number(item.price).toFixed(2)}
                    </td>
                    <td className="px-6 py-4 text-right font-semibold text-green-600">
                      ${subtotal.toFixed(2)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          <div className="mt-8 flex justify-end text-xl font-bold text-gray-800">
            Total: <span className="text-blue-600 ml-2">${totalPrice.toFixed(2)}</span>
          </div>
        </div>

        {/* RIGHT: Shipping Form */}
        <div className="bg-white rounded-3xl shadow-xl p-6 sm:p-10 h-fit sticky top-10">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Shipping Info</h2>

          <div className="space-y-5">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Name
              </label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                type="text"
                className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Your full name"
              />
            </div>

            <div>
              <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                Address
              </label>
              <input
                name="address"
                value={form.address}
                onChange={handleChange}
                type="text"
                className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Street, City, ZIP"
              />
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number
              </label>
              <input
                name="phone"
                value={form.phone}
                onChange={handleChange}
                type="tel"
                className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="+880 1XXXXXXXXX"
              />
            </div>
          </div>

          <button
            onClick={handleSubmit}
            className="mt-8 w-full bg-blue-600 hover:bg-blue-700 transition text-white font-semibold py-3 px-6 rounded-lg shadow-md active:scale-95"
          >
            Confirm Order
          </button>
        </div>
      </div>
    </main>
  );
}
