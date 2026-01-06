"use server";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import bcrypt from "bcryptjs";
import { User } from "../types/user-types";

export type NewUserData = {
  id?: number;
  name: string;
  email: string;
  password?: string;
  role: string;
};

export async function addNewUser(data: NewUserData): Promise<User> {
  try {
    const session = await getServerSession(authOptions);
    if (!session) throw new Error("Unauthorized");

    if (session.user.role !== "admin") throw new Error("Forbidden");

    const existingUser = await prisma.user.findUnique({
      where: { email: data.email.toLowerCase().trim() },
    });
    if (existingUser) throw new Error("Email already in use");

    if (!data.password) throw new Error("Password is required");
    const hashedPassword = (await bcrypt.hash(data.password, 12)) as string;

    const newUser = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email.toLowerCase().trim(),
        password: hashedPassword,
        role: data.role,
        created_date: new Date(),
      },
    });

    return {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role as string,
    };
  } catch (error: any) {
    console.error("Error creating user:", error);
    throw new Error(error.message || "Failed to create user");
  }
}

export async function editUser(data: NewUserData): Promise<User> {
  try {
    const session = await getServerSession(authOptions);
    if (!session) throw new Error("Unauthorized");

    if (session.user.role !== "admin") throw new Error("Forbidden");

    const existingUser = await prisma.user.findUnique({
      where: { id: data.id },
    });
    if (!existingUser) throw new Error("User doesn't exist");

    if (data.email && data.email.toLowerCase().trim() !== existingUser.email) {
      const emailTaken = await prisma.user.findUnique({
        where: { email: data.email.toLowerCase().trim() },
      });
      if (emailTaken) throw new Error("Email already in use");
    }

    let hashedPassword = existingUser.password;
    if (data.password && data.password.trim().length > 0) {
      hashedPassword = await bcrypt.hash(data.password, 12);
    }

    const updatedUser = await prisma.user.update({
      where: { id: data.id },
      data: {
        name: data.name,
        email: data.email.toLowerCase().trim(),
        password: hashedPassword,
        role: data.role,
      },
    });

    return {
      id: updatedUser.id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role as string,
    };
  } catch (error: any) {
    console.error("Error editing user:", error);
    throw new Error(error.message || "Failed to edit user");
  }
}

export async function deleteUser(userId: number): Promise<User> {
  try {
    const session = await getServerSession(authOptions);
    if (!session) throw new Error("Unauthorized");

    if (session.user.role !== "admin") throw new Error("Forbidden");

    if (session.user.id === userId) {
      throw new Error("You cannot delete your own account");
    }

    const existingUser = await prisma.user.findUnique({
      where: { id: userId },
    });
    if (!existingUser) throw new Error("User not found");

    const deletedUser = await prisma.user.delete({
      where: { id: userId },
    });

    return {
      id: deletedUser.id,
      name: deletedUser.name,
      email: deletedUser.email,
      role: deletedUser.role as string,
    };
  } catch (error: any) {
    console.error("Error deleting user:", error);
    throw new Error(error.message || "Failed to delete user");
  }
}
