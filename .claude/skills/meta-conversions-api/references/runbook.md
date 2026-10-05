# Runbook — Meta Conversions API bekötése egy új Next.js oldalra

Lépésről lépésre, fejlesztői szemmel. Feltételezi, hogy van egy cPanel-es hosting,
ahova PHP fájlt tudsz feltölteni, és hogy a Meta-kampányokat egy külsős fél kezeli.

A kódot a `assets/` mappából másold, a döntések magyarázata a `SKILL.md`-ben van.
Ez a dokumentum a **sorrendről**, a **szerepekről** és a **tesztelésről** szól.

---

## 0. Előfeltételek

| Kell | Miért |
|---|---|
| Next.js App Router projekt | a `MetaPixel` kliens komponens és a route handler ide kerül |
| Cookie consent banner (CookieScript, Cookiebot, …) | a pixel és a CAPI is hozzájárulás mögé kerül |
| cPanel-es hosting PHP 7.0+ és curl támogatással | ide megy a szerveroldali küldő |
| Egy űrlap, aminek a beküldése konverzió | ez lesz a `Lead` event |
| Meta pixel (dataset) ID + Conversions API token | a külsős féltől — lásd 1. és 2. pont |

Idő: a kódolás ~1 óra, a tesztelés ~1 óra. A szűk keresztmetszet szinte mindig a
token megszerzése és a CookieScript cookie-tábla beállítása.

---

## 1. Szerepek — ki mit ad

| Szerep | Ki | Mit tesz | Mikor |
|---|---|---|---|
| **Fejlesztő** (te) | | Next.js kód, PHP feltöltés cPanelbe, `.env`, manuális tesztelés | 3–8. lépés |
| **Meta kampánykezelő** (külsős) | | pixel ID + CAPI token kiadása, Test Event Code, Events Manager hozzáférés adása, pár nap múlva EMQ ellenőrzés | 2. és 9. lépés |
| **GTM / consent banner kezelő** | gyakran ugyanaz a külsős, vagy te | cookie-tábla és trigger beállítás, duplikált pixel tag eltávolítása | 5. lépés |
| **Ügyfél / üzleti döntéshozó** | | jóváhagyja, hogy hashelt email/telefon megy a Metának (adatvédelmi tájékoztató!) | a projekt elején |

**Amit neked mindenképp kérned kell magadnak:** hozzáférés az **Events Managerhez**
ahhoz a dataset-hez, amit használunk. Enélkül nem látod a **Test Events** fület,
tehát nem tudod ellenőrizni, hogy mind a két irányból (Browser + Server) beérkezett-e
az event — és pontosan ez a 7. pont lényege. Elég a legkisebb szintű hozzáférés
(Business Manager → Data Sources → a dataset → Assign People → *View / Analyst*).

Ha ezt nem kapod meg, a 7.6 lépéshez képernyőmegosztásos egyeztetés kell a
külsőssel — de akkor az egész tesztelés az ő idejétől függ. Kérd meg a hozzáférést.

---

## 2. Amit be kell kérni a kampánykezelőtől

Másold be neki ezt (magyarul vagy angolul), így nem lesz félreértés:

> Szükségem van a szerveroldali konverziómérés (Meta Conversions API) beállításához:
>
> 1. **Pixel / Dataset ID** — Events Manager → Data Sources → a pixel neve alatt
>    látszó számsor.
> 2. **Conversions API access token** — Events Manager → az adott dataset →
>    **Settings** → *Conversions API* → **Generate access token**. Ez egy hosszú,
>    `EAA…`-val kezdődő string. Küldd jelszókezelőn vagy más biztonságos csatornán,
>    ne chatben.
> 3. **Test Event Code** — Events Manager → a dataset → **Test Events** fül, a
>    tetején lévő `TEST…` kód. Ez csak a tesztelés idejére kell.
> 4. **Hozzáférés** ehhez a dataset-hez a saját Meta fiókomnak (View/Analyst szint
>    elég), hogy a Test Events fülön lássam a beérkező eventeket.
>
> Amit tudni érdemes: a `Lead` event a beküldött kapcsolatfelvételi űrlap. Ugyanaz a
> konverzió megy fel a böngészőből és a szerverről is, közös `event_id`-vel, tehát
> **dedupolódik** — nem lesz duplán számolva. Fontos: **ne legyen külön Meta Pixel
> tag a Google Tag Managerben**, mert az duplázna és nem tudna dedupolni.

