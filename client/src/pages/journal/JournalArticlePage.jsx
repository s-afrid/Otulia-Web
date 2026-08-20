// pages/JournalArticlePage.jsx
import React, { useEffect } from "react";
import { useParams, Navigate } from "react-router-dom";
import { journalArticles } from "../../data/journalArticles";

function JournalArticlePage() {
  const { slug } = useParams();
  const article = journalArticles[slug];

  useEffect(() => {
    if (article?.title) {
      document.title = `${article.title} | Otulia Journal`;
    } else {
      document.title = "Journal | Otulia";
    }

    return () => {
      document.title = "Otulia - Buy & Sell Luxury Assets Worldwide";
    };
  }, [article]);

  if (!article) return <Navigate to="/journal" replace />;

  const ArticleContent = article.component;
  return <ArticleContent />;
}

export default JournalArticlePage;
