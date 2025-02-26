"use client";

import { Tabs } from "@/components/ui/tabs";
import AgentCollection from "./AgentCollection";
import NewAgentReq from "./NewAgentReq";
import UserCollection from "./UserCollection";

export function UserManagement() {
  const tabs = [
    {
      title: "New Agent Request",
      value: "agent-request",
      content: (
        <div className="w-full h-full overflow-auto bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
            New Agent Request
          </h2>
          <NewAgentReq />
        </div>
      ),
    },
    {
      title: "User Collection",
      value: "user-collection",
      content: (
        <div className="w-full h-full overflow-auto bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
            User Collection
          </h2>
          <UserCollection />
        </div>
      ),
    },
    {
      title: "Agent Collection",
      value: "agent-collection",
      content: (
        <div className="w-full h-full overflow-auto bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
            Agent Collection
          </h2>
          <AgentCollection />
        </div>
      ),
    },
  ];

  return (
    <div className="min-h-[600px] bg-gray-50 dark:bg-gray-900 p-4 md:p-6 rounded-xl shadow-sm max-w-7xl mx-auto w-full">
      <h1 className="text-2xl mt-8 font-bold text-gray-800 dark:text-white mb-6">
        User Management
      </h1>
      <Tabs tabs={tabs} />
    </div>
  );
}