A tokent **ne** írd kódba és ne kerüljön gitbe. Csak a `meta.config.php`-ba, a
szerverre.

---

## 3. Next.js oldal — fájlok

Az `assets/next/` tartalmát másold be, ebben a sorrendben:

1. **`src/lib/consent.js`** ← `assets/next/consent.js`
   Ez CookieScriptre van írva. **Más consent bannernél**: fogadd el egyszer a
   marketing kategóriát, nézd meg a cookie-t (DevTools → Application → Cookies), és
   csak a `hasMarketingConsent` függvényt írd át. A `SKILL.md` „Adapting to a
   different CMP" táblája segít.

2. **`src/components/MetaPixel.js`** ← `assets/next/MetaPixel.js`
   Ha nem CookieScript a banner, az `events` tömbben lévő event neveket is cseréld
   (Cookiebot: `CookiebotOnAccept`, `CookiebotOnLoad`).

3. **Root layout** (`src/app/layout.jsx`) — lásd `assets/next/layout-snippet.jsx`:
   ```jsx
   <MetaPixel pixelId={process.env.NEXT_PUBLIC_META_PIXEL_ID} />
   ```
   a `<head>`-be. Consent előtt `null`-t rendel, tehát nem kerül semmibe.

4. **Az űrlap komponens** — lásd `assets/next/form-snippet.js`. Három sor:
   `event_id` generálás, böngészős `fbq('track','Lead', …, { eventID })`, és az
   `event_id` + `event_source_url` bekerül a POST bodyba.

5. **A route handler** — lásd `assets/next/route-snippet.js`. Itt épül a `metaFields`
   objektum a request cookie-jaiból és headereiből, consent mögött.

6. **`.env`** (illetve a hosting env kezelője):
   ```
   NEXT_PUBLIC_META_PIXEL_ID=1234567890123456
   CAPI_ENDPOINT_URL=https://api.pelda.hu/capi-lead.php
   CAPI_SHARED_SECRET=<64 karakter random hex>
   ```
   A shared secret generálása:
   `php -r 'echo bin2hex(random_bytes(32)), PHP_EOL;'`
   vagy `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`

   ⚠️ A `NEXT_PUBLIC_*` build időben beépül a bundle-be. Ha változtatod, **deploy kell**,
   nem elég újraindítani.

---

## 4. cPanel oldal — PHP feltöltés

1. cPanel → **File Manager**.
2. Hozz létre egy mappát a public web rooton **kívül**, ha lehet — pl.
   `/home/<user>/api/general/`. Ide megy a `meta.php` és a `meta.config.php`.
   Ha ez nem opció, a public rootban is működik, de akkor a `meta.config.php`
   fájlengedélye **600** legyen, és a mappában legyen `.htaccess` `deny from all`
   a `.php`-n kívüli fájlokra.
3. Töltsd fel:
   - `assets/php/meta.php` → `api/general/meta.php`
   - `assets/php/capi-lead.php` → a **public** web rootba, pl.
     `public_html/capi-lead.php` (ennek kell URL, ez a `CAPI_ENDPOINT_URL`).
     A fájl első `require_once`-át igazítsd a valós útvonalra, pl.
     `require_once __DIR__ . '/../api/general/meta.php';`
4. `assets/php/meta.config.example.php` → nevezd át **`meta.config.php`**-ra, a
   `meta.php` mellé, és töltsd ki:
   ```php
   define('META_PIXEL_ID', '1234567890123456');
   define('META_CAPI_TOKEN', 'EAAG...');
   define('CAPI_SHARED_SECRET', '<ugyanaz, mint a Next .env-ben>');
   define('META_TEST_EVENT_CODE', 'TEST12345');   // csak most, teszteléshez
   define('META_PHONE_DEFAULT_PREFIX', '36');     // a fő piac országkódja
   ```
   Fájlengedély: **600**. Gitbe soha.
