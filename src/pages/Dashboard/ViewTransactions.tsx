/* eslint-disable @typescript-eslint/no-explicit-any */
import { useContext } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { AuthContext, AuthContextProps } from "@/Provider/AuthProvider";

export function ViewTransactions() {
  const { mobileNumber } = useParams();
  const { user } = useContext(AuthContext) as AuthContextProps;

  const fetchTransactions = async () => {
    try {
      if (user?.role === "ADMIN") {
        const response = await axios.get(
          `http://localhost:5000/transaction/transaction/${mobileNumber}`,
          {
            headers: {
              Authorization: `${localStorage.getItem("token")}`,
            },
          }
        );
        console.log(response.data);
        return response.data;
      } else {
        const response = await axios.get(`http://localhost:5000/transaction`, {
          headers: {
            Authorization: `${localStorage.getItem("token")}`,
          },
        });
        console.log(response.data);
        return response.data;
      }
    } catch (err: any) {
      throw new Error(`Error fetching transactions: ${err.message}`);
    }
  };

  const {
    data: transactions,
    error,
    isLoading,
  } = useQuery({
    queryKey: ["transactions", mobileNumber],
    queryFn: fetchTransactions,
    select: (data) => {
      // Handle the new data structure
      if (
        data.data.sendMoneyTransactions ||
        data.data.cashOutTransactions ||
        data.data.cashInTransactions
      ) {
        // Combine the three arrays into one for display
        return [
          ...(data.data.sendMoneyTransactions || []),
          ...(data.data.cashOutTransactions || []),
          ...(data.data.cashInTransactions || []),
        ];
      }
      // Fallback for old data structure if needed
      return data.data;
    },
  });

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error.message}</p>;
  }

  // Calculate total amount from all transactions
  const totalAmount =
    transactions?.reduce(
      (total: number, transaction: any) => total + (transaction.amount || 0),
      0
    ) || 0;

  return (
    <Table className="mt-20">
      <TableCaption>A list of your recent transactions.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">Transaction Type</TableHead>
          <TableHead>Amount</TableHead>
          <TableHead>Transaction Date</TableHead>
          <TableHead>Correspondent</TableHead>
          <TableHead>Correspondent Mobile Number</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {transactions?.map((transaction: any) => (
          <TableRow key={transaction._id}>
            <TableCell className="font-medium">
              {transaction?.transactionType}
            </TableCell>
            <TableCell>{transaction?.amount}</TableCell>
            <TableCell>
              {new Date(transaction?.transactionDate).toLocaleString()}
            </TableCell>
            <TableCell>
              {transaction?.transactionType === "SEND" && (
                <>
                  <strong>User:</strong> {transaction?.receiver?.name || "N/A"}
                </>
              )}
              {transaction?.transactionType === "CASH_OUT" && (
                <>
                  <strong>Agent:</strong> {transaction?.agent?.name || "N/A"}
                </>
              )}
              {transaction?.transactionType === "CASH_IN" && (
                <>
                  <strong>{user?.role === "AGENT" ? " User" : " Agent"}</strong>{" "}
                  {user?.role === "AGENT"
                    ? transaction?.user?.name || "N/A"
                    : transaction?.agent?.name || "N/A"}
                </>
              )}
            </TableCell>
            <TableCell>
              {transaction?.transactionType === "SEND" && (
                <>
                  <strong>User:</strong>{" "}
                  {transaction?.receiver?.mobileNumber || "N/A"}
                </>
              )}
              {transaction?.transactionType === "CASH_OUT" && (
                <>
                  <strong>Agent:</strong>{" "}
                  {transaction?.agent?.mobileNumber || "N/A"}
                </>
              )}
              {transaction?.transactionType === "CASH_IN" && (
                <>
                  <strong>{user?.role === "AGENT" ? " User" : "Agent"}</strong>{" "}
                  {user?.role === "AGENT"
                    ? transaction?.user?.mobileNumber || "N/A"
                    : transaction?.agent?.mobileNumber || "N/A"}
                </>
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell colSpan={2}>Total</TableCell>
          <TableCell className="text-right">{totalAmount}</TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  );
}
