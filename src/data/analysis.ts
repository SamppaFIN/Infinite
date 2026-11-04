// Neuvonantajien analyysit jokaisesta projektista. Faktat tulevat projects.json-datasta ja docs/design/reviews.py:stä.
// tech = Hionta (tekninen), philo = Kirkkaus (filosofinen), fun = Loiste (hauska). Filosofinen ja hauska ovat tulkintaa, eivät lähdefaktoja.
type L10n = { fi: string; en: string };
export type Analysis = { tech: L10n; philo: L10n; fun: L10n };
const x = (fi: string, en: string): L10n => ({ fi, en });

export const ANALYSIS: Record<string, Analysis> = {
  'ai-koulu': {
    tech: x('Astro 7 ja MDX pitävät sisällön staattisena, React herää vain demoissa ja aikakehässä, ja Pagefind hakee ilman palvelinta. Vitest vahtii lähteitä ja dataa, Playwright ja axe käyttöliittymää kahdella leveydellä.', 'Astro 7 and MDX keep the content static, React wakes up only in the demos and the time ring, and Pagefind searches without a server. Vitest guards the sources and data, Playwright and axe the UI at two widths.'),
    philo: x('Tekoälyä opettava sivu, jonka ihminen ja tekoäly tekivät yhdessä. Opettaja ja oppiaine ovat samaa ainetta.', 'A site that teaches AI, made by a human and an AI together. The teacher and the subject are made of the same stuff.'),
    fun: x('Ainoa koulu, jossa kukaan ei ole jäänyt luokalle. Toisaalta oppilaita ei ole vielä laskettu.', 'The only school where nobody has been held back a year. Then again, nobody has counted the pupils yet.') },
  globeciv3: {
    tech: x('Three.js piirtää planeetan, Svelte käyttöliittymän ja Zustand pitää tilan. Zoom kulkee planeetalta ruutuun ilman näkymän vaihtoa, ja testit ovat Vitestillä ja Playwrightilla.', 'Three.js draws the planet, Svelte the UI and Zustand holds the state. The zoom goes from planet to tile without a view change, and the tests run on Vitest and Playwright.'),
    philo: x('Maailma on olemassa vasta, kun sitä katsoo. Kartta toimii kuin havainto: tuntematon pysyy tyhjänä, kunnes joku käy siellä.', 'A world that exists only once you look at it. The map works like perception: the unknown stays blank until someone goes there.'),
    fun: x('Kolmas yritys rakentaa sivilisaatio. Ihmiskunnalta meni siihen vähän kauemmin, ja sekin tarvitsi useamman version.', 'The third attempt at building a civilisation. Humanity took a bit longer, and it also needed a few versions.') },
  '3dihminen': {
    tech: x('React Three Fiber ja glTF-putki, jossa on Draco- ja meshoptimizer-pakkaus. Anatomia kuoriutuu kerros kerrokselta, kun zoomaat.', 'React Three Fiber and a glTF pipeline with Draco and meshoptimizer compression. The anatomy peels away layer by layer as you zoom.'),
    philo: x('Kipu on yksityinen kokemus, lihas julkista anatomiaa. Sovellus kääntää toisen toiseksi ja sanoo rehellisesti, ettei se ole diagnoosi.', 'Pain is a private experience, a muscle is public anatomy. The app translates one into the other and honestly says it is not a diagnosis.'),
    fun: x('Ensimmäinen lääkäri, jolle ei tarvitse jonottaa. Reseptiä se ei tosin kirjoita.', 'The first doctor with no queue. It does not write prescriptions, though.') },
  bandrock: {
    tech: x('Staattinen GitHub Pages -sivu ja Cloudflare Worker + R2 -tallennus. Sivua muokataan viisimerkkisellä koodilla, ja CLAUDE.md:tä on muutettu 29 kertaa.', 'A static GitHub Pages site with Cloudflare Worker + R2 storage. A page is edited with a five-character code, and CLAUDE.md has been changed 29 times.'),
    philo: x('Ilman kirjautumista identiteetti on viisi merkkiä. Bändille se riittää: tärkeintä on, että joku kuulee.', 'Without login, identity is five characters. For a band that is enough: what matters is that someone listens.'),
    fun: x('AI-avustaja Roudari kantaa nyt koodia vahvistimien sijaan. Selkä kiittää.', 'The AI assistant Roudari, the roadie, now carries code instead of amplifiers. Much easier on the back.') },
  eldritch: {
    tech: x('React-PWA pnpm-monorepossa. Ydin on puhdasta, testattua TypeScriptiä, Playwright ajaa ensin 360 px:n mobiiliprojektin, ja CSS kutistui 11 204 rivistä 372:een.', 'A React PWA in a pnpm monorepo. The core is pure, tested TypeScript, Playwright runs the 360 px mobile project first, and the CSS shrank from 11,204 lines to 372.'),
    philo: x('Omistaminen syntyy liikkeestä. Maata ei osteta vaan kierretään, ja kartta muistaa jokaisen askeleen.', 'Ownership comes from movement. Land is not bought but walked around, and the map remembers every step.'),
    fun: x('Peli, joka saa koodarin ulos. Jo se on kosminen ihme.', 'A game that gets a coder outdoors. That alone is a cosmic wonder.') },
  'toni1-0': {
    tech: x('Poisson-malli arvioi todennäköisyydet ja Kelly-kaava panoksen koon. Taustalla ovat skrapperi, Supabase ja Express, ja commiteja on 652, eniten kaikista.', 'A Poisson model estimates the probabilities and the Kelly formula the stake size. Behind it are a scraper, Supabase and Express, and 652 commits, the most of all.'),
    philo: x('Kelly-kaava on nöyryyden matematiikkaa: se kertoo, kuinka vähän omaan näkemykseen kannattaa luottaa.', 'The Kelly formula is the mathematics of humility: it tells you how little to trust your own view.'),
    fun: x('652 committia vedonlyöntiin. Todennäköisyys, että tämä on portfolion ahkerin repo: 1,00.', '652 commits on betting. Probability that this is the hardest-working repo in the portfolio: 1.00.') },
  harakka: {
    tech: x('Sivu ja API ovat yksi Cloudflare Worker, ja data on R2:ssa. Muokkauskoodit suojataan HMAC-SHA256:lla, ja kirjoitukset ovat optimistisia etagilla.', 'The page and API are one Cloudflare Worker, and the data is in R2. Edit codes are protected with HMAC-SHA256, and writes are optimistic with etags.'),
    philo: x('Äänestys ilman kirjautumista luottaa ihmisiin. Se on yhtä aikaa tekninen ratkaisu ja pieni kannanotto.', 'Voting without login trusts people. It is a technical choice and a small statement at the same time.'),
    fun: x('Harakka kerää kiiltäviä mielipiteitä, eikä sen tarvitse varastaa niitä: äänestäjät tuovat ne itse.', 'Harakka, the magpie, collects shiny opinions and never needs to steal them: the voters bring them in.') },
  roguereborn: {
    tech: x('Tasot syntyvät proseduraalisesti, ja mukana ovat statusvaikutukset. Playwright on jo riippuvuutena, ja dokumentaatio on kattava.', 'The levels are procedural, with status effects. Playwright is already a dependency, and the documentation is thorough.'),
    philo: x('Roguelikessa kuolema on opettaja. Jokainen yritys alkaa alusta, mutta pelaaja ei.', 'In a roguelike, death is the teacher. Every run starts over, but the player does not.'),
    fun: x('Ääretön luolasto, mutta kehitys loppui kesäkuussa. Ehkä kehittäjä on yhä jossain kerroksessa 47.', 'An endless dungeon, but development ended in June. Perhaps the developer is still somewhere on floor 47.') },
  webshop: {
    tech: x('Next.js, Prisma, Supabase, Stripe, NextAuth ja OpenAI. Kolme committia tehtiin lokakuussa 2025 ja varsinainen toteutus kesäkuussa 2026.', 'Next.js, Prisma, Supabase, Stripe, NextAuth and OpenAI. Three commits were made in October 2025 and the real implementation in June 2026.'),
    philo: x('Semanttinen haku ymmärtää, mitä tarkoitat, vaikket osaisi sanoa sitä. Kauppa kuuntelee aikomusta eikä sanoja.', 'Semantic search understands what you mean even when you cannot say it. The shop listens to intent, not words.'),
    fun: x('Kauppa on valmis myymään mitä tahansa. Mitä, sitä ei kerro edes README.', 'The shop is ready to sell anything. What, exactly, not even the README says.') },
  vaihtokaupat: {
    tech: x('Staattinen sivu ja Worker + R2 -rajapinta, ja Playwright ajaa axe-saavutettavuustestit. AI-avustajana on Hermes (Claude Opus 5.5).', 'A static page and a Worker + R2 API, and Playwright runs axe accessibility tests. The AI assistant is Hermes (Claude Opus 5.5).'),
    philo: x('Ilman rahaa arvo pitää sopia ihmisten kesken. Vanhin kaupankäynnin muoto tarvitsi uusimman mallin.', 'Without money, value has to be agreed between people. The oldest form of trade needed the newest model.'),
    fun: x('Hermes oli kauppiaiden jumala. Nyt se kirjoittaa Workereita ilmaiseksi, mikä sopii teemaan.', 'Hermes was the god of merchants. Now it writes Workers for free, which suits the theme.') },
  spotifyplaylisttherapist: {
    tech: x('Pohjana ovat Express-mock, Vitest ja Playwright. README suunnittelee Spotify OAuth PKCE:n, Geniuksen ja GPT-4o-minin.', 'The base is an Express mock, Vitest and Playwright. The README plans Spotify OAuth PKCE, Genius and GPT-4o-mini.'),
    philo: x('Olemmeko sitä, mitä kuuntelemme, vai kuuntelemmeko sitä, mitä olemme? Projekti ei ole vielä päättänyt, emmekä mekään.', 'Are we what we listen to, or do we listen to what we are? The project has not decided yet, and neither have we.'),
    fun: x('Terapeutti, joka ei ole vielä avannut vastaanottoa. Ajanvaraus on kuitenkin jo mockattu.', 'A therapist who has not opened the practice yet. The booking is already mocked, though.') },
  'spatial-3d-ui-framework': {
    tech: x('README on yli 31 000 merkkiä, portfolion laajin, ja testit ajetaan Playwrightilla. Repolla on portfolion ainoat GitHub-tähdet, kaksi.', 'The README is over 31,000 characters, the longest in the portfolio, and the tests run on Playwright. It has the portfolio’s only GitHub stars, two.'),
    philo: x('Käyttöliittymä on aina ollut taso. Kolmas ulottuvuus kysyy, pitääkö napin olla jossakin eikä vain jotakin.', 'A user interface has always been a plane. The third dimension asks whether a button should be somewhere, not just something.'),
    fun: x('Kaksi tähteä. Michelin-oppaassa se olisi jo erinomainen ravintola.', 'Two stars. In the Michelin guide that would already be an excellent restaurant.') },
  nutriscan: {
    tech: x('Expo ja React Native. Ensimmäinen commit on maaliskuulta 2025, ja saavutettavuus on kirjattu README:hen.', 'Expo and React Native. The first commit is from March 2025, and accessibility is documented in the README.'),
    philo: x('Viivakoodi on tuotteen nimi koneelle. Sovellus kääntää sen takaisin sille, jolle sillä on väliä: allergiselle.', 'A barcode is a product’s name for machines. The app translates it back for the person it matters to: the one with allergies.'),
    fun: x('Projekti on vanhempi kuin useimmat sen skannaamat eväät. Parasta ennen -päivää ei näy.', 'The project is older than most of the snacks it scans. No best-before date in sight.') },
  sein: {
    tech: x('React, Konva ja Supabase, ja Vitest on mukana. Koko projekti syntyi yhdessä päivässä, 31 committia.', 'React, Konva and Supabase, with Vitest. The whole project was made in one day, 31 commits.'),
    philo: x('Anonyymi seinä on kaupungin vanhin some. Se kysyy saman kuin aina: mitä ihmiset sanovat, kun kukaan ei tiedä, kuka puhuu?', 'An anonymous wall is the city’s oldest social media. It asks what it always has: what do people say when nobody knows who is speaking?'),
    fun: x('Ääretön seinä yhdessä päivässä. Roomaa ei rakennettu päivässä, mutta Roomalla ei ollut Supabasea.', 'An endless wall in one day. Rome was not built in a day, but Rome had no Supabase.') },
  globeciv: {
    tech: x('Kaupungit, teknologiapuu ja tekoälyvastustajat, 4X-mekaniikka ja proseduraalinen Web Audio. README on hyvä.', 'Cities, a tech tree and AI opponents, 4X mechanics and procedural Web Audio. The README is good.'),
    philo: x('Jokainen sarja alkaa versiosta, joka ei tiedä olevansa ensimmäinen.', 'Every series begins with a version that does not know it is the first.'),
    fun: x('Sivilisaatio kahdeksassa commitissa. Raamatussa siihen meni kuusi päivää ja lepopäivä.', 'A civilisation in eight commits. In Genesis it took six days and a day of rest.') },
  glow: {
    tech: x('27 committia kahdessa päivässä, ja silti mukana ovat Vitest ja Playwright. AI-avustajana oli Sol (DeepSeek V4 Pro).', '27 commits in two days, and still with Vitest and Playwright. The AI assistant was Sol (DeepSeek V4 Pro).'),
    philo: x('Rytmipeli opettaa, että oikea hetki on taito. Liian aikaisin ja liian myöhään ovat yhtä väärin.', 'A rhythm game teaches that the right moment is a skill. Too early and too late are equally wrong.'),
    fun: x('Testit rytmipelille. Ainakin koodi pysyy tahdissa.', 'Tests for a rhythm game. At least the code keeps time.') },
  'nlp-ai': {
    tech: x('Mallit tulevat OpenRouterin kautta, ja mukana on puheentunnistus. Projekti alkoi syyskuussa 2025.', 'The models come through OpenRouter, with speech recognition. The project started in September 2025.'),
    philo: x('Kahdeksan persoonaa, yksi kuulija. Ehkä terapian ydin ei ole vastaus vaan se, että joku kuuntelee.', 'Eight personas, one listener. Maybe the core of therapy is not the answer but that someone listens.'),
    fun: x('Kahdeksan terapeuttia samassa ikkunassa. Toinen mielipide on aina saatavilla, samoin kahdeksas.', 'Eight therapists in one window. A second opinion is always available, and so is an eighth.') },
  'ai-pasianssi': {
    tech: x('Malli tulee OpenRouterin tai Groqin kautta. Peli tehtiin kahdessa päivässä, ja README on hyvä.', 'The model comes through OpenRouter or Groq. It was made in two days, and the README is good.'),
    philo: x('Pasianssi on peli yhdelle. Nyt joku pelaa sen puolestasi, ja yksinäisyys siirtyy katsojalle.', 'Solitaire is a game for one. Now someone plays it for you, and the solitude moves to the spectator.'),
    fun: x('Vihdoin tekoäly, joka tekee sen, mihin toimistoissa on käytetty työaikaa vuosikymmeniä.', 'Finally an AI that does what offices have spent working hours on for decades.') },
  eldrichhorror: {
    tech: x('README on laaja ja konsepti GPS-pohjainen. Kaikki 19 committia ovat kahdelta päivältä lokakuussa 2025.', 'The README is extensive and the concept GPS-based. All 19 commits are from two days in October 2025.'),
    philo: x('Edeltäjät jäävät usein näkymättömiksi. Tämä luonnos on päätelty Eldritchin edeltäjäksi.', 'Predecessors often stay invisible. This sketch is inferred to be Eldritch’s predecessor.'),
    fun: x('Nimestä puuttuu t-kirjain. Lovecraftin mukaan jotkin asiat on parempi jättää lausumatta.', 'The name is missing a t. According to Lovecraft, some things are better left unspoken.') },
  newsscaper: {
    tech: x('Se on käyttöliittymä last30days-työkalulle, ja taustalla on FastAPI.', 'It is a UI for the last30days tool, with FastAPI behind it.'),
    philo: x('Viisi lähdettä, viisi totuutta. Työkalu ei valitse puolta vaan näyttää, miltä sama asia kuulostaa eri huoneissa.', 'Five sources, five truths. The tool does not take sides but shows how the same thing sounds in different rooms.'),
    fun: x('Viisi committia, viisi lähdettä. Tasapuolisuus näkyy jopa git-historiassa.', 'Five commits, five sources. Even the git history is balanced.') },
  hallituspaatokset: {
    tech: x('Commiteja on viisi toukokuulta 2026, ja README:ssä on 88 merkkiä.', 'There are five commits from May 2026, and the README has 88 characters.'),
    philo: x('Lupaus on puhetta tulevaisuudelle. Infografiikka tuo sen takaisin nykyhetkeen ja kysyy, mitä tapahtui.', 'A promise is speech addressed to the future. The infographic brings it back to the present and asks what happened.'),
    fun: x('Ainoa projekti, jonka kohteet voi äänestää ulos. Neljän vuoden välein.', 'The only project whose subjects can be voted out. Every four years.') },
  'globeciv2-0': {
    tech: x('Svelte, Phaser, Comlink ja Dexie. AI-avustajana oli Syvyys (DeepSeek V4 Pro).', 'Svelte, Phaser, Comlink and Dexie. The AI assistant was Syvyys (DeepSeek V4 Pro).'),
    philo: x('Autonominen sivilisaatio ei tarvitse pelaajaa. Se kysyy, mitä varten pelaaja sitten on.', 'An autonomous civilisation does not need a player. It asks what the player is for, then.'),
    fun: x('Yksi commit. Sivilisaatio, joka syntyi ja lepää samana päivänä.', 'One commit. A civilisation that was born and went to rest on the same day.') },
  resonance: {
    tech: x('Ääni syntyy Web Audiolla, ja kuva on geometrista. AI-avustajana oli Aavistus (DeepSeek V4 Pro).', 'The sound is made with Web Audio, and the visuals are geometric. The AI assistant was Aavistus (DeepSeek V4 Pro).'),
    philo: x('Taajuus on vain luku, kunnes joku kuuntelee sitä. Meditaatio tekee luvusta kokemuksen.', 'A frequency is just a number until someone listens to it. Meditation turns the number into an experience.'),
    fun: x('963 hertsiä. Naapuri ei meditoi.', '963 hertz. The neighbours are not meditating.') },
  'j-rjestelm-nvarjot': {
    tech: x('Lähteinä ovat Finlex, Kilpailu- ja kuluttajavirasto ja FINE. Commiteja on kaksi.', 'The sources are Finlex, the Competition and Consumer Authority and FINE. There are two commits.'),
    philo: x('Varjo kertoo, mistä valo tulee. Epäkohtien kartta on myös kartta siitä, mitä yhteiskunnalta odotetaan.', 'A shadow tells you where the light comes from. A map of grievances is also a map of what we expect from society.'),
    fun: x('Käsikirja, jonka luettuaan haluaa tehdä valituksen. Onneksi kirja kertoo, minne.', 'A handbook that makes you want to file a complaint. Luckily it tells you where.') },
  suomisimulaattori: {
    tech: x('Väestö ja talous ovat samassa mallissa, ja aikajana kattaa 1800–2024. Commiteja on kuusi kahdessa päivässä.', 'Population and economy are in one model, and the timeline covers 1800–2024. There are six commits in two days.'),
    philo: x('Simulaatio on väite siitä, mikä historiassa oli olennaista. Jokainen pois jätetty muuttuja on myös valinta.', 'A simulation is a claim about what mattered in history. Every variable left out is a choice too.'),
    fun: x('224 vuotta Suomen historiaa kahdessa päivässä. Nopeampi kuin yksikään hallitusohjelma.', '224 years of Finnish history in two days. Faster than any government programme.') },
  'factory-ultra': {
    tech: x('README on yli 20 000 merkkiä, ja BRDC-työnkulku näkyy myöhemmin Eldritchin tiketeissä.', 'The README is over 20,000 characters, and the BRDC workflow later shows up in Eldritch’s tickets.'),
    philo: x('Tehdas, joka tekee tehtaita. Kun prosessi kirjoitetaan auki, sen voi antaa eteenpäin, myös tekoälylle.', 'A factory that makes factories. Once a process is written down, you can hand it on, even to an AI.'),
    fun: x('Kolme committia ja 20 000 merkkiä README:tä. Tehtaan johto on selvästi palaverissa.', 'Three commits and 20,000 characters of README. Factory management is clearly in a meeting.') },
  'insurance-gap-review': {
    tech: x('Tiedostot pysyvät selaimen muistissa eivätkä lähde koneelta. PDF.js ladataan CDN:stä.', 'Files stay in browser memory and never leave the machine. PDF.js is loaded from a CDN.'),
    philo: x('Vakuutus on lupaus pahan päivän varalle. Aukkoanalyysi kysyy, mitä lupaus jättää sanomatta.', 'Insurance is a promise for a bad day. Gap analysis asks what the promise leaves unsaid.'),
    fun: x('Työkalu, joka lukee pienellä präntätyn tekstin. Sitä ei ole tehnyt kukaan ennen.', 'A tool that reads the small print. Nobody has done that before.') },
  'rag-demo': {
    tech: x('Mukana on TypeScriptiä ja Pythonia, ja README on kaksikielinen. Viimeisin commit on elokuulta 2025.', 'It uses TypeScript and Python, and the README is bilingual. The latest commit is from August 2025.'),
    philo: x('RAG erottaa muistin puheesta: malli puhuu, mutta tieto haetaan muualta. Vähän kuin ihminen, joka tarkistaa ennen kuin väittää.', 'RAG separates memory from speech: the model talks, but the knowledge is fetched from elsewhere. Rather like a person who checks before claiming.'),
    fun: x('Karkkikauppa, josta haetaan dokumentteja. Lapset pettyvät, insinöörit ilahtuvat.', 'A candy store where you retrieve documents. Children are disappointed, engineers delighted.') },
  mergemaster: {
    tech: x('TypeScript-peli, jonka ensimmäinen commit on maaliskuulta 2025, portfolion vanhimpia. README on laaja.', 'A TypeScript game whose first commit is from March 2025, one of the oldest in the portfolio. The README is extensive.'),
    philo: x('Tunnin projekti lapsen kanssa voi olla portfolion tärkein. Siinä opittiin jotain, mitä mikään testi ei mittaa.', 'An hour-long project with a child may be the most important in the portfolio. Something was learned that no test measures.'),
    fun: x('Peli valmis tunnissa. Useimmat sprintit kestävät kaksi viikkoa, eikä niissä ole 8-vuotiasta konsulttia.', 'A game done in an hour. Most sprints last two weeks, and they have no 8-year-old consultant.') },
  'aurora-security-dojo': {
    tech: x('Taustalla on Flask, ja README on laaja. Kaikki 13 committia ovat samalta päivältä.', 'It runs on Flask, and the README is extensive. All 13 commits are from the same day.'),
    philo: x('Hyökkäyksen ymmärtäminen on puolustuksen alku. Dojossa iskuja harjoitellaan, jotta niitä ei tarvitsisi käyttää.', 'Understanding attack is where defence begins. In a dojo you practise strikes so you never need them.'),
    fun: x('Nimessä on Aurora, ja nyt koko sivu on revontulten alla. Sattumaa vai hyvin suunniteltu hyökkäys?', 'Its name is Aurora, and now the whole page sits under the northern lights. Coincidence, or a well-planned attack?') },
  'tarot-game': {
    tech: x('GitHub ei tunnista repossa koodia, ja commiteja on kaksi.', 'GitHub detects no code in the repo, and there are two commits.'),
    philo: x('Tarot ei ennusta vaan kysyy. Hyvä kysymys voi olla arvokkaampi kuin vastaus.', 'Tarot does not predict, it asks. A good question can be worth more than an answer.'),
    fun: x('Kortit ennustivat, että koodi ilmestyy repoon. Ennuste on yhä voimassa.', 'The cards foretold that the code would appear in the repo. The prophecy still stands.') },
  healthconnectai: {
    tech: x('TypeScript-kokeilu toukokuulta 2025, ja commiteja on 15.', 'A TypeScript experiment from May 2025, with 15 commits.'),
    philo: x('Terveyskysymys on usein huoli kysymyksen muodossa. Vastaus tarvitsee lähteen mutta myös myötätuntoa.', 'A health question is often a worry in the shape of a question. The answer needs a source, but also compassion.'),
    fun: x('Kysy tekoälyltä, mikä sinua vaivaa. Älä kuitenkaan kysy, miksi README puuttuu.', 'Ask an AI what ails you. Just do not ask why the README is missing.') },
};
