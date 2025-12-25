import ArticleReview from "@/components/article/ArticleReview";
import {
  getArticles,
  getFilters,
  getOrigins,
  getStatuses,
  getTags,
  getWidth,
} from "@/lib/queries/article";

export const dynamic = "force-dynamic";

export default async function TrainingsPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: "classifying" | "cleaning" }>;
}) {
  const resolvedSearchParams = await searchParams;
  
  const trainingType = resolvedSearchParams.type ?? "classifying";
  console.log("typeeeee",trainingType)

  const [articles, filters, origins, statuses, tags, initialWidth] =
    await Promise.all([
      getArticles(trainingType),
      getFilters(),
      getOrigins(),
      getStatuses(),
      getTags(),
      getWidth(trainingType),
    ]);

  return (
    <ArticleReview
      key={trainingType}
      articles={articles ?? []}
      categories={filters.categories}
      industries={filters.industries}
      origins={origins.origins}
      statuses={statuses.statuses}
      tags={tags.tags}
      leftWidth={initialWidth.leftWidth}
      rightWidth={initialWidth.rightWidth}
    />
  );
}
