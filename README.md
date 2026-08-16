# IXA Links Hub

Ein responsiver, interaktiver Links Hub für IXA Agency auf Basis von Next.js und React.

## Entwicklung

```bash
npm install
npm run dev
```

Der Produktions-Build wird mit `npm run build` erstellt. Vercel erkennt das Projekt automatisch als Next.js-Anwendung.

Die Hauptoberfläche befindet sich in `app/page.jsx`, das Design in `app/globals.css`. Vor der endgültigen Domainaufschaltung müssen die vollständigen Anbieterangaben im Impressum und in der Datenschutzerklärung ergänzt werden.

## Analytics und Leads

Google Analytics 4 wird mit der Measurement-ID `G-MC97FW20HT` über Consent Mode eingebunden. Die Analysespeicherung ist standardmäßig deaktiviert und wird erst nach Zustimmung aktiviert.

Erfasste Ereignisse:

- `page_view`: Seitenaufruf, einschließlich clientseitiger Navigation
- `scroll_depth`: 25, 50, 75 und 90 Prozent Scrolltiefe
- `engaged_visit`: mindestens 30 Sekunden sichtbare Nutzung
- `select_content`: Auswahl des IXA-Leads-Angebots
- `outbound_click`: Auswahl externer Angebote oder Social-Media-Profile
- `contact_select`: Auswahl eines Kontaktkanals
- `generate_lead`: qualifizierte Kontaktabsicht über Telefon, WhatsApp oder E-Mail
- `logo_interaction`, `theme_change`, `legal_select` und `navigation_select`: Interaktionen mit der Oberfläche

`generate_lead` sollte in GA4 als Schlüsselereignis markiert werden. Die Parameter `lead_channel`, `lead_source` und `lead_context` ermöglichen die Auswertung der Kontaktquelle.
