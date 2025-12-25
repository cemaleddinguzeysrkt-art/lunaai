import { prisma } from "@/lib/prisma";

export async function getCompanies() {
  const companies = await prisma.company.findMany({
    orderBy: {
      id: "asc",
    },
    take:50,
    include: {
      company_news: true,
      user:true
    },
  });

  return {
    companies,
  };
}

export async function getCompanyNewses(companyId: number) {
  const company_newses = await prisma.company_news.findMany({
    where: { company_id: companyId },
    include: {
      news: {
        include: {
          news_source: true,
        },
      },
    },
  });

  const newses = company_newses.map((cn) => ({
    id: cn.news?.id ?? null,
    published_date: cn.news?.published_date ?? null,
    author: cn.news?.author ?? null,
    url: cn.news?.url ?? null,
    header: cn.news?.header ?? null,
    portal: cn.news?.news_source?.name ?? null,
  }));

  return {
    newses,
  };
}