5. **Selftest** — cPanel → **Terminal** (ha engedélyezett):
   ```bash
   cd ~/api/general && php meta.php --selftest
   ```
   Elvárt: `meta.php selftest OK`.
   Nincs Terminal? cPanel → **Cron Jobs**: egyszeri futtatás
   `php /home/<user>/api/general/meta.php --selftest`, és a kimenet emailben jön.
   Vagy: a `--selftest` sorok nélkül is működik a rendszer, ez csak ellenőrzés.
6. Ha a hosting nem engedi a kimenő HTTPS hívást (ritka, de shared hostingon előfordul),
   a CAPI hívás timeoutol. Teszt:
   ```bash
   curl -s -o /dev/null -w '%{http_code}\n' https://graph.facebook.com/v21.0/
   ```
   Ha nem jön válasz, a hostinggal kell engedélyeztetni a `graph.facebook.com`-ot.

### Ellenőrizd, hogy az endpoint zár

```bash
# secret nélkül -> 401
curl -s -X POST https://api.pelda.hu/capi-lead.php -d '{}'

# GET -> 405
curl -s https://api.pelda.hu/capi-lead.php
```

Ha bármelyik 200-at ad, a shared secret nincs beállítva — állj meg és javítsd.

---

## 5. GTM / consent banner beállítások

Ezt gyakran a külsős fél kezeli, de rajtad múlik, hogy elmondod-e neki. A három
leggyakoribb hibaforrás:

1. **A `_fbc` és `_fbp` legyen benne a consent banner cookie-táblájában**, a
   **Targeting / Marketing** kategóriában. Ha nincs, a banner minden oldalbetöltésnél
   kitörli őket. Tünet: a cookie „felvillan, majd eltűnik" — és akkor a CAPI-nak sem
   megy fel az `fbc`, mert a route handler ugyanazt a cookie-t olvassa.
2. **A consent banner tag triggere** GTM-ben: *Consent Initialization – All Pages*.
   Későbbi triggerrel a banner a pixel után fut.
3. **NE legyen Meta Pixel tag a GTM-ben.** Az duplán küldene minden eventet, és a
   GTM-es `Lead` nem kapja meg az `event_id`-t, tehát nem dedupolódik. A pixelt a
   `MetaPixel.js` tölti, mert csak így tudjuk consent mögé zárni és az `event_id`-t
   összekötni.

---

## 6. Smoke test — 5 perc, még mielőtt bármit átadnál

Sorrendben, és **ne** menj tovább, ha valamelyik nem stimmel:

| # | Művelet | Elvárt |
|---|---|---|
| 1 | `php meta.php --selftest` | `meta.php selftest OK` |
| 2 | Inkognitó ablak, oldal betöltés, **nem fogadsz el semmit** | DevTools → Network: nincs `connect.facebook.net` kérés. Elements: nincs `#meta-pixel`. Application → Cookies: nincs `_fbp`, nincs `_fbc`. |
| 3 | Consent banner → **Elfogadom mindet** | `fbevents.js` betöltődik oldal-újratöltés nélkül, `_fbp` cookie megjelenik |
| 4 | `curl` a `capi-lead.php`-ra secret nélkül | `401` |

Ha a 2. lépés bukik (consent előtt is betölt a pixel), akkor vagy a
`hasMarketingConsent` olvas rosszul, vagy van egy másik pixel forrás (GTM!).

---

## 7. Teljes manuális teszt — inkognitó és adblocker

Ez a lényegi rész. Két böngésző-profil kell:

- **A profil**: sima inkognitó, semmilyen kiegészítő
- **B profil**: inkognitó, bekapcsolt uBlock Origin / AdBlock (Chromeban az inkognitó
  módban külön engedélyezni kell a kiegészítőt: `chrome://extensions` → a kiegészítő →
  *Allow in Incognito*)

Előfeltétel: a `META_TEST_EVENT_CODE` be van állítva a `meta.config.php`-ban, és nyitva
van az Events Manager → a dataset → **Test Events** fül.

