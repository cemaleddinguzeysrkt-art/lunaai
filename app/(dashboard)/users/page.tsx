import SettingsPage from "@/components/users/SettingsPage";
import { authOptions } from "@/lib/auth";
import {
  getCategories,
  getIndustries,
  getTargets,
  getTags,
  getTaskTypes,
} from "@/lib/queries/definition";
import { getUsers } from "@/lib/queries/user";
import { getServerSession } from "next-auth";
import { redirect, unauthorized } from "next/navigation";

export default async function Page() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "admin") {
    redirect("/"); 
  }

  const [
    userData,
    categoryData,
    industryData,
    tagData,
    taskTypeData,
    targetData,
  ] = await Promise.all([
    getUsers(),
    getCategories(),
    getIndustries(),
    getTags(),
    getTaskTypes(),
    getTargets(),
  ]);
  if (!userData.ok) {
    unauthorized();
  }
  return (
    <SettingsPage
      initialUsers={userData.users}
      initialCategories={categoryData}
      initialIndustries={industryData}
      initialTags={tagData}
      initialTaskTypes={taskTypeData}
      initialTargets={targetData}
    />
  );
}
