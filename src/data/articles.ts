import type { Article } from './types';

export const articles: Article[] = [
  {
    id: 1,
    slug: 'confucianism-ritual-ethics',
    region: 'east',
    school: 'Confucianism',
    title_uz: 'Konfutsiychilik: Axloq va marosim uygunligi',
    title_en: 'Confucianism: Ethics and Ritual Harmony',
    summary_uz:
      'Konfutsiychilik jamiyat barqarorligi uchun shaxsiy fazilat, oilaviy burch va marosimiy tartibni asos deb biladi.',
    summary_en:
      'Confucianism sees social stability as the result of personal virtue, family duty, and ritual order.',
    content_uz: `## Asosiy yonalish
Konfutsiychilikda **ren** (insonparvarlik) va **li** (marosimiy tartib) bir-birini toldiradi. Inson ichki fazilatni rivojlantirsa, jamiyatdagi munosabatlar ham tog'ri shakllanadi.

## Jamiyat va siyosat
Konfutsiychilik davlatni zoravon kuch bilan emas, balki namuna boladigan yetakchilik bilan boshqarishni taklif qiladi. Hukmdor avval ozini tarbiyalashi kerak.

## Talimning roli
Talim maqsadi faqat bilim emas, balki **junzi** - komil insonni tarbiyalashdir. Bu yolda odob, ozini nazorat qilish va kattalarga hurmat markazda turadi.`,
    content_en: `## Core orientation
In Confucian thought, **ren** (humaneness) and **li** (ritual propriety) reinforce each other. When inner character is cultivated, public relationships become ordered.

## Society and politics
Confucianism proposes rule by moral example rather than coercive fear. A ruler should first discipline the self, then guide the state.

## Role of learning
Education is not only information transfer. It is the formation of the **junzi** - the noble person who combines courtesy, restraint, and responsibility.`,
    concepts: ['ren', 'li', 'junzi', 'de'],
    keyTakeaways_uz: [
      'Ren va li birgalikda shaxsiy va ijtimoiy axloqni quradi.',
      'Yetakchilik avvalo shaxsiy fazilatga tayanishi kerak.',
      'Talimning maqsadi komil insonni tarbiyalashdir.',
    ],
    keyTakeaways_en: [
      'Ren and li jointly shape personal and social ethics.',
      'Leadership should rest on cultivated virtue before force.',
      'Education aims to form character, not just transmit facts.',
    ],
    readingTime: 7,
    timelineYear: -500,
  },
  {
    id: 2,
    slug: 'daoism-natural-harmony',
    region: 'east',
    school: 'Daoism',
    title_uz: 'Daochilik: Tabiiy uygunlik yoli',
    title_en: 'Daoism: The Path of Natural Harmony',
    summary_uz:
      'Daochilik tabiat oqimiga mos yashashni va suniy zorlashdan voz kechishni tavsiya qiladi.',
    summary_en:
      'Daoism advises living in alignment with natural flow and avoiding forced control.',
    content_uz: `## Dao va tabiiylik
Daochilikning markazida **dao** - borliqning tabiiy yoli turadi. Inson bu yolga qarshi emas, balki unga mos yashashi kerak.

## Wu wei tamoyili
**Wu wei** faoliyatsizlik emas; bu ortiqcha bosimsiz, vaziyatga mos harakat qilishdir. Zorlash kopincha tartibsizlik tugdiradi.

## Soddalik va ichki tinchlik
Daochilik hayotda soddalik, kam istak va ichki xotirjamlikni qadrlaydi. Shaxs tabiat bilan uygunlashganda ruhiy barqarorlik kuchayadi.`,
    content_en: `## Dao and naturalness
At the center of Daoism stands **dao**, the way things unfold. The wise person does not dominate reality but aligns with it.

## Principle of wu wei
**Wu wei** is not laziness. It is skilled, low-friction action that avoids unnecessary force. Over-control usually produces instability.

## Simplicity and inner ease
Daoist practice values simplicity, reduced craving, and quiet awareness. Harmony with nature is presented as a practical path to balance.`,
    concepts: ['dao', 'wu-wei', 'ziran', 'de'],
    keyTakeaways_uz: [
      'Dao borliqning tabiiy yonalishini anglatadi.',
      'Wu wei zoravon bosimsiz samarali harakatdir.',
      'Soddalik va kam istak ichki xotirjamlikni kuchaytiradi.',
    ],
    keyTakeaways_en: [
      'Dao names the natural unfolding of reality.',
      'Wu wei means effective action without needless force.',
      'Simplicity and low desire support durable calm.',
    ],
    readingTime: 6,
    timelineYear: -400,
  },
  {
    id: 3,
    slug: 'legalism-state-order',
    region: 'east',
    school: 'Legalism',
    title_uz: 'Legizm: Davlat tartibi va qonun',
    title_en: 'Legalism: State Order Through Law',
    summary_uz:
      'Legizm kuchli davlat uchun qatiy qonun, nazorat va mukofot-jazo tizimini asosiy vosita deb biladi.',
    summary_en:
      'Legalism treats strict law, surveillance, and reward-punishment systems as tools of a strong state.',
    content_uz: `## Qonun markaziyligi
Legizmda shaxsning niyatidan kora **fa** - aniq va bir xil qollanadigan qonun muhimroq. Tizim oldindan aytilgan bolishi kerak.

## Boshqaruv texnikasi
**Shu** (mamuriy usul) va **shi** (lavozim kuchi) orqali hukmdor byurokratiyani nazorat qiladi. Maqsad - markazlashgan barqarorlik.

## Axloqdan kora tartib
Legizm odatda axloqiy tarbiyani ikkilamchi deb koradi; birinchi orinda xavfsizlik va intizom turadi.`,
    content_en: `## Primacy of law
For Legalists, **fa** - clear, public, predictable law - matters more than private intention. Uniform standards reduce arbitrariness.

## Administrative technique
Through **shu** (method) and **shi** (positional power), rulers manage officials and prevent factional drift.

## Order over moral education
Legalism often places security and discipline before ethical cultivation, arguing that durable institutions need enforceable rules.`,
    concepts: ['fa', 'shu', 'shi'],
    keyTakeaways_uz: [
      'Fa - oldindan malum bolgan qatiy meyorlar tizimi.',
      'Shu va shi hukmdorga boshqaruvni markazlashtirishga yordam beradi.',
      'Legizmda tartib axloqiy tarbiyadan ustun qoyiladi.',
    ],
    keyTakeaways_en: [
      'Fa means explicit, consistently applied standards.',
      'Shu and shi support centralized control of officials.',
      'Legalism prioritizes order over moral persuasion.',
    ],
    readingTime: 6,
    timelineYear: -300,
  },
  {
    id: 4,
    slug: 'mohism-universal-care',
    region: 'east',
    school: 'Mohism',
    title_uz: 'Motsizm: Umumiy gamxorlik va foydalilik',
    title_en: 'Mohism: Universal Care and Practical Benefit',
    summary_uz:
      'Motsizm barcha insonlarga teng gamxorlikni va jamiyatga real foyda beradigan siyosatni himoya qiladi.',
    summary_en:
      'Mohism defends impartial care for all and public policies judged by concrete social benefit.',
    content_uz: `## Jian ai tamoyili
Mozi **jian ai** - hammani teng qadrlash tamoyilini ilgari suradi. Qarindoshlik asosidagi tarafkashlik urush va adolatsizlikni kuchaytiradi.

## Foydalilik mezoni
Motsizm goyalarni "xalq uchun foydalimi?" degan savol bilan tekshiradi. Behuda hashamat, qimmat marosim va keraksiz urush tanqid qilinadi.

## Layoqatli boshqaruv
Lavozimlar nasabga emas, malakaga asoslanishi kerak degan fikr mohistik siyosatda markaziy orinda turadi.`,
    content_en: `## Principle of jian ai
Mozi advances **jian ai** - impartial concern for all persons. Partiality to kin or clan is seen as a source of conflict.

## Test of public benefit
Mohists evaluate doctrines by practical outcomes: does this reduce harm and increase welfare for ordinary people?

## Merit in governance
Office should be assigned by competence rather than birth. Mohism links ethical concern with institutional design.`,
    concepts: ['jian-ai', 'meritocracy', 'fa'],
    keyTakeaways_uz: [
      'Jian ai - tarafkashliksiz umumiy gamxorlik tamoyili.',
      'Siyosat xalq uchun aniq foyda berishi bilan baholanadi.',
      'Lavozim nasab emas, layoqat asosida taqsimlanishi kerak.',
    ],
    keyTakeaways_en: [
      'Jian ai calls for impartial care beyond clan loyalty.',
      'Policies are judged by measurable public benefit.',
      'Merit should outweigh lineage in public office.',
    ],
    readingTime: 7,
    timelineYear: -430,
  },
  {
    id: 5,
    slug: 'buddhism-path-liberation',
    region: 'east',
    school: 'Buddhism',
    title_uz: 'Buddaviylik: Ozodlikka eltuvchi yol',
    title_en: 'Buddhism: The Path to Liberation',
    summary_uz:
      'Buddaviylik azob sabablarini tahlil qilib, ongni tarbiyalash orqali ozodlikka erishishni orgatadi.',
    summary_en:
      'Buddhism analyzes the causes of suffering and teaches liberation through disciplined mind training.',
    content_uz: `## Tort oliy haqiqat
Buddaviylik inson holatini **tort oliy haqiqat** orqali tushuntiradi: azob mavjud, azobning sababi bor, azob tugashi mumkin, va bunga eltuvchi yol bor.

## Sakkiz pogonali yol
Tog'ri qarash, niyat, soz, amal, tirikchilik, say, xotirjamlik va diqqat birgalikda axloqiy va ruhiy rivojlanishni taminlaydi.

## Ozaro bogliqlik
**Dependent origination** tamoyili hodisalar mustaqil emasligini korsatadi. Bu qarash ego markazligini kamaytiradi va rahm-shafqatni kuchaytiradi.`,
    content_en: `## Four Noble Truths
Buddhist teaching begins with the **Four Noble Truths**: suffering exists, it has causes, cessation is possible, and a path leads to that cessation.

## Noble Eightfold Path
Right view, intention, speech, action, livelihood, effort, mindfulness, and concentration form an integrated discipline.

## Interdependence
The doctrine of dependent origination denies isolated existence. Seeing interconnected causes weakens attachment and supports compassion.`,
    concepts: ['four-noble-truths', 'eightfold-path', 'dependent-origination', 'karma'],
    keyTakeaways_uz: [
      'Tort oliy haqiqat azob va uning yechimini tizimli tushuntiradi.',
      'Sakkiz pogonali yol axloq, ong va donolikni birlashtiradi.',
      'Ozaro bogliqlik ego markazligidan voz kechishga yordam beradi.',
    ],
    keyTakeaways_en: [
      'The Four Noble Truths structure diagnosis and cure of suffering.',
      'The Eightfold Path integrates ethics, attention, and wisdom.',
      'Interdependence reduces ego fixation and deepens compassion.',
    ],
    readingTime: 8,
    timelineYear: -500,
  },
  {
    id: 6,
    slug: 'jainism-nonviolence-truth',
    region: 'east',
    school: 'Jainism',
    title_uz: 'Jaynizm: Zoravonliksiz hayot va kop qirrali haqiqat',
    title_en: 'Jainism: Nonviolence and Many-Sided Truth',
    summary_uz:
      'Jaynizm barcha tirik mavjudotlarga zarar bermaslikni va haqiqatga kop nuqtai nazardan qarashni talab qiladi.',
    summary_en:
      'Jainism demands non-harm to all living beings and encourages many-sided approaches to truth.',
    content_uz: `## Ahimsa markaziyligi
Jaynizmda **ahimsa** eng oliy axloqiy mezondir. Fikrda, sozda va amalda zoravonlikdan tiyilish talab qilinadi.

## Anekantavada
Haqiqat murakkab bolgani uchun bir nuqtai nazar uni toliq qamrab olmaydi. **Anekantavada** muloqot madaniyatini kuchaytiradi.

## Aparigraha va intizom
Ortiqcha egalikdan voz kechish (**aparigraha**) istakni kamaytiradi, bu esa ruhiy yengillikka olib keladi.`,
    content_en: `## Centrality of ahimsa
In Jain ethics, **ahimsa** is foundational: avoid harm in thought, speech, and action toward all life forms.

## Anekantavada
Because truth is complex, no single perspective captures it fully. **Anekantavada** cultivates intellectual humility.

## Aparigraha and discipline
Non-possessiveness restrains craving. Jain practice links ethical restraint with inner clarity and liberation.`,
    concepts: ['ahimsa', 'anekantavada', 'aparigraha', 'karma'],
    keyTakeaways_uz: [
      'Ahimsa fikr, soz va amalda zoravonlikdan tiyilishni talab qiladi.',
      'Anekantavada haqiqatning kop qirrali ekanini eslatadi.',
      'Aparigraha ortiqcha egalik va ochkozlikni kamaytiradi.',
    ],
    keyTakeaways_en: [
      'Ahimsa extends nonviolence across thought, speech, and behavior.',
      'Anekantavada frames truth as many-sided and dialogical.',
      'Aparigraha limits attachment to possessions and desire.',
    ],
    readingTime: 7,
    timelineYear: -450,
  },
  {
    id: 7,
    slug: 'socrates-examined-life',
    region: 'west',
    school: 'Socratic',
    title_uz: 'Sokrat: Savol berish sanati va tekshirilgan hayot',
    title_en: 'Socrates: Questioning and the Examined Life',
    summary_uz:
      'Sokrat dialog orqali yashirin taxminlarni ochib, axloqiy ravshanlikka erishishni maqsad qiladi.',
    summary_en:
      'Socrates uses dialogue to expose hidden assumptions and move toward moral clarity.',
    content_uz: `## Elenxus usuli
Sokratik usulda ketma-ket savollar orqali davolar sinovdan otadi. Ziddiyat chiqqanda pozitsiya qayta korib chiqiladi.

## Bilim va axloq
Sokrat yomonlik kopincha bilimsizlikdan keladi deb hisoblaydi. Demak, axloqiy talim hayotiy ahamiyatga ega.

## Tekshirilgan hayot
Shaxs oz qarashlarini muntazam tekshirib borsa, adolatliroq qaror qiladi. Bu usul demokratik muloqotga ham xizmat qiladi.`,
    content_en: `## Method of elenchus
Socratic dialogue tests claims through disciplined questioning. Contradictions are not defeat; they are diagnostic tools.

## Knowledge and ethics
Socrates often links wrongdoing to ignorance, making ethical education central to civic life.

## The examined life
Regular self-examination improves judgment and responsibility. The method also models respectful public reasoning.`,
    concepts: ['socratic-elenchus', 'maieutic', 'eudaimonia'],
    keyTakeaways_uz: [
      'Elenxus savollar orqali notogri taxminlarni ochadi.',
      'Sokrat axloqni bilim bilan chambarchas boglaydi.',
      'Tekshirilgan hayot shaxsiy va ijtimoiy masuliyatni oshiradi.',
    ],
    keyTakeaways_en: [
      'Elenchus reveals weak assumptions through structured inquiry.',
      'Socratic ethics ties better action to better understanding.',
      'The examined life strengthens responsibility and judgment.',
    ],
    readingTime: 6,
    timelineYear: -430,
  },
  {
    id: 8,
    slug: 'plato-forms-justice',
    region: 'west',
    school: 'Platonism',
    title_uz: 'Platon: Goyalar dunyosi va adolatli davlat',
    title_en: 'Plato: Forms and the Just City',
    summary_uz:
      'Platon ozgaruvchan dunyo ortida doimiy goyalar borligini va adolat bilimli boshqaruvni talab qilishini takidlaydi.',
    summary_en:
      'Plato argues that stable Forms ground reality and that justice requires knowledgeable political rule.',
    content_uz: `## Goyalar nazariyasi
Platon sezgi olami ozgaruvchan, haqiqiy bilim esa **Formalar** (Goyalar) haqida deb hisoblaydi. Shu sabab falsafa bilishga tayyorlaydi.

## Adolat tushunchasi
"Respublika"da adolat - har bir qism oz vazifasini tog'ri bajarishi. Ruh va davlat tuzilmasi oxshash modelda tahlil qilinadi.

## Faylasuf-podshoh
Davlatni bilimga ega, nafsini boshqara oladigan yetakchi boshqarishi kerak degan goya Plato siyosatining markazidir.`,
    content_en: `## Theory of Forms
Plato distinguishes unstable sensory appearances from intelligible **Forms**. Philosophy trains the mind for durable knowledge.

## Justice
In the *Republic*, justice means each part doing its proper role in both soul and city.

## Philosopher-king
Political authority should belong to those educated in truth and disciplined in character, not merely in rhetoric or power seeking.`,
    concepts: ['theory-of-forms', 'philosopher-king', 'cardinal-virtues'],
    keyTakeaways_uz: [
      'Platon uchun haqiqiy bilim ozgarmas Formlarga tegishli.',
      'Adolat - qism va butun ortasidagi togri uygunlik.',
      'Faylasuf-podshoh modeli bilimli boshqaruvni himoya qiladi.',
    ],
    keyTakeaways_en: [
      'Stable Forms make knowledge possible in Platos framework.',
      'Justice is functional harmony within soul and city.',
      'The philosopher-king ideal links knowledge to legitimate rule.',
    ],
    readingTime: 8,
    timelineYear: -380,
  },
  {
    id: 9,
    slug: 'aristotle-virtue-reason',
    region: 'west',
    school: 'Aristotelian',
    title_uz: 'Arastu: Fazilat, mantiq va oltin ortalik',
    title_en: 'Aristotle: Virtue, Logic, and the Golden Mean',
    summary_uz:
      'Arastu maqsadga yonaltirilgan tabiat tasavvuri asosida odat orqali shakllanuvchi fazilat etikasini ishlab chiqqan.',
    summary_en:
      'Aristotle develops a teleological view of nature and an ethics of virtue formed through habituation.',
    content_uz: `## Eudaimonia
Arastuda baxt - qisqa zavq emas, balki butun hayot davomida maqsadga muvofiq ravnaq topishdir.

## Oltin ortalik
Fazilat kopincha ikki ogish orasidagi meyoriy nuqtadir. Jasorat, masalan, qorqoqlik va telbalik orasida turadi.

## Aql va amaliy donolik
Mantiq va **phronesis** (amaliy donolik) kundalik qarorlar sifatini oshiradi. Axloq odat orqali mustahkamlanadi.`,
    content_en: `## Eudaimonia
For Aristotle, happiness is not momentary pleasure but long-term flourishing through excellent activity.

## Golden mean
Virtue is often a calibrated middle between excess and deficiency. Courage sits between rashness and cowardice.

## Reason and practical wisdom
Logic and practical judgment (*phronesis*) guide action in concrete situations. Character is built by repeated practice.`,
    concepts: ['eudaimonia', 'golden-mean', 'cardinal-virtues'],
    keyTakeaways_uz: [
      'Eudaimonia uzoq muddatli ravnaq holatini anglatadi.',
      'Oltin ortalik fazilatni meyoriy muvozanat sifatida talqin qiladi.',
      'Odat va amaliy donolik axloqiy xulqni shakllantiradi.',
    ],
    keyTakeaways_en: [
      'Eudaimonia refers to sustained human flourishing.',
      'The golden mean frames virtue as calibrated balance.',
      'Habit and practical wisdom produce reliable character.',
    ],
    readingTime: 7,
    timelineYear: -340,
  },
  {
    id: 10,
    slug: 'stoicism-inner-freedom',
    region: 'west',
    school: 'Stoicism',
    title_uz: 'Stoitsizm: Ichki erkinlik va logos',
    title_en: 'Stoicism: Inner Freedom and Logos',
    summary_uz:
      'Stoitsizm nazorat qilinadigan narsaga etibor qaratib, aql va tabiatga mos yashash orqali xotirjamlikka erishishni orgatadi.',
    summary_en:
      'Stoicism teaches tranquility by focusing on what we control and living in accordance with reason and nature.',
    content_uz: `## Nazorat dichotomiyasi
Stoiklar tashqi hodisalardan kora ularga berilgan bahoni boshqarish muhimligini takidlaydi. Bu ichki erkinlikning asosi.

## Logos va tabiat
Koinot oqilona tartib - **logos** bilan boshqariladi. Inson vazifasi shu tartibga mos yashash.

## Amaliy mashqlar
Kundalik refleksiya, salbiy ssenariyni oldindan tasavvur qilish va hissiy intizom stoik amaliyotning asosiy usullaridir.`,
    content_en: `## Control distinction
Stoics distinguish what depends on us from what does not. Peace increases when attention stays on choice and judgment.

## Logos and nature
Reality is ordered by **logos**, a rational structure. Virtue means consenting to that order without resentment.

## Practices
Journaling, premeditation of adversity, and emotional discipline make Stoicism a trainable way of life.`,
    concepts: ['logos', 'apatheia', 'eudaimonia'],
    keyTakeaways_uz: [
      'Stoitsizm boshqariladigan va boshqarilmaydigan narsani ajratadi.',
      'Logosga mos yashash axloqiy tinchlikni qollab-quvvatlaydi.',
      'Kundalik amaliyot stoik intizomni mustahkamlaydi.',
    ],
    keyTakeaways_en: [
      'Stoicism begins with separating control from non-control.',
      'Living by logos aligns character with rational order.',
      'Daily practices turn Stoic theory into habit.',
    ],
    readingTime: 7,
    timelineYear: -300,
  },
  {
    id: 11,
    slug: 'epicureanism-pleasure-prudence',
    region: 'west',
    school: 'Epicureanism',
    title_uz: 'Epikurizm: Zavq, ehtiyotkorlik va xotirjamlik',
    title_en: 'Epicureanism: Pleasure, Prudence, and Tranquility',
    summary_uz:
      'Epikurizm oqilona tanlov orqali ortiqcha iztirobni kamaytirib, sodda zavq va ruhiy osoyishtalikni maqsad qiladi.',
    summary_en:
      'Epicureanism seeks simple pleasure and calm by prudent choices that minimize unnecessary pain.',
    content_uz: `## Zavq tushunchasi
Epikur uchun eng oliy maqsad cheksiz lazzat emas, balki ogriqning yoqligi va ruhiy bezovtalikning kamayishidir.

## Donolik va tanlov
Har bir istak ortidan quvish emas, balki uzoq muddatli oqibatni hisoblash kerak. Prudensiya bu maktabning markaziy fazilati.

## Dostlik va sodda hayot
Dostlik, xavfsizlik va oddiy hayot tarzi barqaror **ataraxia**ga olib boradi.`,
    content_en: `## Understanding pleasure
Epicurus defines the highest good as freedom from bodily pain and mental disturbance, not endless stimulation.

## Prudence and selection
Desires should be filtered by long-term consequences. Wise restraint often produces more durable satisfaction.

## Friendship and simplicity
Community, safety, and modest living support **ataraxia**, a steady state of tranquility.`,
    concepts: ['ataraxia', 'tetrapharmakos', 'eudaimonia'],
    keyTakeaways_uz: [
      'Epikurizm zavqni ogriq va bezovtalik kamayishi bilan belgilaydi.',
      'Ehtiyotkor tanlov uzoq muddatli xotirjamlik beradi.',
      'Dostlik va sodda hayot ataraxiani qollab-quvvatlaydi.',
    ],
    keyTakeaways_en: [
      'Epicurean pleasure means low pain and low anxiety.',
      'Prudence evaluates desires by long-term outcomes.',
      'Friendship and simplicity stabilize ataraxia.',
    ],
    readingTime: 7,
    timelineYear: -300,
  },
  {
    id: 12,
    slug: 'hellenistic-stoic-epicurean-debate',
    region: 'west',
    school: 'Hellenistic Ethics',
    title_uz: 'Ellinistik bahs: Stoik va Epikur yondashuvlari',
    title_en: 'Hellenistic Debate: Stoic and Epicurean Models',
    summary_uz:
      'Stoitsizm va Epikurizm xotirjamlikka turli yollar bilan erishadi: biri burch va logosni, boshqasi ehtiyotkor zavqni markazga qoyadi.',
    summary_en:
      'Stoicism and Epicureanism pursue tranquility differently: one centers duty and logos, the other prudent pleasure.',
    content_uz: `## Umumiy maqsad
Har ikki maktab ruhiy notinchlikni kamaytirishni maqsad qiladi. Ammo bunga olib boruvchi yol uslubda farqlanadi.

## Stoik urgu
Stoiklar axloqiy burch va ichki intizomni birinchi oringa qoyadi. Tashqi yoqotishlar axloqiy yomonlik emas.

## Epikur urgu
Epikurchilar xavotirni kamaytiradigan oddiy zavq va xavfsiz hayot sharoitini qadrlaydi. Dostlik va ehtiyotkorlik markaziy orinda turadi.`,
    content_en: `## Shared objective
Both schools target freedom from agitation, yet they map different routes toward that end.

## Stoic emphasis
Stoics prioritize duty, rational discipline, and moral resilience even in adverse conditions.

## Epicurean emphasis
Epicureans prioritize prudent pleasure, secure friendships, and reduced fear as practical medicine for the mind.`,
    concepts: ['logos', 'ataraxia', 'apatheia', 'tetrapharmakos'],
    keyTakeaways_uz: [
      'Stoik va Epikur maktablari xotirjamlikni umumiy maqsad deb oladi.',
      'Stoik modelda burch va ichki intizom ustun.',
      'Epikur modelda ehtiyotkor zavq va dostlik ustun.',
    ],
    keyTakeaways_en: [
      'Both schools seek tranquility as a practical goal.',
      'Stoicism foregrounds duty and inner discipline.',
      'Epicureanism foregrounds prudent pleasure and friendship.',
    ],
    readingTime: 6,
    timelineYear: -250,
  },
  {
    id: 13,
    slug: 'mencius-moral-sprouts',
    region: 'east',
    school: 'Confucianism',
    title_uz: 'Mencius: Axloqiy urug`lar va inson tabiati',
    title_en: 'Mencius: Moral Sprouts and Human Nature',
    summary_uz:
      'Mencius inson qalbida tug`ma axloqiy mayllar borligini va ularni tarbiya qilish adolatli jamiyatga olib borishini himoya qiladi.',
    summary_en:
      'Mencius argues that humans possess innate moral sprouts that can be cultivated into just social life.',
    content_uz: `## Tug'ma axloqiy mayllar
Menciusga ko'ra inson qalbida rahm-shafqat, uyat, hurmat va adolat urug'lari mavjud. Bu urug'lar rivojlansa, **ren** va **yi** mustahkamlanadi.

## Tarbiya va siyosat
Davlat zo'ravon jazodan ko'ra axloqiy ta'lim va yaxshi boshqaruv bilan barqaror bo'ladi. Hukmdor xalq ishonchini yo'qotsa, siyosiy legitimlik ham zaiflashadi.

## Ijtimoiy ishonch
**Xin** (ishonchlilik) va adolatli qarorlar jamiyatda uzoq muddatli hamkorlikni kuchaytiradi.`,
    content_en: `## Innate moral tendencies
For Mencius, humans contain moral sprouts: compassion, shame, respect, and a sense of rightness. Cultivation turns these into stable **ren** and **yi**.

## Education and governance
Political order should rely more on moral formation than fear. A ruler who loses public trust loses legitimacy.

## Social trust
**Xin** (trustworthiness) and fair judgment build durable cooperation across the community.`,
    concepts: ['ren', 'yi', 'xin', 'junzi'],
    keyTakeaways_uz: [
      'Mencius insonda tug`ma axloqiy mayllar mavjudligini ta`kidlaydi.',
      'Axloqiy tarbiya davlat barqarorligining muhim sharti hisoblanadi.',
      'Ishonchlilik va adolat jamiyatda uzoq muddatli birlik yaratadi.',
    ],
    keyTakeaways_en: [
      'Mencius defends innate moral tendencies in human nature.',
      'Moral education is central to legitimate governance.',
      'Trust and fairness stabilize social cooperation.',
    ],
    readingTime: 7,
    timelineYear: -350,
  },
  {
    id: 14,
    slug: 'xunzi-ritual-human-nature',
    region: 'east',
    school: 'Confucianism',
    title_uz: 'Xunzi: Inson tabiati, marosim va intizom',
    title_en: 'Xunzi: Human Nature, Ritual, and Discipline',
    summary_uz:
      'Xunzi inson tabiati o`z holicha tartibsizlikka moyil deya, marosim va qonuniy intizom orqali axloqiy tartib qurishni taklif qiladi.',
    summary_en:
      'Xunzi views uncultivated human nature as disorder-prone and emphasizes ritual plus institutional discipline.',
    content_uz: `## Xing e yondashuvi
Xunzi nazariyasida inson tabiati tabiiy ravishda mukammal emas (**xing e**). Shu sabab axloq ijtimoiy mehnat bilan shakllanadi.

## Li va nomlarni to'g'rilash
**Li** marosimi va **zhengming** (nomlarni to'g'rilash) ijtimoiy rollarni ravshanlashtiradi. Til va institut aniq bo'lsa, nizolar kamayadi.

## Tartib va boshqaruv
Xunzi axloqiy ta'limni inkor qilmaydi, lekin uni qonuniy tizim va intizom bilan birga ko'radi.`,
    content_en: `## Xing e framework
Xunzi argues that human nature, left untrained, drifts toward conflict (**xing e**). Ethical order is therefore constructed through practice.

## Ritual and rectification of names
**Li** and **zhengming** clarify roles and responsibilities. Clear language and institutions reduce social friction.

## Governance
Xunzi combines moral education with law-like discipline, treating both as necessary for stability.`,
    concepts: ['li', 'fa', 'xing-e', 'zhengming'],
    keyTakeaways_uz: [
      'Xunzi inson tabiatini tarbiya talab qiladigan holat deb ko`radi.',
      'Li va zhengming ijtimoiy rollarni aniq belgilaydi.',
      'Barqarorlik uchun axloqiy ta`lim va intizom birga ishlaydi.',
    ],
    keyTakeaways_en: [
      'Xunzi treats human nature as needing deliberate cultivation.',
      'Li and zhengming organize social roles clearly.',
      'Order requires both ethical training and discipline.',
    ],
    readingTime: 7,
    timelineYear: -300,
  },
  {
    id: 15,
    slug: 'nagarjuna-emptiness-middle-way',
    region: 'east',
    school: 'Mahayana Buddhism',
    title_uz: 'Nagarjuna: Bo`shliq va O`rta yo`l',
    title_en: 'Nagarjuna: Emptiness and the Middle Way',
    summary_uz:
      'Nagarjuna barcha narsalar o`zidan mustaqil mohiyatga ega emasligini ko`rsatib, o`rta yo`l orqali dogmatizm va inkorni yengadi.',
    summary_en:
      'Nagarjuna shows that things lack independent essence and uses the Middle Way to avoid both absolutism and nihilism.',
    content_uz: `## Sunyata tushunchasi
**Sunyata** narsalarning bo'shligini bildiradi: ular mustaqil emas, sabablar tarmog'ida mavjud. Bu qarash mutlaq yopishishni kamaytiradi.

## O'rta yo'l
Nagarjuna ikki chekkani rad etadi: "hammasi mutlaq bor" va "hammasi mutlaq yo'q". **Middle way** mantiqiy muvozanatni saqlaydi.

## Amaliy oqibat
Bo'shliq nazariyasi rahm-shafqatga zid emas; aksincha, bog'liqlikni chuqurroq ko'rsatadi va axloqiy javobgarlikni kuchaytiradi.`,
    content_en: `## Sunyata
**Sunyata** means emptiness of independent essence. Things exist dependently within causal networks.

## Middle Way
Nagarjuna rejects both extremes: absolute existence and absolute nonexistence. The **Middle Way** preserves analytical balance.

## Practical impact
Emptiness is not moral indifference; it deepens awareness of interdependence and responsibility.`,
    concepts: ['sunyata', 'middle-way', 'dependent-origination', 'karma'],
    keyTakeaways_uz: [
      'Sunyata narsalarning mustaqil mohiyatga ega emasligini bildiradi.',
      'O`rta yo`l ikki ekstrem yondashuvni rad etadi.',
      'Bu qarash rahm-shafqat va javobgarlikni kuchaytiradi.',
    ],
    keyTakeaways_en: [
      'Sunyata denies independent essence in phenomena.',
      'The Middle Way avoids metaphysical extremes.',
      'Interdependence supports compassion and responsibility.',
    ],
    readingTime: 8,
    timelineYear: 150,
  },
  {
    id: 16,
    slug: 'chanakya-arthashastra-statecraft',
    region: 'east',
    school: 'Arthashastra Tradition',
    title_uz: 'Chanakya: Arthashastra va davlat boshqaruvi',
    title_en: 'Chanakya: Arthashastra and Statecraft',
    summary_uz:
      'Chanakya davlat xavfsizligi, iqtisodiy manfaat va strategik boshqaruvni birlashtirgan amaliy siyosiy modelni ishlab chiqqan.',
    summary_en:
      'Chanakya develops a practical model of governance combining security, economic strength, and strategic policy.',
    content_uz: `## Artha markaziyligi
Chanakyaga ko'ra davlatning barqarorligi **artha** - resurs, iqtisod va xavfsizlik boshqaruviga bog'liq.

## Rajadharma va maslahat
Hukmdor burchi (**rajadharma**) faqat buyruq berish emas; to'g'ri maslahatchilarni tanlash, ma'lumot yig'ish va xavfni oldindan baholash ham muhim.

## Dandaniti
**Dandaniti** qonun, jazoni qo'llash va strategik siyosatning uyg'un ishlashini anglatadi.`,
    content_en: `## Priority of artha
For Chanakya, state durability depends on **artha**: resources, revenue, and security management.

## Rajadharma and counsel
Rulership (**rajadharma**) includes selecting competent advisors, gathering intelligence, and planning for risk.

## Dandaniti
**Dandaniti** links law enforcement, deterrence, and strategic policy into one governance framework.`,
    concepts: ['artha', 'rajadharma', 'dandaniti', 'fa'],
    keyTakeaways_uz: [
      'Artha davlatning iqtisodiy va xavfsizlik poydevorini belgilaydi.',
      'Rajadharma hukmdordan strategik mas`uliyat talab qiladi.',
      'Dandaniti siyosat va ijroning muvozanatli birligini yaratadi.',
    ],
    keyTakeaways_en: [
      'Artha anchors material and security foundations of state power.',
      'Rajadharma frames rule as strategic responsibility.',
      'Dandaniti coordinates policy design and enforcement.',
    ],
    readingTime: 7,
    timelineYear: -300,
  },
  {
    id: 17,
    slug: 'cynicism-diogenes-simple-life',
    region: 'west',
    school: 'Cynicism',
    title_uz: 'Kinizm: Diogen va sodda hayot etikasi',
    title_en: 'Cynicism: Diogenes and the Ethics of Simplicity',
    summary_uz:
      'Kinizm ijtimoiy rasmiyatchilikni tanqid qilib, erkinlikni oddiy hayot, ochiq haqiqat va o`ziga yetarlilikda ko`radi.',
    summary_en:
      'Cynicism criticizes social pretension and locates freedom in simplicity, frank speech, and self-sufficiency.',
    content_uz: `## O'ziga yetarlilik
Diogen uchun haqiqiy erkinlik boylikda emas, balki **autarkeia** - minimum ehtiyoj bilan yashash qobiliyatida.

## Parrhesia
Kiniklar hokimiyat va jamoat qarshisida ham ochiq gapirishni (**parrhesia**) axloqiy burch deb biladi.

## Etik tanqid
Kinizm jamiyatning sun'iy status belgilarini fosh etib, hayotni amaliy fazilat orqali baholaydi.`,
    content_en: `## Self-sufficiency
For Diogenes, freedom lies in **autarkeia**: needing little and remaining independent from luxury.

## Parrhesia
Cynics practice **parrhesia**, courageous truth-telling even against social pressure.

## Ethical critique
Cynicism exposes status performance and asks whether life is actually virtuous in practice.`,
    concepts: ['autarkeia', 'parrhesia', 'eudaimonia'],
    keyTakeaways_uz: [
      'Autarkeia kam ehtiyoj bilan erkin yashashni bildiradi.',
      'Parrhesia bosim ostida ham haqiqatni aytish jasoratidir.',
      'Kinizm sun`iy ijtimoiy niqoblarni tanqid qiladi.',
    ],
    keyTakeaways_en: [
      'Autarkeia defines freedom through minimal dependence.',
      'Parrhesia is courageous truth-telling.',
      'Cynicism targets performative social values.',
    ],
    readingTime: 6,
    timelineYear: -400,
  },
  {
    id: 18,
    slug: 'neoplatonism-plotinus-the-one',
    region: 'west',
    school: 'Neoplatonism',
    title_uz: 'Neoplatonizm: Plotinus va Yagona manba',
    title_en: 'Neoplatonism: Plotinus and The One',
    summary_uz:
      'Plotinus borliqni Yagona manbadan nurlanish orqali tushuntirib, aqliy va ruhiy yuksalishni falsafiy-amaliy yo`l sifatida ko`rsatadi.',
    summary_en:
      'Plotinus explains reality as emanation from The One and frames ascent of intellect and soul as a practical path.',
    content_uz: `## The One
Plotinusda barcha borliqning ildizi **The One** - tasvirlab bo'lmaydigan mutlaq manba.

## Emanatsiya tartibi
Borliq bosqichma-bosqich **emanation** orqali ochiladi: One -> Nous -> Soul -> material dunyo.

## Ruhiy yuksalish
Falsafa faqat nazariya emas; ichki poklanish va diqqat orqali yuqori birlik tajribasiga qaytish yo'lidir.`,
    content_en: `## The One
For Plotinus, reality originates in **The One**, beyond conceptual division.

## Emanation
Being unfolds by **emanation**: One -> Nous -> Soul -> the material realm.

## Ascent
Philosophy becomes practice: disciplined attention returns the self toward higher unity.`,
    concepts: ['the-one', 'emanation', 'nous'],
    keyTakeaways_uz: [
      'The One neoplatonik metafizikaning markaziy manbai hisoblanadi.',
      'Emanatsiya borliqni bosqichli tuzilma sifatida tushuntiradi.',
      'Ruhiy yuksalish falsafani amaliy yo`lga aylantiradi.',
    ],
    keyTakeaways_en: [
      'The One is the central source in Neoplatonic metaphysics.',
      'Emanation explains a layered structure of reality.',
      'Philosophical ascent links theory with inner discipline.',
    ],
    readingTime: 7,
    timelineYear: 250,
  },
  {
    id: 19,
    slug: 'al-farabi-virtuous-city',
    region: 'east',
    school: 'Islamic Philosophy',
    title_uz: 'Al-Farobiy: Fozil shahar va aqlli jamiyat',
    title_en: 'Al-Farabi: The Virtuous City and Rational Society',
    summary_uz:
      'Al-Farobiy axloq, siyosat va bilimni birlashtirib, fozil jamiyat rahbarligi ilm, adolat va hikmatga tayanishi kerakligini asoslaydi.',
    summary_en:
      'Al-Farabi links ethics, politics, and knowledge, arguing that a virtuous society must be led by reason, justice, and wisdom.',
    content_uz: `## Fozil shahar modeli
Al-Farobiy "fozil shahar" g'oyasida jamiyatning maqsadi umumiy saodat ekanini ko'rsatadi. Bunda rahbar ilmli va axloqli bo'lishi lozim.

## Aql va siyosat
Unga ko'ra siyosiy tartib tasodifiy emas: **burhan** (isbotli dalil) bilan tekshirilgan bilim boshqaruvning poydevori bo'ladi.

## Hikmat va tarbiya
Fozil jamiyat faqat qonun bilan emas, balki **hikma** va tarbiya tizimi bilan barqaror bo'ladi.`,
    content_en: `## Virtuous city
In Al-Farabi's model, the purpose of political life is shared flourishing. Leadership must combine intellect and moral character.

## Reason and governance
Political order should be grounded in demonstrated knowledge (**burhan**), not impulse or factional interest.

## Wisdom and formation
Durable civic order depends on education in **hikma** and ethical discipline, not coercion alone.`,
    concepts: ['falsafa', 'hikma', 'burhan', 'virtuous-city'],
    keyTakeaways_uz: [
      'Fozil shahar modeli jamiyat maqsadini umumiy saodatga bog`laydi.',
      'Siyosiy boshqaruv aql va isbotlangan bilimga tayanishi kerak.',
      'Tarbiya va hikmat jamiyat barqarorligining asosiy omilidir.',
    ],
    keyTakeaways_en: [
      'The virtuous city frames politics around shared flourishing.',
      'Governance should rely on reason and demonstrative proof.',
      'Education in wisdom stabilizes social order.',
    ],
    readingTime: 8,
    timelineYear: 930,
  },
  {
    id: 20,
    slug: 'ibn-sina-reason-and-medicine',
    region: 'east',
    school: 'Islamic Philosophy',
    title_uz: 'Ibn Sino: Aql, mavjudot va tibb-falsafa birligi',
    title_en: 'Ibn Sina: Reason, Being, and the Unity of Medicine and Philosophy',
    summary_uz:
      'Ibn Sino mantiqiy tafakkur, metafizika va tibbni yagona ilmiy dunyoqarashda birlashtirib, nazariya va amaliyotni uyg`unlashtirgan.',
    summary_en:
      'Ibn Sina unifies logic, metaphysics, and medicine into a single intellectual framework linking theory and practice.',
    content_uz: `## Aqliy tizim
Ibn Sino bilishni tartibli mantiq bilan quradi: aniq tushuncha, dalil va xulosa ketma-ketligi orqali xato kamayadi.

## Mavjudot tahlili
U "mumkin" va "zarur" mavjudot farqini kiritib, borliqni falsafiy tahlil qilish uchun kuchli model beradi.

## Tibb va falsafa
**Tibb-falsafa** birligi Ibn Sinoda amaliy ahamiyatga ega: nazariy bilim inson salomatligi va axloqiy hayotda qo'llanadi.`,
    content_en: `## Rational architecture
Ibn Sina structures knowledge through disciplined logic: clear concepts, proof, and conclusion.

## Analysis of being
His distinction between contingent and necessary being shaped later metaphysical debates.

## Medicine and philosophy
For Ibn Sina, **tibb-falsafa** is practical: rigorous theory should improve health, judgment, and human life.`,
    concepts: ['burhan', 'ilm', 'tibb-falsafa', 'falsafa'],
    keyTakeaways_uz: [
      'Ibn Sino mantiqiy metodni markaziy bilish usuli sifatida rivojlantiradi.',
      'Zarur va mumkin mavjudot farqi metafizikani chuqurlashtiradi.',
      'Tibb va falsafa uyg`unligi nazariya-amaliyot birligini yaratadi.',
    ],
    keyTakeaways_en: [
      'Ibn Sina builds a rigorous logical method for inquiry.',
      'Necessary vs contingent being deepens metaphysical analysis.',
      'Medicine and philosophy are integrated in practical reasoning.',
    ],
    readingTime: 9,
    timelineYear: 1020,
  },
  {
    id: 21,
    slug: 'al-biruni-comparative-knowledge',
    region: 'east',
    school: 'Islamic Philosophy',
    title_uz: 'Al-Beruniy: Qiyosiy bilish va tanqidiy kuzatuv',
    title_en: 'Al-Biruni: Comparative Knowledge and Critical Observation',
    summary_uz:
      'Al-Beruniy turli madaniyat va ilmiy qarashlarni qiyosiy usulda o`rganib, kuzatuv, tekshiruv va adolatli tahlil tamoyillarini mustahkamlagan.',
    summary_en:
      'Al-Biruni compares cultures and scientific views through observation, verification, and fair analytical method.',
    content_uz: `## Qiyosiy metod
Al-Beruniy bir qarashni mutlaq deb qabul qilmaydi. **Comparative method** turli manbalarni solishtirib xulosa chiqarishni talab qiladi.

## Kuzatuv va tekshiruv
U empirik kuzatuvni nazariy fikr bilan bog'laydi. **Critical observation** orqali xato taxminlar aniqlanadi.

## Ilmiy xolislik
Bahsli masalalarda adolatli yondashuv va manba tanqidi ilmiy ishonchlilikni oshiradi.`,
    content_en: `## Comparative method
Al-Biruni avoids single-perspective certainty and compares sources before concluding.

## Observation and verification
He combines empirical work with conceptual analysis. **Critical observation** tests assumptions against evidence.

## Intellectual fairness
Source criticism and methodological fairness are central to reliable scholarship.`,
    concepts: ['comparative-method', 'critical-observation', 'ilm', 'falsafa'],
    keyTakeaways_uz: [
      'Qiyosiy usul biryoqlama xulosalardan saqlaydi.',
      'Kuzatuv va tekshiruv ilmiy ishonchlilikni oshiradi.',
      'Xolis manba tanqidi bilish sifatini kuchaytiradi.',
    ],
    keyTakeaways_en: [
      'Comparative analysis prevents one-sided conclusions.',
      'Observation plus verification increases reliability.',
      'Fair source criticism strengthens knowledge quality.',
    ],
    readingTime: 8,
    timelineYear: 1030,
  },
  {
    id: 22,
    slug: 'al-khwarizmi-algorithmic-reason',
    region: 'east',
    school: 'Islamic Scientific Thought',
    title_uz: 'Al-Xorazmiy: Algoritmik tafakkur va ilm tartibi',
    title_en: 'Al-Khwarizmi: Algorithmic Reason and Order of Knowledge',
    summary_uz:
      'Al-Xorazmiy masalalarni bosqichma-bosqich yechish usulini rivojlantirib, algoritmik tafakkur orqali ilmiy aniqlikni kuchaytirgan.',
    summary_en:
      'Al-Khwarizmi develops stepwise problem-solving methods, strengthening scientific precision through algorithmic reasoning.',
    content_uz: `## Algoritmik fikrlash
Al-Xorazmiy yondashuvida murakkab muammo oddiy bosqichlarga ajratiladi. Bu **algorithmic reason** natijaning takrorlanuvchanligini oshiradi.

## Hisob va dalil
Matematik tartib faqat hisob uchun emas, balki fikrni intizomga keltirish uchun ham xizmat qiladi.

## Ilmiy meros
Uning metodlari keyingi fan va texnologiya tafakkuriga poydevor bo'lib qolgan.`,
    content_en: `## Algorithmic thinking
Al-Khwarizmi models problem solving as ordered steps, making reasoning repeatable and testable.

## Calculation and proof
Mathematical discipline supports both computation and logical rigor in argument.

## Legacy
His methods shaped later scientific and technical reasoning across cultures.`,
    concepts: ['algorithmic-reason', 'ilm', 'burhan', 'critical-observation'],
    keyTakeaways_uz: [
      'Algoritmik yondashuv murakkab muammoni boshqariladigan bosqichlarga bo`ladi.',
      'Matematik intizom fikr aniqligi va dalillashni kuchaytiradi.',
      'Al-Xorazmiy merosi zamonaviy ilmiy tafakkurga ta`sir qilgan.',
    ],
    keyTakeaways_en: [
      'Algorithmic method makes complex reasoning manageable.',
      'Mathematical discipline improves clarity and proof quality.',
      'Al-Khwarizmi significantly influenced scientific thinking.',
    ],
    readingTime: 7,
    timelineYear: 830,
  },
  {
    id: 23,
    slug: 'alisher-navoi-ethics-and-language',
    region: 'east',
    school: 'Humanistic Ethics',
    title_uz: 'Alisher Navoiy: Til, adab va axloqiy kamolot',
    title_en: 'Alisher Navoiy: Language, Adab, and Ethical Refinement',
    summary_uz:
      "Alisher Navoiy adab, ma'naviyat va ijtimoiy mas'uliyatni badiiy-falsafiy yondashuvda birlashtirib, inson kamolotini markazga qo'yadi.",
    summary_en:
      'Alisher Navoiy unites adab, spirituality, and social responsibility in a literary-philosophical vision of human refinement.',
    content_uz: `## Adab va ma'naviyat
Navoiy uchun **adab** faqat odob emas; u til, xulq va jamiyat oldidagi mas'uliyat birligidir.

## Tilning falsafiy roli
U so'zning tarbiyaviy kuchini yuksak baholaydi. To'g'ri til inson qalbi va ijtimoiy muhitni yaxshilaydi.

## Inson kamoloti
Navoiy merosida axloqiy kamolot, mehr-shafqat va adolatli muomala asosiy yo'nalish hisoblanadi.`,
    content_en: `## Adab and spiritual culture
For Navoiy, **adab** is more than etiquette; it is an ethical culture of speech, character, and responsibility.

## Philosophical role of language
He treats language as formative power: words shape inner life and public order.

## Human refinement
Compassion, justice, and disciplined character define the path of maturation.`,
    concepts: ['adab', 'hikma', 'nafs-discipline', 'falsafa'],
    keyTakeaways_uz: [
      "Navoiy adabni axloqiy va ijtimoiy mas'uliyat tizimi sifatida ko'radi.",
      "Til tarbiya va jamiyat sifatiga bevosita ta'sir qiladi.",
      'Mehr-shafqat va adolat inson kamolotining markazida turadi.',
    ],
    keyTakeaways_en: [
      'Navoiy frames adab as ethical-social responsibility.',
      'Language is a formative force in moral life.',
      'Compassion and justice drive human refinement.',
    ],
    readingTime: 8,
    timelineYear: 1480,
  },
  {
    id: 24,
    slug: 'maturidi-reason-faith-balance',
    region: 'east',
    school: 'Kalam Tradition',
    title_uz: "Moturidiy: Aql va e'tiqod muvozanati",
    title_en: 'Al-Maturidi: Balance of Reason and Faith',
    summary_uz:
      "Imom Moturidiy diniy e'tiqod va aqliy dalil o'rtasida muvozanat o'rnatib, mas'uliyatli axloqiy tanlovni asoslaydi.",
    summary_en:
      'Imam al-Maturidi establishes a balance between faith and rational inquiry, grounding responsible moral choice.',
    content_uz: `## Aqlning o'rni
Moturidiy inson aqli haqiqatni izlashda faol vosita ekanini ta'kidlaydi. E'tiqod va tafakkur qarama-qarshi emas.

## E'tiqod va mas'uliyat
Axloqiy javobgarlik ongli tanlov bilan bog'liq. Inson bilimi va niyati amaliy qarorlar sifatini belgilaydi.

## Muvozanat modeli
**Reason-faith balance** jamiyatda bag'rikenglik va muloqot madaniyatini mustahkamlaydi.`,
    content_en: `## Role of reason
Al-Maturidi treats reason as an active instrument in seeking truth; faith and reflection are complementary.

## Responsibility and belief
Moral accountability depends on conscious judgment, intention, and informed choice.

## Balanced framework
The **reason-faith balance** supports tolerance and durable dialogue in society.`,
    concepts: ['reason-faith-balance', 'burhan', 'nafs-discipline', 'adab'],
    keyTakeaways_uz: [
      "Moturidiy aql va e'tiqodni o'zaro to'ldiruvchi kuchlar sifatida ko'rsatadi.",
      "Mas'uliyatli axloqiy tanlov bilim va niyatga tayanadi.",
      "Muvozanatli yondashuv bag'rikeng muloqotni kuchaytiradi.",
    ],
    keyTakeaways_en: [
      'Al-Maturidi presents reason and faith as complementary.',
      'Moral responsibility depends on informed intention.',
      'Balanced inquiry strengthens social tolerance and dialogue.',
    ],
    readingTime: 8,
    timelineYear: 940,
  },
  {
    id: 25,
    slug: 'ulugh-beg-observatory-method',
    region: 'east',
    school: 'Timurid Scientific Thought',
    title_uz: "Ulug'bek: Rasadxona metodi va aniqlik madaniyati",
    title_en: 'Ulugh Beg: Observatory Method and the Culture of Precision',
    summary_uz:
      "Ulug'bek Samarqand rasadxonasida kuzatuv, hisob va tekshiruvni birlashtirib, ilmiy aniqlikning yuqori standartini yaratgan.",
    summary_en:
      'Ulugh Beg integrated observation, calculation, and verification in the Samarqand observatory, setting a high standard of scientific precision.',
    content_uz: `## Rasadxona va aniq kuzatuv
Ulug'bek ilmiy tadqiqotni rasadxona amaliyoti bilan bog'laydi. Yulduzlar harakati uzoq muddatli kuzatuv orqali qayd etiladi va natija qayta tekshiriladi.

## Hisob va jadval intizomi
Kuzatuv ma'lumotlari matematik tahlil bilan mustahkamlanadi. Hisob-kitob va jadval metodlari ilmiy xulosa aniqligini oshiradi.

## Bilim madaniyati
Bu yondashuvda ilm faqat nazariya emas, balki jamoaviy mehnat, asbob aniqligi va metod intizomi orqali shakllanadi.`,
    content_en: `## Observatory discipline
Ulugh Beg ties scientific inquiry to observatory practice. Astronomical motion is tracked through sustained observation and repeated checks.

## Calculation and tables
Empirical data is strengthened by mathematical analysis. Structured tables and calculation routines improve reliability of conclusions.

## Culture of knowledge
In this model, knowledge is not abstract alone; it is produced through teamwork, instruments, and methodological discipline.`,
    concepts: ['observatory-method', 'critical-observation', 'ilm', 'algorithmic-reason'],
    keyTakeaways_uz: [
      "Ulug'bek metodi kuzatuv, hisob va tekshiruv birligiga tayangan.",
      "Rasadxona amaliyoti ilmiy aniqlik standartini oshirgan.",
      "Ilmiy natija metod intizomi va qayta tekshiruv bilan mustahkamlanadi.",
    ],
    keyTakeaways_en: [
      'Ulugh Beg unifies observation, calculation, and verification.',
      'Observatory practice raises standards of scientific precision.',
      'Reliable findings require method discipline and repeat checks.',
    ],
    readingTime: 8,
    timelineYear: 1430,
  },
  {
    id: 26,
    slug: 'al-ghazali-ethics-and-certainty',
    region: 'east',
    school: 'Islamic Ethics and Theology',
    title_uz: "Al-G'azzoliy: Ishonch, shubha va axloqiy poklanish",
    title_en: 'Al-Ghazali: Certainty, Doubt, and Ethical Purification',
    summary_uz:
      "Al-G'azzoliy shubhani inkor etmay, uni chuqurroq ishonchga olib boruvchi bosqich sifatida talqin qiladi va axloqiy o'zgarishni markazga qo'yadi.",
    summary_en:
      'Al-Ghazali does not dismiss doubt; he treats it as a stage toward deeper certainty while centering ethical transformation.',
    content_uz: `## Shubha va aniqlik
Al-G'azzoliy bilishda shubha bosqichini tan oladi. Unga ko'ra tanqidiy tekshiruv xatoni kamaytirib, mustahkam ishonchga olib boradi.

## Nafs tarbiyasi
Axloqiy yuksalish faqat nazariy bilim bilan cheklanmaydi. Nafsni tarbiyalash, odatni tuzatish va ichki intizom markaziy ahamiyatga ega.

## Aql va e'tiqod
U aql va e'tiqodni bir-biriga qarshi qo'ymaydi. Muvozanatli yondashuvda tafakkur ham, ruhiy-amaliy poklanish ham zarur hisoblanadi.`,
    content_en: `## Doubt and certainty
Al-Ghazali acknowledges doubt as part of inquiry. Critical testing can reduce error and open the way to stronger conviction.

## Discipline of the self
Ethical growth is not theory alone. Training desire, repairing habits, and sustained inner discipline are essential.

## Reason and faith
He does not frame reason and faith as enemies. Durable understanding requires both reflection and spiritual practice.`,
    concepts: ['certainty-doubt', 'spiritual-discipline', 'reason-faith-balance', 'nafs-discipline'],
    keyTakeaways_uz: [
      "Shubha Al-G'azzoliyda bilishni chuqurlashtiruvchi bosqich sifatida ko'rinadi.",
      "Axloqiy o'zgarish nafs tarbiyasi va odatni tuzatishni talab qiladi.",
      "Aql va e'tiqod muvozanati barqaror qaror sifatini oshiradi.",
    ],
    keyTakeaways_en: [
      'For Al-Ghazali, doubt can deepen inquiry when disciplined.',
      'Ethical change requires self-training, not ideas alone.',
      'Balanced reason and faith improve the quality of judgment.',
    ],
    readingTime: 8,
    timelineYear: 1090,
  },
  {
    id: 27,
    slug: 'rumi-ethical-love-and-self',
    region: 'east',
    school: 'Sufi Humanism',
    title_uz: 'Rumiy: Muhabbat etikasi va ichki ozgarish',
    title_en: 'Rumi: Ethical Love and Inner Transformation',
    summary_uz:
      "Rumiy muhabbatni faqat hissiy holat emas, balki axloqiy poklanish va boshqaga mehr bilan munosabat quruvchi amaliy yo'l deb ko'radi.",
    summary_en:
      'Rumi treats love not as mere emotion but as a practical path of ethical purification and compassionate relation to others.',
    content_uz: `## Muhabbatning axloqiy manosi
Rumiyda muhabbat ichki o'zgarish kuchi hisoblanadi. U insonni manmanlikdan uzoqlashtirib, boshqaga nisbatan adolat va mehrni kuchaytiradi.

## Ozlikni tarbiyalash
Ichki tarbiya, sabr va xotirjamlik ruhiy yetilishning asosiy yo'nalishi sifatida ko'rsatiladi. Bu yondashuv ijtimoiy muloqotni ham yumshatadi.

## Adab va jamiyat
Rumiy adabni ruhiy noziklik bilan bog'laydi: so'z, xulq va niyat uyg'un bo'lsa, jamiyatdagi ishonch mustahkamlanadi.`,
    content_en: `## Ethical meaning of love
For Rumi, love is a force of transformation. It reduces ego-centeredness and strengthens justice and compassion in human relations.

## Training the self
Patience, composure, and inner discipline are central to maturation. This orientation also softens social conflict.

## Adab in society
Rumi links adab to refined intention, speech, and conduct. When these align, trust in community grows.`,
    concepts: ['ethical-love', 'adab', 'spiritual-discipline', 'nafs-discipline'],
    keyTakeaways_uz: [
      "Rumiy muhabbatni axloqiy o'zgarishning amaliy quvvati sifatida talqin qiladi.",
      "Ichki intizom va sabr komil xulqni shakllantiradi.",
      "Adab va mehr ijtimoiy ishonchni kuchaytiradi.",
    ],
    keyTakeaways_en: [
      'Rumi frames love as practical ethical transformation.',
      'Inner discipline and patience shape mature character.',
      'Adab and compassion reinforce social trust.',
    ],
    readingTime: 7,
    timelineYear: 1260,
  },
  {
    id: 28,
    slug: 'ibn-rushd-commentary-and-reason',
    region: 'east',
    school: 'Andalusian Philosophy',
    title_uz: 'Ibn Rushd: Sharh ananasi va isbotiy aql',
    title_en: 'Ibn Rushd: Commentary Tradition and Demonstrative Reason',
    summary_uz:
      "Ibn Rushd matnlarni chuqur sharhlash va isbotiy tahlil orqali falsafiy aniqfikrlilikni kuchaytirib, aqlning ijtimoiy ahamiyatini himoya qilgan.",
    summary_en:
      'Ibn Rushd strengthens philosophical clarity through rigorous commentary and demonstrative reasoning, defending the social importance of reason.',
    content_uz: `## Sharh metodologiyasi
Ibn Rushd murakkab matnlarni izchil sharhlash orqali tushunchalar aniqligini oshiradi. Sharh faqat takrorlash emas, balki mantiqiy rekonstruksiya hisoblanadi.

## Isbotiy aql
U dalilga asoslangan fikrni ustuvor deb biladi. Isbotiy tafakkur nazariy bahsni aniq mezonlar bilan tartibga soladi.

## Falsafa va jamiyat
Ibn Rushdga ko'ra aqlning ommaviy qadri bor: ilmiy va huquqiy qarorlar imkon qadar dalillangan mulohazaga tayanishi kerak.`,
    content_en: `## Commentary as method
Ibn Rushd uses disciplined commentary to clarify difficult texts. Commentary is not repetition; it is logical reconstruction.

## Demonstrative reason
He prioritizes argument grounded in proof. Demonstrative method gives shared criteria for philosophical disagreement.

## Reason in society
For Ibn Rushd, reason has public value: legal and intellectual judgment should lean on evidence-based thinking.`,
    concepts: ['commentary-tradition', 'demonstrative-reason', 'burhan', 'falsafa'],
    keyTakeaways_uz: [
      "Ibn Rushd sharhni mantiqiy aniqlashtirish vositasi sifatida rivojlantiradi.",
      "Isbotiy aql bahsni mezonli va tekshiriladigan qiladi.",
      "Dalilga tayangan tafakkur ijtimoiy qaror sifatini oshiradi.",
    ],
    keyTakeaways_en: [
      'Ibn Rushd develops commentary as a tool of logical clarification.',
      'Demonstrative reason makes debate testable and precise.',
      'Evidence-based thinking improves public judgment quality.',
    ],
    readingTime: 8,
    timelineYear: 1180,
  },
];





