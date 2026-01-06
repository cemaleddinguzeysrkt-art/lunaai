import { DefinitionItem, TabType } from "@/lib/types/user-types";
import { Loader2, Trash2, X } from "lucide-react";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { DeleteConfirmationModal } from "../DeleteConfirmation";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import {
  addNewDefinition,
  deleteDefinition,
  editDefinition,
} from "@/lib/actions/definition";

interface DefinitionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (definitionData: DefinitionItem) => void;
  onEditSubmit: (definitionData: DefinitionItem) => void;
  onDelete: (id: number) => void;
  editingDefinition: DefinitionItem | null;
  activeTab?: TabType;
}

const DefinitionModal: React.FC<DefinitionModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  onEditSubmit,
  editingDefinition,
  onDelete,
  activeTab,
}) => {
  const [isSubmitting, setisSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isDeleteConfirmModalOpen, setIsDeleteConfirmModalOpen] =
    useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isResettingPassword, setIsResettingPassword] = useState(false);
  const [formData, setFormData] = useState<DefinitionItem>({
    name: "",
  });
  const [errors, setErrors] = useState<{
    name?: string;
  }>({});

  useEffect(() => {
    if (editingDefinition) {
      setFormData({
        name: editingDefinition.name,
      });
      console.log("editing definition detected", editingDefinition);
      setIsResettingPassword(false);
    } else {
      setFormData({
        name: "",
      });
    }
    setErrors({});
  }, [editingDefinition, isOpen]);

  if (!isOpen) return null;

  const validate = () => {
    const newErrors: {
      name?: string;
    } = {};

    if (!formData.name.trim()) newErrors.name = "Name is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      setisSubmitting(true);
      try {
        let result: DefinitionItem;

        if (editingDefinition) {
          result = await editDefinition({
            id: editingDefinition.id as number,
            value: formData.name,
          });
          toast.success("Definition updated successfully", {
            richColors: true,
          });
          onEditSubmit(result);
        } else {
          result = await addNewDefinition({
            type: activeTab as Omit<TabType, "Users" | "Target">,
            value: formData.name,
          });
          toast.success("Definition added successfully", { richColors: true });
          onSubmit(result);
        }

        onClose();
      } catch (error) {
        if (error instanceof Error) {
          toast.error(
            `Failed to ${editingDefinition ? "update" : "add"} definition: ${
              error.message
            }`,
            { richColors: true }
          );
        }
      } finally {
        setisSubmitting(false);
      }
    }
  };

  const handleDelete = async () => {
    if (!editingDefinition) return;
    setIsDeleting(true);
    try {
      await deleteDefinition({ id: editingDefinition.id as number });
      toast.success("Definition deleted successfully", { richColors: true });
      onClose();
      onDelete(editingDefinition?.id as number);
      setIsDeleteConfirmModalOpen(false);
    } catch (error) {
      toast.error("Failed to delete definition", { richColors: true });
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-md rounded-xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="px-6 py-4 border-b-[1.5px] border-border flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">
            {editingDefinition ? `Edit ${activeTab}` : `Add New ${activeTab}`}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="cursor-pointer size-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Name
            </label>
            <Input
              type="text"
              value={formData.name}
              onChange={(e) => {
                setFormData({ ...formData, name: e.target.value });
                setErrors({ ...errors, name: undefined });
              }}
              className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 ${
                errors.name ? "border-red-500" : "border-gray-200"
              }`}
              placeholder={`Enter ${activeTab} name`}
            />
            {errors.name && (
              <p className="mt-1 text-xs text-danger">{errors.name}</p>
            )}
          </div>

          <div className="flex items-center gap-3 pt-4">
            {editingDefinition && (
              <Button
                size="md"
                type="button"
                color="#CB0000"
                onClick={() => setIsDeleteConfirmModalOpen(true)}
                variant="outline"
                className="text-danger cursor-pointer flex items-center gap-2 flex-1 px-4 py-2 text-sm font-medium rounded-lg transition-colors border-danger/30 hover:bg-danger/5"
              >
                <Trash2 className="size-4" />
                <span>Delete {activeTab}</span>
              </Button>
            )}
            <Button
              size="md"
              type="submit"
              className="flex gap-2 items-center cursor-pointer flex-1 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
            >
              {isSubmitting && <Loader2 className="size-4 animate-spin" />}
              <span>{editingDefinition ? "Save Changes" : `Add ${activeTab}`}</span>
            </Button>
          </div>
        </form>
      </div>

      <DeleteConfirmationModal
        title="Delete definition"
        description="Are you sure you want to delete this definition?"
        itemName={editingDefinition?.name}
        isOpen={isDeleteConfirmModalOpen}
        onConfirm={handleDelete}
        onCancel={() => setIsDeleteConfirmModalOpen(false)}
        isLoading={isDeleting}
      />
    </div>
  );
};

export default DefinitionModal;
