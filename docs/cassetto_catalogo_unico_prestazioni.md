### 📌 STATO ATTUALE VIGENTE (Verità Attive Ottobre 2026)
• **[catalogo.visibilita.riservata_backend]** 🟢 [GIÀ ATTIVO] **Nomenclatore & Listino Prezzi Riservato Esclusivamente al Backend/CRM**: I prezzi delle singole prestazioni, le tariffe orarie e la scomposizione economica non devono MAI comparire sul sito web pubblico (in piena conformità con il Brand Vault e la legge sulla pubblicità sanitaria). I costi sono visibili e operativi unicamente nel gestionale per Segreteria, Medici e Direzione.
• **[catalogo.architettura.dinamica]** 🔨 [IN CANTIERE] **Catalogo Dinamico Modificabile da Segreteria & Sync File**: La segreteria e la direzione possono aggiornare in tempo reale i prezzi delle singole prestazioni, i prezzi dei pacchetti/percorsi e aggiungere nuove prestazioni direttamente dal pannello reception/admin. Ogni nuovo nomenclatore fornito dalla clinica (CSV/Excel) aggiorna sia la memoria centrale Hub sia la tabella `public.medical_services` del CRM.
• **[catalogo.architettura.matrice_associativa]** 🔨 [IN CANTIERE] **Matrice Relazionale a 4 Vertici (Medico ↔ Prestazione ↔ Stanza ↔ Slot Orario)**: 
  1) **Medico ↔ Prestazioni (`doctor_services`)**: Uno specialista è abilitato solo alle prestazioni di sua competenza, con facoltà di tariffa personalizzata (override tariffa base).
  2) **Prestazione ↔ Stanza (`clinic_rooms`)**: Ogni prestazione ha una o più stanze idonee in base alle attrezzature (es. Studio 1 con riunito odontoiatrico, Studio 2 chirurgia/senologia, Studio 3 laser/medicina estetica, Studio 4 ecografo multifunzione, Sala OPT per ortopantomografia e CBCT).
  3) **Medico ↔ Stanza ↔ Disponibilità (`doctor_availability`)**: L'agenda prenotazioni associa il medico alla stanza in fasce orarie e giorni precisi, impedendo conflitti sia di operatore che di ambulatorio.
  4) **Prenotazione (`appointments`)**: Vincolata alla terna Medico + Prestazione abilitata + Stanza disponibile.

---

### 📋 CATALOGO UNICO DELLE PRESTAZIONI (Ottobre 2026)

Fonte: Catalogo Unico Nomenclatore e Tariffe Ufficiali (consegna Ottobre 2026).
Totale prestazioni codificate: **78 voci**.

