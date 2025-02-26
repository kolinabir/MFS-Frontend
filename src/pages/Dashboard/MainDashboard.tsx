/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/rules-of-hooks */
import { AuthContext, AuthContextProps } from "@/Provider/AuthProvider";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BounceLoader } from "react-spinners";

const MainDashboard = () => {
  const { user, loading } = useContext(AuthContext) as AuthContextProps;
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [balanceByPhone, setBalanceByPhone] = useState("");

  if (loading) {
    return <p>Loading...</p>;
  }
  if (loading === false) {
    if (user === null) {
      navigate("/");
    }
  }

  const { data: allMoney, isLoading: allMoneyLoading } = useQuery({
    queryKey: ["allMoney"],
    queryFn: async () => {
      try {
        if (user?.role === "ADMIN") {
          const response = await axios.get(
            "https://mfs-web-app-backend.vercel.app/admin-control-panel/all-money",
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: String(token),
              },
            }
          );
          return response.data.data;
        }
        return 0;
      } catch (err: any) {
        throw new Error(`Error fetching data: ${err.message}`);
      }
    },
    select: (data) => data,
  });

  const handleSearchBalanceByPhone = async (phoneNo: string) => {
    try {
      const response = await axios.get(
        `https://mfs-web-app-backend.vercel.app/admin-control-panel/balance/${phoneNo}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: String(token),
          },
        }
      );
      setBalanceByPhone(response.data.data.balance);
    } catch (err: any) {
      throw new Error(`Error fetching data: ${err.message}`);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[80vh] p-4">
      <div className="w-full max-w-2xl bg-white rounded-xl shadow-lg p-8 border border-gray-100">
        <h1 className="text-3xl font-bold mb-8 text-center text-gray-800">
          Dashboard Overview
        </h1>

        {user?.role === "ADMIN" && (
          <div className="mb-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg shadow-sm border border-blue-100">
            <h2 className="text-xl font-semibold mb-3 text-gray-700 flex items-center justify-center">
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                ></path>
              </svg>
              All Money
            </h2>
            {allMoneyLoading ? (
              <div className="flex justify-center my-4">
                <BounceLoader color="#4F46E5" size={24} />
              </div>
            ) : (
              <p className="text-3xl font-bold text-center text-indigo-600">
                {allMoney} TK
              </p>
            )}
          </div>
        )}

        <div className="p-6 bg-gradient-to-r from-gray-50 to-slate-50 rounded-lg shadow-sm border border-gray-100">
          <h2 className="text-xl font-semibold mb-4 text-gray-700 flex items-center justify-center">
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              ></path>
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
              ></path>
            </svg>
            View Balance
          </h2>
          <div className="mb-5">
            <input
              onChange={(e) => handleSearchBalanceByPhone(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring focus:ring-blue-200 focus:border-blue-400 transition-all outline-none"
              type="text"
              placeholder="Enter phone number of User/Agent"
            />
          </div>
          {balanceByPhone && (
            <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg text-center">
              <p className="text-lg font-medium text-gray-700">
                Balance:{" "}
                <span className="font-bold text-blue-700">
                  {balanceByPhone} TK
                </span>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MainDashboard;
