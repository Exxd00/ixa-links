import Legal from '../legal';

export const metadata = {
  title: 'Impressum',
  description: 'Impressum und Anbieterinformationen der IXA Agency.',
  alternates: { canonical: '/impressum' },
  openGraph: {
    type: 'website',
    url: '/impressum',
    title: 'Impressum | IXA Agency',
    description: 'Impressum und Anbieterinformationen der IXA Agency.',
  },
};

export default function Impressum() {
  return (
    <Legal title="Impressum">
      <p><strong>Angaben gemäß § 5 DDG</strong></p>
      <address className="legal-address">
        IXA Agency<br/>
        Emad Alzaim<br/>
        Einsteinring 12<br/>
        90453 Nürnberg<br/>
        Deutschland
      </address>
      <h2>Kontakt</h2>
      <p>
        Telefon: <a href="tel:+491629155408">+49 162 9155408</a><br/>
        E-Mail: <a href="mailto:info@ixa-leads.de">info@ixa-leads.de</a>
      </p>
    </Legal>
  );
}
