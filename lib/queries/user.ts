import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth";
import { User } from "../types/user-types";
import { getWeekStart } from "../utils";

export interface WeeklyTargetProgress {
  completedTargets: number;
  totalTargets: number;
}

type GetUsersResult = {
  ok: boolean;
  error: "UNAUTHORIZED" | "FORBIDDEN" | null;
  users: User[];
};

export async function getUsers(): Promise<GetUsersResult> {
  const session = await getServerSession(authOptions);

  if (!session) {
    return { ok: false, error: "UNAUTHORIZED", users: [] };
  }
  const userRole = session.user.role;

  if (userRole !== "admin") {
    return { ok: false, error: "FORBIDDEN", users: [] };
  }

  const data = await prisma.user.findMany({});

  const users = data.map((user) => ({
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  }));

  return {
    ok: true,
    users: users.map((u) => ({
      id: u.id,
      name: u.name,
      email: u.email,
      role: u.role as "admin" | "user",
    })),
    error: null,
  };
}

// export async function getWeeklyTargetProgress(
//   trainingType: "classifying" | "cleaning" = "cleaning"
// ): Promise<WeeklyTargetProgress> {
//   const session = await getServerSession(authOptions);

//   if (!session) {
//     throw new Error("Unauthorized");
//   }
//   const userId = session.user.id;
//   const targetName = `target:training-${trainingType};user:${userId}`;

//   const targetData = await prisma.definition.findFirst({
//     where: {
//       name: {
//         startsWith: targetName,
//       },
//     },
//   });

//   const sourceIdStr = targetData?.name
//     ?.split(";")
//     .find((part) => part.startsWith("sourceid:"))
//     ?.split(":")[1];

//   const sourceId = sourceIdStr ? Number(sourceIdStr) : null;

//   if (!sourceId) {
//     return {
//       completedTargets: 0,
//       totalTargets: 0,
//     };
//   }

//   const totalWeeklyTargets =
//     (targetData?.value && parseInt(targetData?.value)) || 0;
//   // const weekStart = getWeekStart();

//   const completedCleaningTargets = await prisma.news_training.count({
//     where: {
//       user_id: userId,
//       // time_stamp: {
//       //   gte: weekStart,
//       // },
//       like: {
//         not: null,
//       },
//       news: {
//         is: {
//           // news_source_id: sourceId,
//           invalid: 0,
//         },
//       },
//     },
//   });

//   const completedClassifyingTargets = await prisma.news_training.count({
//     where: {
//       user_id: userId,
//       // time_stamp: {
//       //   gte: weekStart,
//       // },
//       category: {
//         not: null,
//       },
//       news: {
//         is: {
//           // news_source_id: sourceId,
//           invalid: 0,
//         },
//       },
//     },
//   });

//   return {
//     completedTargets:
//       trainingType === "cleaning"
//         ? completedCleaningTargets
//         : completedClassifyingTargets,
//     totalTargets: totalWeeklyTargets,
//   };
// }

export async function getWeeklyTargetProgressForUser(
  trainingType: "cleaning" | "classifying",
  weeklyLimit?: number,
  sourceId?: number,
) {
  const session = await getServerSession(authOptions);

  if (!session) {
    throw new Error("Unauthorized");
  }
  const userId = session.user.id;

  // const nextActiveSourceId = await getNextActiveSource(trainingType)
  if (!weeklyLimit || !sourceId) {
    return {
      completedTargets: 0,
      totalTargets: 0,
      isCompleted: false,
    };
  }

  const completed = await prisma.news_training.count({
    where: {
      user_id: userId,
      ...(trainingType === "cleaning"
        ? { like: { not: null } }
        : { category: { not: null } }),
      news: {
        is: {
          news_source_id: sourceId,
          invalid: 0,
        },
      },
    },
  });

  return {
    completedTargets: completed,
    totalTargets: weeklyLimit,
    isCompleted: completed >= weeklyLimit,
  };
}

async function getOrderedUserTargets(
  userId: number,
  trainingType: "cleaning" | "classifying",
) {
  const targets = await prisma.definition.findMany({
    where: {
      name: {
        startsWith: `target:training-${trainingType};user:${userId}`,
      },
    },
  });

  return targets
    .map((t) => {
      const sourceId = Number(
        t.name
          ?.split(";")
          .find((p) => p.startsWith("sourceid:"))
          ?.split(":")[1],
      );

      return sourceId
        ? {
            sourceId,
            weeklyLimit: parseInt(t.value ?? "0"),
          }
        : null;
    })
    .filter(Boolean)
    .sort((a, b) => a!.sourceId - b!.sourceId) as {
    sourceId: number;
    weeklyLimit: number;
  }[];
}

export async function getNextActiveSource(
  trainingType: "cleaning" | "classifying",
) {
  const session = await getServerSession(authOptions);

  if (!session) {
    throw new Error("Unauthorized");
  }
  const userId = session.user.id;

  const targets = await getOrderedUserTargets(userId, trainingType);

  for (const target of targets) {
    const progress = await getWeeklyTargetProgressForUser(
      trainingType,
      target.weeklyLimit,
      target.sourceId,
    );

    if (!progress.isCompleted) {
      return {
        sourceId: target.sourceId,
        weeklyLimit: target.weeklyLimit,
      };
    }
  }

  return null;
}
