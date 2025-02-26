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
import { useContext, useState } from "react";
import { AuthContext, AuthContextProps } from "@/Provider/AuthProvider";
import { NavLink, useNavigate } from "react-router-dom";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

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

const AgentCollection = () => {
  const { user, loading } = useContext(AuthContext) as AuthContextProps;
  const navigate = useNavigate();
  if (loading === false) {
    if (user?.role !== "ADMIN") {
      navigate("/dashboard");
    }
  }
  const [isActivated, setIsActivated] = useState(true);

  const token = localStorage.getItem("token");
  const { toast } = useToast();

  const {
    data: activeUsers,
    error,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: [isActivated ? "activeUsers" : "blockedUsers"],
    queryFn: async () => {
      try {
        const endpoint = isActivated
          ? "/admin-control-panel/agents"
          : "/admin-control-panel/blocked-agents";

        const response = await axios.get(`http://localhost:5000${endpoint}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: String(token),
          },
        });

        return response.data.data;
      } catch (err: any) {
        throw new Error(`Error fetching data: ${err.message}`);
      }
    },
    select: (data) => data,
  });

  const handleActionButtonClick = async (agent: Agent) => {
    try {
      const endpoint = agent.isAccountActive ? "block" : "unblock";

      await axios.patch(
        `http://localhost:5000/admin-control-panel/${agent._id}/${endpoint}`,
        { userId: agent._id },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: String(token),
          },
        }
      );
      refetch();
      toast({
        title: `${agent.name} has been ${endpoint}ed `,
      });
    } catch (err) {
      toast({
        title: "Something went wrong",
      });
    }
  };

  if (isLoading) {
    return <BounceLoader color="#36d7b7" />;
  }

  if (error) {
    return <p>Error: {error.message}</p>;
  }

  return (
    <div>
      <Tabs defaultValue="account" className="">
        <div className="flex justify-center my-8 ">
          <TabsList className="">
            <TabsTrigger
              onClick={() => {
                setIsActivated(true);
              }}
              className="w-72"
              value="account"
            >
              Active Agents
            </TabsTrigger>
            <TabsTrigger
              onClick={() => {
                setIsActivated(false);
              }}
              className="w-72"
              value="password"
            >
              Blocked Agents
            </TabsTrigger>
          </TabsList>
        </div>
      </Tabs>

      <Table className="p-4  mt-14 scroll-auto">
        <TableCaption>A list of your recent invoices.</TableCaption>
        <TableHeader className="text-white">
          <TableRow className="text-white font-bold">
            <TableHead className="text-white">Name</TableHead>
            <TableHead className="text-white">Mobile Number</TableHead>
            <TableHead className="text-white">Email</TableHead>
            <TableHead className="text-white">Role</TableHead>
            <TableHead className="text-white">NID</TableHead>
            <TableHead className="text-white">Balance</TableHead>
            <TableHead className="text-white">Transactions</TableHead>
            <TableHead className="text-white">Logins</TableHead>
            <TableHead className="text-white">Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {activeUsers?.map((agent: Agent) => (
            <TableRow key={agent._id}>
              <TableCell>{agent.name}</TableCell>
              <TableCell>{agent.mobileNumber}</TableCell>
              <TableCell>{agent.email}</TableCell>
              <TableCell>{agent.role}</TableCell>
              <TableCell>{agent.nid}</TableCell>
              <TableCell>{agent.balance}</TableCell>
              <TableCell>
                <NavLink to={`/dashboard/transactions/${agent.mobileNumber}`}>
                  <Button>View</Button>
                </NavLink>
              </TableCell>
              <TableCell>{agent.devicesLogins}</TableCell>
              <TableCell>
                <Button
                  className=""
                  onClick={() => handleActionButtonClick(agent)}
                >
                  {agent.isAccountActive ? "Block" : "UnBlock"}
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default AgentCollection;
