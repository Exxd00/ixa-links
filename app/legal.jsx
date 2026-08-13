import Link from 'next/link';

export default function Legal({ title, children }) {
  return <main className="legal-page"><Link className="legal-back" href="/">← IXA</Link><article><h1>{title}</h1>{children}</article></main>;
}
