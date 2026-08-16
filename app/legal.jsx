'use client';

import Link from 'next/link';
import { trackEvent, trackLead } from './tracking';

export default function Legal({ title, children }) {
  const handleClick = (event) => {
    const link = event.target.closest('a');
    if (!link) return;
    if (link.href.startsWith('tel:')) trackLead('phone', 'telephone', 'legal_page');
    if (link.href.startsWith('mailto:')) trackLead('email', 'email', 'legal_page');
  };

  return <main className="legal-page" onClick={handleClick}><Link className="legal-back" href="/" onClick={() => trackEvent('navigation_select', { destination_path: '/', link_context: 'legal_back' })}>← IXA</Link><article><h1>{title}</h1>{children}</article></main>;
}
