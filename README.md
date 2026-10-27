# ETF Landing Page

**Stav projektu:** Návrh a počáteční vývoj  
**Termín odevzdání:** 30. 10. 2026

## Cíl projektu

Cílem je vytvořit mobilní-first landing page pro českého drobného investora, který přichází z reklamy a během několika sekund se musí rozhodnout, jestli má smysl na stránce zůstat.

Stránka nabídne srozumitelné srovnání vybraných ETF obchodovaných na NYSE a jejich evropských alternativ. Hlavním cílem je získat kontakt návštěvníka výměnou za konkrétní a užitečný srovnávací přehled.

Nejde pouze o hezký design. Důležitá je celá cesta návštěvníka, důvěryhodnost dat, funkční získávání kontaktů a měření jednotlivých kroků konverzního procesu.

## Cílová skupina

Primární cílovou skupinou jsou čeští drobní investoři, kteří se zajímají o americký akciový trh a ETF nebo hledají způsob, jak dlouhodobě pracovat se svými úsporami. Nechtějí sami zdlouhavě procházet velké množství fondů a jejich dokumentace.

Předpokládané potřeby:

- Rychle pochopit rozdíly mezi vybranými fondy.
- Porovnat nákladovost a investiční zaměření.
- Zjistit, zda existuje evropská alternativa ke konkrétnímu americkému ETF.
- Dostat užitečný přehled bez nutnosti pročítat dlouhý odborný článek.

Jde o výchozí předpoklady, které zatím nejsou ověřené výzkumem cílové skupiny.

## Nabízená hodnota

Pracovním konceptem je interaktivní srovnání vybraných ETF obchodovaných na NYSE a jejich relevantních evropských alternativ.

Návštěvník si může prohlédnout ukázku dat a pracovat se srovnáním přímo na stránce. Po zadání e-mailu a úspěšném uložení kontaktu se mu zpřístupní kompletní výsledky včetně zdrojů, nákladovosti a vysvětlení důležitých rozdílů. Formulář bude obsahovat pouze e-mailovou adresu, která je pro tento účel dostačující.

Hlavní hodnotou není stažitelný dokument, ale možnost rychle se zorientovat v konkrétních fondech bez nutnosti samostatně procházet jejich dokumentaci.

Přesný seznam fondů a obsah srovnání budou dokončeny po ověření dat.

## Návrh uživatelské cesty

1. **Příchod z reklamy:** První obrazovka odpovídá příslibu reklamy a okamžitě vysvětluje, co návštěvník získá.
2. **Ukázka srovnání:** Návštěvník uvidí skutečná data a pochopí hodnotu kompletního přehledu.
3. **Výzva k akci:** Stránka nabídne odemknutí kompletního srovnání.
4. **Získání kontaktu:** Návštěvník zadá pouze e-mail.
5. **Dokončení:** Po úspěšném uložení kontaktu se přímo na stránce odemknou kompletní výsledky včetně detailů a zdrojů.

Pořadí sekcí vychází z toho, že návštěvník přichází z mobilní reklamy a nemá důvod věnovat stránce mnoho času, dokud nevidí její hodnotu.

## Data a jejich ověřování

Do hlavního srovnání budou zařazeny pouze ETF skutečně obchodované na **NYSE**. ETF obchodované na NYSE Arca, Nasdaq nebo jiných amerických burzách nebudou do hlavního výběru zahrnuty.

U každého fondu bude ověřeno:

- Název a ticker.
- Burza, na které se obchoduje.
- Sledovaný index nebo investiční strategie.
- Roční nákladovost fondu (TER, případně odpovídající údaj uváděný emitentem).
- Typ fondu a další údaje důležité pro srovnání.

U každého údaje bude evidován zdroj, datum ověření a případně datum, ke kterému se údaj vztahuje. Vycházet budu především z oficiálních stránek emitentů, dokumentace fondů a zdrojů burzy.

Evropské UCITS fondy budou sloužit pouze jako alternativy ke srovnávaným americkým ETF. U každé dvojice bude rozlišeno, zda oba fondy sledují stejný index, nebo mají pouze podobnou investiční strategii.

