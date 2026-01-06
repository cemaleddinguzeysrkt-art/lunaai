import React from "react";
import { TABS } from "@/lib/constants";
import { PlusIcon, SearchIcon } from "../Icons";
import {
  DefinitionItem,
  TabType,
  TargetItem,
  User,
} from "@/lib/types/user-types";
import { Button } from "../ui/button";

interface AdminHeaderProps {
  onAddClicked: () => void;
  onEditClicked: () => void;
  onSearch: (query: string) => void;
  searchQuery: string;
  selectedData?: User | DefinitionItem | TargetItem | null;
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

const AdminHeader: React.FC<AdminHeaderProps> = ({
  onAddClicked,
  onEditClicked,
  onSearch,
  searchQuery,
  selectedData,
  activeTab,
  onTabChange,
}) => {
  return (
    <div className="px-6 border-b border-gray-100 bg-white">
      <div className="flex items-center justify-between">
        {/* Tabs */}
        <div className="flex items-center gap-6">
          {TABS.map((tab) => (
            <button
              key={tab.name}
              onClick={() => onTabChange(tab.value as TabType)}
              className={`py-4 text-sm font-medium border-b-2 transition-colors cursor-pointer ${
                tab.value === activeTab
                  ? "text-blue-600 border-blue-600"
                  : "text-gray-400 border-transparent hover:text-gray-600"
              }`}
            >
              {tab.name} {tab.count ? `(${tab.count})` : ""}
            </button>
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 py-2">
          <Button
            size="sm"
            variant="outline"
            disabled={!selectedData}
            onClick={onEditClicked}
            className="px-5 py-1.5 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
          >
            Edit
          </Button>
          <button
            onClick={onAddClicked}
            className="flex items-center gap-2 px-5 py-1.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors cursor-pointer"
          >
            <PlusIcon className="w-4 h-4" />
            Add
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminHeader;
