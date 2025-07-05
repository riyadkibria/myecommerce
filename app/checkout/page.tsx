"use client";

import { useCart } from "@/app/context/CartContext";
import { useState } from "react";
import { FaUser, FaMapMarkerAlt, FaPhoneAlt } from "react-icons/fa";

export default function CheckoutPage() {
  const { cart } = useCart();

  const [form, setForm] = useState({
    name: "",
    address: "",
    phone: "",
  });

  const [errors, setErrors] = useState({
    name: "",
    address: "",
    phone: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const totalPrice = cart.reduce(
    (total, item) => total + Number(item.price || 0) * item.quantity,
    0
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    setErrors({ ...errors, [name]: "" });
  };

  const handleSubmit = () => {
    const newErrors = {
      name: form.name.trim() ? "" : "Name is required",
      address: form.address.trim() ? "" : "Address is required",
      phone: form.phone.trim() ? "" : "Phone number is required",
    };

    setErrors(newErrors);
    const hasErrors = Object.values(newErrors).some((e) => e !== "");
    if (hasErrors) return;

    setIsSubmitting(true);
    setTimeout(() => {
      alert(
        `✅ Order Confirmed!\n\nName: ${form.name}\nAddress: ${form.address}\nPhone: ${form.phone}\nTotal: $${totalPrice.toFixed(
          2
        )}`
      );
      setIsSubmitting(false);
    }, 1500);
  };

  if (cart.length === 0) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
        <div className="text-center bg-white shadow rounded-lg p-8">
          <h2 className="text-lg font-semibold text-gray-700 mb-2">
            Your cart is empty
          </h2>
          <p className="text-gray-500 text-sm">Add items to begin checkout.</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 p-4 sm:p-6">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT: Product Table */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow p-4 sm:p-6 overflow-x-auto">
          <h1 className="text-2xl sm:text-3xl font-semibold text-gray-800 mb-6">
            Your Order
          </h1>

          <table className="min-w-full text-sm text-gray-700">
            <thead className="bg-gray-100 uppercase tracking-wide border-b text-xs">
              <tr>
                <th className="text-left px-4 py-3">Product</th>
                <th className="text-center px-4 py-3">Qty</th>
                <th className="text-right px-4 py-3">Price</th>
                <th className="text-right px-4 py-3">Subtotal</th>
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
                    <td className="px-4 py-3 font-medium">{item.name}</td>
                    <td className="px-4 py-3 text-center">{item.quantity}</td>
                    <td className="px-4 py-3 text-right">${Number(item.price).toFixed(2)}</td>
                    <td className="px-4 py-3 text-right text-green-600 font-semibold">
                      ${subtotal.toFixed(2)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          <div className="mt-6 flex justify-end text-sm font-semibold text-gray-700">
            Total: <span className="text-blue-600 ml-2">${totalPrice.toFixed(2)}</span>
          </div>
        </div>

        {/* RIGHT: Shipping Form */}
        <div className="bg-white rounded-xl shadow p-4 sm:p-6 h-fit sticky top-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Shipping Info</h2>

          <div className="space-y-4 text-sm">
            <div>
              <label htmlFor="name" className="block font-medium text-gray-700 mb-1">
                <div className="flex items-center gap-1">
                  <FaUser className="text-gray-400" /> Name
                </div>
              </label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                type="text"
                className={`w-full border ${
                  errors.name ? "border-red-500" : "border-gray-300"
                } rounded-md p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500`}
                placeholder="Your full name"
              />
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
            </div>

            <div>
              <label htmlFor="address" className="block font-medium text-gray-700 mb-1">
                <div className="flex items-center gap-1">
                  <FaMapMarkerAlt className="text-gray-400" /> Address
                </div>
              </label>
              <input
                name="address"
                value={form.address}
                onChange={handleChange}
                type="text"
                className={`w-full border ${
                  errors.address ? "border-red-500" : "border-gray-300"
                } rounded-md p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500`}
                placeholder="Street, City, ZIP"
              />
              {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
            </div>

            <div>
              <label htmlFor="phone" className="block font-medium text-gray-700 mb-1">
                <div className="flex items-center gap-1">
                  <FaPhoneAlt className="text-gray-400" /> Phone
                </div>
              </label>
              <input
                name="phone"
                value={form.phone}
                onChange={handleChange}
                type="tel"
                className={`w-full border ${
                  errors.phone ? "border-red-500" : "border-gray-300"
                } rounded-md p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500`}
                placeholder="+880 1XXXXXXXXX"
              />
              {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
            </div>
          </div>

          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className={`mt-6 w-full bg-blue-600 hover:bg-blue-700 transition text-white font-semibold py-2.5 px-4 rounded-md shadow-sm active:scale-95 ${
              isSubmitting ? "opacity-60 cursor-not-allowed" : ""
            }`}
          >
            {isSubmitting ? "Processing..." : "Confirm Order"}
          </button>
        </div>
      </div>
    </main>
  );
}
