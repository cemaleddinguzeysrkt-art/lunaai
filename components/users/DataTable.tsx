import React, { useMemo, useState } from "react";
import {
  DefinitionItem,
  TabType,
  TargetItem,
  User,
} from "@/lib/types/user-types";
import { cn } from "@/lib/utils";
import { NewsSourceType } from "@/lib/types/news-types";
import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";

interface DataTableProps {
  data: (User | DefinitionItem | TargetItem)[];
  onEdit: (user: User) => void;
  onDelete: (id: number) => void;
  onSelect?: (data: User | DefinitionItem | TargetItem) => void;
  selectedData?: User | DefinitionItem | TargetItem | null;
  activeTab: TabType;
  newsSourcesOptions: NewsSourceType[];
}

const DataTable: React.FC<DataTableProps> = ({
  data,
  onEdit,
  onDelete,
  onSelect,
  selectedData,
  activeTab,
  newsSourcesOptions,
}) => {
  type TargetSortKey = "user" | "source" | null;
  type SortDirection = "asc" | "desc";
  const [targetSortKey, setTargetSortKey] = useState<TargetSortKey>(null);
  const [targetSortDir, setTargetSortDir] = useState<SortDirection>("asc");

  const isUserTab = activeTab === "Users";
  const isTargetTab = activeTab === "Target";

  const handleTargetSort = (key: TargetSortKey) => {
    if (targetSortKey === key) {
      setTargetSortDir((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setTargetSortKey(key);
      setTargetSortDir("asc");
    }
  };

  const sortedData = useMemo(() => {
    if (!isTargetTab) return data;

    const targets = [...(data as TargetItem[])];

    //default order TARGET ID DESC
    if (!targetSortKey) {
      return targets.sort((a, b) => (b.id ?? 0) - (a.id ?? 0));
    }

    return targets.sort((a, b) => {
      let primaryCompare = 0;

      if (targetSortKey === "user") {
        primaryCompare = (a.user ?? "").localeCompare(b.user ?? "");
      }

      if (targetSortKey === "source") {
        primaryCompare = (a.sourceName ?? "").localeCompare(b.sourceName ?? "");
      }

      if (targetSortDir === "desc") {
        primaryCompare *= -1;
      }

      // fallback to target id compare
      return primaryCompare !== 0 ? primaryCompare : (b.id ?? 0) - (a.id ?? 0);
    });
  }, [data, isTargetTab, targetSortKey, targetSortDir]);

  const SortIcon = ({
    active,
    dir,
  }: {
    active: boolean;
    dir: "asc" | "desc";
  }) => {
    if (!active) {
      return (
        <ArrowUpDown className="ml-2 h-4 w-4 text-gray-300 inline-block" />
      );
    }

    return dir === "asc" ? (
      <ArrowUp className="ml-2 h-4 w-4 inline-block" />
    ) : (
      <ArrowDown className="ml-2 h-4 w-4 inline-block" />
    );
  };

  console.log("DataTable rendered with data:", data, "Active Tab:", activeTab);

  return (
    <div className="max-h-144 overflow-y-auto overflow-x-auto scrollbar-custom">
      <table className="w-full text-left">
        <thead>
          <tr className="border-[1.5px] border-border-dark bg-[#f8f8f8]">
            <th className="px-6 py-4 text-sm font-semibold text-subtitle-dark w-20">
              ID
            </th>
            {!isTargetTab && (
              <th className="px-6 py-4 text-sm font-semibold text-subtitle-dark">
                Name
              </th>
            )}
            {isTargetTab && (
              <>
                <th
                  className="px-6 py-4 text-sm font-semibold text-subtitle-dark cursor-pointer select-none"
                  onClick={() => handleTargetSort("user")}
                >
                  <span className="inline-flex items-center">
                    User
                    <SortIcon
                      active={targetSortKey === "user"}
                      dir={targetSortDir}
                    />
                  </span>
                </th>
                <th
                  className="px-6 py-4 text-sm font-semibold text-subtitle-dark cursor-pointer select-none"
                  onClick={() => handleTargetSort("source")}
                >
                  <span className="inline-flex items-center">
                    Source
                    <SortIcon
                      active={targetSortKey === "source"}
                      dir={targetSortDir}
                    />
                  </span>
                </th>
                <th className="px-6 py-4 text-sm font-semibold text-subtitle-dark">
                  Training type
                </th>
                <th className="px-6 py-4 text-sm font-semibold text-subtitle-dark">
                  Value
                </th>
              </>
            )}
            {isUserTab && (
              <>
                <th className="px-6 py-4 text-sm font-semibold text-subtitle-dark">
                  Email
                </th>
                <th className="px-6 py-4 text-sm font-semibold text-subtitle-dark">
                  Role
                </th>
              </>
            )}
            {/* <th className="px-6 py-4 text-sm font-semibold text-subtitle-dark text-right">
              Actions
            </th> */}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {sortedData.length > 0 ? (
            sortedData.map((item) => (
              <tr
                onClick={onSelect && (() => onSelect(item as User))}
                key={item.id}
                className={cn(
                  "group hover:bg-blue-50/50 transition-colors border border-border",
                  selectedData?.id === item.id && "bg-blue-50",
                )}
              >
                <td className="px-6 py-4 text-sm text-subtitle-dark">
                  {item.id}
                </td>
                {!isTargetTab && (
                  <td className="px-6 py-4 text-sm text-subtitle-dark font-medium">
                    {(item as User | DefinitionItem).name}
                  </td>
                )}
                {isTargetTab && (
                  <>
                    <td className="px-6 py-4 text-sm text-subtitle-dark font-medium">
                      {(item as TargetItem).user}
                    </td>
                    <td className="px-6 py-4 text-sm text-subtitle-dark font-medium">
                      {(item as TargetItem).sourceName ?? "-"}
                    </td>
                    <td className="px-6 py-4 text-sm text-subtitle-dark font-medium">
                      {(item as TargetItem).trainingType}
                    </td>
                    <td className="px-6 py-4 text-sm text-subtitle-dark font-medium">
                      {(item as TargetItem).value}
                    </td>
                  </>
                )}
                {isUserTab && (
                  <>
                    <td className="px-6 py-4 text-sm text-subtitle-dark font-medium">
                      {(item as User).email}
                    </td>
                    <td className="px-6 py-4 text-sm text-subtitle-dark capitalize font-medium">
                      {(item as User).role ?? "user"}
                    </td>
                  </>
                )}
                {/* <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => onEdit(item as User)}
                      className="cursor-pointer p-1 text-gray-400 hover:text-blue-600 transition-colors"
                      title="Edit User"
                    >
                      <EditIcon className="w-5 h-5" />
                    </button>
                  </div>
                </td> */}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={4} className="px-6 py-12 text-center text-gray-500">
                No items found in {activeTab}.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable;
