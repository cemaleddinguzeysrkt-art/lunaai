
import SettingsPage from "@/components/users/SettingsPage";
import {
  getCategories,
  getIndustries,
  getTargets,
  getTags,
  getTaskTypes
} from "@/lib/queries/definition";
import { getUsers } from "@/lib/queries/user";
import { unauthorized } from "next/navigation";

export default async function Page() {
  const [userData, categoryData, industryData, tagData, taskTypeData, targetData] = await Promise.all([
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
  return <SettingsPage
  initialUsers={userData.users} 
  initialCategories={categoryData}
  initialIndustries={industryData}
  initialTags={tagData}
  initialTaskTypes={taskTypeData}
  initialTargets={targetData}
  />;
}