### 7.1 Consent nélküli állapot (A profil)

1. Nyisd meg az oldalt inkognitóban. **Ne** fogadj el semmit.
2. DevTools → **Network**, szűrő: `facebook`. → **nincs találat**.
3. DevTools → **Elements**, `Ctrl+F`: `meta-pixel`. → **nincs találat**.
4. DevTools → **Application → Cookies**. → nincs `_fbp`, nincs `_fbc`.

✅ Ez a bizonyíték, hogy a pixel valóban consent mögött van.

### 7.2 Elfogadás (A profil, ugyanaz az ablak)

5. Consent banner → **Elfogadom**.
6. Network: `fbevents.js` betöltődik, és kimegy egy `/tr?…ev=PageView` kérés.
   **Oldal-újratöltés nélkül** — ez a `MetaPixel.js` event listenere.
7. Cookies: `_fbp` megjelent (`fb.1.<timestamp>.<szám>`).

### 7.3 Click id (A profil)

8. Töltsd be: `https://azoldal.hu/?fbclid=TEST456`
9. Fogadd el a bannert (ha újra kéri).
10. Cookies → `_fbc` = `fb.1.<timestamp>.TEST456`
11. Nyomj **F5**-öt, majd navigálj át egy másik oldalra. → az `_fbc` **megmarad**.
    (90 napos cookie; Safariban JS-ből írva 7 nap — ez normális.)

Ha az `_fbc` egy oldalbetöltés után eltűnik: a consent banner törli. → 5. pont, 1. hiba.

### 7.4 Űrlap beküldés (A profil)

12. Töltsd ki és küldd be az űrlapot.
13. Network, szűrő `tr?`: kimegy egy `…/tr?…&ev=Lead&eid=<uuid>` kérés.
    **Jegyezd fel az `eid` értéket.**
14. Network → a `/api/emails` (vagy a te route-od) kérés → **Payload** fül:
    ott van az `event_id`, ugyanaz az uuid, és az `event_source_url`.

A teljes CAPI payload (fbc, fbp, IP, UA) **nem látszik a böngészőben** — az a Next
szerveren kerül a kérésbe. Ez szándékos, nem hiba.

### 7.5 Adblockeres kör (B profil)

15. Ugyanaz, mint 7.1–7.4, de bekapcsolt adblockerrel, és `?fbclid=TEST789`-nel.
16. Elvárt:
    - `_fbp` **nincs** → a pixel nem tudott lefutni. **Ez így helyes**, és nem
      javítható. Pont ezért van a szerveroldali küldés.
    - `_fbc` **van** → ezt a mi kódunk írja, az adblocker nem látja.
    - Nincs `/tr?…ev=Lead` kérés → nincs böngészős event.
    - A `/api/emails` kérés **kimegy** és az `event_id` benne van.
    - Az űrlap **működik**, jön a visszajelzés / köszönőoldal.

✅ Ez a legfontosabb teszt: adblockerrel a konverzió *csak* a szerveren keresztül jut
el a Metához. Ha itt nincs Server event, a rendszer nem ér semmit.

### 7.6 Events Manager — a két irány összevetése

17. Events Manager → a dataset → **Test Events**.
18. Elvárt: **két** `Lead` sor a 7.4-es beküldésből:
    - egy **Browser** forrású
    - egy **Server** forrású
    - **ugyanazzal az `event_id`-vel** (kattints a sorra, a részleteknél látszik) —
      ez jelenti, hogy dedupolódik, tehát nem lesz duplán számolva
19. A 7.5-ös (adblockeres) beküldésből **egy** sor: csak **Server**.

| Amit látsz | Mit jelent |
|---|---|
| Browser + Server, közös `event_id` | ✅ minden működik |
| csak **Browser** | a PHP oldal hibázott → `error_log`-ban `Meta CAPI Lead failed (HTTP …)` vagy `CAPI endpoint: rejected` (rossz shared secret) |
| csak **Server** | a pixel nem futott: nincs consent, vagy adblocker. Adblockeres körben ez a helyes. |
| Browser + Server, **eltérő** `event_id` | nem dedupol → az `eventID` nem ér ki a `fbq` hívásból, vagy a body-ban más id van. Nézd meg a 7.4/13-14-et. |
| **négy** sor egy beküldésre | van egy második pixel tag a GTM-ben → 5. pont, 3. hiba |
| **nincs** egy sor sem | rossz Test Event Code, vagy nem a jó dataset-et nézed |

