# DASH
Dashboard personale

[Mio Layout](https://files.catbox.moe/h7etah.json)

## API esterne usate

| Widget | Servizio | Autenticazione | Note |
| --- | --- | --- | --- |
| Meteo | **Open-Meteo** (+ geocoding) | Nessuna | Restituisce codici meteo standard **WMO**, tradotti in testo/emoji con le tabelle `WMO` e `WMO_ICON` nel codice. |
| Mappa | **Leaflet** + tile **OpenStreetMap** | Nessuna | Libreria caricata da CDN (`unpkg`) con controllo `integrity` (SRI). |
| Crypto | **CoinGecko** | Nessuna | Prezzo in USD e variazione nelle ultime 24 ore. |
| Citazioni | **kanye.rest** | Nessuna | Citazione casuale a ogni apertura/refresh. |
| News | **Hacker News** (Firebase API), **Reddit** (`.json`), **Lobsters** | Nessuna | Hacker News richiede **due passaggi**: prima si chiede la lista degli ID delle notizie, poi una richiesta separata per ogni singolo articolo. |
| GitHub | `api.github.com/users/…` | Nessuna | Legge un profilo pubblico (repository, follower, bio). |
| AniList | **GraphQL** (`graphql.anilist.co`) | **OAuth** | Login: AniList reindirizza al sito con il token nel frammento dell'URL (`#access_token=...`); il codice lo estrae, lo salva e ripulisce l'indirizzo. |
| Ricerca | Google Suggest | Nessuna | Solo per l'autocompletamento della barra di ricerca. |
| Segnalibri | Google Favicon service | Nessuna | Recupera l'iconcina di ogni sito salvato. |
| Font | Google Fonts | Nessuna | Space Grotesk, JetBrains Mono, DotGothic16. |

**Widget senza alcuna API esterna:** orologio, mondo (fusi orari calcolati localmente), calendario, note, todo, timer pomodoro, abitudini, mini browser (`webpage`, che incorpora un sito in un `<iframe>`).
