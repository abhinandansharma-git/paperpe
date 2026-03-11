'use client';

import Link from 'next/link';
import { ArrowLeft, Clock, Tag, BookOpen, ChevronRight } from 'lucide-react';
import { getPostBySlug, posts } from '../posts';
import { notFound } from 'next/navigation';

interface PageProps {
  params: { slug: string };
}

function renderContent(content: string) {
  const lines = content.trim().split('\n');
  const elements: JSX.Element[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i].trim();

    if (!line) {
      i++;
      continue;
    }

    if (line.startsWith('## ')) {
      elements.push(
        <h2 key={i} className="text-2xl font-bold text-gray-900 mt-10 mb-4">
          {line.replace('## ', '')}
        </h2>
      );
      i++;
      continue;
    }

    if (line.startsWith('### ')) {
      elements.push(
        <h3 key={i} className="text-xl font-semibold text-gray-800 mt-7 mb-3">
          {line.replace('### ', '')}
        </h3>
      );
      i++;
      continue;
    }

    if (line.startsWith('**') && line.endsWith('**') && !line.slice(2, -2).includes('**')) {
      elements.push(
        <p key={i} className="font-semibold text-gray-900 mt-4 mb-2">
          {line.slice(2, -2)}
        </p>
      );
      i++;
      continue;
    }

    // Table detection
    if (line.startsWith('|')) {
      const tableLines: string[] = [];
      while (i < lines.length && lines[i].trim().startsWith('|')) {
        tableLines.push(lines[i].trim());
        i++;
      }
      const headerRow = tableLines[0];
      const dataRows = tableLines.slice(2); // skip separator
      const headers = headerRow.split('|').filter(c => c.trim()).map(c => c.trim());
      const rows = dataRows.map(r => r.split('|').filter(c => c.trim()).map(c => c.trim()));

      elements.push(
        <div key={`table-${i}`} className="overflow-x-auto my-6">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="bg-blue-50">
                {headers.map((h, hi) => (
                  <th key={hi} className="border border-blue-200 px-4 py-2 text-left font-semibold text-blue-800">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, ri) => (
                <tr key={ri} className={ri % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  {row.map((cell, ci) => (
                    <td key={ci} className="border border-gray-200 px-4 py-2 text-gray-700">
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
      continue;
    }

    // Bullet list
    if (line.startsWith('- ')) {
      const listItems: string[] = [];
      while (i < lines.length && lines[i].trim().startsWith('- ')) {
        listItems.push(lines[i].trim().replace(/^- /, ''));
        i++;
      }
      elements.push(
        <ul key={`ul-${i}`} className="list-none my-4 space-y-2">
          {listItems.map((item, li) => (
            <li key={li} className="flex items-start gap-2 text-gray-700">
              <span className="mt-1.5 w-2 h-2 rounded-full bg-blue-400 flex-shrink-0" />
              <span dangerouslySetInnerHTML={{ __html: formatInline(item) }} />
            </li>
          ))}
        </ul>
      );
      continue;
    }

    // Numbered list
    if (/^\d+\./.test(line)) {
      const listItems: string[] = [];
      while (i < lines.length && /^\d+\./.test(lines[i].trim())) {
        listItems.push(lines[i].trim().replace(/^\d+\.\s*/, ''));
        i++;
      }
      elements.push(
        <ol key={`ol-${i}`} className="list-none my-4 space-y-2">
          {listItems.map((item, li) => (
            <li key={li} className="flex items-start gap-3 text-gray-700">
              <span className="mt-0.5 w-6 h-6 rounded-full bg-blue-500 text-white text-xs font-bold flex items-center justify-center flex-shrink-0">
                {li + 1}
              </span>
              <span dangerouslySetInnerHTML={{ __html: formatInline(item) }} />
            </li>
          ))}
        </ol>
      );
      continue;
    }

    // Regular paragraph
    elements.push(
      <p key={i} className="text-gray-700 leading-relaxed my-4"
        dangerouslySetInnerHTML={{ __html: formatInline(line) }}
      />
    );
    i++;
  }

  return elements;
}

function formatInline(text: string): string {
  return text
    .replace(/\*\*(.+?)\*\*/g, '<strong class="font-semibold text-gray-900">$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/`(.+?)`/g, '<code class="bg-gray-100 text-blue-700 px-1 py-0.5 rounded text-sm font-mono">$1</code>');
}

export default function BlogPostPage({ params }: PageProps) {
  const post = getPostBySlug(params.slug);

  if (!post) {
    notFound();
  }

  const related = posts.filter(p => p.slug !== post.slug && p.category === post.category).slice(0, 2);
  const others = posts.filter(p => p.slug !== post.slug && p.category !== post.category).slice(0, 2 - related.length);
  const relatedPosts = [...related, ...others].slice(0, 2);

  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: 'Inter, sans-serif' }}>
      {/* Header */}
      <header className="border-b border-gray-100 bg-white sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center font-bold text-white text-lg">
              P
            </div>
            <span className="font-semibold text-xl text-gray-900">PaperPe</span>
          </Link>
          <Link
            href="/blog"
            className="text-gray-500 hover:text-blue-500 flex items-center gap-1 text-sm transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> All Articles
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="py-12 px-6 bg-gradient-to-b from-gray-50 to-white border-b border-gray-100">
        <div className="max-w-3xl mx-auto">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-gray-400 mb-6">
            <Link href="/" className="hover:text-blue-500 transition-colors">Home</Link>
            <ChevronRight className="w-3 h-3" />
            <Link href="/blog" className="hover:text-blue-500 transition-colors">Blog</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-gray-600 truncate">{post.title}</span>
          </div>

          {/* Category & Meta */}
          <div className="flex items-center gap-4 mb-5">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
              <Tag className="w-3.5 h-3.5" />
              {post.category}
            </span>
            <span className="text-gray-400 text-sm flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              {post.readTime} read
            </span>
            <span className="text-gray-400 text-sm">{post.date}</span>
          </div>

          {/* Title */}
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight mb-4">
            {post.title}
          </h1>
          <p className="text-lg text-gray-500 leading-relaxed">{post.excerpt}</p>
        </div>
      </section>

      {/* Article Body */}
      <main className="py-12 px-6">
        <div className="max-w-3xl mx-auto">
          <article className="prose-custom">
            {renderContent(post.content)}
          </article>

          {/* Divider */}
          <div className="my-12 border-t border-gray-100" />

          {/* CTA Box */}
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-8 text-white text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/20 rounded-full text-sm font-medium mb-4">
              <BookOpen className="w-4 h-4" />
              Practice What You Just Learned
            </div>
            <h2 className="text-2xl font-bold mb-3">
              Apply This Knowledge Risk-Free
            </h2>
            <p className="text-blue-100 mb-6 max-w-md mx-auto">
              PaperPe gives you ₹10 Lakh virtual capital to trade NIFTY, BANKNIFTY, and MCX in real market conditions — zero risk, real learning.
            </p>
            <div className="flex items-center justify-center gap-4 flex-wrap">
              <Link
                href="/"
                className="bg-white text-blue-600 hover:bg-blue-50 px-6 py-3 rounded-lg font-semibold transition-colors"
              >
                Join Waitlist — Free
              </Link>
              <Link
                href="/blog"
                className="text-white border border-white/40 hover:bg-white/10 px-6 py-3 rounded-lg font-medium transition-colors"
              >
                Read More Articles
              </Link>
            </div>
          </div>

          {/* Related Posts */}
          {relatedPosts.length > 0 && (
            <div className="mt-12">
              <h3 className="text-xl font-bold text-gray-900 mb-6">More Articles</h3>
              <div className="grid md:grid-cols-2 gap-4">
                {relatedPosts.map((related) => (
                  <Link
                    key={related.slug}
                    href={`/blog/${related.slug}`}
                    className="group block"
                  >
                    <article className="border border-gray-200 rounded-xl p-5 hover:border-blue-300 hover:shadow-md transition-all h-full">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs bg-blue-100 text-blue-600 px-2 py-0.5 rounded font-medium">
                          {related.category}
                        </span>
                        <span className="text-xs text-gray-400 flex items-center gap-1">
                          <Clock className="w-3 h-3" /> {related.readTime}
                        </span>
                      </div>
                      <h4 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors text-sm leading-snug mb-1">
                        {related.title}
                      </h4>
                      <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">
                        {related.excerpt}
                      </p>
                    </article>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-100 py-8 px-6 mt-12 bg-gray-50">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-7 h-7 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center font-bold text-white text-sm">
              P
            </div>
            <span className="font-semibold text-gray-900">PaperPe</span>
          </Link>
          <p className="text-sm text-gray-400">
            India's paper trading platform for MCX & F&O. Practice before you go live.
          </p>
          <div className="flex items-center gap-4 text-sm text-gray-400">
            <Link href="/blog" className="hover:text-blue-500 transition-colors">Blog</Link>
            <Link href="/tools" className="hover:text-blue-500 transition-colors">Tools</Link>
            <Link href="/" className="hover:text-blue-500 transition-colors">Home</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
