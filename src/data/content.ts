// Sivun tekstit ja rakenne kahdella kielellä. Faktat: docs/poc-vaihe-1-2.md ja docs/design/*.json (haettu 2026-11-01).
export type Lang = 'fi' | 'en';
type L10n = Record<Lang, string>;

export const SITE = 'https://samppafin.github.io';
export const BASE = '/Infinite';
export const FETCHED = '2026-11-01';

export const TAGS: { id: string; dim: 'purpose' | 'tech' | 'ai'; label: L10n }[] = [
  { id: 'p-peli', dim: 'purpose', label: { fi: 'Pelit ja simulaatiot', en: 'Games and simulations' } },
  { id: 'p-yht', dim: 'purpose', label: { fi: 'Yhteisöpalvelut', en: 'Community services' } },
  { id: 'p-data', dim: 'purpose', label: { fi: 'Data ja analyysi', en: 'Data and analysis' } },
  { id: 'p-hyv', dim: 'purpose', label: { fi: 'Hyvinvointi', en: 'Wellbeing' } },
  { id: 'p-tyo', dim: 'purpose', label: { fi: 'Työkalut ja kehykset', en: 'Tools and frameworks' } },
  { id: 'p-opp', dim: 'purpose', label: { fi: 'Oppiminen', en: 'Learning' } },
  { id: 'p-yhk', dim: 'purpose', label: { fi: 'Yhteiskunta', en: 'Society' } },
  { id: 'p-taide', dim: 'purpose', label: { fi: 'Taide ja ääni', en: 'Art and sound' } },
  { id: 't-ts', dim: 'tech', label: { fi: 'TypeScript', en: 'TypeScript' } },
  { id: 't-test', dim: 'tech', label: { fi: 'Testattu ja saavutettava', en: 'Tested and accessible' } },
  { id: 't-back', dim: 'tech', label: { fi: 'Backend ja reaaliaika', en: 'Backend and realtime' } },
  { id: 't-mob', dim: 'tech', label: { fi: 'Mobiili ja PWA', en: 'Mobile and PWA' } },
  { id: 't-react', dim: 'tech', label: { fi: 'React', en: 'React' } },
  { id: 't-py', dim: 'tech', label: { fi: 'Python', en: 'Python' } },
  { id: 't-3d', dim: 'tech', label: { fi: '3D ja WebGL', en: '3D and WebGL' } },
  { id: 't-svelte', dim: 'tech', label: { fi: 'Svelte', en: 'Svelte' } },
  { id: 'a-claude', dim: 'ai', label: { fi: 'Rakennettu Claudella', en: 'Built with Claude' } },
  { id: 'a-ds', dim: 'ai', label: { fi: 'Rakennettu DeepSeekillä', en: 'Built with DeepSeek' } },
  { id: 'a-prod', dim: 'ai', label: { fi: 'AI tuotteessa', en: 'AI in the product' } },
  { id: 'a-aihe', dim: 'ai', label: { fi: 'AI aiheena', en: 'AI as the subject' } },
];
export const PURPOSE_ORDER = ['p-peli', 'p-yht', 'p-data', 'p-hyv', 'p-tyo', 'p-opp', 'p-yhk', 'p-taide'];

export const SOURCES: Record<string, L10n> = {
  K: { fi: 'repon kuvaus', en: 'repo description' }, R: { fi: 'README', en: 'README' }, P: { fi: 'package.json', en: 'package.json' },
  D: { fi: 'demosivu', en: 'demo page' }, V: { fi: 'vanha portfolio', en: 'old portfolio' }, A: { fi: 'agenttitiedosto', en: 'agent file' },
  L: { fi: 'kielitilasto', en: 'language stats' }, Q: { fi: 'requirements.txt', en: 'requirements.txt' },
};

export const SECTIONS: { id: string; nav: L10n; summary: L10n; status: 'new' | 'updated' }[] = [
  { id: 'etusivu', nav: { fi: 'Etusivu', en: 'Home' }, summary: { fi: 'Talvimaisema ja siniset revontulet, nimi ja kaksi toimintoa.', en: 'A winter landscape with blue auroras, the name and two actions.' }, status: 'updated' },
  { id: 'top5', nav: { fi: 'Top 5', en: 'Top 5' }, summary: { fi: 'Viisi valittua projektia tuloksineen ja AI-avustajineen.', en: 'Five selected projects with results and AI assistants.' }, status: 'updated' },
  { id: 'projektit', nav: { fi: 'Projektit', en: 'Projects' }, summary: { fi: 'Kaikki 32 projektia tarinana kuudessa luvussa. Rajaa luvulla tai aiheella.', en: 'All 32 projects as a story in six chapters. Narrow down by chapter or topic.' }, status: 'new' },
  { id: 'teknologiat', nav: { fi: 'Teknologiat', en: 'Technologies' }, summary: { fi: 'Mitattu kieli- ja kirjastojakauma.', en: 'Measured language and library breakdown.' }, status: 'new' },
  { id: 'yhteys', nav: { fi: 'Yhteys', en: 'Contact' }, summary: { fi: 'Yhteydenotto sähköpostilla tai WhatsAppilla sekä GitHub-profiili.', en: 'Contact by email or WhatsApp, and the GitHub profile.' }, status: 'new' },
];

export const LANGS = [
  { name: 'TypeScript', pct: 49.2, repos: 14 }, { name: 'JavaScript', pct: 22.3, repos: 27 }, { name: 'HTML', pct: 20.4, repos: 28 },
  { name: 'CSS', pct: 3.3, repos: 19 }, { name: 'Python', pct: 3.0, repos: 5 },
];
export const LIBS = [
  { name: 'Vitest', n: 9 }, { name: 'Playwright', n: 9 }, { name: 'React', n: 7 }, { name: 'Vite', n: 6 }, { name: 'Zustand', n: 4 },
  { name: 'Tailwind CSS', n: 4 }, { name: 'Three.js', n: 4 }, { name: 'Supabase', n: 3 }, { name: 'Cloudflare Workers', n: 3 },
];

