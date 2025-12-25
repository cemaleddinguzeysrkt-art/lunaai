"use client";

import { ThumbsDown, X } from "lucide-react";
import Image from "next/image";

interface CleaningFeedBackModalProps {
  onlike: VoidFunction;
  onDislike: VoidFunction;
  onNotSure: VoidFunction;
  isAddingFeedback: boolean;
}
const CleaningFeedBackModal = ({
  onlike,
  onDislike,
  onNotSure,
  isAddingFeedback
}: CleaningFeedBackModalProps) => {
  return (
    <div className="absolute bottom-6 right-1/2 left-1/2 bg-white drop-shadow-2xl border border-neutral-200 p-4 w-90 animate-in slide-in-from-bottom-4 z-30 rounded-full h-[54px] flex items-center !-translate-x-45">
      <div className="flex items-center gap-3 w-full">
        <button
          onClick={onDislike}
          className="flex-1 flex items-center justify-center gap-1.5 text-sm font-medium text-danger/80 hover:text-red-600 hover:bg-red-50 py-1.5 rounded-lg transition-colors border border-transparent hover:border-red-100 cursor-pointer"
        >
          <Image
            src="/icons/dislike.svg"
            alt="Luna logo"
            width={16}
            height={16}
            className="flex items-center p-0 m-0 "
          />
          Dislike
        </button>
        <div className="h-7 w-[1.5px] bg-border"></div>
        <button
          onClick={onNotSure}
          className="flex-1 flex items-center justify-center gap-1.5 text-sm font-medium text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 py-1.5 rounded-lg transition-colors border border-transparent hover:border-neutral-200 cursor-pointer"
        >
          <ThumbsDown className="w-4 h-4 rotate-90" />
          Not sure
        </button>
        <div className=" h-7 w-[1.5px] bg-border"></div>
        <button
          onClick={onlike}
          className="flex-1 flex items-center justify-center gap-1.5 text-sm font-medium text-success/80 hover:text-green-600 hover:bg-green-50 py-1.5 rounded-lg transition-colors border border-transparent hover:border-green-100 cursor-pointer"
        >
          <Image
            src="/icons/like.svg"
            alt="Luna logo"
            width={16}
            height={16}
            className="flex items-center p-0 m-0 "
          />
          Like
        </button>
      </div>
    </div>
  );
};

export default CleaningFeedBackModal;
