// pages/JournalArticlePage.jsx
import React from "react";
import { useParams } from "react-router-dom";
import { journalArticles } from "../../data/journalArticles";
import SEO from "../../components/SEO";
import NotFound from "../NotFound";

function JournalArticlePage() {
  const { slug } = useParams();
  const article = Object.prototype.hasOwnProperty.call(journalArticles, slug)
    ? journalArticles[slug]
    : null;

  if (!article) return <NotFound />;

  const ArticleContent = article.component;
  return (
    <>
      <SEO
        title={`${article.title} | Otulia Journal`}
        description={article.description}
        type="article"
        breadcrumbs={[
          { label: "Home", path: "/" },
          { label: "Journal", path: "/journal" },
          { label: article.title, path: `/journal/${slug}` },
        ]}
      />
      <ArticleContent />
    </>
  );
}

export default JournalArticlePage;