| Codice | Branca / Specialità | Prestazione | Prezzo (€) | Modalità Prezzo | Regime Fiscale | Sala Assegnata | Online | Note Cliniche & Operative |
|---|---|---|---|---|---|---|---|---|
| **COC-001** | Cardiologia | Ecocardiogramma color Doppler transtoracico | — | DA_DEFINIRE | ESENTE IVA art. 10 | Studio 4 | NO | Nuova voce da approvare |
| **COC-002** | Cardiologia | Elettrocardiogramma (ECG) a 12 derivazioni | — | DA_DEFINIRE | ESENTE IVA art. 10 | Studio 4 | NO | Nuova voce da approvare |
| **COC-003** | Cardiologia | Visita cardiologica con ECG ed ecocardiogramma color Doppler | 180,00 | DA_DEFINIRE | ESENTE IVA art. 10 | Studio 4 | NO | Nuova voce da approvare |
| **COC-004** | Cardiologia | Visita cardiologica con elettrocardiogramma (ECG) a 12 derivazioni | 120,00 | DA_DEFINIRE | ESENTE IVA art. 10 | Studio 4 | NO | Nuova voce da approvare |
| **COC-005** | Chirurgia ambulatoriale | Medicazioni | 80,00 | FISSO | ESENTE IVA art. 10 | Studio 2 | SI | Originale riga 112 |
| **COC-006** | Chirurgia ambulatoriale | Piccola chirurgia ambulatoriale | — | PREVENTIVO_POST_VISITA | ESENTE IVA art. 10 | Studio 2 | NO | Distinguere tipo lesione e istologico |
| **COC-007** | Chirurgia ambulatoriale | Rimozione punti | 60,00 | FISSO | ESENTE IVA art. 10 | Studio 2 | SI | Originale riga 113 |
| **COC-008** | Chirurgia ambulatoriale | Escissione chirurgica nevo con istopatologico | 350,00 | DA_DEFINIRE | ESENTE IVA art. 10 | Studio 2 | NO | Prezzo con istologico post verifica lab |
| **COC-009** | Chirurgia ambulatoriale | Visita specialistica di chirurgia ambulatoriale | 150,00 | DA_DEFINIRE | ESENTE IVA art. 10 | Studio 2 | NO | Nuova voce da approvare |
| **COC-010** | Chirurgia dermatologica | Asportazione cisti cutanea/sottocutanea con istologico | 450,00 | DA_DEFINIRE | ESENTE IVA art. 10 | Studio 2 | NO | Una sola voce tariffaria |
| **COC-011** | Chirurgia plastica | Asportazione piccole neoformazioni cutanee corpo | — | PREVENTIVO_POST_VISITA | ESENTE IVA art. 10 | Studio 3 | NO | Area sovrapposta, preventivo post visita |
| **COC-012** | Chirurgia plastica | Asportazione piccole neoformazioni cutanee volto | — | PREVENTIVO_POST_VISITA | ESENTE IVA art. 10 | Studio 3 | NO | Preventivo post visita |
| **COC-013** | Chirurgia plastica | Asportazioni piccoli tumori cutanei | — | PREVENTIVO_POST_VISITA | ESENTE IVA art. 10 | Studio 3 | NO | Preventivo post visita |
| **COC-014** | Chirurgia plastica | Blefaroplastica superiore | — | PREVENTIVO_POST_VISITA | ESENTE IVA art. 10 | Studio 3 | NO | Preventivo post visita |
| **COC-016** | Chirurgia plastica | Fenolizzazione matrice ungueale per unghia incarnita | — | PREVENTIVO_POST_VISITA | ESENTE IVA art. 10 | Studio 3 | NO | Preventivo post visita |
| **COC-018** | Dermatologia | Dermatoscopia / epiluminescenza | 150,00 | FISSO | ESENTE IVA art. 10 | Studio 2 | SI | Distinguere da mappatura |
| **COC-019** | Dermatologia | Mappatura nei | 250,00 | FISSO | ESENTE IVA art. 10 | Studio 2 | SI | Distinguere da controllo singolo |
| **COC-020** | Dermatologia | Piccola chirurgia dermatologica ambulatoriale | 450,00 | PREVENTIVO_POST_VISITA | ESENTE IVA art. 10 | Studio 2 | NO | Preventivo post visita |
| **COC-021** | Dermatologia | Visita dermatologica | 150,00 | FISSO | ESENTE IVA art. 10 | Studio 2 | SI | Originale riga 95 |
| **COC-022** | Dermatologia | Escissione chirurgica nevo con istopatologico | 350,00 | FISSO | ESENTE IVA art. 10 | Studio 2 | NO | Istologico incluso post verifica lab |
| **COC-023** | Ginecologia | Esame citologico urinario | — | DA_DEFINIRE | ESENTE IVA art. 10 | Studio 2 | NO | Valutare competenza urologica/lab |
| **COC-024** | Ginecologia | Pap test - esame citologico cervico-vaginale | — | DA_DEFINIRE | ESENTE IVA art. 10 | Studio 2 | NO | Specificare se fase liquida |
| **COC-025** | Ginecologia | Test HPV-DNA ad alto rischio oncogeno | — | DA_DEFINIRE | ESENTE IVA art. 10 | Studio 2 | NO | Definire metodica ed eventuale co-testing |
| **COC-026** | Ginecologia | Visita specialistica ginecologica | 180,00 | DA_DEFINIRE | ESENTE IVA art. 10 | Studio 2 | NO | Nuova voce da approvare |
| **COC-027** | Laboratorio e check-up | Check-up Avanzato Donna | — | DA_DEFINIRE | ESENTE IVA art. 10 | Studio 4 | NO | Componente laboratorio da confermare |
| **COC-028** | Laboratorio e check-up | Check-up Avanzato Uomo | — | DA_DEFINIRE | ESENTE IVA art. 10 | Studio 4 | NO | Componente laboratorio da confermare |
| **COC-029** | Laboratorio e check-up | Check-up Completo Donna | — | DA_DEFINIRE | ESENTE IVA art. 10 | Studio 4 | NO | Verificare se venduto singolo o in Club |
| **COC-030** | Laboratorio e check-up | Check-up Completo Uomo | — | DA_DEFINIRE | ESENTE IVA art. 10 | Studio 4 | NO | Verificare se venduto singolo o in Club |
| **COC-031** | Laboratorio e check-up | Check-up Salute (17 voci) | — | DA_DEFINIRE | ESENTE IVA art. 10 | Studio 4 | NO | Pannello 17 voci |
| **COC-032** | Laboratorio e check-up | Prelievo ematico in sede | — | DA_DEFINIRE | ESENTE IVA art. 10 | Studio 4 | NO | Prelievo in sede |
| **COC-033** | Medicina estetica | Bioristrutturazione corpo | — | PREVENTIVO_POST_VISITA | IVA 22% / Esente se ter. | Studio 3 | NO | Preventivo post visita |
| **COC-034** | Medicina estetica | Bioristrutturazione volto | — | PREVENTIVO_POST_VISITA | IVA 22% / Esente se ter. | Studio 3 | NO | Preventivo post visita |
| **COC-035** | Medicina estetica | Biorivitalizzazione | 120,00 | FISSO | IVA 22% / Esente se ter. | Studio 3 | SI | Protocollo da specificare |
| **COC-036** | Medicina estetica | Biorivitalizzazione/biostimolazione occhiaie | — | PREVENTIVO_POST_VISITA | IVA 22% / Esente se ter. | Studio 3 | NO | Preventivo post visita |
| **COC-037** | Medicina estetica | Biostimolazione | 120,00 | FISSO | IVA 22% / Esente se ter. | Studio 3 | SI | Protocollo da specificare |
| **COC-038** | Medicina estetica | Blefaroplastica non chirurgica con laser CO2 | — | PREVENTIVO_POST_VISITA | IVA 22% / Esente se ter. | Studio 3 | NO | Laser CO2 medicale |
| **COC-039** | Medicina estetica | Carbossiterapia – trattamento singolo | 150,00 | FISSO | IVA 22% / Esente se ter. | Studio 3 | SI | Singola seduta |
| **COC-040** | Medicina estetica | Consulenza per armonizzazione del viso | — | PREVENTIVO_POST_VISITA | IVA 22% / Esente se ter. | Studio 3 | SI | Sovrapposta a visita medicina estetica |
| **COC-041** | Medicina estetica | Cryoliposculpt – trattamento per area | 250,00 | FISSO | IVA 22% / Esente se ter. | Studio 3 | SI | Trattamento a zona |
| **COC-042** | Medicina estetica | Filler Full Face | — | PREVENTIVO_POST_VISITA | IVA 22% / Esente se ter. | Studio 3 | NO | Preventivo post visita |
| **COC-043** | Medicina estetica | Filler labbra | 300,00 | FISSO | IVA 22% / Esente se ter. | Studio 3 | SI | Trattamento labbra |
| **COC-044** | Medicina estetica | Filler mandibola / jawline | — | PREVENTIVO_POST_VISITA | IVA 22% / Esente se ter. | Studio 3 | NO | Preventivo post visita |
| **COC-045** | Medicina estetica | Filler mento | — | PREVENTIVO_POST_VISITA | IVA 22% / Esente se ter. | Studio 3 | NO | Preventivo post visita |
| **COC-046** | Medicina estetica | Filler occhiaie | — | PREVENTIVO_POST_VISITA | IVA 22% / Esente se ter. | Studio 3 | NO | Preventivo post visita |
| **COC-047** | Medicina estetica | Filler zigomi | — | PREVENTIVO_POST_VISITA | IVA 22% / Esente se ter. | Studio 3 | NO | Preventivo post visita |
| **COC-048** | Medicina estetica | Laser CO2 frazionato – resurfacing viso | 500,00 | PREVENTIVO_POST_VISITA | IVA 22% / Esente se ter. | Studio 3 | NO | Resurfacing viso |
| **COC-049** | Medicina estetica | Laser CO2 – asportazioni piccole neoformazioni cutanee | — | PREVENTIVO_POST_VISITA | IVA 22% / Esente se ter. | Studio 3 | NO | Preventivo post visita |
| **COC-050** | Medicina estetica | Laser CO2 – cicatrici e irregolarità cutanee | — | PREVENTIVO_POST_VISITA | IVA 22% / Esente se ter. | Studio 3 | NO | Preventivo post visita |
| **COC-051** | Medicina estetica | Laser CO2 – macchie cutanee | — | PREVENTIVO_POST_VISITA | IVA 22% / Esente se ter. | Studio 3 | NO | Preventivo post visita |
| **COC-052** | Medicina estetica | Laser Erbium-yag cicatrici/smagliature a seduta | 200,00 | FISSO | IVA 22% / Esente se ter. | Studio 3 | SI | Seduta singola |
| **COC-053** | Medicina estetica | Laser Erbium-yag resurfacing volto a seduta | 300,00 | FISSO | IVA 22% / Esente se ter. | Studio 3 | NO | Seduta singola |
| **COC-054** | Medicina estetica | Laser Q-switched rimozione microblading a seduta | 200,00 | FISSO | IVA 22% / Esente se ter. | Studio 3 | SI | Seduta singola |
| **COC-055** | Medicina estetica | Laser Q-switched rimozione tatuaggi a seduta | 200,00 | FISSO | IVA 22% / Esente se ter. | Studio 3 | SI | Seduta singola |
| **COC-056** | Medicina estetica | Mesoterapia corpo seduta singola | 120,00 | FISSO | IVA 22% / Esente se ter. | Studio 3 | NO | Seduta singola |
| **COC-057** | Medicina estetica | Peeling chimici medicali | 150,00 | FISSO | IVA 22% / Esente se ter. | Studio 3 | NO | Trattamento medico |
| **COC-058** | Medicina estetica | Polilattico corpo | — | PREVENTIVO_POST_VISITA | IVA 22% / Esente se ter. | Studio 3 | NO | Preventivo post visita |
| **COC-059** | Medicina estetica | Polilattico volto o collo | — | PREVENTIVO_POST_VISITA | IVA 22% / Esente se ter. | Studio 3 | NO | Preventivo post visita |
| **COC-060** | Medicina estetica | Protocollo anticellulite | 700,00 | FISSO | IVA 22% / Esente se ter. | Studio 3 | NO | Ciclo combinato |
| **COC-061** | Medicina estetica | PRX | 120,00 | FISSO | IVA 22% / Esente se ter. | Studio 3 | SI | Peeling biostimolante |
| **COC-062** | Medicina estetica | Rinofiller | 450,00 | FISSO | IVA 22% / Esente se ter. | Studio 3 | NO | Modellamento naso |
| **COC-063** | Medicina estetica | Skin booster | 120,00 | FISSO | IVA 22% / Esente se ter. | Studio 3 | SI | Idratazione profonda |
| **COC-064** | Medicina estetica | Trattamenti rigenerativi | — | PREVENTIVO_POST_VISITA | IVA 22% / Esente se ter. | Studio 3 | NO | Preventivo post visita |
| **COC-065** | Medicina estetica | Intralipoterapia singola zona | 250,00 | FISSO | IVA 22% / Esente se ter. | Studio 3 | NO | Adiposità localizzate |
| **COC-066** | Medicina estetica | Trattamento bruxismo con tossina botulinica | 600,00 | FISSO | IVA 22% / Esente se ter. | Studio 3 | NO | Terapeutico muscolare |
| **COC-067** | Medicina estetica | Trattamento CFU (HIFU) corpo | 120,00 | PREVENTIVO_POST_VISITA | IVA 22% / Esente se ter. | Studio 3 | SI | Ultrasuoni focalizzati |
| **COC-068** | Medicina estetica | Trattamento CFU (HIFU) viso e collo | 120,00 | PREVENTIVO_POST_VISITA | IVA 22% / Esente se ter. | Studio 3 | SI | Ultrasuoni focalizzati |
| **COC-069** | Medicina estetica | Trattamento cicatrici acneiche | — | PREVENTIVO_POST_VISITA | IVA 22% / Esente se ter. | Studio 3 | NO | Preventivo post visita |
| **COC-070** | Medicina estetica | Trattamento iperidrosi con tossina botulinica | — | PREVENTIVO_POST_VISITA | IVA 22% / Esente se ter. | Studio 3 | NO | Preventivo post visita |
| **COC-071** | Medicina estetica | Trattamento lassità cutanea | — | PREVENTIVO_POST_VISITA | IVA 22% / Esente se ter. | Studio 3 | NO | Preventivo post visita |
| **COC-072** | Medicina estetica | Trattamento luminosità cutanea | — | PREVENTIVO_POST_VISITA | IVA 22% / Esente se ter. | Studio 3 | NO | Preventivo post visita |
| **COC-073** | Medicina estetica | Trattamento rughe dinamiche con botulinica | — | PREVENTIVO_POST_VISITA | IVA 22% / Esente se ter. | Studio 3 | SI | Preventivo post visita |
| **COC-074** | Medicina estetica | Trattamento texture cutanea | — | PREVENTIVO_POST_VISITA | IVA 22% / Esente se ter. | Studio 3 | NO | Preventivo post visita |
| **COC-075** | Medicina estetica | Valutazione skin quality | 80,00 | LISTINO_IN_SEDE | IVA 22% / Esente se ter. | Studio 3 | SI | Check strumentale |
| **COC-076** | Medicina estetica | Visita medicina estetica o chirurgia plastica | 100,00 | LISTINO_IN_SEDE | IVA 22% / Esente se ter. | Studio 3 | SI | Prima visita specialistica |
| **COC-077** | Medicina estetica | Biostimolazione con acido poli-L-lattico | — | PREVENTIVO_POST_VISITA | IVA 22% / Esente se ter. | Studio 3 | NO | Prezzo su preventivo |
| **COC-078** | Medicina estetica | Biostimolazione con idrossiapatite di calcio | — | PREVENTIVO_POST_VISITA | IVA 22% / Esente se ter. | Studio 3 | NO | Prezzo su preventivo |
| **COC-080** | Nutrizione | Prima visita nutrizionale con piano alimentare | 100,00 | FISSO | IVA 22% / Esente se ter. | Studio 2 | SI | Con dieta personalizzata |
| **COC-081** | Nutrizione | Visita nutrizionale di controllo | 80,00 | FISSO | IVA 22% / Esente se ter. | Studio 2 | SI | Controllo periodico |
| **COC-082** | Oculistica | Visita oculistica completa | 200,00 | FISSO | ESENTE IVA art. 10 | Studio 4 | SI | Con fondo oculare e tono |
| **COC-083** | Oculistica | Visita oculistica pediatrica | 170,00 | FISSO | ESENTE IVA art. 10 | Studio 4 | SI | Fascia pediatrica |
| **COC-084** | Odontoiatria | Visita odontoiatrica con OPT | — | PREVENTIVO_POST_VISITA | ESENTE IVA art. 10 | Studio 1 | NO | Visita + radiografia |
| **COC-085** | Odontoiatria | Visita ortodontica e valutazione malocclusioni | — | PREVENTIVO_POST_VISITA | ESENTE IVA art. 10 | Studio 1 | NO | Studio del caso ortodontico |
| **COC-086** | Odontoiatria e ortodonzia | Chirurgia implantare | — | PREVENTIVO_POST_VISITA | ESENTE IVA art. 10 | Studio 1 | NO | Impianti in titanio |
| **COC-087** | Odontoiatria e ortodonzia | Chirurgia orale | — | PREVENTIVO_POST_VISITA | ESENTE IVA art. 10 | Studio 1 | NO | Chirurgia odontostomatologica |
| **COC-088** | Odontoiatria e ortodonzia | Cone Beam / CBCT | 140,00 | FISSO | ESENTE IVA art. 10 | Sala OPT | SI | Tomografia volumetrica 3D |
| **COC-089** | Odontoiatria e ortodonzia | Conservativa generale | — | PREVENTIVO_POST_VISITA | ESENTE IVA art. 10 | Studio 1 | NO | Categoria generale da specificare |
| **COC-090** | Odontoiatria e ortodonzia | Endodonzia Monoradicolare | 350,00 | FISSO | ESENTE IVA art. 10 | Studio 1 | NO | Devitalizzazione 1 canale |
| **COC-091** | Odontoiatria e ortodonzia | Endodonzia Pluriradicolare | 450,00 | FISSO | ESENTE IVA art. 10 | Studio 1 | NO | Devitalizzazione pluricanalare |
| **COC-092** | Odontoiatria e ortodonzia | Estrazione ottavi / denti del giudizio | 450,00 | FISSO | ESENTE IVA art. 10 | Studio 1 | NO | Estrazione chirurgica |
| **COC-093** | Odontoiatria e ortodonzia | Estrazioni semplici e complesse | 250,00 | FISSO | ESENTE IVA art. 10 | Studio 1 | NO | Estrazione dentale |
| **COC-094** | Odontoiatria e ortodonzia | Faccette dentali | — | PREVENTIVO_POST_VISITA | IVA 22% / Esente se ter. | Studio 1 | NO | Faccette estetiche |
| **COC-095** | Odontoiatria e ortodonzia | Igiene orale professionale | 90,00 | FISSO | ESENTE IVA art. 10 | Studio 1 | SI | Ablazione tartaro e airflow |
| **COC-096** | Odontoiatria e ortodonzia | Impronta digitale 3D | 70,00 | FISSO | IVA 22% / Esente se ter. | Studio 1 | SI | Scanner intraorale |
| **COC-097** | Odontoiatria e ortodonzia | OPT / ortopantomografia | 50,00 | FISSO | ESENTE IVA art. 10 | Sala OPT | SI | Panoramica dentale digitale |
| **COC-098** | Odontoiatria e ortodonzia | Ortodonzia bambini e adolescenti | — | PREVENTIVO_POST_VISITA | ESENTE IVA art. 10 | Studio 1 | NO | Intercettiva / fissa |
| **COC-099** | Odontoiatria e ortodonzia | Ortodonzia invisibile / allineatori trasparenti | — | PREVENTIVO_POST_VISITA | ESENTE IVA art. 10 | Studio 1 | NO | Trattamento con allineatori |
| **COC-100** | Odontoiatria e ortodonzia | Ortodonzia tradizionale | — | PREVENTIVO_POST_VISITA | ESENTE IVA art. 10 | Studio 1 | NO | Apparecchio fisso |
| **COC-102** | Odontoiatria e ortodonzia | Protesi fissa/mobile | — | PREVENTIVO_POST_VISITA | ESENTE IVA art. 10 | Studio 1 | NO | Riabilitazione protesica |
| **COC-105** | Odontoiatria e ortodonzia | Radiografie endorali | 35,00 | FISSO | ESENTE IVA art. 10 | Studio 1 | SI | Radiografia endorale singola |
| **COC-106** | Odontoiatria e ortodonzia | Ricostruzioni estetiche | — | PREVENTIVO_POST_VISITA | ESENTE IVA art. 10 | Studio 1 | NO | Otturazioni e restauri |
| **COC-107** | Odontoiatria e ortodonzia | Ritrattamenti canalari | — | PREVENTIVO_POST_VISITA | ESENTE IVA art. 10 | Studio 1 | NO | Ritrattamento endodontico |
| **COC-108** | Odontoiatria e ortodonzia | Sbiancamento dentale professionale | 450,00 | FISSO | IVA 22% / Esente se ter. | Studio 1 | SI | Con lampada LED / laser |
| **COC-109** | Odontoiatria e ortodonzia | Visita odontoiatrica | 0,00 | FISSO | ESENTE IVA art. 10 | Studio 1 | SI | Visita odontoiatrica (inclusa) |
| **COC-110** | Oncologia | Consulenza oncologica | 220,00 | FISSO | ESENTE IVA art. 10 | Studio 2 | SI | Second opinion e orientamento |
| **COC-111** | Oncologia | Supporto nella lettura referti e doc clinica | 180,00 | FISSO | ESENTE IVA art. 10 | Studio 2 | SI | Revisione cartelle ed esami |
| **COC-115** | Pediatria | Visita Pediatrica domiciliare | 150,00 | FISSO | ESENTE IVA art. 10 | Fuori sede | SI | Visita a domicilio |
| **COC-116** | Pediatria | Visita pediatrica in studio | 120,00 | FISSO | ESENTE IVA art. 10 | Studio 2 | SI | Visita ambulatoriale |
| **COC-117** | Psicologia | Consulenza psicologica | 100,00 | FISSO | ESENTE IVA art. 10 | Studio 2 | SI | Colloquio clinico |
| **COC-118** | Psicologia | Trattamento dipendenza da device digitali | 120,00 | FISSO | ESENTE IVA art. 10 | Studio 2 | NO | Percorso specialistico device addiction |
| **COC-121** | Radiologia ed ecografia | Ecografia addome completo | 160,00 | FISSO | ESENTE IVA art. 10 | Studio 4 | SI | Superiore + inferiore |
| **COC-122** | Radiologia ed ecografia | Ecografia addome inferiore (PELVI) | 160,00 | FISSO | ESENTE IVA art. 10 | Studio 4 | SI | Distretto pelvico |
| **COC-123** | Radiologia ed ecografia | Ecografia addome superiore | 160,00 | FISSO | ESENTE IVA art. 10 | Studio 4 | SI | Fegato, vie biliari, pancreas, milza, reni |
| **COC-124** | Radiologia ed ecografia | Ecografia articolare | 140,00 | FISSO | ESENTE IVA art. 10 | Studio 4 | SI | Singola articolazione |
| **COC-125** | Radiologia ed ecografia | Ecografia collo | 120,00 | FISSO | ESENTE IVA art. 10 | Studio 4 | SI | Tiroide e stazioni linfonodali |
| **COC-126** | Radiologia ed ecografia | Ecografia cute e sottocute | 120,00 | FISSO | ESENTE IVA art. 10 | Studio 4 | SI | Tessuti molli superficiali |
| **COC-127** | Radiologia ed ecografia | Ecografia ginecologica sovrapubica | 140,00 | FISSO | ESENTE IVA art. 10 | Studio 4 | SI | Distretto ginecologico |
| **COC-128** | Radiologia ed ecografia | Ecografia mammaria | 130,00 | FISSO | ESENTE IVA art. 10 | Studio 4 | SI | Bilaterale |
| **COC-129** | Radiologia ed ecografia | Ecografia muscolo-tendinea | 140,00 | FISSO | ESENTE IVA art. 10 | Studio 4 | SI | Singolo distretto muscolare |
| **COC-130** | Radiologia ed ecografia | Ecografia pelvica sovrapubica | 160,00 | FISSO | ESENTE IVA art. 10 | Studio 4 | SI | Sovrapubica |
| **COC-132** | Radiologia ed ecografia | Ecografia renale e vie urinarie | 160,00 | FISSO | ESENTE IVA art. 10 | Studio 4 | SI | Reni, vescica, prostata sovrapubica |
| **COC-133** | Radiologia ed ecografia | Ecografia tessuti molli | 120,00 | FISSO | ESENTE IVA art. 10 | Studio 4 | SI | Singola sede |
| **COC-134** | Radiologia ed ecografia | Ecografia testicolare | 130,00 | FISSO | ESENTE IVA art. 10 | Studio 4 | SI | Con ecocolordoppler vasi spermatici |
| **COC-135** | Radiologia ed ecografia | Ecografia tiroidea | 120,00 | FISSO | ESENTE IVA art. 10 | Studio 4 | SI | Tiroide e paratiroidi |
| **COC-136** | Radiologia ed ecografia | Supporto ecografico a visite specialistiche | 80,00 | FISSO | ESENTE IVA art. 10 | Studio 4 | SI | Ecografia mirata complementare |
| **COC-138** | Senologia | Follow-up senologico | 140,00 | FISSO | ESENTE IVA art. 10 | Studio 2 | SI | Visita di controllo periodico |
| **COC-139** | Senologia | Visita senologica | 160,00 | FISSO | ESENTE IVA art. 10 | Studio 2 | SI | Palpazione ed esame clinico |
| **COC-140** | Senologia | Visita senologica con ecografia mammaria | 200,00 | FISSO | ESENTE IVA art. 10 | Studio 2 | SI | Pacchetto combinato visita + ecografia |
| **COC-141** | Telemedicina | Teleconsulto specialistico | 120,00 | FISSO | ESENTE IVA art. 10 | — | SI | Consulto da remoto |
