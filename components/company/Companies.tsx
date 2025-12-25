"use client";

import { company as Company } from "@/app/generated/prisma/client";
import { COMPANY_TAGS_MAP } from "@/lib/data/news-data";
import { ChevronDown, ListCheck, Pencil, Plus, Search } from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { Button } from "../ui/button";
import CompanyDetail from "./CompanyDetail";
import { CompanyArrayType } from "@/lib/types/news-types";

interface CompaniesProps {
  initialCompanies: CompanyArrayType;
}

export default function Companies({ initialCompanies }: CompaniesProps) {
  const [companies, setCompanies] = useState(initialCompanies.companies);
  const [sidebarWidth, setSidebarWidth] = useState(500);
  const [isResizing, setIsResizing] = useState(false);
  const [showListMenu, setShowListMenu] = useState(false);
  const [liststatus, setListstatus] = useState("Long List");
  const [selectedCompanyId, setSelectedCompanyId] = useState<number | null>(
    companies.length ? companies[0].id : null
  );

  const getCompanyTags = (company: Company) => {
    const tagIds = company.tags
      ? company.tags.split(",").filter((id) => id.trim() !== "")
      : [];

    const displayTags = tagIds
      .map((id) => COMPANY_TAGS_MAP[id.trim()])
      .filter((tagName) => tagName !== undefined);
    return displayTags;
  };

  const startResizing = useCallback(() => setIsResizing(true), []);
  const stopResizing = useCallback(() => setIsResizing(false), []);

  const resize = useCallback(
    (mouseMoveEvent: MouseEvent) => {
      if (isResizing) {
        setSidebarWidth(mouseMoveEvent.clientX);
      }
    },
    [isResizing]
  );

  useEffect(() => {
    window.addEventListener("mousemove", resize);
    window.addEventListener("mouseup", stopResizing);
    return () => {
      window.removeEventListener("mousemove", resize);
      window.removeEventListener("mouseup", stopResizing);
    };
  }, [resize, stopResizing]);

  // prevent text selection when resizing
  useEffect(() => {
    if (isResizing) {
      document.body.classList.add("no-select");
    } else {
      document.body.classList.remove("no-select");
    }

    return () => {
      document.body.classList.remove("no-select");
    };
  }, [isResizing]);

  const activeCompany = selectedCompanyId
    ? companies.find((c) => c.id === selectedCompanyId) || null
    : null;

  useEffect(() => {
    console.log("companiess", companies);
  }, []);

  return (
    <div className="flex h-full bg-neutral-50">
      {/* companies list sidebar */}
      <div
        className="bg-white border-r-2 border-border-dark flex flex-col shrink-0 relative"
        style={{ width: sidebarWidth, minWidth: 300, maxWidth: 600 }}
      >
        <div className="p-4 border-b border-neutral-200 space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-y-2">
            <div className="relative">
              <button
                onClick={() => setShowListMenu(!showListMenu)}
                className="flex items-center gap-4 font-semibold text-subtitle-dark text-xs hover:bg-neutral-50 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  {/* <ListCheck size={16} /> */}
                  <span>{liststatus}</span>
                </div>
                <ChevronDown
                  className={`w-5 h-5 text-subtitle-dark transition-transform ${
                    showListMenu ? "rotate-180" : ""
                  }`}
                />
              </button>

              {showListMenu && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setShowListMenu(false)}
                  />
                  <div className="absolute top-full left-0 mt-1 w-56 bg-white rounded-xl shadow-xl border border-neutral-100 py-1 z-20 overflow-hidden animate-in fade-in zoom-in-95 duration-100">
                    {["Long List", "Short List", "Archived"].map((status) => (
                      <button
                        key={status}
                        onClick={() => {
                          setListstatus(status);
                          setShowListMenu(false);
                        }}
                        className={`w-full text-left px-4 py-2.5 text-sm hover:bg-neutral-50 transition-colors ${
                          status === liststatus
                            ? "font-medium text-blue-600 bg-blue-50"
                            : "text-subtitle-dark"
                        }`}
                      >
                        {status}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
            <div className="flex items-center ">
              <Button
                variant="ghost"
                className="text-blue-600 text-sm hover:bg-blue-50 flex items-center gap-2 cursor-pointer"
                size="sm"
              >
                <Pencil size={14} />
                <span>Edit</span>
              </Button>
              <Button
                variant="ghost"
                className="text-blue-600 text-sm hover:bg-blue-50 flex items-center gap-2 cursor-pointer"
                size="sm"
              >
                <Plus size={14} />
                <span>Add company</span>
              </Button>
            </div>
          </div>
          <div className="relative group">
            <Search
              size={14}
              className="text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2 group-focus-within:text-blue-500 transition-colors"
            />
            <input
              type="text"
              placeholder="Search for anything..."
              className="pl-9 pr-4 py-2 w-full border border-searchbox rounded-lg text-xs text-subtitle-dark bg-white placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300 transition-all"
            />
          </div>
        </div>

        <div className="grid grid-cols-[40px_1fr_1fr] px-4 py-2 bg-neutral-50 text-sm font-semibold text-title-dark/90 border-b border-border-dark">
          <div>ID</div>
          <div>Company name</div>
          <div>Tags</div>
        </div>

        {/* companies list */}
        <div className="flex-1 overflow-y-auto scrollbar-custom">
          {companies.map((company) => (
            <div
              key={company.id}
              onClick={() => setSelectedCompanyId(company.id)}
              className={`
                grid grid-cols-[40px_1fr_1fr] px-4 py-3 border-y-[0.7px] border-border-dark cursor-pointer items-center text-sm font-medium text-title-dark/90
                ${
                  company.id === selectedCompanyId
                    ? "bg-blue-50/50"
                    : "hover:bg-neutral-50"
                }
              `}
            >
              <div className="text-neutral-500">{company.id}</div>
              <div
                className={`font-medium text-sm ${
                  company.id === selectedCompanyId
                    ? "text-blue-700"
                    : "text-title-dark"
                }`}
              >
                {company.name}
              </div>
              <div className="flex items-center gap-1 flex-wrap">
                {getCompanyTags(company).map((tag, i) => (
                  <span
                    key={i}
                    className="px-2 py-0.5 bg-neutral-100 border border-neutral-200 rounded text-xs text-title-dark whitespace-nowrap"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div
          className="absolute -right-3 top-5 z-20 cursor-grab group/handle"
          onMouseDown={startResizing}
        >
          <div className="w-6 h-6 bg-white border border-neutral-200 rounded-full shadow-sm flex items-center justify-center group-hover/handle:border-blue-400 group-hover/handle:ring-2 group-hover/handle:ring-blue-100 transition-all">
            {/* <UnfoldHorizontal className="w-4 h-4 text-subtitle-dark/80 group-hover/handle:text-blue-500" /> */}
            <Image
              src="/icons/resizer.svg"
              alt="Luna logo"
              width={14}
              height={14}
              className="flex items-center p-0 m-0 pointer-events-none"
              priority
            />
          </div>
        </div>

        <div
          className="absolute right-0 top-0 bottom-0 w-1 cursor-col-resize hover:bg-blue-500/0 transition-colors z-10"
          onMouseDown={startResizing}
        />
      </div>

      {/* company details panel */}
      {activeCompany && <CompanyDetail activeCompany={activeCompany} />}
    </div>
  );
}
