/* eslint-disable @typescript-eslint/no-explicit-any */
import { useToast } from "@/components/ui/use-toast";
import { useState } from "react";
import axios from "axios";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";

const ReqRecharge = () => {
  const [formData, setFormData] = useState({
    amount: 0,
  });
  const { data: recharge, refetch } = useQuery({
    queryKey: ["recharge"],
    queryFn: async () => {
      try {
        // Assuming token is defined before this point
        const response = await axios.get("http://localhost:5000/recharge", {
          headers: {
            "Content-Type": "application/json",
            Authorization: String(token),
          },
        });
        return response.data.data[response.data.data.length - 1];
      } catch (err: any) {
        throw new Error(`Error fetching data: ${err.message}`);
      }
    },
    select: (data) => data,
    gcTime: 0,
    refetchOnWindowFocus: true,
  });
  console.log(recharge);
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("token");
  const toast = useToast();

  const handleChange = (e: any) => {
    setFormData({
      ...formData,
      amount: e.target.value,
    });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const { amount } = formData;
    setLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:5000/recharge",
        { amount }, // Assuming you have a default pin or you get it from somewhere
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: String(token),
          },
        }
      );
      const data = response.data;
      refetch();
      if (data.error) {
        toast.toast({
          title: "Recharge Request Failed!",
        });
      } else {
        toast.toast({
          title: "Recharge Requested Sent!",
        });
      }
    } catch (error: any) {
      console.log(error);
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
        <h2 className="text-2xl font-bold mb-4">Cash In</h2>
        <form onSubmit={handleSubmit}>
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
          <button
            type="submit"
            className={cn(
              "bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:bg-blue-600",
              loading &&
                "cursor-not-allowed bg-blue-300 hover:bg-blue-300 focus:bg-blue-300",
              recharge &&
                recharge?.isApproved === false &&
                "cursor-not-allowed bg-blue-300 hover:bg-blue-300 focus:bg-blue-300"
            )}
            disabled={loading === true || recharge?.isApproved === false}
          >
            {loading
              ? "Loading..."
              : recharge?.isApproved === false
              ? "Pending Old Request..."
              : "Submit"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ReqRecharge;
