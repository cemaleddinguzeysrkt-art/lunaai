import React from "react";
import { TrashIcon } from "./Icons";
import { FileRecord } from "@/lib/types/file-upload";
import { FileIcon } from "lucide-react";

interface FileListItemProps {
  record: FileRecord;
  onRemove: (id: string) => void;
}

export const FileListItem: React.FC<FileListItemProps> = ({
  record,
  onRemove,
}) => {
  const formatSize = (bytes: number) => {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return (
      parseFloat((bytes / Math.pow(k, i)).toFixed(1)) +
      " " +
      ["B", "KB", "MB", "GB"][i]
    );
  };

  const getStatusColor = () => {
    switch (record.status) {
      case "success":
        return "bg-emerald-500";
      case "error":
        return "bg-rose-500";
      default:
        return "bg-blue-500";
    }
  };

  return (
    <div className="group relative bg-white border border-border-dark rounded-lg p-3 transition-all hover:shadow-xs">
      <div className="flex items-center gap-3">
        <div className="shrink-0 w-8 h-8 bg-slate-50 rounded-lg flex items-center justify-center">
          <FileIcon className="w-4 h-4 text-slate-400" />
        </div>

        <div className="grow min-w-0">
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm font-semibold text-slate-700 truncate pr-2">
              {record.file.name}
            </span>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-medium text-slate-400">
                {formatSize(record.file.size)}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex-grow h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-300 ${getStatusColor()}`}
                style={{ width: `${record.progress}%` }}
              />
            </div>
            <span className="text-[10px] font-bold text-slate-500 min-w-[24px]">
              {record.progress}%
            </span>
          </div>

          {record.errorMessage && (
            <p className="text-[10px] text-rose-500 mt-1 font-medium">
              {record.errorMessage}
            </p>
          )}
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRemove(record.id);
          }}
          className="cursor-pointer opacity-0 group-hover:opacity-100 p-1 hover:text-rose-500 transition-all text-slate-300"
        >
          <TrashIcon className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