export const SEO: Record<Lang, { title: string; description: string; locale: string; path: string }> = {
  fi: { title: 'Infinite – projektit, tekniikat ja AI-kokeilut', path: '/Infinite/', locale: 'fi_FI',
    description: 'Infiniten 32 julkista projektia: oma top 5 ja kaikkien projektien tarina kuudessa luvussa. Pelejä, 3D:tä, dataa ja tekoälyavusteista kehitystä.' },
  en: { title: 'Infinite – projects, techniques and AI experiments', path: '/Infinite/en/', locale: 'en_US',
    description: 'Infinite’s 32 public projects: a top 5 and the story of every project in six chapters. Games, 3D, data and AI-assisted development.' },
};
// Inventaarion vanhat URLit (docs/poc-vaihe-1-2.md, osio 1.1). GitHub Pages ei lähetä 301:tä, joten ankkurit ohjataan skriptillä.
export const REDIRECTS: { from: string; to: string }[] = [
  { from: '/Infinite/', to: '/Infinite/' },
  { from: '/Infinite/#hero', to: '/Infinite/#etusivu' },
  { from: '/Infinite/#featured', to: '/Infinite/#top5' },
  { from: '/Infinite/#projects', to: '/Infinite/#projektit' },
];

type Line = { who: 'loiste' | 'hionta' | 'kirkkaus'; text: L10n };
export const PERSONAS: Record<string, { name: string; role: L10n; bio: L10n }> = {
  loiste: { name: 'Loiste', role: { fi: 'humoristi · hehkumato', en: 'humorist · glow worm' },
    bio: { fi: 'Hehkumato Andromedan reunalta. Valaisee pimeät kohdat ja vitsailee niistä. Liikkuu pomppien, ja päässä palaa houkutinvalo.', en: 'A glow worm from the edge of Andromeda. Lights up the dark corners and jokes about them. Moves in hops, with a lure glowing on its head.' } },
  hionta: { name: 'Hionta', role: { fi: 'tekninen analyytikko · panssarimato', en: 'technical analyst · armoured worm' },
    bio: { fi: 'Panssaroitu kidemato asteroidivyöhykkeeltä. Mittaa ennen kuin puhuu, ja visiirisilmä skannaa koodia. Kulkee suoraan ja täsmällisesti.', en: 'An armoured crystal worm from the asteroid belt. Measures before speaking, and its visor eye scans the code. Moves straight and precisely.' } },
  kirkkaus: { name: 'Kirkkaus', role: { fi: 'filosofi ja kriitikko · sielumato', en: 'philosopher and critic · spirit worm' },
    bio: { fi: 'Läpikuultava sielumato tähtisumusta. Kolmella silmällä se kysyy, mitä varten projekti on olemassa, ja sanoo ääneen, mitä puuttuu. Aaltoilee hitaasti.', en: 'A translucent spirit worm from a nebula. With three eyes it asks what a project exists for and says out loud what is missing. Drifts slowly in waves.' } },
};
const l = (who: Line['who'], fi: string, en: string): Line => ({ who, text: { fi, en } });
// Osioiden keskustelut. Jokaisen projektin keskustelu kootaan analysis.ts:stä (site.ts): esittely, tekninen, filosofinen, hauska, heikkous ja ehdotus.
export const POINTS: { id: string; label: L10n; lines: Line[] }[] = [
  { id: 'welcome', label: { fi: 'Tervetuloa', en: 'Welcome' }, lines: [
    l('loiste', 'Hei, tervetuloa Infiniten portfoliosivulle! Me kolme avaruusmatoa esittelemme paikat.', 'Hi, welcome to Infinite’s portfolio! We three space worms will show you around.'),
    l('hionta', 'Ylimpänä on Infiniten oma top 5. Sen alla ovat kaikki 32 projektia tarinana kuudessa luvussa, ja ne voi rajata luvulla tai aiheella.', 'At the top is Infinite’s own top 5. Below it are all 32 projects as a story in six chapters, and you can narrow them down by chapter or topic.'),
    l('kirkkaus', 'Teknologiat-osio kertoo mitatut kielet ja kirjastot. Yhteys-osiosta voit lähettää viestin sähköpostilla tai WhatsAppissa.', 'The Technologies section shows the measured languages and libraries. From the Contact section you can send a message by email or WhatsApp.'),
    l('loiste', 'Osoita mitä tahansa korttia, niin ryömimme sen ympärille kertomaan siitä. Kysy-painikkeesta voit kysyä meiltä suoraan.', 'Point at any card and we will crawl around it to tell you about it. With the Ask button you can ask us directly.') ] },
  { id: 'hero', label: { fi: 'Etusivu', en: 'Home' }, lines: [
    l('loiste', 'Tervetuloa. Infinitellä on 32 julkista projektia maaliskuusta 2025, ja ylimpänä on viisi valittua.', 'Welcome. Infinite has 32 public projects since March 2025, with five picks at the top.'),
    l('hionta', 'Taustan talvimaisema on yksi WebGL-shaderi: revontuliverhot, tunturit, jäätynyt järvi ja neljä kerrosta lumihiutaleita.', 'The winter landscape behind is one WebGL shader: aurora curtains, fells, a frozen lake and four layers of snowflakes.'),
    l('kirkkaus', 'Kaunis maisema, mutta sivu ei vielä kerro, mitä Infinite tarjoaa. Se kohta on paikkamerkki.', 'A beautiful landscape, but the page does not yet say what Infinite offers. That part is a placeholder.'),
    l('loiste', 'Vie osoitin taivaalle, niin revontulet taipuvat sitä kohti. Me ryömimme perässä.', 'Move the pointer into the sky and the auroras bend towards it. We crawl after it.'),
    l('hionta', 'Puhelimella seuraamme kohtaa, joka on näkymän keskellä. Kysy-painikkeesta voit kysyä meiltä suoraan.', 'On a phone we follow the part in the middle of the view. With the Ask button you can ask us directly.') ] },
  { id: 'top5', label: { fi: 'Oma top 5', en: 'My top 5' }, lines: [
    l('loiste', 'Viisi Infiniten itse valitsemaa projektia.', 'Five projects picked by Infinite.'),
    l('hionta', 'Pisteet tulevat kaavasta: tuoreus, laajuus, demo, testit, README ja kesto.', 'The score comes from a formula: recency, size, demo, tests, README and duration.'),
    l('kirkkaus', 'Valinta ei seuraa pisteitä: AI-Koulu on pisteissä sijalla 16, mutta Infinite nostaa sen kärkeen.', 'The pick does not follow the scores: AI-Koulu is 16th by score, yet Infinite puts it first.'),
    l('loiste', 'Siksi se on oma valinta. Vie osoitin kortin päälle, niin kerromme siitä lisää.', 'That is what makes it a personal pick. Move the pointer over a card and we will tell you more.') ] },
  { id: 'projektit', label: { fi: 'Projektit', en: 'Projects' }, lines: [
    l('loiste', 'Tässä ovat kaikki 32 projektia tarinana: kuusi lukua maaliskuusta 2025 tähän päivään.', 'Here are all 32 projects as a story: six chapters from March 2025 to today.'),
    l('hionta', 'Valitse luku tai aiheita, niin kortit ja aikajana rajautuvat. Jokaisen valitun aiheen pitää osua, ja painikkeen luku kertoo etukäteen, montako projektia jää.', 'Pick a chapter or topics and the cards and timeline narrow down. Every chosen topic must match, and the number on each button tells you in advance how many projects remain.'),
    l('kirkkaus', 'Aikajärjestys kertoo enemmän kuin pisteet: näet, mistä aloitettiin ja mihin on päädytty.', 'Time order says more than scores: you see where it started and where it has got to.'),
    l('loiste', 'Osoita korttia, niin ryömimme sen ympärille kertomaan siitä.', 'Point at a card and we will crawl around it to tell you about it.') ] },
  { id: 'teknologiat', label: { fi: 'Teknologiat', en: 'Technologies' }, lines: [
    l('loiste', 'Tässä on mitattu kieli- ja kirjastojakauma 32 reposta.', 'Here is the measured language and library breakdown of 32 repos.'),
    l('hionta', 'TypeScriptiä on 49 % koodista, ja Vitest ja Playwright ovat käytetyimmät kirjastot.', 'TypeScript is 49 % of the code, and Vitest and Playwright are the most used libraries.'),
    l('kirkkaus', 'Koodin määrä ei ole osaamisen mitta. HTML-osuutta kasvattavat isot yksittäiset sivut.', 'Amount of code is not a measure of skill. Large single pages inflate the HTML share.'),
    l('loiste', 'Projektit-osiossa voit rajata kortit teknologian mukaan.', 'In the Projects section you can narrow the cards down by technology.') ] },
  { id: 'yhteys', label: { fi: 'Yhteys', en: 'Contact' }, lines: [
    l('loiste', 'Kiinnostaako jokin projekti vai haluatko kysyä tekoälystä? Valitse aihe ja kirjoita viesti.', 'Interested in a project, or want to ask about AI? Pick a topic and write a message.'),
    l('hionta', 'Lomake avaa sähköpostin tai WhatsAppin valmiiksi täytetyllä viestillä. Sivu ei tallenna mitään.', 'The form opens email or WhatsApp with the message filled in. The page stores nothing.'),
    l('kirkkaus', 'Kaupallinen tai ei, hyvä kysymys on aina tervetullut. Koodi on joka tapauksessa julkisena GitHubissa.', 'Commercial or not, a good question is always welcome. The code is public on GitHub either way.') ] },
];

