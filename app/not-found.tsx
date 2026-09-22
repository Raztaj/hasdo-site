import Link from 'next/link';

export default function NotFound() {
  return (
    <main
      className="container"
      style={{
        minHeight: '70vh',
        display: 'grid',
        placeItems: 'center',
        textAlign: 'center',
      }}
    >
      <div>
        <h1 style={{ fontSize: '2.4rem', letterSpacing: '0.08em' }}>404</h1>
        <p style={{ color: 'var(--muted)', marginTop: 8 }}>الصفحة غير موجودة.</p>
        <Link
          href="/"
          style={{
            display: 'inline-block',
            marginTop: 18,
            fontWeight: 600,
            color: 'var(--hasdo-blue)',
          }}
        >
          العودة للرئيسية
        </Link>
      </div>
    </main>
  );
}
