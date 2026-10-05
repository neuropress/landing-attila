# Hogyan működik a szerveroldali konverziómérés? — egyszerűen

Ez a dokumentum bárkinek érthető, aki nem fejlesztő. Nincs benne kód.

---

## A probléma egy hasonlattal

Van egy üzletünk. Kint az utcán van egy plakátunk. Szeretnénk tudni, hogy a
plakát hoz-e vásárlót — mert csak akkor érdemes fizetni érte.

Ezért felvettünk egy **ajtónállót**, aki minden belépőnél feljegyzi: „ez az ember a
plakátról jött". Amikor az illető vásárol, az ajtónálló szól a marketingesnek.

Ez az ajtónálló a **Facebook pixel**: egy kis programocska, ami a weboldalon fut, a
látogató böngészőjében.

**A gond:** ez az ajtónálló egyre gyakrabban nem tud dolgozni.

- A látogató **reklámblokkolót** használ → az ajtónállót kiküldik az ajtóból
- A böngésző (Safari, Firefox) **magától letiltja** az ilyen figyelőket
- Vagy a látogató kikapcsol valamit, és az ajtónálló elveszti a jegyzeteit

Így a vásárlás megtörténik, a pénz bejön — de a marketinges soha nem tudja meg,
hogy a plakát hozta. A statisztikában úgy látszik, mintha a plakát nem működne.
Emiatt rossz döntések születnek: leállítunk egy jól működő hirdetést.

---

## A megoldás

Beépítettünk egy **második, független csatornát**.

Amikor valaki kitölti az űrlapot, a jelentkezés bekerül a **saját rendszerünkbe** (a
saját szerverünkre). Onnan a **szerverünk maga** küld egy üzenetet a Facebooknak:
„megtörtént egy jelentkezés".

Ez a **Conversions API** — magyarul: szerveroldali mérés.

A lényeg: **ez az üzenet nem a látogató böngészőjéből megy, hanem a mi
szerverünkről.** A reklámblokkoló a látogató gépén fut, tehát a mi szerverünkhez nem
ér el. Ezt az üzenetet nem tudja megállítani semmi.

| | Régi mód (csak pixel) | Új mód (pixel + szerver) |
|---|---|---|
| Honnan megy az üzenet | a látogató böngészőjéből | a böngészőből **és** a szerverünkről |
| Reklámblokkoló megállítja? | igen | a szerveresét nem |
| Safari/Firefox letiltja? | gyakran igen | a szerveresét nem |
| Elveszett konverziók | jellemzően 20–40% | jóval kevesebb |

---

## „Akkor most minden duplán lesz számolva?"

Nem. Ez a leggyakoribb kérdés, és jogos.

Minden jelentkezés kap egy **egyedi azonosítót** — mint egy rendszám. Például
`a7f3-9c21`. Ugyanez a rendszám kerül rá:

- a böngészőből küldött üzenetre, **és**
- a szerverről küldött üzenetre

A Facebook megkapja mindkettőt, látja, hogy azonos a rendszám, és összevonja őket
**egyetlen** konverzióvá. Ezt hívják dedupolásnak.

Ha csak az egyik érkezik meg (mert a böngészős elakadt), akkor is **egy** konverzió
lesz. Tehát a szám soha nem lesz felfújva, csak pontosabb.

---

## „Mi az, ami felmegy a Facebooknak?"

Csak annyi, amennyi az azonosításhoz kell, és a személyes adatok **titkosított
formában**:

| Adat | Hogyan megy fel |
|---|---|
| email cím | **átalakítva** — olvashatatlan karaktersor lesz belőle |
| telefonszám | **átalakítva** |
| keresztnév, vezetéknév | **átalakítva** |
| melyik szolgáltatás iránt érdeklődött | nyersen (ez nem személyes adat) |
| melyik hirdetésről jött, milyen böngészőt használ | nyersen (technikai azonosítók) |

Az „átalakítás" (a szakszó rá: *hashelés*) egy egyirányú művelet. Az
`anna@pelda.hu`-ból ez lesz:

```
b4f8c1e9a72d...
```

Ebből visszafelé nem lehet kiszámolni az email címet. A Facebook is csak arra
használja, hogy összehasonlítsa a saját, ugyanígy átalakított adataival — ha egyezik,
tudja, melyik hirdetés hozta a jelentkezőt.

**Ami soha nem megy fel:** az űrlapon beírt szöveges üzenet. Arra semmi szükség.

---

## „És a cookie-hozzájárulás?"

Ez a legfontosabb rész, és itt szigorúbbak vagyunk, mint amit sokan gondolnak.

Attól, hogy a szerverről küldjük az adatot, **nem szűnik meg a hozzájárulás
kötelezettsége**. A titkosított email is személyes adat. Ezért:

> **Ha a látogató a cookie-sávon nem fogadja el a marketing sütiket, akkor a
> Facebooknak SEMMI nem megy — sem a böngészőből, sem a szerverről.**

Ezt négy egymástól független ponton ellenőrzi a rendszer. Ha bármelyik azt látja,
hogy nincs hozzájárulás, ott megáll a folyamat. Négy zár egy ajtón.

**Amit viszont a hozzájárulás nem érint:** a jelentkezés maga.

- A lead **mindig** bekerül a rendszerünkbe
- Az értesítő email **mindig** kimegy a sales csapatnak
- A látogató **mindig** megkapja a visszaigazolást

Ezek azért működnek hozzájárulás nélkül is, mert ezeknek a jogalapja maga az űrlap
beküldése — a látogató épp azt kérte, hogy keressük meg. A cookie-hozzájárulás csak a
*hirdetési mérésre* vonatkozik.

Ha valaki elutasítja: a jelentkezését ugyanúgy feldolgozzuk, csak a Facebook nem
tudja meg, hogy a hirdetése hozta.

---

## „Mit veszek ebből észre a mindennapokban?"

Semmit — és ez a jó hír. A weboldal ugyanúgy működik, az űrlap ugyanúgy működik, a
látogató nem lát semmi újat.

Ami változik: a Facebook hirdetési felületén **több konverzió** fog látszani, mint
korábban. Nem azért, mert több jelentkezés jön, hanem mert eddig egy részük
láthatatlan volt.

Ennek két gyakorlati következménye:

1. **A riportok pontosabbak.** Jobban látszik, melyik hirdetés hozza a valódi
   érdeklődőket, és melyik csak a pénzt viszi.
2. **A Facebook algoritmusa okosabban dolgozik.** Több adatot kap arról, kik
   jelentkeznek valójában, és hasonló embereket keres. Ez általában olcsóbb
   jelentkezéseket eredményez.

---

## Egy mondatban

> A jelentkezést két úton, két példányban jelentjük a Facebooknak — a látogató
> böngészőjéből és a saját szerverünkről —, közös azonosítóval, hogy ne legyen duplán
> számolva, titkosított személyes adatokkal, és kizárólag akkor, ha a látogató
> elfogadta a marketing sütiket.
