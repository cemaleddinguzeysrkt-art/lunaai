"use server";

import { prisma } from "@/lib/prisma";
import { taskSchema, CreateTaskType } from "@/lib/validation/task.schema";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { SingleTaskType } from "../types/news-types";

export async function createTask(input: CreateTaskType):Promise<SingleTaskType> {
  const session = await getServerSession(authOptions);

  if (!session) {
    throw new Error("Unauthorized");
  }

  const userId = session.user.id;

  const data = taskSchema.parse(input);

  return prisma.task.create({
    data: {
      comp_id: data.comp_id,
      status: data.status,
      due_date: data.due_date ?? null,
      user_id: userId,
    },
    include:{user:true}
  });
}

export async function editTask(taskId: number, input: CreateTaskType):Promise<SingleTaskType> {
  const session = await getServerSession(authOptions);

  if (!session) {
    throw new Error("Unauthorized");
  }

  const userId = session.user.id;
  const data = taskSchema.parse(input);

  return prisma.task.update({
    where: {
      id: taskId
    },
    data: {
      status: data.status,
      due_date: data.due_date ?? null,
      comp_id: data.comp_id,
    },
    include:{user:true}
  });
}
