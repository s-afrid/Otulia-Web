// pages/JournalArticlePage.jsx
import { useParams, Navigate } from "react-router-dom";
import { journalArticles } from "../../data/journalArticles";

function JournalArticlePage() {
  const { slug } = useParams();
  const article = journalArticles[slug];

  if (!article) return <Navigate to="/journal" replace />;

  const ArticleContent = article.component;
  return <ArticleContent />;
}

export default JournalArticlePage;
