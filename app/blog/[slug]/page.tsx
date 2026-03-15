'use client';

import Link from 'next/link';
import { ArrowLeft, Clock, Tag, ArrowRight, ChevronRight, TrendingUp } from 'lucide-react';
import { getPostBySlug, allPosts } from '../posts';
import { notFound } from 'next/navigation';

interface PageProps {
  params: { slug: string };
}

function formatInline(text: string): string {
  return text
    .replace(/\*\*(.+?)\*\*/g, '<strong style="color:#e2e8f0;font-weight:700">$1</strong>')
    .replace(/\*(.+?)\*/g, '<em style="color:#94a3b8">$1</em>')
    .replace(/`(.+?)`/g, '<code style="background:rgba(0,192,118,0.1);color:#00C076;padding:2px 7px;border-radius:5px;font-size:0.88em;font-family:monospace">$1</code>');
}

function renderContent(content: string) {
  const lines = content.trim().split('\n');
  const elements: JSX.Element[] = [];
  let i = 0;
  let sectionCount = 0;

  while (i < lines.length) {
    const line = lines[i].trim();

    if (!line) { i++; continue; }

    // H2
    if (line.startsWith('## ')) {
      sectionCount++;
      elements.push(
        <h2 key={i} style={{
          fontSize: 26, fontWeight: 800, color: '#e2e8f0',
          marginTop: 56, marginBottom: 16, letterSpacing: '-0.02em',
          paddingBottom: 12, borderBottom: '1px solid rgba(255,255,255,0.06)',
        }}>
          {line.replace('## ', '')}
        </h2>
      );
      i++; continue;
    }

    // H3
    if (line.startsWith('### ')) {
      elements.push(
        <h3 key={i} style={{
          fontSize: 19, fontWeight: 700, color: '#cbd5e1',
          marginTop: 36, marginBottom: 12,
        }}>
          {line.replace('### ', '')}
        </h3>
      );
      i++; continue;
    }

    // Bold standalone = callout label
    if (line.startsWith('**') && line.endsWith('**') && !line.slice(2, -2).includes('**')) {
      elements.push(
        <p key={i} style={{ fontWeight: 700, color: '#00C076', marginTop: 24, marginBottom: 8, fontSize: 15 }}>
          {line.slice(2, -2)}
        </p>
      );
      i++; continue;
    }

    // Table
    if (line.startsWith('|')) {
      const tableLines: string[] = [];
      while (i < lines.length && lines[i].trim().startsWith('|')) {
        tableLines.push(lines[i].trim());
        i++;
      }
      const headers = tableLines[0].split('|').filter(c => c.trim()).map(c => c.trim());
      const rows = tableLines.slice(2).map(r => r.split('|').filter(c => c.trim()).map(c => c.trim()));

      elements.push(
        <div key={`table-${i}`} style={{ overflowX: 'auto', margin: '28px 0' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
            <thead>
              <tr style={{ background: 'rgba(0,192,118,0.08)', borderBottom: '1px solid rgba(0,192,118,0.2)' }}>
                {headers.map((h, hi) => (
                  <th key={hi} style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 700, color: '#00C076', fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, ri) => (
                <tr key={ri} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)', background: ri % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.02)' }}>
                  {row.map((cell, ci) => (
                    <td key={ci} style={{ padding: '11px 16px', color: '#94a3b8', fontSize: 14 }}
                      dangerouslySetInnerHTML={{ __html: formatInline(cell) }} />
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
        <ul key={`ul-${i}`} style={{ listStyle: 'none', margin: '16px 0', padding: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
          {listItems.map((item, li) => (
            <li key={li} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, color: '#94a3b8', fontSize: 15, lineHeight: 1.7 }}>
              <span style={{ marginTop: 8, width: 6, height: 6, borderRadius: '50%', background: '#00C076', flexShrink: 0, display: 'block' }} />
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
        <ol key={`ol-${i}`} style={{ listStyle: 'none', margin: '16px 0', padding: 0, display: 'flex', flexDirection: 'column', gap: 12 }}>
          {listItems.map((item, li) => (
            <li key={li} style={{ display: 'flex', alignItems: 'flex-start', gap: 14, color: '#94a3b8', fontSize: 15, lineHeight: 1.7 }}>
              <span style={{ minWidth: 26, height: 26, borderRadius: '50%', background: 'rgba(0,192,118,0.12)', border: '1px solid rgba(0,192,118,0.25)', color: '#00C076', fontSize: 12, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                {li + 1}
              </span>
              <span dangerouslySetInnerHTML={{ __html: formatInline(item) }} />
            </li>
          ))}
        </ol>
      );
      continue;
    }

    // Paragraph
    elements.push(
      <p key={i} style={{ color: '#94a3b8', lineHeight: 1.85, margin: '16px 0', fontSize: 16 }}
        dangerouslySetInnerHTML={{ __html: formatInline(line) }}
      />
    );
    i++;
  }

  return elements;
}

export default function BlogPostPage({ params }: PageProps) {
  const post = getPostBySlug(params.slug);
  if (!post) notFound();

  const related = allPosts.filter(p => p.slug !== post!.slug && p.category === post!.category).slice(0, 2);
  const others = allPosts.filter(p => p.slug !== post!.slug && p.category !== post!.category).slice(0, 2 - related.length);
  const relatedPosts = [...related, ...others].slice(0, 2);

  return (
    <div style={{ background: '#0D1117', color: '#e2e8f0', minHeight: '100vh', fontFamily: "'Inter', sans-serif" }}>

      <style>{`
        @keyframes fadeUp { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
        .fade-up { animation: fadeUp 0.6s ease both; }
        .related-card { background:#161B22; border:1px solid #21262D; border-radius:16px; padding:20px; text-decoration:none; color:inherit; display:block; transition:all 0.2s; }
        .related-card:hover { border-color:rgba(0,192,118,0.3); transform:translateY(-2px); }
        .nav-link { color:#64748b; text-decoration:none; font-size:14px; transition:color 0.2s; }
        .nav-link:hover { color:#e2e8f0; }
        .inline-cta { display:inline-flex; align-items:center; gap:6px; color:#00C076; font-weight:600; font-size:14px; text-decoration:none; padding:6px 14px; border:1px solid rgba(0,192,118,0.25); border-radius:8px; transition:all 0.2s; background:rgba(0,192,118,0.05); }
        .inline-cta:hover { background:rgba(0,192,118,0.12); border-color:rgba(0,192,118,0.4); }
      `}</style>

      {/* ── Navbar ─────────────────────────────── */}
      <nav style={{ position: 'sticky', top: 0, zIndex: 50, background: 'rgba(13,17,23,0.9)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(255,255,255,0.06)', padding: '13px 24px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none' }}>
            <div style={{ width: 32, height: 32, background: '#00C076', borderRadius: 9, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, color: '#0D1117', fontSize: 15, boxShadow: '0 0 14px rgba(0,192,118,0.3)' }}>P</div>
            <span style={{ fontWeight: 800, fontSize: 17, color: '#e2e8f0' }}>Paper<span style={{ color: '#00C076' }}>Pe</span></span>
          </Link>
          <Link href="/blog" className="nav-link" style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <ArrowLeft size={15} /> All Articles
          </Link>
        </div>
      </nav>

      {/* ── Hero ────────────────────────────────── */}
      <section style={{ padding: '60px 24px 48px', borderBottom: '1px solid rgba(255,255,255,0.06)', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', width: 700, height: 300, background: 'radial-gradient(ellipse, rgba(0,192,118,0.05) 0%, transparent 65%)', pointerEvents: 'none' }} />
        <div style={{ maxWidth: 760, margin: '0 auto', position: 'relative' }}>

          {/* Breadcrumb */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: '#374151', marginBottom: 24, flexWrap: 'wrap' }}>
            <Link href="/" className="nav-link">Home</Link>
            <ChevronRight size={12} color="#374151" />
            <Link href="/blog" className="nav-link">Blog</Link>
            <ChevronRight size={12} color="#374151" />
            <span style={{ color: '#64748b' }}>{post.title}</span>
          </div>

          {/* Tags + meta */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20, flexWrap: 'wrap' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '5px 12px', background: 'rgba(0,192,118,0.1)', border: '1px solid rgba(0,192,118,0.2)', color: '#00C076', borderRadius: 999, fontSize: 12, fontWeight: 600 }}>
              <Tag size={11} /> {post.category}
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 5, color: '#374151', fontSize: 13 }}>
              <Clock size={13} /> {post.readTime} read
            </span>
            <span style={{ color: '#374151', fontSize: 13 }}>{post.date}</span>
          </div>

          {/* Title */}
          <h1 className="fade-up" style={{ fontSize: 40, fontWeight: 800, lineHeight: 1.15, marginBottom: 16, letterSpacing: '-0.02em' }}>
            {post.title}
          </h1>
          <p style={{ fontSize: 18, color: '#64748b', lineHeight: 1.7 }}>{post.excerpt}</p>
        </div>
      </section>

      {/* ── Article ─────────────────────────────── */}
      <main style={{ padding: '56px 24px', maxWidth: 760, margin: '0 auto' }}>

        {/* Inline CTA top */}
        <div style={{ background: 'rgba(0,192,118,0.05)', border: '1px solid rgba(0,192,118,0.15)', borderRadius: 14, padding: '16px 20px', marginBottom: 40, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <TrendingUp size={18} color="#00C076" />
            <span style={{ fontSize: 14, color: '#94a3b8' }}>Practice what you learn — <span style={{ color: '#e2e8f0', fontWeight: 600 }}>₹10 Lakh virtual capital, zero risk</span></span>
          </div>
          <Link href="/" className="inline-cta">
            Start Free <ArrowRight size={13} />
          </Link>
        </div>

        {/* Content */}
        <article>
          {renderContent(post.content)}
        </article>

        {/* Bottom CTA */}
        <div style={{ marginTop: 64, background: 'linear-gradient(135deg, rgba(0,192,118,0.08) 0%, rgba(0,153,255,0.04) 100%)', border: '1px solid rgba(0,192,118,0.2)', borderRadius: 24, padding: '48px 40px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: '-40%', left: '50%', transform: 'translateX(-50%)', width: 500, height: 300, background: 'radial-gradient(ellipse, rgba(0,192,118,0.08) 0%, transparent 65%)', pointerEvents: 'none' }} />
          <div style={{ position: 'relative' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '5px 14px', background: 'rgba(0,192,118,0.1)', border: '1px solid rgba(0,192,118,0.2)', borderRadius: 999, fontSize: 12, color: '#00C076', fontWeight: 600, marginBottom: 16 }}>
              Practice What You Just Learned
            </div>
            <h2 style={{ fontSize: 30, fontWeight: 800, marginBottom: 12, letterSpacing: '-0.02em' }}>Apply This Knowledge Risk-Free</h2>
            <p style={{ color: '#64748b', marginBottom: 28, fontSize: 16, lineHeight: 1.7, maxWidth: 440, margin: '0 auto 28px' }}>
              PaperPe gives you ₹10 Lakh virtual capital to trade NIFTY, BANKNIFTY, and MCX in real market conditions — zero risk, real learning.
            </p>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, flexWrap: 'wrap' }}>
              <Link href="/" style={{ background: '#00C076', color: '#0D1117', padding: '13px 28px', borderRadius: 12, fontWeight: 800, fontSize: 15, textDecoration: 'none', boxShadow: '0 0 30px rgba(0,192,118,0.35)', display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                Join Waitlist — Free <ArrowRight size={16} />
              </Link>
              <Link href="/blog" style={{ color: '#64748b', border: '1px solid #21262D', padding: '13px 24px', borderRadius: 12, fontWeight: 600, fontSize: 15, textDecoration: 'none' }}>
                More Articles
              </Link>
            </div>
          </div>
        </div>

        {/* Related posts */}
        {relatedPosts.length > 0 && (
          <div style={{ marginTop: 56 }}>
            <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 20, color: '#e2e8f0' }}>More Articles</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 14 }}>
              {relatedPosts.map(rel => (
                <Link key={rel.slug} href={`/blog/${rel.slug}`} className="related-card">
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                    <span style={{ fontSize: 11, background: 'rgba(0,192,118,0.1)', color: '#00C076', padding: '3px 9px', borderRadius: 999, fontWeight: 600 }}>{rel.category}</span>
                    <span style={{ fontSize: 12, color: '#374151', display: 'flex', alignItems: 'center', gap: 4 }}><Clock size={11} /> {rel.readTime}</span>
                  </div>
                  <h4 style={{ fontWeight: 700, fontSize: 15, color: '#e2e8f0', lineHeight: 1.4, marginBottom: 6 }}>{rel.title}</h4>
                  <p style={{ fontSize: 13, color: '#475569', lineHeight: 1.6, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{rel.excerpt}</p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* ── Footer ─────────────────────────────── */}
      <footer style={{ borderTop: '1px solid rgba(255,255,255,0.05)', padding: '40px 24px', background: '#0a0e15', marginTop: 40 }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none' }}>
            <div style={{ width: 28, height: 28, background: '#00C076', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, color: '#0D1117', fontSize: 13 }}>P</div>
            <span style={{ fontWeight: 700, fontSize: 15, color: '#e2e8f0' }}>Paper<span style={{ color: '#00C076' }}>Pe</span></span>
          </Link>
          <p style={{ fontSize: 13, color: '#374151' }}>India&apos;s paper trading platform for MCX &amp; F&amp;O.</p>
          <div style={{ display: 'flex', gap: 20 }}>
            {[['Blog', '/blog'], ['Tools', '/calculator'], ['Home', '/']].map(([l, h]) => (
              <Link key={h} href={h} className="nav-link">{l}</Link>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
