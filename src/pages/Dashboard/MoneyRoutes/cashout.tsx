/* eslint-disable @typescript-eslint/no-explicit-any */
import { useToast } from "@/components/ui/use-toast";
import { useState } from "react";
import axios from "axios";
import { cn } from "@/lib/utils";

const CashOut = () => {
  const [formData, setFormData] = useState({
    mobileNumber: "",
    amount: 0,
    pin: "",
  });
  const [loading, setLoading] = useState(false);
  const [charge, setCharge] = useState(0);
  const token = localStorage.getItem("token");
  const toast = useToast();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setCharge(formData.amount * 0.015);
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const { mobileNumber, amount, pin } = formData;
    setLoading(true);

    try {
      const response = await axios.post(
        "https://mfs-web-app-backend.vercel.app/transaction/cash-out",
        { mobileNumber, amount, pin },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: String(token),
          },
        }
      );

      const data = response.data;
      if (data.error) {
        toast.toast({
          title: "Cash Out Failed!",
        });
      } else {
        toast.toast({
          title: `Cash Out Successful! Total Cost ${
            charge + Number(formData.amount)
          }`,
        });
      }
      // empty form fields
      setFormData({
        mobileNumber: "",
        amount: 0,
        pin: "",
      });
    } catch (error: any) {
      if (error.response) {
        toast.toast({
          title: error.response.data.message,
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center  h-screen">
      <div className="w-full max-w-md mx-auto my-8 p-6 bg-white shadow-md rounded-md">
        <h2 className="text-2xl font-bold mb-4">Cash Out</h2>
        <form onSubmit={(e) => handleSubmit(e)}>
          <div className="mb-4">
            <label
              htmlFor="mobileNumber"
              className="block text-sm font-medium text-gray-600"
            >
              Agent Mobile Number
            </label>
            <input
              type="number"
              id="mobileNo"
              name="mobileNumber"
              value={formData.mobileNumber}
              onChange={handleChange}
              className="mt-1 p-2 w-full border rounded-md focus:outline-none focus:border-blue-500"
              placeholder="Receiver Mobile Number"
              required
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="amount"
              className="block text-sm font-medium text-gray-600"
            >
              Amount
            </label>
            <input
              type="number"
              id="amount"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              className="mt-1 p-2 w-full border rounded-md focus:outline-none focus:border-blue-500"
              placeholder="Amount"
              required
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="pin"
              className="block text-sm font-medium text-gray-600"
            >
              PIN
            </label>
            <input
              type="text"
              id="pin"
              name="pin"
              value={formData.pin}
              onChange={handleChange}
              className="mt-1 p-2 w-full border rounded-md focus:outline-none focus:border-blue-500"
              placeholder="PIN"
              required
            />
          </div>
          <h1>Total Cost: {charge + Number(formData.amount)}</h1>
          <button
            type="submit"
            className={cn(
              "bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:bg-blue-600",
              loading &&
                "cursor-not-allowed bg-blue-300 hover:bg-blue-300 focus:bg-blue-300"
            )}
            disabled={loading}
          >
            {loading ? "Loading..." : "Cash Out"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CashOut;
