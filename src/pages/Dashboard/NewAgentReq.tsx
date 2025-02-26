/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { BounceLoader } from "react-spinners";
import { useContext } from "react";
import { AuthContext, AuthContextProps } from "@/Provider/AuthProvider";
import { useNavigate } from "react-router-dom";

interface Agent {
  _id: string;
  name: string;
  mobileNumber: string;
  email: string;
  role: string;
  nid: string;
  balance: number;
  isAccountActive: boolean;
  isAccountVerified: boolean;
  devicesLogins: number;
}

const NewAgentReq = () => {
  const { user, loading } = useContext(AuthContext) as AuthContextProps;
  const navigate = useNavigate();
  if (loading === false) {
    if (user?.role !== "ADMIN") {
      navigate("/dashboard");
    }
  }

  const token = localStorage.getItem("token");
  const { toast } = useToast();

  console.log(token);
  const {
    data: agents,
    error,
    isLoading,
  } = useQuery({
    queryKey: ["new-agents"],
    queryFn: async () => {
      try {
        // Assuming token is defined before this point
        const response = await axios.get(
          "https://mfs-web-app-backend.vercel.app/admin-control-panel/new-agents",
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: String(token),
            },
          }
        );
        console.log(response.data.data.result);
        return response.data;
      } catch (err: any) {
        throw new Error(`Error fetching data: ${err.message}`);
      }
    },
    select: (data) => data.data.result,
  });

  // Example usage in the component
  if (isLoading) {
    return <BounceLoader color="#36d7b7" />;
  }

  if (error) {
    return <p>Error: {error.message}</p>;
  }

  const handleVerify = (agentId: string) => {
    // Implement verification logic here
    // https://mfs-web-app-backend.vercel.app/auth/:id PATCH

    try {
      const response = fetch(
        `https://mfs-web-app-backend.vercel.app/auth/${agentId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: String(token),
          },
        }
      );
      response.then(() => {
        toast({
          title: "Agent Verified!",
        });
      });
    } catch (error) {
      toast({
        title: "You are not authorized to perform this action!",
      });
    }
  };

  return (
    <Table className="p-4  mt-14 scroll-auto">
      <TableCaption>A list of your recent invoices.</TableCaption>
      <TableHeader className="text-white">
        <TableRow className="text-white font-bold">
          <TableHead className="text-white">Name</TableHead>
          <TableHead className="text-white">Mobile Number</TableHead>
          <TableHead className="text-white">Email</TableHead>
          <TableHead className="text-white">NID</TableHead>
          <TableHead className="text-white">Balance</TableHead>
          <TableHead className="text-white">Active</TableHead>
          <TableHead className="text-white">Verified</TableHead>
          <TableHead className="text-white">Logins</TableHead>
          <TableHead className="text-white">Actions</TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {agents?.map((agent: Agent) => (
          <TableRow key={agent._id}>
            <TableCell>{agent.name}</TableCell>
            <TableCell>{agent.mobileNumber}</TableCell>
            <TableCell>{agent.email}</TableCell>
            <TableCell>{agent.nid}</TableCell>
            <TableCell>{agent.balance}</TableCell>
            <TableCell>{agent.isAccountActive ? "Yes" : "No"}</TableCell>
            <TableCell>{agent.isAccountVerified ? "Yes" : "No"}</TableCell>
            <TableCell>{agent.devicesLogins}</TableCell>
            <TableCell>
              <Button className="" onClick={() => handleVerify(agent._id)}>
                Approve Agent
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default NewAgentReq;
