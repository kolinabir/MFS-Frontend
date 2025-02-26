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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { CheckCircle, AlertCircle, Search, Download } from "lucide-react";
import AgentApprovalModal from "./AgentApprovalModal";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

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
  createdAt?: string;
}

const AgentCollection = () => {
  const { user, loading } = useContext(AuthContext) as AuthContextProps;
  const navigate = useNavigate();

  // Check admin access
  if (loading === false) {
    if (user?.role !== "ADMIN") {
      navigate("/dashboard");
    }
  }

  // Filter and search states
  const [isActivated, setIsActivated] = useState(true);
  const [verificationFilter, setVerificationFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [isApprovalModalOpen, setIsApprovalModalOpen] = useState(false);
  const [isApproving, setIsApproving] = useState(false);

  const token = localStorage.getItem("token");
  const { toast } = useToast();

  // CSV Export headers
  const csvHeaders = [
    { label: "Name", key: "name" },
    { label: "Mobile Number", key: "mobileNumber" },
    { label: "Email", key: "email" },
    { label: "Role", key: "role" },
    { label: "NID", key: "nid" },
    { label: "Balance", key: "balance" },
    { label: "Status", key: "isAccountVerified" },
    { label: "Account Active", key: "isAccountActive" },
    { label: "Device Logins", key: "devicesLogins" },
    { label: "Created Date", key: "createdAt" },
  ];

  // Build query parameters based on filters
  const getQueryParams = () => {
    const params = new URLSearchParams();

    // Only add parameters when filtering (not for "all")
    if (verificationFilter === "verified") {
      params.append("isAccountVerified", "true");
    } else if (verificationFilter === "unverified") {
      params.append("isAccountVerified", "false");
    }

    return params.toString();
  };

  const {
    data: activeUsers,
    error,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: [
      isActivated ? "activeUsers" : "blockedUsers",
      verificationFilter,
    ],
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

  // Function to handle agent approval
  const handleApproveAgent = async (agent: Agent) => {
    setIsApproving(true);
    try {
      const response = await axios.patch(
        `http://localhost:5000/admin-control-panel/verify-agent/${agent._id}`,
        {},
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: String(token),
          },
        }
      );

      // Refetch to update the UI with latest data
      refetch();

      toast({
        title: "Agent approved successfully",
        description: `${agent.name} has been verified and received an initial balance of 100,000`,
        variant: "default",
      });

      setIsApproving(false);
      return response.data;
    } catch (err: any) {
      toast({
        title: "Approval failed",
        description:
          err.response?.data?.message || "An error occurred during approval",
        variant: "destructive",
      });
      setIsApproving(false);
      throw new Error(err.response?.data?.message || "Failed to approve agent");
    }
  };

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
        title: `${agent.name} has been ${endpoint}ed`,
        variant: agent.isAccountActive ? "destructive" : "default",
      });
    } catch (err) {
      toast({
        title: "Something went wrong",
        variant: "destructive",
      });
    }
  };

  // Filter agents based on search query
  const filteredAgents = activeUsers?.filter((agent: Agent) => {
    if (!searchQuery.trim()) return true;

    const query = searchQuery.toLowerCase();
    return (
      agent.name.toLowerCase().includes(query) ||
      agent.mobileNumber.toLowerCase().includes(query) ||
      agent.email.toLowerCase().includes(query) ||
      agent.nid.toLowerCase().includes(query)
    );
  });

  const openApprovalModal = (agent: Agent) => {
    setSelectedAgent(agent);
    setIsApprovalModalOpen(true);
  };

  const closeApprovalModal = () => {
    setIsApprovalModalOpen(false);
    setSelectedAgent(null);
  };

  // Custom CSV export function
  const exportToCSV = () => {
    if (!filteredAgents || filteredAgents.length === 0) return;

    // Format agent data for CSV
    const formattedData = filteredAgents.map((agent: Agent) => ({
      name: agent.name,
      mobileNumber: agent.mobileNumber,
      email: agent.email,
      role: agent.role,
      nid: agent.nid,
      balance: agent.isAccountVerified ? agent.balance.toLocaleString() : "0",
      isAccountVerified: agent.isAccountVerified ? "Verified" : "Unverified",
      isAccountActive: agent.isAccountActive ? "Active" : "Blocked",
      devicesLogins: agent.devicesLogins,
      createdAt: agent.createdAt
        ? new Date(agent.createdAt).toLocaleDateString()
        : "N/A",
    }));

    // Create CSV content
    let csvContent = "data:text/csv;charset=utf-8,";

    // Add header row
    csvContent += csvHeaders.map((header) => header.label).join(",") + "\r\n";

    // Add data rows
    formattedData.forEach((agent) => {
      const row = csvHeaders
        .map((header) => {
          // Escape commas in values
          const value = String(agent[header.key as keyof typeof agent] || "");
          return value.includes(",") ? `"${value}"` : value;
        })
        .join(",");
      csvContent += row + "\r\n";
    });

    // Create download link
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      `${isActivated ? "active" : "blocked"}-agents-${new Date()
        .toISOString()
        .slice(0, 10)}.csv`
    );
    document.body.appendChild(link);

    // Download CSV file
    link.click();

    // Clean up
    document.body.removeChild(link);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <BounceLoader color="#36d7b7" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-md">
        <p className="text-red-600">Error: {error.message}</p>
      </div>
    );
  }

  return (
    <div>
      <Tabs defaultValue="account" className="">
        <TabsList>
          <TabsTrigger
            onClick={() => {
              setIsActivated(true);
              setSearchQuery("");
            }}
            className="w-72 bg-white dark:bg-gray-800 border-b-2 border-transparent hover:border-blue-500 hover:text-blue-500 data-[state=active]:border-blue-600 data-[state=active]:text-blue-600"
            value="account"
          >
            Active Agents
          </TabsTrigger>
          <TabsTrigger
            onClick={() => {
              setIsActivated(false);
              setSearchQuery("");
            }}
            className="w-72 bg-white dark:bg-gray-800 border-b-2 border-transparent hover:border-blue-500 hover:text-blue-500 data-[state=active]:border-blue-600 data-[state=active]:text-blue-600"
            value="password"
          >
            Blocked Agents
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm mt-4 mb-4">
        <div className="flex flex-col md:flex-row md:justify-between gap-4">
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Filter by verification:</h3>
            <RadioGroup
              defaultValue="all"
              className="flex space-x-4"
              value={verificationFilter}
              onValueChange={(value) => {
                setVerificationFilter(value);
                setSearchQuery("");
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

          <div className="flex flex-col space-y-2 md:space-y-0 md:items-end">
            <div className="relative w-full md:w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                type="search"
                placeholder="Search agents..."
                className="pl-8 pr-4"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {filteredAgents?.length > 0 && (
              <div className="text-xs text-gray-500 pt-1">
                {`Showing ${filteredAgents.length} of ${activeUsers.length} agents`}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">
            {`${isActivated ? "Active" : "Blocked"} Agent List`}
            {verificationFilter !== "all" && (
              <Badge variant="outline" className="ml-2">
                {verificationFilter === "verified"
                  ? "Verified Only"
                  : "Unverified Only"}
              </Badge>
            )}
          </h2>

          {filteredAgents?.length > 0 && (
            <Button
              onClick={exportToCSV}
              className="flex items-center gap-1 bg-green-600 hover:bg-green-700 text-white"
              size="sm"
            >
              <Download className="h-4 w-4" />
              Export to CSV
            </Button>
          )}
        </div>

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
              <TableHead>Status</TableHead>
              <TableHead>Transactions</TableHead>
              <TableHead>Logins</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {filteredAgents?.length > 0 ? (
              filteredAgents.map((agent: Agent) => (
                <TableRow
                  key={agent._id}
                  className={cn(
                    !agent.isAccountVerified &&
                      "bg-amber-50 dark:bg-amber-900/10"
                  )}
                >
                  <TableCell className="font-medium">{agent.name}</TableCell>
                  <TableCell>{agent.mobileNumber}</TableCell>
                  <TableCell>{agent.email}</TableCell>
                  <TableCell>{agent.role}</TableCell>
                  <TableCell>{agent.nid}</TableCell>
                  <TableCell>
                    {agent.isAccountVerified
                      ? agent.balance.toLocaleString()
                      : "0"}
                  </TableCell>
                  <TableCell>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="flex items-center">
                            {agent.isAccountVerified ? (
                              <CheckCircle className="h-5 w-5 text-green-500 mr-1" />
                            ) : (
                              <AlertCircle className="h-5 w-5 text-amber-500 mr-1" />
                            )}
                            <span
                              className={
                                agent.isAccountVerified
                                  ? "text-green-600"
                                  : "text-amber-600"
                              }
                            >
                              {agent.isAccountVerified
                                ? "Verified"
                                : "Unverified"}
                            </span>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          {agent.isAccountVerified
                            ? "Agent is verified and has full access to agent functions"
                            : "Agent needs approval to receive initial balance and access agent functions"}
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </TableCell>
                  <TableCell>
                    <NavLink
                      to={`/dashboard/transactions/${agent.mobileNumber}`}
                    >
                      <Button variant="outline" size="sm">
                        View
                      </Button>
                    </NavLink>
                  </TableCell>
                  <TableCell>{agent.devicesLogins}</TableCell>
                  <TableCell>
                    <div className="flex justify-end gap-2">
                      {!agent.isAccountVerified && (
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => openApprovalModal(agent)}
                          className="bg-green-600 hover:bg-green-700 text-white"
                        >
                          Approve
                        </Button>
                      )}
                      <Button
                        variant={
                          agent.isAccountActive ? "destructive" : "default"
                        }
                        size="sm"
                        onClick={() => handleActionButtonClick(agent)}
                      >
                        {agent.isAccountActive ? "Block" : "Unblock"}
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={10} className="h-24 text-center">
                  {searchQuery
                    ? "No agents match your search query"
                    : "No agents found with the selected filters"}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Agent Approval Modal */}
      <AgentApprovalModal
        agent={selectedAgent}
        isOpen={isApprovalModalOpen}
        onClose={closeApprovalModal}
        onApprove={handleApproveAgent}
        isLoading={isApproving}
      />
    </div>
  );
};

export default AgentCollection;
