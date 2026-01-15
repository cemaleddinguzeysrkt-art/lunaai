import { NextRequest, NextResponse } from "next/server";
import { getArticles } from "@/lib/queries/article";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  const type = searchParams.get("type") as "classifying" | "cleaning";
  const cursor = searchParams.get("cursor");

  const articles = await getArticles(type, cursor ? Number(cursor) : undefined);

  return NextResponse.json(articles);
}
