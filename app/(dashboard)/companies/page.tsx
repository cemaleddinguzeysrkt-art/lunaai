import Companies from "@/components/company/Companies";
import { getCompanies } from "@/lib/queries/company";

export const dynamic = "force-dynamic";

export default async function CompaniesPage() {
  const [initialCompaniesData] = await Promise.all([getCompanies()]);

  return <Companies initialCompanies={initialCompaniesData} />;
}