A Test Events fül pár másodperces késleltetéssel frissül. Ha semmi nem jön, várj
30 másodpercet és tölts újra, mielőtt hibát keresnél.

### 7.7 Negatív teszt — ez a compliance bizonyíték

20. Új inkognitó ablak. Consent banner → **Elutasítom** (vagy csak a szükségeseket).
21. Küldd be az űrlapot.
22. Elvárt:
    - az űrlap **működik**, a lead megjön (email + adatbázis)
    - `_fbp`, `_fbc` **nincs**
    - Test Events: **egy** sor sincs, sem Browser, sem Server

Ez a lépés bizonyítja, hogy elutasítás esetén semmilyen adat nem megy a Metának.
Ezt írásban is érdemes dokumentálni az ügyfélnek.

### 7.8 Hibatűrés teszt

23. Írj át egy karaktert a `META_CAPI_TOKEN`-ben a `meta.config.php`-ban.
24. Küldj be egy űrlapot (elfogadott consenttel).
25. Elvárt: az űrlap **továbbra is 200-at ad**, a lead megjön, a köszönőoldal
    megjelenik. A hiba csak a szerver `error_log`-jában van:
    `Meta CAPI Lead failed (HTTP 190)` vagy hasonló.
26. Javítsd vissza a tokent.

Ha az űrlap elhasal a rossz tokentől, valahol elmarad a hibakezelés — a tracking soha
nem veheti el a leadet.

---

## 8. Élesítés / lezárás

1. **Vedd ki a `META_TEST_EVENT_CODE`-ot** a `meta.config.php`-ból (kommentezd ki).
   A test kóddal küldött eventeket a Meta **nem használja** hirdetés-optimalizációra.
2. Ellenőrizd éles forgalommal: Events Manager → **Overview** → a `Lead` eventnél
   látszania kell a *Server* forrásnak is.
3. **Adatvédelmi tájékoztató**: szerepelnie kell benne, hogy a beküldött adatokból
   hashelt (SHA256) email/telefon kerül a Meta felé, marketing hozzájárulás esetén.
   Ez üzleti/jogi feladat, de a fejlesztő dolga szólni róla.
4. Írd fel a naptárba **+3 nap**: Events Manager → Data Sources → `Lead` →
   **Event Match Quality**. 6 felett jó. Ha 4 alatt van, a `fn`/`ln`/telefon
   normalizálás a gyanús — vesd össze a `meta_normalize_phone` országkódját a valós
   forgalommal.
5. Add át a kampánykezelőnek: „a `Lead` event mostantól Browser + Server forrásból is
   jön, közös `event_id`-vel dedupolva, marketing consent mögött. A GTM-be ne
   kerüljön Meta Pixel tag."
6. Add át az ügyfélnek: `how-it-works-simple.md`.

---

## 9. Hibakeresés

| Tünet | Hol nézd | Ok |
|---|---|---|
| `_fbc`/`_fbp` felvillan, majd eltűnik | consent banner cookie-tábla | nincs bejegyezve a Targeting kategóriába |
| egy beküldés = két konverzió | GTM tag lista | van egy második Meta Pixel tag |
| csak Browser event | szerver `error_log` | `Meta CAPI … failed (HTTP …)` → rossz token vagy pixel ID; `rejected request` → rossz shared secret |
| csak Server event | consent állapot, adblocker | gyakran helyes viselkedés |
| `event_id` nem egyezik | Network payload | az `eventID` (nagy D!) nem ment ki a `fbq` hívásban |
| CAPI HTTP 400 `Invalid parameter` | `error_log` body | hashelés nélküli `em`/`ph`, vagy `+` a telefonszám előtt |
| CAPI HTTP 190 | `error_log` | lejárt / rossz access token → új tokent kell kérni |
| pixel ID-t átírtam, nem változott | build | `NEXT_PUBLIC_*` build-time inline → deploy kell |
| minden jó, de az attribúció rossz | Test Events részletek | nincs `fbc` (a belépő URL-ben nem volt `fbclid`), vagy a Next szerver IP-je megy a látogató helyett (`x-forwarded-for`) |
| a telefon soha nem matchel | `meta_normalize_phone` | rossz `META_PHONE_DEFAULT_PREFIX`, vagy más ország formátuma |
| CAPI hívás timeoutol | hosting | kimenő HTTPS tiltva → `curl https://graph.facebook.com/v21.0/` teszt |

