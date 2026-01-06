import { User, UserRole } from "@/lib/types/user-types";
import React, { useState, useEffect } from "react";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import {
  Eye,
  EyeOff,
  Loader2,
  RotateCcwKey,
  Trash,
  Trash2,
  TrashIcon,
  X,
} from "lucide-react";
import {
  addNewUser,
  deleteUser,
  editUser,
  NewUserData,
} from "@/lib/actions/user";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { set } from "zod";
import { DeleteConfirmationModal } from "../DeleteConfirmation";

interface UserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (userData: User) => void;
  onEditSubmit: (userData: User) => void;
  onDelete: (id: number) => void;
  editingUser: User | null;
}
const roleOptions: { name: string; value: UserRole }[] = [
  { name: "User", value: "user" },
  { name: "Admin", value: "admin" },
];
const UserModal: React.FC<UserModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  onEditSubmit,
  editingUser,
  onDelete,
}) => {
  const [isSubmitting, setisSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isDeleteConfirmModalOpen, setIsDeleteConfirmModalOpen] =
    useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isResettingPassword, setIsResettingPassword] = useState(false);
  const [formData, setFormData] = useState<NewUserData>({
    name: "",
    email: "",
    password: "",
    role: "",
  });
  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    password?: string;
    role?: string;
  }>({});

  useEffect(() => {
    if (editingUser) {
      setFormData({
        name: editingUser.name,
        email: editingUser.email,
        role: editingUser.role,
        password: "",
      });
      console.log("editing user detected", editingUser);
      setIsResettingPassword(false);
    } else {
      setFormData({
        name: "",
        email: "",
        role: "",
        password: "",
      });
    }
    setErrors({});
  }, [editingUser, isOpen]);

  if (!isOpen) return null;

  const validate = () => {
    const newErrors: {
      name?: string;
      email?: string;
      password?: string;
      role?: string;
    } = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }
    // Password validation — only for new users or when editing and password is provided
    if (!editingUser || formData.password) {
      if (!formData.password?.trim()) {
        newErrors.password = "Password is required";
      } else if (formData.password.length < 8) {
        newErrors.password = "Password must be at least 8 characters";
      } else if (!/(?=.*[a-zA-Z])(?=.*\d)/.test(formData.password)) {
        newErrors.password = "Password must contain letters and numbers";
      }
    }

    // Role validation
    if (!formData.role) newErrors.role = "Role is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      setisSubmitting(true);
      try {
        let result: User;

        if (editingUser) {
          // Editing an existing user
          result = await editUser({ ...formData, id: editingUser.id });
          toast.success("User updated successfully", { richColors: true });
          onEditSubmit(result);
        } else {
          // Adding a new user
          result = await addNewUser(formData);
          toast.success("User added successfully", { richColors: true });
          onSubmit(result);
        }

        onClose();
      } catch (error) {
        if (error instanceof Error) {
          toast.error(
            `Failed to ${editingUser ? "update" : "add"} user: ${
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
    if (!editingUser) return;
    setIsDeleting(true);
    try {
      await deleteUser(editingUser.id);
      toast.success("User deleted successfully", { richColors: true });
      onClose();
      onDelete(editingUser.id);
      setIsDeleteConfirmModalOpen(false);
    } catch (error) {
      toast.error("Failed to delete user", { richColors: true });
    }
    finally{
      setIsDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-md rounded-xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="px-6 py-4 border-b-[1.5px] border-border flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">
            {editingUser ? "Edit User" : "Add New User"}
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
              placeholder="e.g. John Doe"
            />
            {errors.name && (
              <p className="mt-1 text-xs text-danger">{errors.name}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <Input
              type="email"
              value={formData.email}
              onChange={(e) => {
                setFormData({ ...formData, email: e.target.value });
                setErrors({ ...errors, email: undefined });
              }}
              className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 ${
                errors.email ? "border-red-500" : "border-gray-200"
              }`}
              placeholder="e.g. john@example.com"
            />
            {errors.email && (
              <p className="mt-1 text-xs text-danger">{errors.email}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            {editingUser && !isResettingPassword ? (
              <Button
                size="sm"
                variant="ghost"
                onClick={(e) => {
                  e.preventDefault();
                  setIsResettingPassword(true);
                }}
                className="cursor-pointer"
              >
                <RotateCcwKey className="size-4 mr-2" />
                Reset password
              </Button>
            ) : (
              <>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={(e) => {
                      setFormData({ ...formData, password: e.target.value });
                      setErrors({ ...errors, password: undefined });
                    }}
                    className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 ${
                      errors.password ? "border-red-500" : "border-gray-200"
                    }`}
                    placeholder={
                      isResettingPassword
                        ? "Enter a new password to reset"
                        : "Enter password"
                    }
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="cursor-pointer absolute inset-y-0 right-2 flex items-center text-gray-500 hover:text-gray-700"
                    tabIndex={-1}
                  >
                    {showPassword ? (
                      <EyeOff className="size-5" />
                    ) : (
                      <Eye className="size-5" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-1 text-xs text-danger">{errors.password}</p>
                )}
              </>
            )}
          </div>

          <div className="w-full">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Role
            </label>
            <Select
              key={formData.role || "empty"}
              onValueChange={(value) => {
                setFormData({ ...formData, role: value as UserRole });
                setErrors({ ...errors, role: undefined });
              }}
              value={formData.role}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a role" />
              </SelectTrigger>
              <SelectContent className="z-[1000]">
                <SelectGroup>
                  <SelectLabel>Roles</SelectLabel>
                  {roleOptions?.map((role) => (
                    <SelectItem key={role.value} value={role.value}>
                      {role.name}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
            {errors.role && (
              <p className="mt-1 text-xs text-danger">{errors.role}</p>
            )}
          </div>

          <div className="flex items-center gap-3 pt-4">
            {editingUser && (
              <Button
                size="md"
                type="button"
                color="#CB0000"
                onClick={() => setIsDeleteConfirmModalOpen(true)}
                variant="outline"
                className="text-danger cursor-pointer flex items-center gap-2 flex-1 px-4 py-2 text-sm font-medium rounded-lg transition-colors border-danger/30 hover:bg-danger/5"
              >
                <Trash2 className="size-4" />
                <span>Delete User</span>
              </Button>
            )}
            <Button
              size="md"
              type="submit"
              className="flex gap-2 items-center cursor-pointer flex-1 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
            >
              {isSubmitting && <Loader2 className="size-4 animate-spin" />}
              <span>{editingUser ? "Save Changes" : "Add User"}</span>
            </Button>
          </div>
        </form>
      </div>

      <DeleteConfirmationModal
        title="Delete user"
        description="Are you sure you want to delete this user? This action cannot be undone."
        itemName={editingUser?.name}
        isOpen={isDeleteConfirmModalOpen}
        onConfirm={handleDelete}
        onCancel={() => setIsDeleteConfirmModalOpen(false)}
        isLoading={isDeleting}
      />
    </div>
  );
};

export default UserModal;
