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
  if (loading) {
    return <p>Loading...</p>;
  }
  if (loading === false) {
    if (user === null) {
      navigate("/");
    }
  }
  const { data: userDetails } = useQuery({
    queryKey: ["userDetails"],
    queryFn: async () => {
      try {
        // Assuming token is defined before this point
        const response = await axios.get(
          "http://localhost:5000/admin-control-panel/details",
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: String(token),
            },
          }
        );
        console.log(response.data.data);
        return response.data.data;
      } catch (err: any) {
        throw new Error(`Error fetching data: ${err.message}`);
      }
    },
    select: (data) => data,
  });
  const token = localStorage.getItem("token");
  const { data: balance, isLoading: balanceLoading } = useQuery({
    queryKey: ["balance"],
    queryFn: async () => {
      try {
        // Assuming token is defined before this point
        const response = await axios.get(
          "http://localhost:5000/admin-control-panel/balance",
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: String(token),
            },
          }
        );
        return response.data.data[0].balance;
      } catch (err: any) {
        throw new Error(`Error fetching data: ${err.message}`);
      }
    },
    select: (data) => data,
  });
  const { data: allMoney, isLoading: allMoneyLoading } = useQuery({
    queryKey: ["allMoney"],
    queryFn: async () => {
      try {
        // Assuming token is defined before this point
        if (user?.role === "ADMIN") {
          const response = await axios.get(
            "http://localhost:5000/admin-control-panel/all-money",
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
  const [balanceByPhone, setBalanceByPhone] = useState("");
  const handleSearchBalanceByPhone = async (phoneNo: string) => {
    try {
      const response = await axios.get(
        `http://localhost:5000/admin-control-panel/balance/${phoneNo}`,
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

  // Example usage in the component

  return (
    <div>
      <div className="p-4 border-2 border-gray-200 border-dashed rounded-lg dark:border-gray-700 mt-14">
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="flex items-center justify-center h-24 rounded bg-gray-50 dark:bg-gray-800">
            <p className="text-2xl text-black dark:text-gray-500">
              {balanceLoading ? (
                <BounceLoader color="#000" size={20} />
              ) : (
                <span>Balance : {balance} TK</span>
              )}
            </p>
          </div>
          <div className="flex items-center justify-center h-24 rounded bg-gray-50 dark:bg-gray-800">
            <p className="text-2xl text-black dark:text-gray-500">
              {user?.role !== "ADMIN" ? (
                <span>
                  {/* user should be added */}
                  <svg
                    className="w-3.5 h-3.5"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 18 18"
                  >
                    <path
                      stroke="currentColor"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M9 1v16M1 9h16"
                    />
                  </svg>
                </span>
              ) : (
                <span>
                  {allMoneyLoading ? (
                    <BounceLoader color="#000" size={20} />
                  ) : (
                    <span>All Money : {allMoney} TK</span>
                  )}
                </span>
              )}
            </p>
          </div>
          <div className="flex items-center justify-center h-24 rounded bg-gray-50 dark:bg-gray-800">
            {user?.role === "ADMIN" && (
              <p className="text-2xl text-black dark:text-gray-500 w-full">
                <h1 className="text-base text-center">View Balance</h1>
                <div className="mx-4">
                  <div className="grid grid-cols-1">
                    <input
                      onChange={(e) =>
                        handleSearchBalanceByPhone(e.target.value)
                      }
                      className=" text-xs w-full p-1 mt-2 border-2 border-gray-200 rounded-lg dark:border-gray-700"
                      type="text"
                      placeholder="just enter phone no of User/Agent"
                    />
                    {/* <button className="col-span-2 w-full text-sm mt-2 bg-blue-500 rounded-lg dark:bg-gray-700">
                    View
                  </button> */}
                  </div>
                </div>
                <p className="text-base text-center">
                  Balance {balanceByPhone} TK
                </p>
              </p>
            )}
          </div>
        </div>
        {user?.role === "AGENT" && (
          <div className="flex items-center justify-center h-48 mb-4 rounded bg-gray-50 dark:bg-gray-800">
            <p className="text-2xl text-gray-400 dark:text-gray-500">
              {userDetails?.isAccountVerified === false &&
                "Your account is not verified yet"}
            </p>
          </div>
        )}

        <div className="flex items-center justify-center h-32 mb-4 rounded bg-gray-50 dark:bg-gray-800">
          <p className="text-2xl text-gray-400 dark:text-gray-500">
            Welcome {userDetails?.name}
          </p>
        </div>
        <div className="flex items-center justify-center h-48 mb-4 rounded bg-gray-50 dark:bg-gray-800">
          <p className="text-2xl text-gray-400 dark:text-gray-500">
            {user?.role}
          </p>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center justify-center rounded bg-gray-50 h-28 dark:bg-gray-800">
            <p className="text-2xl text-gray-400 dark:text-gray-500">
              <svg
                className="w-3.5 h-3.5"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 18 18"
              >
                <path
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 1v16M1 9h16"
                />
              </svg>
            </p>
          </div>
          <div className="flex items-center justify-center rounded bg-gray-50 h-28 dark:bg-gray-800">
            <p className="text-2xl text-gray-400 dark:text-gray-500">
              <svg
                className="w-3.5 h-3.5"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 18 18"
              >
                <path
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 1v16M1 9h16"
                />
              </svg>
            </p>
          </div>
          <div className="flex items-center justify-center rounded bg-gray-50 h-28 dark:bg-gray-800">
            <p className="text-2xl text-gray-400 dark:text-gray-500">
              <svg
                className="w-3.5 h-3.5"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 18 18"
              >
                <path
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 1v16M1 9h16"
                />
              </svg>
            </p>
          </div>
          <div className="flex items-center justify-center rounded bg-gray-50 h-28 dark:bg-gray-800">
            <p className="text-2xl text-gray-400 dark:text-gray-500">
              <svg
                className="w-3.5 h-3.5"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 18 18"
              >
                <path
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 1v16M1 9h16"
                />
              </svg>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainDashboard;