U evropských alternativ bude samostatně uvedena jejich burza. Nebudu tvrdit, že jsou dva fondy totožné, pokud se liší jejich index, strategie nebo jiné důležité vlastnosti.

Dostupnost konkrétního fondu pro českého retailového investora se může lišit podle brokera a podmínek produktu. Nebudu ji proto automaticky předpokládat.

Konkrétní fondy a jejich údaje budou doplněny po ověření zdrojů.

## Měření konverzního procesu

Cílem je měřit celou cestu návštěvníka od příchodu na stránku až po odemknutí kompletního srovnání.

Plánované události:

- `landing_view` – zobrazení landing page.
- `comparison_interaction` – interakce se srovnávací tabulkou nebo jejími prvky.
- `lead_form_start` – zahájení vyplňování formuláře.
- `lead_submit_success` – úspěšné uložení kontaktu.
- `comparison_unlocked` – odemknutí a zobrazení kompletního srovnání.

Pomocí UTM parametrů bude možné rozlišit návštěvy z jednotlivých variant reklamy.

Událost úspěšného odeslání bude zaznamenána pouze po potvrzení, že se kontakt skutečně uložil. Samotné kliknutí na tlačítko nebude považováno za úspěšnou konverzi.

Do analytických událostí nebudu posílat samotné e-mailové adresy.

Funkčnost měření bude ověřena při testování aplikace.

## Očekávaná konverze

Pracovní hypotéza konverzního poměru je **3 %**.

Konverzní poměr počítám jako počet unikátních návštěv, při kterých došlo k úspěšnému uložení kontaktu, dělený počtem unikátních návštěv landing page.

Jde o výchozí odhad, nikoliv o ověřený benchmark nebo skutečně naměřený výsledek. Bez reálné reklamní návštěvnosti nebude možné tuto hypotézu potvrdit.

## Hypotézy pro A/B testování

Hypotézy jsou seřazeny podle předpokládaného dopadu na získávání kontaktů.

### 1. Sdělení první obrazovky

**Hypotéza:** První obrazovka, která přesně odpovídá příslibu reklamy, povede k vyššímu počtu relevantních návštěvníků pokračujících ke srovnání a následně k vyššímu počtu získaných kontaktů.

**Proč očekávám tento dopad:** Návštěvník během prvních sekund rozhoduje, jestli stránka odpovídá tomu, co hledal v reklamě. Pokud sdělení nenavazuje, může odejít ještě před zobrazením nabídky.

**Metriky:** Podíl návštěvníků, kteří pokračují ke srovnání, a podíl návštěv končících úspěšným získáním kontaktu.

### 2. Ukázka dat před formulářem

**Hypotéza:** Zobrazení části skutečného srovnání před žádostí o e-mail zvýší důvěru a podíl úspěšně získaných kontaktů.

**Proč očekávám tento dopad:** Návštěvník uvidí konkrétní hodnotu předtím, než má poskytnout své údaje.

**Metrika:** Podíl návštěv končících úspěšným odesláním formuláře.

### 3. Text a umístění výzvy k akci

**Hypotéza:** Konkrétní nabídka kompletního přehledu a jasně označené tlačítko budou účinnější než obecná výzva k registraci.

**Proč očekávám tento dopad:** Návštěvník bude lépe chápat, co získá a jaký bude další krok.

**Metrika:** Poměr úspěšně odeslaných formulářů k unikátním návštěvám landing page.

Jde o předpoklady pro budoucí testování. Zatím nejsou experimentálně ověřené.

## Varianty reklam a návaznost landing page

Cílem je otestovat dva různé důvody, proč by český drobný investor mohl chtít získat srovnávací přehled. První varianta se zaměřuje na nákladovost fondů, druhá na hledání evropských alternativ.

### Varianta A – Porovnání nákladovosti

**Titulek reklamy:**

Kolik stojí ETF, které sledujete?

**Text reklamy:**