type Note = { title: L10n; technique: L10n; formula: L10n; why: L10n };
export const TECH: Record<string, Note> = {
  hero: { title: { fi: 'Talvimaisema ja revontulet', en: 'Winter landscape and auroras' },
    technique: { fi: 'Raaka WebGL ja yksi fragmenttishaderi koko hero-alueella. Revontulet ovat kolme verhoa: alareuna aaltoilee siniaalloista, ja pystysäteet tulevat 1D-kohinasta. Tunturit ovat fraktaalikohinaa, ja jäätynyt järvi peilaa koko maiseman. Lunta sataa neljässä kerroksessa: kaksi lähintä ovat kuusihaaraisia kiteitä ja kaukaisin kimaltavaa timanttipölyä. Revontulet taipuvat ja kirkastuvat osoittimen kohdalla (aikavakio 0,12 s). Renderöinti pysähtyy, kun hero ei näy tai välilehti on piilossa. Ilman WebGL:ää näytetään CSS-gradientti ja reduced motion -tilassa pysäytyskuva.',
      en: 'Raw WebGL and one fragment shader over the whole hero. The auroras are three curtains: the lower edge waves on sine waves, and the vertical rays come from 1D noise. The fells are fractal noise, and the frozen lake mirrors the whole landscape. Snow falls in four layers: the two nearest are six-armed crystals and the farthest is glittering diamond dust. The auroras bend and brighten at the pointer (time constant 0.12 s). Rendering stops when the hero is out of view or the tab is hidden. Without WebGL a CSS gradient is shown, and with reduced motion a still frame.' },
    formula: { fi: 'verho: y₀(x) = yᵢ + 0,07 sin(1,1x + 0,12t) + 0,04 sin(2,7x − 0,17t) + kohina\nI = e^(−(y − y₀)/hᵢ) · säteet(x) · (0,7 + 0,3 sin(5x − 1,1t))\nosoitin: y₀ ← y₀ + 0,3 (y_o − y₀) · e^(−(x − x_o)²/0,08)\nkide: kulma taitetaan 60°:n sektoriin, d = min(haara, sivuhaarat)\njärvi: c = mix(jää, c(x, 2y_h − y), F), F = 0,78 → 0,30',
      en: 'curtain: y₀(x) = yᵢ + 0.07 sin(1.1x + 0.12t) + 0.04 sin(2.7x − 0.17t) + noise\nI = e^(−(y − y₀)/hᵢ) · rays(x) · (0.7 + 0.3 sin(5x − 1.1t))\npointer: y₀ ← y₀ + 0.3 (y_p − y₀) · e^(−(x − x_p)²/0.08)\ncrystal: the angle is folded into a 60° sector, d = min(arm, side arms)\nlake: c = mix(ice, c(x, 2y_h − y), F), F = 0.78 → 0.30' },
    why: { fi: 'Sininen sähköinen valo toimii samalla koodilla Titaanin tummalla ja Timantin vaalealla pohjalla: tummassa revontulet lisätään valona, vaaleassa ne värjäävät taivaan. Kuusihaarainen kide syntyy yhdestä haarasta peilaamalla, joten tekstuureja ei tarvita.',
      en: 'The blue electric light works with the same code on Titanium’s dark and Diamond’s light base: in dark the auroras are added as light, in light they tint the sky. The six-armed crystal comes from mirroring one arm, so no textures are needed.' } },
  rim: { title: { fi: 'Lasi ja metallireuna', en: 'Glass and metal rim' },
    technique: { fi: 'Kortit ovat lasia: taustan peittävyys 72 %, backdrop-filter blur(14px) saturate(1.4). Reuna on 1 px:n conic-gradient, joka on maskattu renkaaksi. Sen kulma on rekisteröity @property --rim -ominaisuudeksi, joten se animoituu.',
      en: 'Cards are glass: 72 % background opacity, backdrop-filter blur(14px) saturate(1.4). The rim is a 1 px conic-gradient masked into a ring. Its angle is registered with @property --rim, so it animates.' },
    formula: { fi: '--rim = atan2(y − c_y, x − c_x) + 90°\nkallistus = clamp(Δ / (koko/2), −1, 1) · 2°', en: '--rim = atan2(y − c_y, x − c_x) + 90°\ntilt = clamp(Δ / (size/2), −1, 1) · 2°' },
    why: { fi: 'Hienovarainen metalli korostaa kortin rajaa kilpailematta sisällön kanssa. @property tekee kulman interpoloinnista sileän.', en: 'A subtle metal edge marks the card boundary without competing with the content. @property makes the angle interpolate smoothly.' } },
  finder: { title: { fi: 'Projektit ja tarina', en: 'Projects and story' },
    technique: { fi: 'Kaikki 32 projektia ovat yhdessä listassa luvuittain aikajärjestyksessä. Luku ja aiheet rajaavat samaa listaa: projektin pitää kuulua valittuun lukuun ja osua jokaiseen valittuun aiheeseen. Jokainen luku- ja aihepainike näyttää, montako projektia valinnan jälkeen jäisi, ja nollan painikkeet ovat pois käytöstä, joten tulos ei voi jäädä tyhjäksi. Aikajanalla palkit ovat commitit kuukaudessa ja pisteet projektien aloituksia. Pisteen valinta vie kortin luo.',
      en: 'All 32 projects are in one list, by chapter in time order. The chapter and the topics narrow the same list: a project must belong to the chosen chapter and match every chosen topic. Every chapter and topic button shows how many projects would remain after choosing it, and buttons at zero are disabled, so the result can never be empty. On the timeline the bars are commits per month and the dots are project starts. Picking a dot takes you to its card.' },
    formula: { fi: 'näkyy(c) = (luku = kaikki ∨ luku(c) = luku) ∧ V ⊆ T_c\nmäärä(t) = |{c : näkyy(c) ∧ t ∈ T_c}|\npiste: x = (kuukausi + 0,5) / 21 · palkki = commitit / max(commitit) · 96 px',
      en: 'visible(c) = (chapter = all ∨ chapter(c) = chapter) ∧ V ⊆ T_c\ncount(t) = |{c : visible(c) ∧ t ∈ T_c}|\ndot: x = (month + 0.5) / 21 · bar = commits / max(commits) · 96 px' },
    why: { fi: 'Yksi lista korvaa erillisen haun, tarinan ja arkiston: saman kortin löytää ajan tai aiheen kautta. Ja-ehto on helppo ennustaa, ja painikkeiden määrät kertovat etukäteen, mitä valinta tekee. Repon luontipäivä harhauttaa (WebShop luotiin 10/2025, mutta työ tehtiin 06/2026), joten järjestys perustuu ensimmäiseen committiin.',
      en: 'One list replaces a separate finder, story and archive: the same card can be found through time or topic. An AND condition is easy to predict, and the counts on the buttons tell in advance what a choice will do. A repo’s creation date misleads (WebShop was created in 10/2025, but the work happened in 06/2026), so the order is based on the first commit.' } },
  personas: { title: { fi: 'Avaruusmadot ja huomiokenttä', en: 'Space worms and attention field' },
    technique: { fi: 'Kolme avaruusmatoa piirretään canvasille koko näkymän päälle ilman omaa paneelia: hehkumato Loiste, panssarimato Hionta ja sielumato Kirkkaus. Pää ohjautuu kohteeseen, ja jokainen jäsen seuraa edellistä vakioetäisyydellä, joten vartalo mutkittelee. Sivulle tultaessa madot toivottavat tervetulleeksi ja kertovat, mitä sivulla on. Sen jälkeen ne ryömivät hitaasti sen laatikon ympäri, jota osoitat hiirellä, ja väistävät osoitinta. Puhelimella ja näppäimistöllä laatikko on fokus tai näkymän keskellä oleva kortti. Jokaisella kohdalla, myös jokaisella projektikortilla, on huomioarvo A. Kun madot ovat perillä ja A on pysynyt kynnyksen yllä, ne ajattelevat ääneen ajatuskuplissa. Repliikit on kirjoitettu valmiiksi, eikä API-kutsuja tehdä.',
      en: 'Three space worms are drawn on a canvas over the whole view, with no panel of their own: Loiste the glow worm, Hionta the armoured worm and Kirkkaus the spirit worm. The head steers to the target and every segment follows the previous one at a fixed distance, so the body winds. When you arrive, the worms welcome you and tell you what is on the page. After that they crawl slowly around the box you point at with the mouse, keeping out of the pointer’s way. On a phone or keyboard the box is the focus or the card in the middle of the view. Every point, including every project card, has an attention value A. Once the worms have arrived and A has stayed above the threshold, they think out loud in thought bubbles. The lines are written in advance, with no API calls.' },
    formula: { fi: 'pää: v ← v + (v* − v)(1 − e^(−Δt/0,3)), v* = min(v_max, 2,5d) · d̂, kierto sin(φ)·w\nkehä: s ← s + 22 px/s · Δt (puhuessa 8 px/s), madot 58 px:n välein\nväistö: kohde siirtyy osoittimesta poispäin 110 px:n etäisyydelle\njäsen: s_k = s_(k−1) + g · (s_k − s_(k−1)) / ‖s_k − s_(k−1)‖\nA ← A + (I − A)(1 − e^(−Δt/τ))\nENGAGE 0,35 · SPEAK 0,55 yli 0,6 s · RELEASE 0,25 · hystereesi 0,12',
      en: 'head: v ← v + (v* − v)(1 − e^(−Δt/0.3)), v* = min(v_max, 2.5d) · d̂, turned by sin(φ)·w\nring: s ← s + 22 px/s · Δt (8 px/s while talking), worms 58 px apart\ndodge: the target moves away from the pointer to a distance of 110 px\nsegment: s_k = s_(k−1) + g · (s_k − s_(k−1)) / ‖s_k − s_(k−1)‖\nA ← A + (I − A)(1 − e^(−Δt/τ))\nENGAGE 0.35 · SPEAK 0.55 for 0.6 s · RELEASE 0.25 · hysteresis 0.12' },
    why: { fi: 'Kynnykset ja hystereesi estävät matoja hyppimästä kohdasta toiseen, ja ajatukset alkavat vasta perillä, joten ajatus ja paikka kuuluvat yhteen. Jokaisella madolla on oma muoto, liike ja näkökulma: hauska, tekninen ja filosofinen.', en: 'Thresholds and hysteresis keep the worms from jumping between points, and the thoughts only start on arrival, so thought and place belong together. Each worm has its own shape, motion and angle: funny, technical and philosophical.' } },
  scapes: { title: { fi: 'Osioiden maisemat', en: 'Section landscapes' },
    technique: { fi: 'Jokaisella osiolla on oma kosminen maisemansa, ja jokainen on tehty eri tekniikalla: etusivu WebGL-shaderilla, Top 5 CSS-gradienteilla ja clip-path-vuorilla, projektit canvas 2D -meteoreilla, teknologiat canvasin virtauskentällä ja yhteys @property-animoidulla conic-gradientilla. Animaatiot pyörivät vain, kun osio näkyy, ja reduced motion -tilassa maisemat pysyvät paikallaan.',
      en: 'Every section has its own cosmic landscape, each made with a different technique: the home page with a WebGL shader, Top 5 with CSS gradients and clip-path mountains, the projects with canvas 2D meteors, technologies with a canvas flow field and contact with an @property-animated conic gradient. Animations only run while the section is visible, and with reduced motion the landscapes stay still.' },
    formula: { fi: 'virtauskenttä: θ(x, y, t) = 1,6 sin(0,006x + 0,15t) + 1,6 cos(0,009y − 0,11t) + 1,2 sin(0,003(x + y))\nmeteori: p(t) = p₀ + v·t, |v| ≈ 450 px/s, häntä 0,12 s\nkehä: --a: 0° → 360° (@property <angle>), 16 s',
      en: 'flow field: θ(x, y, t) = 1.6 sin(0.006x + 0.15t) + 1.6 cos(0.009y − 0.11t) + 1.2 sin(0.003(x + y))\nmeteor: p(t) = p₀ + v·t, |v| ≈ 450 px/s, tail 0.12 s\nring: --a: 0° → 360° (@property <angle>), 16 s' },
    why: { fi: 'Sama aihe eri välineillä näyttää, mihin kukin tekniikka sopii parhaiten: shaderi pikselitason valoon, CSS kevyisiin muotoihin ja canvas liikkuviin hiukkasiin.', en: 'The same subject in different media shows what each technique does best: a shader for per-pixel light, CSS for light shapes and canvas for moving particles.' } },
  map: { title: { fi: 'Hiukkaskartta', en: 'Particle map' },
    technique: { fi: '900 hiukkasta canvas 2D:llä, additiivinen sekoitus (lighter) ja perspektiiviprojektio. Osiot ovat rypäinä renkaassa, ja keskellä on etusivu. Valittu rypäs morfaa osion omaan muotoon, ja rengas kääntyy sen eteen.',
      en: '900 particles on canvas 2D, additive blending (lighter) and perspective projection. Sections are clusters on a ring with the home page in the middle. The selected cluster morphs into the section’s own shape, and the ring turns it to the front.' },
    formula: { fi: 's = f / (z + d), x′ = c_x + x·s, y′ = c_y + y·s\np ← p + (p* − p)(1 − e^(−Δt/0,25 s))', en: 's = f / (z + d), x′ = c_x + x·s, y′ = c_y + y·s\np ← p + (p* − p)(1 − e^(−Δt/0.25 s))' },
    why: { fi: 'Kartta näyttää koko sivun rakenteen yhdellä silmäyksellä ilman pudotusvalikoita. Näppäimistöllä ja painikelistalla se toimii myös ilman osoitinta.', en: 'The map shows the whole page structure at a glance without dropdowns. With the keyboard and the button list it works without a pointer too.' } },
  seo: { title: { fi: 'Hakukoneoptimointi', en: 'Search engine optimisation' },
    technique: { fi: 'Semanttinen HTML: landmarkit, yksi h1 ja osioiden h2:t. JSON-LD: ProfilePage, jonka mainEntity on Person nimellä Infinite, sekä WebSite, BreadcrumbList ja projektien ItemList (SoftwareSourceCode). hreflang fi/en ja x-default.',
      en: 'Semantic HTML: landmarks, one h1 and h2s for sections. JSON-LD: ProfilePage with mainEntity Person named Infinite, plus WebSite, BreadcrumbList and an ItemList of projects (SoftwareSourceCode). hreflang fi/en and x-default.' },
    formula: { fi: 'title ≤ 60 merkkiä · description ≤ 155 merkkiä\nLCP < 2,5 s · INP < 200 ms · CLS < 0,1', en: 'title ≤ 60 characters · description ≤ 155 characters\nLCP < 2.5 s · INP < 200 ms · CLS < 0.1' },
    why: { fi: 'GitHub Pages ei lähetä 301-vastauksia, joten vanhat ankkurit ohjataan skriptillä ja taulukko dokumentoi ne. Sitemap ja llms.txt generoidaan samasta datasta kuin sivu.', en: 'GitHub Pages cannot send 301 responses, so old anchors are redirected by script and the table documents them. The sitemap and llms.txt are generated from the same data as the page.' } },
};

