import Companies from "@/components/company/Companies";
import { getOrigins, getStatuses, getTags } from "@/lib/queries/article";
import { getCompanies, getTasks } from "@/lib/queries/company";

export const dynamic = "force-dynamic";

export default async function CompaniesPage() {
  const [initialCompaniesData, origins, statuses, tags, tasks] = await Promise.all([
    getCompanies(),
    getOrigins(),
    getStatuses(),
    getTags(),
    getTasks()
  ]);

  return (
    <Companies
      initialCompanies={initialCompaniesData}
      origins={origins.origins}
      statuses={statuses.statuses}
      tags={tags.tags}
      tasks={tasks}
    />
  );
}