Porovnejte vybraná ETF obchodovaná na NYSE a zjistěte, jak se liší jejich nákladovost, investiční zaměření a další důležité vlastnosti.

Získejte přehledné srovnání s odkazy na zdroje zdarma.

**CTA:** Zobrazit srovnání

**Odpovídající první obrazovka landing page:**

- **Hlavní nadpis:** „Porovnejte nákladovost vybraných ETF obchodovaných na NYSE.“
- **Podnadpis:** „Srozumitelný přehled nákladovosti, sledovaných indexů a důležitých rozdílů. U údajů najdete také zdroje a datum ověření.“
- **Vizuální prvek:** Ukázka srovnávací tabulky s reálně ověřenými údaji.
- **Primární CTA:** „Prohlédnout srovnání zdarma“

### Varianta B – Evropské alternativy

**Titulek reklamy:**

Hledáte evropskou alternativu k americkému ETF?

**Text reklamy:**

Porovnejte vybraná ETF obchodovaná na NYSE s evropskými UCITS fondy, které sledují stejný index nebo mají podobnou investiční strategii.

Zjistěte, v čem se fondy liší, a získejte přehledné srovnání s uvedenými zdroji zdarma.

**CTA:** Prozkoumat alternativy

**Odpovídající první obrazovka landing page:**

- **Hlavní nadpis:** „Hledáte evropskou alternativu k americkému ETF?“
- **Podnadpis:** „Porovnejte investiční zaměření, nákladovost a důležité rozdíly mezi vybranými americkými ETF a evropskými UCITS fondy.“
- **Vizuální prvek:** Ukázka dvojice fondů s jasně uvedeným sledovaným indexem, nákladovostí a případnými rozdíly.
- **Primární CTA:** „Prohlédnout dostupné alternativy“

Reklama ani landing page nebudou slibovat, že konkrétní fond lze koupit u každého brokera. Dostupnost bude nutné ověřit pro konkrétní instrument a podmínky poskytovatele.

### Propojení reklamy a stránky

Obě varianty budou vést na stejnou landing page. Podle UTM parametrů se ale přizpůsobí hlavní sdělení první obrazovky tak, aby odpovídalo příslibu reklamy.

Pro rozlišení variant lze použít například:

- `utm_content=fees`
- `utm_content=alternatives`

Zbytek stránky, srovnávací data a formulář mohou zůstat společné.

### Jak vyhodnotit obě varianty

Samotná proklikovost reklamy nestačí. Je potřeba sledovat také to, kolik návštěvníků pokračuje ke srovnání, začne vyplňovat formulář a úspěšně odešle kontakt.

Teprve na základě těchto údajů bude možné vyhodnotit, která varianta přivádí relevantnější návštěvníky a lépe plní obchodní cíl.

## Práce s AI

Při vývoji používám Google Antigravity IDE jako nástroj pro práci s AI agentem.

Během práce budu zaznamenávat důležité pokyny, podstatné výstupy, vlastní rozhodnutí, kontrolu vygenerovaného řešení a případné chyby a jejich opravy.

V dokumentaci popíšu také to, proč jsem některé návrhy AI přijal, změnil nebo odmítl a jak jsem ověřoval, že výsledné řešení skutečně funguje.

Záznamy komunikace a další podklady budou uchovány ve složce `ai-log/`. Způsob archivace bude odpovídat skutečným možnostem použitého nástroje.

## Testování a nasazení

Plánovaným hostingem je Vercel v rámci bezplatného plánu.

Před odevzdáním bude ověřeno zejména:

- Správné zobrazení na mobilních zařízeních.
- Správnost finančních údajů vůči evidovaným zdrojům.
- Funkčnost formuláře a skutečné uložení kontaktu.
- Správné zaznamenávání analytických událostí.
- Validace formuláře a chybové stavy.
- Funkčnost odemknutí kompletního srovnání po odeslání kontaktu.
- Funkčnost veřejně dostupné nasazené aplikace.

Výsledky testů, použitý technologický stack, URL nasazené aplikace a známá omezení doplním podle skutečného stavu řešení.