import { ArticleType } from "@/lib/types/news-types";


export async function fetchNextCenterNews(trainingType: "classifying" | "cleaning" = "cleaning"): Promise<ArticleType | null> {

  let res:Response 
  if(trainingType == "cleaning"){
    res = await fetch(`/api/next-news`);
  }
  else{
    res = await fetch(`/api/next-classifying-news`);
  }
  if (res.status === 404) return null;
  if (!res.ok) throw new Error("Failed to fetch next news");
  return res.json();
}

export async function fetchMoreArticles(
  trainingType: "classifying" | "cleaning",
  cursor?: number
) {
  const res = await fetch(
    `/api/articles?type=${trainingType}&cursor=${cursor}`
  );

  if (!res.ok) throw new Error("Failed to fetch more articles");

  return res.json();
}
