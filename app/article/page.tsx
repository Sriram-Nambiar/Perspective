import ArticleDetailPage from "./[id]/page";

export default function ArticlePage() {
  return (
    <ArticleDetailPage
      params={Promise.resolve({ id: "2" })}
    />
  );
}
