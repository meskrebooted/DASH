# DASH
Dashboard personale

[Mio Layout](https://files.catbox.moe/h7etah.json)

## API esterne usate

| Widget | Servizio | Autenticazione |
| --- | --- | --- |
| Meteo | **Open-Meteo** (+ geocoding) | Nessuna |
| Mappa | **Leaflet** + tile **OpenStreetMap** | Nessuna |
| Crypto | **CoinGecko** | Nessuna |
| Citazioni | **kanye.rest** | Nessuna |
| News | **Hacker News** (Firebase API), **Reddit** (`.json`), **Lobsters** | Nessuna |
| GitHub | `api.github.com/users/…` | Nessuna |
| AniList | **GraphQL** (`graphql.anilist.co`) | **OAuth** |
| Ricerca | Google Suggest | Nessuna |
| Segnalibri | Google Favicon service | Nessuna |
| Font | Google Fonts | Nessuna |

**Widget senza alcuna API esterna:** orologio, mondo (fusi orari calcolati localmente), calendario, note, todo, timer pomodoro, abitudini, mini browser (`webpage`, che incorpora un sito in un `<iframe>`).