---

## 10. B variant — ha már van PHP API-d

Ha a projektben már van egy PHP endpoint, ami eltárolja a leadet (mint pl. a Prisma
`contact/create.php`), akkor **ne** használd a `capi-lead.php`-t. Helyette:

1. `meta.php` + `meta.config.php` a meglévő PHP fájl mellé.
2. A Next route handler a `metaFields`-et a **meglévő** kérés bodyjába teszi:
   ```js
   body: JSON.stringify({ name, email, phone, message, services, ...(meta && { meta }) })
   ```
3. A PHP fájlban, **a DB commit után**:
   ```php
   require_once __DIR__ . '/../general/meta.php';

   // ... INSERT, $writeDB->commit(); ...

   try {
       if (!empty($contact->meta->consent)) {          // consent kapu #4
           $nameParts = preg_split('/\s+/', trim($name), 2);
           meta_send_event(
               'Lead',
               [
                   'em'          => meta_hash($email),
                   'ph'          => meta_hash(meta_normalize_phone($phone)),
                   'fn'          => meta_hash(isset($nameParts[0]) ? $nameParts[0] : ''),
                   'ln'          => meta_hash(isset($nameParts[1]) ? $nameParts[1] : ''),
                   'external_id' => meta_hash($email),
               ],
               ['content_category' => $services],
               $contact->meta
           );
       }
   } catch (Throwable $ex) {
       error_log("Meta CAPI Error: " . $ex, 0);
   }
   ```
4. A `CAPI_SHARED_SECRET` ilyenkor nem kell — a meglévő endpoint saját auth-ja véd.

**Commit után, try-catch-ben, és a válasz előtt** — ebben a sorrendben. Ha a CAPI
hívás elhal, a lead már mentve van, és a kliens 200-at kap.

---

## 11. Tudatos egyszerűsítések (amit *nem* csinál a rendszer)

Ezeket szándékosan nem építettük meg. Ha valamelyikre később szükség lesz, itt a
belépési pont:

- **Nincs DB séma-változás.** Az `fbc`/`fbp`/`event_id` nincs eltárolva, tehát egy
  sikertelen CAPI hívás nem újrajátszható — csak `error_log` marad. Ha kell retry
  vagy riportolható consent-veszteség: egy `capi_sent` kolumna elég hozzá.
- **A telefon-normalizálás hossz-heurisztika**, RO/HU számokra kalibrálva. Más
  országhoz vagy a formból küldj E.164-et, vagy tegyél trunk-prefix táblát a
  `meta_normalize_phone`-ba.
- **Nincs szintetikus `_fbp`.** Blokkolt pixelnél generálhatnánk egyet, de a Meta soha
  nem látta, tehát nem tud vele párosítani — nem javítja az attribúciót, csak zaj.
- **Nincs rate limiting a `capi-lead.php`-n.** A shared secret a kapu, az endpoint
  nem tárol semmit, és az `event_id` miatt a Meta oldalán idempotens. Token bucket
  csak akkor kell, ha a secret kiszivárog.
- **Csak egy event van bekötve (`Lead`).** Több konverzió (`Purchase`,
  `CompleteRegistration`, `Subscribe`) ugyanezt a `meta_send_event`-et hívja, a
  `capi-lead.php` már engedélyezi is őket — de az űrlap/checkout oldali `event_id`
  generálást minden helyen meg kell ismételni.
