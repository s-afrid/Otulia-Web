import { useEffect, useState } from "react";

// Published CMS posts, shaped like the hardcoded `blogPosts` in BlogCards
// and ordered oldest -> newest (same convention as that array).
export default function useCmsPosts() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/blog")
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => {
        if (cancelled || !Array.isArray(data)) return;
        setPosts(
          data
            .map((p) => ({
              id: `cms-${p._id}`,
              tag: p.tag,
              category: p.category,
              title: p.title,
              image: p.heroImage,
              author: p.author,
              date: new Date(p.publishedAt).toLocaleDateString("en-GB", {
                day: "numeric",
                month: "long",
              }),
              readTime: p.readTime,
              link: `/journal/${p.slug}`,
            }))
            .reverse(),
        );
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  return posts;
}
