"use client";

import React, { useState, ReactNode } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

type Tab = {
  title: string;
  value: string;
  content: React.ReactNode;
};

type TabsProps = {
  tabs?: Tab[];
  defaultValue?: string;
  className?: string;
  children?: ReactNode;
};

export const Tabs = ({
  tabs,
  defaultValue,
  className,
  children,
}: TabsProps) => {
  // If tabs are provided, use the first tab's value as default if no defaultValue is provided
  const initialValue =
    defaultValue || (tabs && tabs.length > 0 ? tabs[0].value : "");
  const [activeTab, setActiveTab] = useState<string>(initialValue);

  // If children are provided, use them directly (for backward compatibility)
  if (children) {
    return <div className={cn("w-full", className)}>{children}</div>;
  }

  // Otherwise, use the tabs prop to render tabbed interface
  return (
    <div className={cn("w-full h-full flex flex-col", className)}>
      {/* Tab Navigation */}
      <div className="relative border-b border-gray-200 dark:border-gray-700">
        <div className="flex space-x-1 overflow-x-auto scrollbar-hide">
          {tabs?.map((tab) => (
            <button
              key={tab.value}
              id={`tab-${tab.value}`}
              onClick={() => setActiveTab(tab.value)}
              className={`py-3 px-4 text-sm font-medium transition-all duration-200 outline-none
                ${
                  activeTab === tab.value
                    ? "text-blue-600 dark:text-blue-400"
                    : "text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
                }
              `}
            >
              {tab.title}
            </button>
          ))}
        </div>

        {/* Active Tab Indicator */}
        <motion.div
          className="absolute bottom-0 h-0.5 bg-blue-600 dark:bg-blue-400"
          layoutId="tabIndicator"
          initial={false}
          animate={{
            width:
              document.getElementById(`tab-${activeTab}`)?.offsetWidth || 0,
            x: document.getElementById(`tab-${activeTab}`)?.offsetLeft || 0,
          }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        />
      </div>

      {/* Tab Content */}
      <div className="mt-4 flex-grow">
        {tabs?.map((tab) => (
          <div
            key={tab.value}
            className={`h-full transition-opacity duration-300 ${
              activeTab === tab.value ? "block" : "hidden"
            }`}
          >
            {tab.content}
          </div>
        ))}
      </div>
    </div>
  );
};

// Backward compatibility components for using Tabs with children
export const TabsList = ({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) => {
  return (
    <div className={cn("flex justify-center my-8", className)}>{children}</div>
  );
};

export const TabsTrigger = ({
  className,
  children,
  value,
  onClick,
}: {
  className?: string;
  children: ReactNode;
  value: string;
  onClick?: () => void;
}) => {
  return (
    <button
      onClick={onClick}
      className={cn("py-2 px-4 text-sm font-medium", className)}
      value={value}
    >
      {children}
    </button>
  );
};
