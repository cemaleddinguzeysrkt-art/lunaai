"use client";

import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { cn, formatDate } from "@/lib/utils";
import { SingleTaskType } from "@/lib/types/news-types";
import { createTask, editTask } from "@/lib/actions/task";
import { toast } from "sonner";

export type TaskStatus = "pending" | "in_progress" | "completed" | "blocked";

interface AddTaskModalProps {
  open: boolean;
  onClose: () => void;
  compId: number; // company id the task belongs to
  editingTask?: SingleTaskType | null;
  onAdd?: (task: SingleTaskType) => void;
  onEdit?: (task: SingleTaskType) => void;
}

const TASK_STATUSES: { label: string; value: TaskStatus }[] = [
  { label: "Pending", value: "pending" },
  { label: "In Progress", value: "in_progress" },
  { label: "Completed", value: "completed" },
  { label: "Blocked", value: "blocked" },
];

const AddTaskModal: React.FC<AddTaskModalProps> = ({
  open,
  onClose,
  compId,
  editingTask,
  onAdd,
  onEdit,
}) => {
  const isEditMode = !!editingTask;

  const [status, setStatus] = useState<TaskStatus>("pending");
  const [dueDate, setDueDate] = useState<Date | undefined>(undefined);
  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState<{ status?: string }>({});

  // hydrate on edit
  useEffect(() => {
    if (open && editingTask) {
      setStatus(editingTask.status ?? "pending");
      setDueDate(
        editingTask.due_date ? new Date(editingTask.due_date) : undefined
      );
    }
  }, [open, editingTask]);

  // reset on close
  useEffect(() => {
    if (!open) {
      setStatus("pending");
      setDueDate(undefined);
      setErrors({});
      setIsSaving(false);
    }
  }, [open]);

  const validate = () => {
    const newErrors: { status?: string } = {};
    if (!status) newErrors.status = "Status is required.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  //   const handleSave = async () => {
  //     if (!validate()) return;

  //     setIsSaving(true);

  //     try {
  //       const payload = {
  //         comp_id: compId,
  //         status,
  //         due_date: dueDate ?? null,
  //       };

  //       if (isEditMode && editingTask) {
  //         // 🔁 replace with your real action
  //         const updatedTask: TaskType = {
  //           ...editingTask,
  //           ...payload,
  //         };

  //         onEdit?.(updatedTask);
  //       } else {
  //         // 🔁 replace with your real action
  //         const newTask: TaskType = {
  //           id: Date.now(), // temp id, backend should return real id
  //           ...payload,
  //         };

  //         onAdd?.(newTask);
  //       }

  //       onClose();
  //     } catch (err) {
  //       console.error("task save error", err);
  //     } finally {
  //       setIsSaving(false);
  //     }
  //   };

  const handleSave = async () => {
    if (!validate()) return;

    setIsSaving(true);

    try {
      const payload = {
        comp_id: compId,
        status,
        due_date: dueDate ?? null,
      };
      console.log("payyyyy",payload)

      if (isEditMode && editingTask?.id) {
        const updatedTask = await editTask(editingTask.id, payload);
        onEdit?.(updatedTask);
        toast.success("Task updated successfully",{richColors:true})
      } else {
        const newTask = await createTask(payload);
        onAdd?.(newTask);
        toast.success("Task created successfully",{richColors:true})
      }

      onClose();
    } catch (err) {
      console.error("task save error", err);
      toast.error("Failed to create task",{richColors:true})
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[420px]">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">
            {isEditMode ? "Edit Task" : "Add Task"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-5 py-2">
          {/* Status */}
          <div className="flex flex-col gap-1.5 w-full">
            <label className="text-sm font-medium">Status</label>
            <Select
              value={status}
              onValueChange={(val: TaskStatus) => {
                setStatus(val);
                setErrors((p) => ({ ...p, status: undefined }));
              }}
            >
              <SelectTrigger
                className={cn(
                  "w-full",
                  errors.status && "border-red-500 focus:ring-red-500"
                )}
              >
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                {TASK_STATUSES.map((s) => (
                  <SelectItem key={s.value} value={s.value} className="w-full">
                    {s.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.status && (
              <p className="text-xs text-red-500">{errors.status}</p>
            )}
          </div>

          {/* Due Date */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium">Due Date</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "justify-start text-left font-normal text-sm",
                    !dueDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dueDate ? formatDate(dueDate) : "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={dueDate}
                  onSelect={setDueDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        <DialogFooter className="pt-4">
          <Button
            onClick={handleSave}
            className="flex items-center gap-2 cursor-pointer  bg-blue-600 hover:bg-blue-700 text-white"
          >
            {isSaving && <Loader2 className="h-4 w-4 animate-spin" />}
            {isSaving ? "Saving..." : "Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddTaskModal;
