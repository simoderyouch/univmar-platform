"use client";

import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScrollReveal from "@/components/ScrollReveal";
import { useLang, useLocalePath } from "@/lib/i18n";
import { BLOG_POSTS } from "@/content/blog/posts";

export default function BlogIndexClient() {
  const { t, lang } = useLang();
  const lp = useLocalePath();

  const posts = [...BLOG_POSTS].sort(
    (a, b) => new Date(b.datePublished).getTime() - new Date(a.datePublished).getTime()
  );

  return (
    <>
      <Navbar />
      <main className="blog-index">
        <div className="blog-index__inner">
          <ScrollReveal className="blog-index__header">
            <p className="eyebrow">Blog</p>
            <h1>{t.seo.blog.title.split("|")[0].trim()}</h1>
            <p className="blog-index__lead">{t.seo.blog.description}</p>
          </ScrollReveal>
          <ul className="blog-index__list">
            {posts.map((post) => {
              const c = post.content[lang];
              return (
                <ScrollReveal as="li" key={post.slug} className="blog-index__item">
                  <Link href={lp(`/blog/${post.slug}`)} className="blog-index__link">
                    <time dateTime={post.datePublished}>
                      {new Date(post.datePublished).toLocaleDateString(
                        lang === "ar" ? "ar-MA" : lang === "en" ? "en-GB" : "fr-FR",
                        { year: "numeric", month: "long", day: "numeric" }
                      )}
                    </time>
                    <h2>{c.title}</h2>
                    <p>{c.excerpt}</p>
                    <span className="blog-index__read">
                      {post.readingMinutes} min
                    </span>
                  </Link>
                </ScrollReveal>
              );
            })}
          </ul>
        </div>
      </main>
      <Footer />
    </>
  );
}