export const CWV: { metric: string; target: string; how: L10n }[] = [
  { metric: 'LCP', target: '< 2,5 s', how: { fi: 'Suurin elementti on heron h1-teksti. Fontit ladataan display=swap-asetuksella, CSS ja JS ovat inline, ja WebGL piirtää vasta ensimmäisen maalauksen jälkeen.', en: 'The largest element is the hero h1 text. Fonts load with display=swap, CSS and JS are inline, and WebGL draws only after the first paint.' } },
  { metric: 'INP', target: '< 200 ms', how: { fi: 'Käsittelijät ovat kevyitä. Raskas laskenta (kenttä, metaballit ja hiukkaset) on jaettu animaatiokehyksiin, ja animaatiot pysähtyvät, kun ne eivät näy.', en: 'Handlers are light. Heavy work (field, metaballs and particles) is split across animation frames, and animations stop when out of view.' } },
  { metric: 'CLS', target: '< 0,1', how: { fi: 'Kuvilla on width ja height. Kiinteille palkeille varataan tila paddingilla ja scroll-paddingilla, ja hero on kiinteän korkuinen.', en: 'Images have width and height. Fixed bars get reserved space with padding and scroll-padding, and the hero has a fixed height.' } },
];

export const UI: Record<Lang, Record<string, string>> = {
  fi: {
    skip: 'Siirry sisältöön', navLabel: 'Osiot', map: 'Kartta', theme: 'Teema', themeDark: 'Titaani', themeLight: 'Timantti', seo: 'SEO',
    langSwitch: 'EN', langSwitchLabel: 'In English', close: 'Sulje',
    heroEyebrow: 'Taiteilijanimi · 32 julkista projektia', heroTagline: 'Tutkin tekoälyavusteisen kehityksen rajoja.',
    heroText: 'Pelejä, 3D:tä, dataa ja yhteisöpalveluita maaliskuusta 2025 alkaen. Kahdeksassatoista repossa on agenttitiedosto, joka antaa AI-avustajalle nimen ja ohjeet.',
    heroCta: 'Etsi projekti', heroGithub: 'GitHub-profiili', heroCanvas: 'Talvimaisema: siniset revontulet, lumiset tunturit, jäätynyt järvi ja leijuvat lumihiutaleet',
    techHero: 'tech · talvimaisema ja revontulet', techRim: 'tech · lasi ja metallireuna', techFinder: 'tech · luvut, aiheet ja aikajana',
    techPersonas: 'tech · avaruusmadot ja huomiokenttä', scapeCss: 'tausta · CSS clip-path', scapeMeteor: 'tausta · canvas-meteorit', scapeFlow: 'tausta · virtauskenttä', scapeEclipse: 'tausta · @property', techMap: 'tech · hiukkaset', techSeo: 'tech · SEO',
    top5Title: 'Oma top 5',
    top5Sub: 'Infiniten oma valinta 32 projektista. Pisteet kertovat mitatun kunnon: tuoreus, laajuus, toimiva demo, testit, README ja kesto.',
    openReview: 'Arvio ja suositukset', review: 'Arvio', reviewNote: 'päätelty lähteistä', recs: 'Suositukset', recNote: 'ehdotus',
    scoreTitle: 'Pisteet', pR: 'Tuoreus', pL: 'Laajuus', pD: 'Demo', pDoc: 'README', pT: 'Testit', pK: 'Kesto', verdictNote: 'pisteiden mukaan',
    v1: 'Kärkityö', v2: 'Vahva', v3: 'Lupaava', v4: 'Kokeilu', v5: 'Luonnos', matched: 'Osuneet tagit', allTags: 'Tagit ja perustelut',
    projectCard: 'Projektikortti',
    purpose: 'Käyttö', technology: 'Tekniikka', ai: 'AI-avustaja', result: 'Tulos', noResult: 'ei lähteessä', demo: 'Avaa demo', code: 'Lähdekoodi', pts: 'p',
    finderTitle: 'Projektit ja Infiniten tarina', finderSub: 'Kaikki 32 projektia aikajärjestyksessä kuudessa luvussa. Valitse luku tai aiheita, niin kortit ja aikajana rajautuvat. Painikkeen luku kertoo, montako projektia jää jäljelle.',
    dimPurpose: 'Käyttötarkoitus', dimTech: 'Teknologia', dimAi: 'AI-puoli', clear: 'Näytä kaikki',
    finderNone: 'kaikki luvut ja aiheet', finderNoMatch: 'Yksikään projekti ei osu valintaan.', allChapters: 'Kaikki luvut', readMore: 'Lue luvusta lisää',
    ftlLabel: 'Aikajana 03/2025–11/2026: palkit ovat commitit kuukaudessa ja pisteet projektien aloituksia. Valitse piste, niin kortti tulee esiin. Nuolinäppäimet siirtyvät pisteestä toiseen.',
    projects: 'projektia', storyEyebrow: 'Tarina · 03/2025–11/2026', chapters: 'Luvut', commits: 'commitia', newHere: 'Uutta tässä luvussa', gModel: 'AI-mallit ja alustat',
    legendTop: 'Top 5', legendPort: 'Portfoliossa', legendOther: 'Ei portfoliossa', legendThread: 'Sarja tai yhteys',
    statusTop: 'Top 5 · sija', statusPort: 'Portfoliossa', statusOther: 'Ei portfoliossa', start: 'Aloitus', lastCommit: 'viimeisin commit',
    firstHere: 'Ensimmäistä kertaa tässä', pair: 'AI-avustaja', agentFile: 'agenttitiedosto', edits: 'muutosta', series: 'Sarja', pickDot: 'Valitse piste aikajanalta.',
    storySources: 'Lähteet: kaikkien 43 repon git-historia (tekijän päiväys, kaikki haarat), GitHub API, package.json:t, README:t ja agenttitiedostojen ensimmäiset commitit. Projektin paikka on sen ensimmäinen commit, ja AI-mallit tulevat agenttitiedostoista. Ensimmäinen commit ei ole oppimispäivä (päätelty).',
    codeShort: 'Koodi',
    techTitle: 'Teknologiat', techSub: 'Mitattu 32 repon kielitilastoista ja package.json-tiedostoista. Kyse ei ole itsearviosta.', langsTitle: 'Kielet, osuus koodista', libsTitle: 'Kirjastot ja alustat, repojen määrä', repos: 'repoa',
    contactTitle: 'Yhteys', contactText: 'Kiinnostaako jokin projekti, tarvitsetko tekijää omaan ideaasi vai haluatko vain kysyä tekoälystä? Kaikki yhteydenotot ovat tervetulleita, niin kaupalliset kuin muutkin.', cPitchTitle: 'Mistä haluat jutella?', cReason: 'Aihe', cProject: 'Projekti (valinnainen)', cProjectNone: 'Ei mikään tietty', cName: 'Nimesi (valinnainen)', cMsg: 'Viesti', cMail: 'Lähetä sähköpostilla', cWa: 'Lähetä WhatsAppissa', cAsk: 'Kysy ensin neuvonantajilta', cNote: 'Lomake avaa sähköpostiohjelmasi tai WhatsAppin valmiiksi täytetyllä viestillä. Sivu ei tallenna eikä lähetä mitään itse.', cPending: 'Paikkamerkki · sähköpostiosoite ja WhatsApp-numero lisätään, kun Infinite vahvistaa ne.', cNeedMsg: 'Kirjoita ensin viesti.', cOpened: 'Viesti avattiin valitsemassasi sovelluksessa.',
    footerSources: 'Tiedot: GitHub API, git-historia, README:t, package.json:t ja agenttitiedostot, haettu 1.11.2026',
    crew: 'Neuvonantajat', log: 'Loki', hide: 'Piilota madot', show: 'Näytä madot', logTitle: 'Keskusteluloki', logEmpty: 'Neuvonantajat eivät ole vielä puhuneet.', wormsTitle: 'Tapaa neuvonantajat',
   
    analysis: 'Neuvonantajien analyysi', analysisNote: 'tulkinta', aTech: 'Tekninen', aPhilo: 'Filosofinen', aFun: 'Hauska',
    ask: 'Kysy', askTitle: 'Kysy neuvonantajilta', askLead: 'Kysy Infinitestä tai projekteista. Vastaukset kootaan selaimessa tämän sivun datasta, eikä kielimallia kutsuta.',
    askLabel: 'Kysymyksesi', askPlaceholder: 'esim. Mitä pelejä on tehty?', askSend: 'Kysy', askYou: 'Sinä', askOpen: 'Avaa kortti',
    askSuggest: 'Kuka on Infinite?|Miten saan yhteyden?|Mitä pelejä on tehty?|Mitä AI-malleja on käytetty?|Mikä on uusin projekti?|Mitkä ovat parhaat?|Mitä 3D-projekteja on?',
    askWho: 'Infinite on tämän portfolion taiteilijanimi. Julkisia projekteja on {n}, ensimmäinen maaliskuulta 2025, ja kaikki koodi on GitHubissa.',
    askWho2: 'Pelejä, 3D:tä, dataa ja yhteisöpalveluita, ja {a} repossa on agenttitiedosto, joka antaa AI-avustajalle nimen ja ohjeet. Työtapa on tekoälyavusteinen kehitys.',
    askWho3: 'Oikeaa nimeä tai muita henkilötietoja sivulla ei kerrota. Se on tietoinen valinta.',
    askContact: 'Koodin näet GitHubissa: github.com/SamppaFIN.', askContact2: 'Muita yhteystietoja ei ole vielä julkaistu. Paikka on varattu Yhteys-osiossa.', askContactForm: 'Yhteys-osiossa on lomake: valitse aihe ja lähetä viesti sähköpostilla tai WhatsAppissa. Kaupalliset ja muut yhteydenotot ovat tervetulleita.',
    askTag: '{tag}: {n} projektia.', askTagMore: 'Kärjessä pisteiden mukaan: {list}.', askTop: 'Infiniten oma top 5: {list}.', askTopCrit: 'Valinta ei seuraa pisteitä. Pisteiden mukaan kärjessä on {best}.',
    askNewest: 'Viimeksi päivitetty projekti on {name} ({date}).', askNewest2: 'Tuoreimmat aloitukset: {list}.', askOldest: 'Vanhin projekti on {name}, ensimmäinen commit {date}.',
    askModels: 'Projekteissa on käytetty {n} AI-mallia ja alustaa: {list}.', askModelsCrit: 'Päivämäärä on agenttitiedoston ensimmäinen commit, ei välttämättä ensimmäinen käyttökerta.',
    askCount: 'Julkisia projekteja on {n}, ja niissä on yhteensä {c} committia.', askLangs: 'Kielistä suurin on {top} ({pct} % koodista). Muut: {list}.',
    askNone: 'En löytänyt tähän vastausta tämän sivun datasta. Kokeile jotakin näistä:', askMatches: 'Lähimmät osumat tekstistä: {list}.',
   
    mapTitle: 'Kartta', mapGo: 'Siirry osioon', mapHelp: '← → valitsee · Enter siirtyy · Esc sulkee', mapCanvas: 'Hiukkaskartta: etusivu keskellä ja neljä osiota renkaana',
    statusNew: 'Uusi', statusUpdated: 'Päivitetään',
    seoTitle: 'Hakukoneoptimointi', tabTitles: 'Titlet', tabRedirects: '301-ohjaukset', tabHeadings: 'Otsikot', page: 'Sivu', chars: 'merkkiä', chains: 'Ketjuja',
    noRedirect: 'ei ohjausta (200)', h1Count: 'h1-otsikoita', jumps: 'Hyppyjä otsikkotasoissa', robotsNote: 'Hakukoneet lukevat robots.txt:n vain domainin juuresta (samppafin.github.io), joten tämä tiedosto on ohjeellinen.',
    redirectNote: 'GitHub Pages ei lähetä 301-vastauksia. Vanhat ankkurit ohjataan sivun skriptillä, ja taulukko dokumentoi ohjaukset.',
    technique: 'Tekniikka', formula: 'Kaava', why: 'Miksi',
  },
  en: {
    skip: 'Skip to content', navLabel: 'Sections', map: 'Map', theme: 'Theme', themeDark: 'Titanium', themeLight: 'Diamond', seo: 'SEO',
    langSwitch: 'FI', langSwitchLabel: 'Suomeksi', close: 'Close',
    heroEyebrow: 'Artist name · 32 public projects', heroTagline: 'Exploring the frontier of AI‑assisted development.',
    heroText: 'Games, 3D, data and community services since March 2025. Eighteen repos have an agent file that gives the AI assistant a name and instructions.',
    heroCta: 'Find a project', heroGithub: 'GitHub profile', heroCanvas: 'Winter landscape: blue auroras, snowy fells, a frozen lake and falling snowflakes',
    techHero: 'tech · winter landscape and auroras', techRim: 'tech · glass and metal rim', techFinder: 'tech · chapters, topics and timeline',
    techPersonas: 'tech · space worms and attention', scapeCss: 'background · CSS clip-path', scapeMeteor: 'background · canvas meteors', scapeFlow: 'background · flow field', scapeEclipse: 'background · @property', techMap: 'tech · particles', techSeo: 'tech · SEO',
    top5Title: 'My top 5',
    top5Sub: 'Infinite’s own pick of 32 projects. The score shows the measured condition: recency, size, a working demo, tests, README and duration.',
    openReview: 'Review and recommendations', review: 'Review', reviewNote: 'inferred from the sources', recs: 'Recommendations', recNote: 'suggestion',
    scoreTitle: 'Score', pR: 'Recency', pL: 'Size', pD: 'Demo', pDoc: 'README', pT: 'Tests', pK: 'Duration', verdictNote: 'by score',
    v1: 'Flagship', v2: 'Strong', v3: 'Promising', v4: 'Experiment', v5: 'Sketch', matched: 'Matching tags', allTags: 'Tags and evidence',
    projectCard: 'Project card',
    purpose: 'Purpose', technology: 'Technology', ai: 'AI assistant', result: 'Result', noResult: 'not in the sources', demo: 'Open demo', code: 'Source code', pts: 'pts',
    finderTitle: 'Projects and the story of Infinite', finderSub: 'All 32 projects in time order, in six chapters. Pick a chapter or topics and the cards and timeline narrow down. The number on each button tells how many projects remain.',
    dimPurpose: 'Purpose', dimTech: 'Technology', dimAi: 'AI side', clear: 'Show all',
    finderNone: 'all chapters and topics', finderNoMatch: 'No project matches the selection.', allChapters: 'All chapters', readMore: 'Read more about this chapter',
    ftlLabel: 'Timeline 03/2025–11/2026: the bars are commits per month and the dots are project starts. Pick a dot to bring its card into view. Arrow keys move between dots.',
    projects: 'projects', storyEyebrow: 'Story · 03/2025–11/2026', chapters: 'Chapters', commits: 'commits', newHere: 'New in this chapter', gModel: 'AI models and platforms',
    legendTop: 'Top 5', legendPort: 'In the portfolio', legendOther: 'Not in the portfolio', legendThread: 'Series or link',
    statusTop: 'Top 5 · rank', statusPort: 'In the portfolio', statusOther: 'Not in the portfolio', start: 'Start', lastCommit: 'last commit',
    firstHere: 'First used here', pair: 'AI assistant', agentFile: 'agent file', edits: 'edits', series: 'Series', pickDot: 'Pick a dot on the timeline.',
    storySources: 'Sources: the git history of all 43 repos (author date, all branches), the GitHub API, package.json files, READMEs and the first commits of the agent files. A project’s place is its first commit, and the AI models come from the agent files. A first commit is not a learning date (inferred).',
    codeShort: 'Code',
    techTitle: 'Technologies', techSub: 'Measured from the language stats and package.json files of 32 repos. Not a self-assessment.', langsTitle: 'Languages, share of code', libsTitle: 'Libraries and platforms, number of repos', repos: 'repos',
    contactTitle: 'Contact', contactText: 'Interested in a project, looking for someone to build your idea, or just want to ask about AI? Every message is welcome, commercial or not.', cPitchTitle: 'What would you like to talk about?', cReason: 'Topic', cProject: 'Project (optional)', cProjectNone: 'None in particular', cName: 'Your name (optional)', cMsg: 'Message', cMail: 'Send by email', cWa: 'Send on WhatsApp', cAsk: 'Ask the advisors first', cNote: 'The form opens your email app or WhatsApp with the message filled in. The page itself stores and sends nothing.', cPending: 'Placeholder · the email address and WhatsApp number will be added once Infinite confirms them.', cNeedMsg: 'Write a message first.', cOpened: 'The message was opened in the app you chose.',
    footerSources: 'Data: GitHub API, git history, READMEs, package.json files and agent files, fetched 1 Nov 2026',
    crew: 'Advisors', log: 'Log', hide: 'Hide the worms', show: 'Show the worms', logTitle: 'Conversation log', logEmpty: 'The advisors have not spoken yet.', wormsTitle: 'Meet the advisors',
   
    analysis: 'The advisors’ analysis', analysisNote: 'interpretation', aTech: 'Technical', aPhilo: 'Philosophical', aFun: 'Funny',
    ask: 'Ask', askTitle: 'Ask the advisors', askLead: 'Ask about Infinite or the projects. The answers are put together in the browser from this page’s data, and no language model is called.',
    askLabel: 'Your question', askPlaceholder: 'e.g. What games have been made?', askSend: 'Ask', askYou: 'You', askOpen: 'Open card',
    askSuggest: 'Who is Infinite?|How do I get in touch?|What games are there?|Which AI models have been used?|What is the newest project?|Which are the best?|What 3D projects are there?',
    askWho: 'Infinite is the artist name behind this portfolio. There are {n} public projects, the first from March 2025, and all the code is on GitHub.',
    askWho2: 'Games, 3D, data and community services, and {a} repos have an agent file that gives the AI assistant a name and instructions. The way of working is AI-assisted development.',
    askWho3: 'The real name and other personal details are not on the page. That is a deliberate choice.',
    askContact: 'You can see the code on GitHub: github.com/SamppaFIN.', askContact2: 'No other contact details have been published yet. There is a placeholder in the Contact section.', askContactForm: 'The Contact section has a form: pick a topic and send a message by email or WhatsApp. Commercial and other enquiries are welcome.',
    askTag: '{tag}: {n} projects.', askTagMore: 'Top by score: {list}.', askTop: 'Infinite’s own top 5: {list}.', askTopCrit: 'The pick does not follow the scores. By score, the top is {best}.',
    askNewest: 'The most recently updated project is {name} ({date}).', askNewest2: 'Latest starts: {list}.', askOldest: 'The oldest project is {name}, first commit {date}.',
    askModels: 'The projects have used {n} AI models and platforms: {list}.', askModelsCrit: 'The date is the first commit of the agent file, not necessarily the first use.',
    askCount: 'There are {n} public projects with {c} commits in total.', askLangs: 'The largest language is {top} ({pct} % of the code). Others: {list}.',
    askNone: 'I found no answer to that in this page’s data. Try one of these:', askMatches: 'Closest matches in the text: {list}.',
   
    mapTitle: 'Map', mapGo: 'Go to section', mapHelp: '← → selects · Enter goes · Esc closes', mapCanvas: 'Particle map: home in the middle and four sections on a ring',
    statusNew: 'New', statusUpdated: 'Updated',
    seoTitle: 'Search engine optimisation', tabTitles: 'Titles', tabRedirects: '301 redirects', tabHeadings: 'Headings', page: 'Page', chars: 'characters', chains: 'Chains',
    noRedirect: 'no redirect (200)', h1Count: 'h1 headings', jumps: 'Skipped heading levels', robotsNote: 'Search engines read robots.txt only from the domain root (samppafin.github.io), so this file is advisory.',
    redirectNote: 'GitHub Pages cannot send 301 responses. Old anchors are redirected by the page script, and the table documents the redirects.',
    technique: 'Technique', formula: 'Formula', why: 'Why',
  },
};

