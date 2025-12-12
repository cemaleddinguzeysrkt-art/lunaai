"use client";

import { FILTERS } from "@/lib/data/news-data";
import { ArticlesArrayType } from "@/lib/types/news-types";
import { formatDate } from "@/lib/utils";
import {
  Check,
  ChevronDown,
  CircleMinus,
  CirclePlus,
  Globe,
  HelpCircle,
  Plus,
} from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { Button } from "../ui/button";
import FeedBackModal from "./FeedBackModal";

interface ArticleReviewProps {
  articles: ArticlesArrayType;
}

export default function ArticleReview({ articles }: ArticleReviewProps) {
  const [activeArticleId, setActiveArticleId] = useState<number>(
    articles[0]?.id
  );
  const [selectionRect, setSelectionRect] = useState<DOMRect | null>(null);
  const [selectedText, setSelectedText] = useState<string>("");
  const [checkedFilters, setCheckedFilters] = useState<Record<string, boolean>>(
    {}
  );
  const [showClassifyMenu, setShowClassifyMenu] = useState(false);
  const [classifyStatus, setClassifyStatus] = useState("Classifying");
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);

  const activeArticle =
    articles.find((a) => a.id === activeArticleId) || articles[0];
  const contentRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleSelection = () => {
      const selection = window.getSelection();

      // ensure selection is within our content area
      if (!selection || selection.rangeCount === 0 || selection.isCollapsed) {
        setSelectionRect(null);
        setSelectedText("");
        return;
      }

      const range = selection.getRangeAt(0);
      const container = contentRef.current;

      if (!container || !container.contains(range.commonAncestorContainer)) {
        setSelectionRect(null);
        return;
      }

      const rect = range.getBoundingClientRect();

      setSelectionRect(rect);
      setSelectedText(selection.toString());
    };

    // hide selection tooltip on scroll
    const handleScroll = () => {
      if (selectionRect) {
        setSelectionRect(null);
        window.getSelection()?.removeAllRanges();
      }
    };

    document.addEventListener("selectionchange", handleSelection);
    const scrollContainer = scrollContainerRef.current;
    if (scrollContainer) {
      scrollContainer.addEventListener("scroll", handleScroll);
    }

    return () => {
      document.removeEventListener("selectionchange", handleSelection);
      if (scrollContainer) {
        scrollContainer.removeEventListener("scroll", handleScroll);
      }
    };
  }, [selectionRect]);

  const handleSelectText = () => {
    console.log("Selected Text:", selectedText);
    window.getSelection()?.removeAllRanges();
    setSelectionRect(null);
  };

  const toggleFilter = (option: string) => {
    setCheckedFilters((prev) => ({ ...prev, [option]: !prev[option] }));
  };

  return (
    <div className="flex flex-col h-full bg-white">
      {/* toolbar */}
      <div className="h-11 border-b-2 border-border-dark bg-white flex items-center justify-between pl-6 shrink-0 z-20">
        <div className="relative w-[256px] border-r-2 border-border-dark h-full flex items-center">
          <button
            onClick={() => setShowClassifyMenu(!showClassifyMenu)}
            className="flex items-center gap-4 font-semibold text-subtitle-dark text-xs hover:bg-neutral-50 px-3 py-1.5 rounded-lg transition-colors cursor-pointer w-full justify-between"
          >
            <div className="flex items-center gap-2">
              {/* <Rows2 size={16} /> */}
              <Image
                src="/icons/classify.svg"
                alt="Luna logo"
                width={13}
                height={11}
                className="flex items-center p-0 m-0 "
              />
              <span>{classifyStatus}</span>
            </div>
            <ChevronDown
              size={16}
              className={` text-icon-dark transition-transform mr-2 ${
                showClassifyMenu ? "rotate-180" : ""
              }`}
            />
          </button>

          {showClassifyMenu && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setShowClassifyMenu(false)}
              />
              <div className="absolute top-full left-0 mt-1 w-56 bg-white rounded-xl shadow-xl border border-neutral-100 py-1 z-20 overflow-hidden animate-in fade-in zoom-in-95 duration-100">
                {["Classifying", "Analyzed", "Rejected"].map((status) => (
                  <button
                    key={status}
                    onClick={() => {
                      setClassifyStatus(status);
                      setShowClassifyMenu(false);
                    }}
                    className={`w-full text-left px-4 py-2.5 text-sm hover:bg-neutral-50 transition-colors ${
                      status === classifyStatus
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

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 mr-2">
            <Button
              variant="outline"
              size="sm"
              className="flex gap-2 items-center cursor-pointer rounded-lg h-7"
            >
              {/* <Globe size={14} className="text-subtitle-dark/80" /> */}
              <span className="text-xs text-subtitle-dark font-semibold">
                Go web
              </span>
            </Button>
            <Button
              size="sm"
              className="flex gap-2 items-center cursor-pointer rounded-lg h-7"
            >
              <Plus size={14} className="" />
              <span className="text-xs font-semibold">Add Lead</span>
            </Button>
          </div>

          <div className="flex items-center border-l-2 border-border-dark">
            <div className="flex items-center gap-2 px-2">
              <div className="w-16 mx-1 h-1.5 bg-neutral-300 rounded-full overflow-hidden">
                <div className="w-[30%] h-full bg-blue-600 rounded-full"></div>
              </div>
              <div className="flex items-center text-xs font-semibold tracking-wide">
                <span className="text-neutral-600">5</span>
                <span className="text-neutral-900/40">/50</span>
              </div>
            </div>
            <div className="h-11 w-[1.5px] bg-neutral-200 mx-[7.5px]"></div>
            <div className="flex items-center text-subtitle-dark text-xs font-semibold px-1">
              <Button variant="ghost" size="sm" className="cursor-pointer">
                <CircleMinus size={14} />
              </Button>
              <span>100%</span>
              <Button variant="ghost" size="sm" className="cursor-pointer">
                <CirclePlus size={14} />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* article list */}
        <aside className="w-[280px] border-r-2 border-border-dark bg-white flex flex-col shrink-0">
          <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-custom">
            {articles.map((article, idx) => (
              <div
                key={article.id}
                className="flex flex-col items-center gap-2"
              >
                <div
                  onClick={() => setActiveArticleId(article.id)}
                  className={`
                  p-4 rounded-xl border-3 cursor-pointer transition-all duration-200 hover:shadow-sm relative group
                  ${
                    article.id === activeArticleId
                      ? "border-green-600/50 bg-white"
                      : "border-neutral-200 bg-white hover:border-neutral-300 shadow-xs"
                  }
                `}
                >
                  <h3 className="font-bold text-sm mb-2 leading-tight text-neutral-900">
                    {article.header}
                  </h3>
                  <p className="text-xs text-neutral-500 line-clamp-3 leading-relaxed">
                    {article.content}
                  </p>

                  {/* {article.id !== activeArticleId && (
                  <div className="mt-3 flex justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-[10px] font-medium text-neutral-400 uppercase tracking-wider">
                      Click to review
                    </span>
                  </div>
                )} */}
                </div>
                <div className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-medium text-neutral-900">
                  {idx + 1}
                </div>
              </div>
            ))}
          </div>
        </aside>

        {/* article content */}
        <section
          ref={scrollContainerRef}
          className="flex-1 bg-bg-main overflow-y-auto relative flex justify-center scroll-smooth scrollbar-custom"
        >
          <div className="my-8 rounded-3xl border-6 border-green-600/50 shadow-sm h-fit">
            <div className="w-2xl 2xl:w-4xl bg-white min-h-full p-12 shadow-sm relative border-x rounded-[18px] border border-brand-green">
              <div className="text-title-red font-bold text-sm tracking-wider uppercase px-2 py-1 mb-2 rounded w-fit ml-auto">
                {activeArticle.company_news[0].company?.name ||
                  "Unknown Company"}
              </div>

              <div className="mb-6 mt-2">
                <h1 className="text-xl font-bold text-title-dark mb-4 leading-tight">
                  {activeArticle.header}
                </h1>
                <div className="flex items-center flex-wrap gap-x-2 gap-y-2 text-sm text-neutral-500">
                  <span className="font-bold text-subtitle-dark text-sm">
                    {activeArticle.news_source?.name ?? "Unknown Source"}
                  </span>
                  <span className="w-1.5 h-1.5 rounded-full bg-neutral-300"></span>
                  <span className="text-subtitle-dark font-medium text-sm">
                    {activeArticle.author}
                  </span>
                  <span className="w-1.5 h-1.5 rounded-full bg-neutral-300 "></span>
                  <span className="text-subtitle-dark font-medium text-sm">
                    {formatDate(activeArticle.published_date)}
                  </span>
                </div>
              </div>

              <div ref={contentRef}>
                <div
                  className="prose prose-sm max-w-none text-title-dark/90 text-sm leading-8 selection:bg-blue-100 selection:text-blue-900"
                  dangerouslySetInnerHTML={{
                    __html: activeArticle?.content ?? "",
                  }}
                />
              </div>
            </div>
          </div>

          {/* text selection popover */}
          {selectionRect && (
            <div
              className="fixed z-100 bg-white text-title-dark shadow-xl px-3 py-1.5 flex items-center gap-3 animate-in fade-in zoom-in-95 duration-200 border border-gray-300 rounded-md"
              style={{
                top: `${selectionRect.top - 48}px`,
                left: `${selectionRect.left + selectionRect.width / 2}px`,
                transform: "translateX(-50%)",
              }}
            >
              <span className="text-xs font-semibold font-mono">
                {selectedText.length}
              </span>
              <div className="h-3 w-px bg-neutral-400"></div>
              <button
                onClick={handleSelectText}
                className="text-xs font-bold text-blue-500 hover:text-blue-700 cursor-pointer"
              >
                Select
              </button>

              <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-white rotate-45"></div>
            </div>
          )}
        </section>

        {/* filters */}
        <aside className="w-[262.5px] border-l-2 border-border-dark bg-white flex flex-col shrink-0">
          <div className="flex-1 overflow-y-auto px-6 pt-6 space-y-8 scrollbar-custom">
            {FILTERS.map((group) => (
              <div key={group.name}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-subtitle-dark text-sm tracking-wide">
                    {group.name}
                  </h3>
                  <HelpCircle className="w-4 h-4 text-neutral-400 cursor-help" />
                </div>
                <div className="space-y-3">
                  {group.options.map((option, i) => (
                    <label
                      key={i}
                      className="flex items-center gap-3 cursor-pointer group select-none"
                    >
                      <div
                        className={`
                          w-5 h-5 rounded border flex items-center justify-center transition-all duration-200
                          ${
                            checkedFilters[`${group.name}-${option}`]
                              ? "bg-checkbox-bg"
                              : "border-gray-300 group-hover:border-blue-400"
                          }
                        `}
                      >
                        {checkedFilters[`${group.name}-${option}`] && (
                          <Check
                            className="w-3.5 h-3.5 text-white"
                            strokeWidth={3}
                          />
                        )}
                        <input
                          type="checkbox"
                          className="hidden"
                          onChange={() =>
                            toggleFilter(`${group.name}-${option}`)
                          }
                          checked={!!checkedFilters[`${group.name}-${option}`]}
                        />
                      </div>
                      <span
                        className={`text-sm transition-colors ${
                          checkedFilters[`${group.name}-${option}`]
                            ? "text-subtitle-dark font-medium"
                            : "text-neutral-600 group-hover:text-subtitle-dark"
                        }`}
                      >
                        {option}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            ))}
            <Button
              variant="outline"
              size="sm"
              className="rounded-full w-full text-subtitle-dark text-xs font-bold cursor-pointer"
            >
              Next
            </Button>

            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-subtitle-dark text-sm tracking-wide">
                Notes
              </h3>
              <HelpCircle className="w-4 h-4 text-neutral-400 cursor-help" />
            </div>

            <Button
              onClick={() => setShowFeedbackModal(true)}
              variant="outline"
              className="text-subtitle-dark flex gap-2 mx-auto w-full rounded-full cursor-pointer mt-auto"
            >
              <Image
                src="/icons/feedback.svg"
                alt="Luna logo"
                width={14}
                height={14}
                className="flex items-center p-0 m-0 "
              />
              <span className="text-sm font-semibold">Feedback</span>
              <div className="rounded-full bg-red-600 text-[10px] text-white px-2 py-1 flex items-center justify-center leading-normal">
                145
              </div>
            </Button>
          </div>
        </aside>

        {showFeedbackModal && (
          <FeedBackModal closeModal={() => setShowFeedbackModal(false)} />
        )}
      </div>
    </div>
  );
}
