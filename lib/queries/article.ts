import { prisma } from "@/lib/prisma";

export async function getArticles() {
  const news = await prisma.news.findMany({
    take:100,
    include: {
      news_source: true,
      company_news: {
        include: { company: true },
      },
      training:true
    },
  });

  return news;
}

export async function getFilters() {
  const categories = await prisma.definition.findMany({
    where: { name: "Category" },
  });
  const industries = await prisma.definition.findMany({
    where: { name: "Industry" },
  });

  return {
    categories,
    industries,
  };
}

export async function getTrainings() {
  const trainings = await prisma.training.findMany();

  return trainings;
}
