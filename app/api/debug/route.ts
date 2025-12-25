import { NextResponse } from "next/server";
import { getCompanies, getCompanyNewses } from "@/lib/queries/company";
import { getStatuses, getTrainings } from "@/lib/queries/article";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const companyId = searchParams.get("companyId");

  const data = await getStatuses();

  console.log("api debug statuses", data.statuses);

  return NextResponse.json(data);
}
