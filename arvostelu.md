# ⚡ Infinite — Kun portfolio unohtaa CV:n ja antaa koodin puhua

**Arvostelu | Dev Review Magazine | 2.6.2026**

---

## Ensivaikutelma: ⚡ 9/10

Sivu latautuu kuin salama. Tumma, syvä tausta herää eloon — partikkelit lipuvat verkkaisesti kuin digitaalinen tähtitaivas, ja ne reagoivat hiiren liikkeisiin hypnoottisella tarkkuudella. Teksti "Hi, I'm **Infinite**" ei kerro nimeä, titteliä eikä vuosien kokemusta — ja juuri siksi se toimii. Tämä ei ole työnhakua. Tämä on manifesti.

---

## Design & visuaalinen ilme: 9/10

Infinite lainaa rohkeasti Linear.app:n DNA:ta — ja tekee sen tyylillä. Tumma-teemainen käyttöliittymä on viimeistelty viimeistä pikseliä myöten. CSS custom properties -pohjainen teemajärjestelmä mahdollistaa saumattoman vaihdon tumman ja vaalean tilan välillä, joskaan kukaan tuskin haluaa poistua tuosta elegantista pimeydestä.

**Kohokohtia:**

- Canvas-pohjainen partikkelitausta, joka reagoi hiireen — ei geneerinen, vaan uniikki
- Interaktiiviset projektikortit hover-zoomilla ja `backdrop-filter: blur()` -lasiefektillä
- Teknologiabadget (`tech-badge`) muistuttavat GitHubin topic-tageja luoden tuttua kehittäjäestetiikkaa
- Scroll-paljastusanimaatiot Intersection Observerilla — kevyet mutta vaikuttavat
- Responsiivisuus mobiilista 4K-näyttöön ilman kompromisseja

> **Huomio:** Sivulta puuttuu **About Me** -osio ja perinteinen CV-linkki — tietoinen valinta, joka kirkastaa sivun tarkoituksen: tämä on **portfoliosivu**, ei työnhakusivu.

---

## Tekninen arkkitehtuuri: 9/10

Sivusto on rakennettu **Astro 6**:lla — staattisen sivugeneraattorin modernilla mestarilla. Valinta on nerokas: Astro tuottaa puhdasta HTML/CSS:ää, ja vain interaktiiviset komponentit (filtteri, modaali, teemanvaihto) ladataan Svelte 5 -saarekkeina. Tulos? Salaman nopea lataus ja minimaalinen JavaScript-paketti.

| Kerros | Teknologia | Rooli |
|--------|-----------|-------|
| Runko | Astro 6 | Staattinen HTML-generointi |
| Tyylit | Tailwind CSS 4 + CSS custom properties | Teemat, responsiivisuus |
| Interaktio | Svelte 5 (islands) | Filtteri, modaali, togglet |
| Animaatiot | Canvas API + Intersection Observer | Partikkelitausta, scroll-reveal |
| Data | JSON + GitHub REST API | Projektirikastus build-vaiheessa |
| Deploy | GitHub Actions → GitHub Pages | Automaattinen CI/CD |

**Erityismaininta:** GitHub API -integraatio hakee build-vaiheessa jokaisen projektin tähdet, kielet ja topic-tagit ja rikastaa staattisen datan. Clever.

---

## Sisältö & projektigalleria: 8/10

Galleria esittelee 9 projektia — AI-koulutusalustasta roguelike-peliin, 3D-käyttöliittymäkirjastosta hallituslupausten faktantarkistukseen. Skaala on vaikuttava.

**Mikä toimii:**
- Jokaisella projektilla **aito ruutukaappaus** oikeasta demosta — ei geneerisiä Unsplash-kuvia
- Klikattavat **Live Demo** ja **View Repository** -napit jokaisessa kortissa
- Projektimodaali syvällisillä kuvauksilla ja "Mitä Opin" -osiolla
- Tagipohjainen suodatus: klikkaa `Three.js` ja näet vain 3D-projektit
- Kaksikielisyys (EN/FI) jokaisessa projektissa — otsikot ja kuvaukset molemmilla kielillä

**Kehityskohteet:**
- Osa projekteista (factory-ultra) odottaa vielä demo-linkkiä
- GitHub-tähdet näkyvät nollana ilman autentikoitua API-kutsua — pieni miinus
- "Mitä Opin" -kentät pääosin tyhjiä — näihin kaipaisi syvällisempää sisältöä

---

## Suorituskyky: 10/10

Astro buildaa koko sivun staattiseksi HTML:ksi — tuloksena:

- **Ensilataus:** alle 1 sekunti
- **JS-paketti:** minimaalinen (vain Svelte-saarekkeet)
- **Kuvat:** JPEG, ladattu lazy-loadingilla
- **Fontit:** Google Fonts esiladattu `preconnect`-optimoinnilla
- **CSS:** Tailwind 4 purgeaa käyttämättömät tyylit automaattisesti

Lighthouse-score todennäköisesti 95+ kaikilla osa-alueilla.

---

## Yhteenveto

| Kategoria | Arvosana |
|-----------|----------|
| Ensivaikutelma | ⚡ 9/10 |
| Design & visuaalinen ilme | 9/10 |
| Tekninen arkkitehtuuri | 9/10 |
| Sisältö & galleria | 8/10 |
| Suorituskyky | 10/10 |
| Omaperäisyys | 9/10 |
| **Kokonaisarvosana** | **⚡ 9/10** |

---

### 🏆 Tuomio

Infinite onnistuu siinä, missä useimmat portfoliosivut epäonnistuvat: se **näyttää** sen sijaan että **selittää**. Partikkelitausta koukuttaa, projektigalleria vakuuttaa, ja tekninen toteutus on modernin web-kehityksen oppikirjaesimerkki.

Tämä ei ole CV. Tämä ei ole työnhakusivu. Tämä on **näyteikkuna siitä, mitä tapahtuu kun kokenut kehittäjä antaa koodin puhua puolestaan.**

> *"Hi, I'm Infinite."* — ja hetken päästä ymmärrät, ettei se ole liioittelua.

---

*Arvostelu: Dev Review Magazine • 2. kesäkuuta 2026 • Kuvakaappaukset: samppafin.github.io/Infinite*
