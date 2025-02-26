"use client";

import AgentCollection from "./AgentCollection";
import NewAgentReq from "./NewAgentReq";
import { Tabs } from "./Tabs";
import UserCollection from "./UserCollection";

export function UserManagement() {
  const tabs = [
    {
      title: "New Agent Request",
      value: "Agent Request",
      content: (
        <div className="w-full overflow-hidden relative h-full rounded-2xl text-xl md:text-4xl font-bold text-white bg-gradient-to-br from-sky-900 to-sky-500 scroll-auto">
          <h1 className="text-center">New Agent Request</h1>
          <NewAgentReq></NewAgentReq>
        </div>
      ),
    },
    {
      title: "User Collection",
      value: "User Collection",
      content: (
        <div className="w-full overflow-hidden relative h-full rounded-2xl  text-xl md:text-4xl font-bold text-white bg-gradient-to-r from-cyan-500 to-blue-500">
          <h1 className="text-center">User Collection</h1>
          <UserCollection></UserCollection>
        </div>
      ),
    },
    {
      title: "Agent Collection",
      value: "Agent Collection",
      content: (
        <div className="w-full overflow-hidden relative h-full rounded-2xl  text-xl md:text-4xl font-bold text-white bg-gradient-to-r from-emerald-500 to-emerald-900">
          <h1 className="text-center">Agent Collection</h1>
          <AgentCollection></AgentCollection>
        </div>
      ),
    },
  ];

  return (
    <div className="h-[20rem] md:h-[40rem] [perspective:1000px] relative b flex flex-col max-w-5xl mx-auto w-full  items-start justify-start my-20">
      <Tabs tabs={tabs} />
    </div>
  );
}
