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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

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
  
  // Filter states
  const [isActivated, setIsActivated] = useState(true);
  const [verificationFilter, setVerificationFilter] = useState<string>("all");
  
  const token = localStorage.getItem("token");
  const { toast } = useToast();

  // Build query parameters based on filters
  const getQueryParams = () => {
    const params = new URLSearchParams();
    
    // Only add parameters when filtering (not for "all")
    if (verificationFilter === "verified") {
      params.append("isAccountVerified", "true");
    } else if (verificationFilter === "unverified") {
      params.append("isAccountVerified", "false");
    }
    
    // For active/blocked agents, we use different endpoints
    // but we could also use the isAccountActive parameter
    
    return params.toString();
  };

  const {
    data: activeUsers,
    error,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: [isActivated ? "activeUsers" : "blockedUsers", verificationFilter],
    queryFn: async () => {
      try {
        let endpoint = isActivated
          ? "/admin-control-panel/agents"
          : "/admin-control-panel/blocked-agents";
          
        const queryParams = getQueryParams();
        if (queryParams) {
          endpoint += `?${queryParams}`;
        }

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
        <TabsList>
          <TabsTrigger
            onClick={() => {
              setIsActivated(true);
            }}
            className="w-72 bg-white dark:bg-gray-800 border-b-2 border-transparent hover:border-blue-500 hover:text-blue-500 data-[state=active]:border-blue-600 data-[state=active]:text-blue-600"
            value="account"
          >
            Active Agents
          </TabsTrigger>
          <TabsTrigger
            onClick={() => {
              setIsActivated(false);
            }}
            className="w-72 bg-white dark:bg-gray-800 border-b-2 border-transparent hover:border-blue-500 hover:text-blue-500 data-[state=active]:border-blue-600 data-[state=active]:text-blue-600"
            value="password"
          >
            Blocked Agents
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Additional Filter Options */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm mt-4 mb-4">
        <h3 className="text-sm font-medium mb-2">Filter by verification status:</h3>
        <RadioGroup 
          defaultValue="all" 
          className="flex space-x-4"
          value={verificationFilter}
          onValueChange={(value) => {
            setVerificationFilter(value);
          }}
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="all" id="all" />
            <Label htmlFor="all">All</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="verified" id="verified" />
            <Label htmlFor="verified">Verified</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="unverified" id="unverified" />
            <Label htmlFor="unverified">Unverified</Label>
          </div>
        </RadioGroup>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
        <Table className="p-4 scroll-auto">
          <TableCaption>
            {`${isActivated ? "Active" : "Blocked"} agents ${
              verificationFilter !== "all" ? `(${verificationFilter})` : ""
            }`}
          </TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Mobile Number</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>NID</TableHead>
              <TableHead>Balance</TableHead>
              <TableHead>Verified</TableHead>
              <TableHead>Transactions</TableHead>
              <TableHead>Logins</TableHead>
              <TableHead>Actions</TableHead>
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
                <TableCell>{agent.isAccountVerified ? "Yes" : "No"}</TableCell>
                <TableCell>
                  <NavLink to={`/dashboard/transactions/${agent.mobileNumber}`}>
                    <Button variant="outline" size="sm">View</Button>
                  </NavLink>
                </TableCell>
                <TableCell>{agent.devicesLogins}</TableCell>
                <TableCell>
                  <Button
                    variant={agent.isAccountActive ? "destructive" : "default"}
                    size="sm"
                    onClick={() => handleActionButtonClick(agent)}
                  >
                    {agent.isAccountActive ? "Block" : "Unblock"}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        
        {activeUsers?.length === 0 && (
          <div className="text-center p-4 text-gray-500">
            No agents found with the selected filters
          </div>
        )}
      </div>
    </div>
  );
};

export default AgentCollection;