// Yhteydenotto (Infinite antoi osoitteen ja numeron 2.11.2026). Sivulla ne kulkevat vain base64-koodattuina lomakkeen linkkeihin.
export const CONTACT = { email: 'raisanen.sami@gmail.com', whatsapp: '358505465573' };
export const CONTACT_REASONS: { id: string; label: L10n; pitch: L10n }[] = [
  { id: 'commercial', label: { fi: 'Kaupallinen yhteistyö', en: 'Commercial work' }, pitch: { fi: 'Sovellus, peli, 3D-näkymä tai AI-avusteinen prototyyppi yrityksellesi.', en: 'An app, a game, a 3D view or an AI-assisted prototype for your company.' } },
  { id: 'project', label: { fi: 'Kiinnostaako jokin projekti?', en: 'Interested in a project?' }, pitch: { fi: 'Demo, lähdekoodi tai jatkokehitys jostakin tämän sivun projektista.', en: 'A demo, the source code or further development of a project on this page.' } },
  { id: 'ai', label: { fi: 'Kysy tekoälystä', en: 'Ask about AI' }, pitch: { fi: 'AI-avusteinen kehitys, agenttitiedostot ja se, mitä tekoälyn kanssa on opittu.', en: 'AI-assisted development, agent files and what has been learned working with AI.' } },
  { id: 'other', label: { fi: 'Muu asia', en: 'Something else' }, pitch: { fi: 'Palaute, idea tai pelkkä tervehdys.', en: 'Feedback, an idea or just a hello.' } },
];
