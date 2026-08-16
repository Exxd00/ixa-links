import Legal from '../legal';
import { AnalyticsPreferencesButton } from '../Analytics';

export const metadata = {
  title: 'Datenschutz',
  description: 'Datenschutzhinweise der IXA Agency.',
  alternates: { canonical: '/datenschutz' },
  openGraph: {
    type: 'website',
    url: '/datenschutz',
    title: 'Datenschutz | IXA Agency',
    description: 'Datenschutzhinweise der IXA Agency.',
  },
};

export default function Datenschutz() {
  return (
    <Legal title="Datenschutz">
      <h2>1. Datenschutz auf einen Blick</h2>
      <p>Diese Website verarbeitet nur die technisch erforderlichen Daten, die beim Aufruf durch den Hosting-Anbieter entstehen. Externe Angebote werden erst geöffnet, wenn Sie den jeweiligen Link aktiv auswählen.</p>

      <h2>2. Verantwortliche Stelle</h2>
      <address className="legal-address">
        IXA Agency · Emad Alzaim<br/>
        Einsteinring 12<br/>
        90453 Nürnberg<br/>
        Deutschland
      </address>
      <p>
        Telefon: <a href="tel:+491629155408">+49 162 9155408</a><br/>
        E-Mail: <a href="mailto:info@ixa-leads.de">info@ixa-leads.de</a>
      </p>

      <h2>3. Hosting</h2>
      <p>Beim Aufruf dieser Website können technische Zugriffsdaten wie IP-Adresse, Zeitpunkt und angeforderte Datei in Server-Logfiles verarbeitet werden.</p>

      <h2>4. Darstellungseinstellung</h2>
      <p>Die Auswahl zwischen hellem und dunklem Modus wird ausschließlich lokal auf Ihrem Gerät gespeichert, damit die gewählte Darstellung beim nächsten Besuch wiederhergestellt werden kann.</p>

      <h2>5. Externe Links</h2>
      <p>Diese Website verlinkt auf LinkedIn, Instagram, WhatsApp und weitere IXA-Angebote. Daten werden erst an den jeweiligen Anbieter übermittelt, wenn Sie einen solchen Link aktiv öffnen. Danach gelten die Datenschutzbestimmungen des jeweiligen Anbieters.</p>

      <h2>6. Google Analytics</h2>
      <p>Wenn Sie ausdrücklich zustimmen, verwenden wir Google Analytics, einen Analysedienst von Google, um Seitenaufrufe, Scrolltiefe und ausgewählte Interaktionen auszuwerten. Dazu können Nutzungsdaten, Geräteinformationen und eine gekürzte IP-Adresse verarbeitet werden. Ohne Ihre Zustimmung bleibt die Analysespeicherung deaktiviert.</p>
      <p>Sie können Ihre Entscheidung jederzeit ändern. Weitere Informationen zur Datenverarbeitung durch Google finden Sie in den Datenschutzhinweisen von Google.</p>
      <p><AnalyticsPreferencesButton /></p>
    </Legal>
  );
}
