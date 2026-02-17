export type Question = {
  id: string;
  lang: 'uz' | 'en';
  type: 'mcq' | 'tf' | 'short';
  prompt: string;
  options?: string[];
  answer: string | boolean;
  acceptedAnswers?: string[];
  source: { articleSlug?: string; section?: string };
  explanationContext?: string;
};

export const quizzes: Question[] = [
  {
    id: 'en-1',
    lang: 'en',
    type: 'mcq',
    prompt: 'Which concept in Confucianism refers to humaneness and moral concern for others?',
    options: ['Wu wei', 'Ren', 'Fa', 'Ataraxia'],
    answer: 'Ren',
    source: { articleSlug: 'confucianism-ritual-ethics', section: 'Core orientation' },
    explanationContext:
      'Confucianism links ren (humaneness) with moral character and social harmony, alongside li (ritual propriety).',
  },
  {
    id: 'en-2',
    lang: 'en',
    type: 'tf',
    prompt: 'True or False: Daoist wu wei means forcing outcomes through strict control.',
    answer: false,
    source: { articleSlug: 'daoism-natural-harmony', section: 'Principle of wu wei' },
    explanationContext:
      'Wu wei is action without unnecessary force, aligned with natural flow rather than rigid control.',
  },
  {
    id: 'en-3',
    lang: 'en',
    type: 'short',
    prompt: 'Name the Buddhist framework that begins with suffering, its cause, cessation, and the path.',
    answer: 'Four Noble Truths',
    acceptedAnswers: ['the four noble truths', 'four truths', 'noble truths'],
    source: { articleSlug: 'buddhism-path-liberation', section: 'Four Noble Truths' },
    explanationContext:
      'Buddhist teaching starts with the Four Noble Truths as a diagnosis-and-path model for suffering.',
  },
  {
    id: 'en-4',
    lang: 'en',
    type: 'mcq',
    prompt: 'In Legalism, what term names clear, consistently enforced law?',
    options: ['Fa', 'Ren', 'De', 'Logos'],
    answer: 'Fa',
    source: { articleSlug: 'legalism-state-order', section: 'Primacy of law' },
    explanationContext:
      'Legalism emphasizes fa as explicit standards applied uniformly to maintain order and predictability.',
  },
  {
    id: 'en-5',
    lang: 'en',
    type: 'mcq',
    prompt: 'Who is most associated with the method of elenchus?',
    options: ['Epicurus', 'Socrates', 'Aristotle', 'Confucius'],
    answer: 'Socrates',
    source: { articleSlug: 'socrates-examined-life', section: 'Method of elenchus' },
    explanationContext:
      'Socratic elenchus tests beliefs through questioning and reveals contradictions as a path to clarity.',
  },
  {
    id: 'en-6',
    lang: 'en',
    type: 'tf',
    prompt: 'True or False: Plato taught that knowledge is only about changing sensory appearances.',
    answer: false,
    source: { articleSlug: 'plato-forms-justice', section: 'Theory of Forms' },
    explanationContext:
      'Plato contrasts changing appearances with stable Forms, which ground durable knowledge.',
  },
  {
    id: 'en-7',
    lang: 'en',
    type: 'short',
    prompt: 'What is Aristotle\'s term for flourishing as the highest human good?',
    answer: 'Eudaimonia',
    acceptedAnswers: ['eudaimonia', 'flourishing'],
    source: { articleSlug: 'aristotle-virtue-reason', section: 'Eudaimonia' },
    explanationContext:
      'Aristotle presents eudaimonia as long-term flourishing through excellent and rational activity.',
  },
  {
    id: 'en-8',
    lang: 'en',
    type: 'mcq',
    prompt: 'Stoicism begins by distinguishing what?',
    options: ['Forms and matter', 'Control and non-control', 'Pleasure and pain', 'Law and ritual'],
    answer: 'Control and non-control',
    source: { articleSlug: 'stoicism-inner-freedom', section: 'Control distinction' },
    explanationContext:
      'Stoic practice centers on what depends on us (judgment, choice) versus what does not.',
  },
  {
    id: 'en-9',
    lang: 'en',
    type: 'short',
    prompt: 'In Epicureanism, what word describes freedom from mental disturbance?',
    answer: 'Ataraxia',
    acceptedAnswers: ['ataraxia'],
    source: { articleSlug: 'epicureanism-pleasure-prudence', section: 'Friendship and simplicity' },
    explanationContext:
      'Epicurean ethics seeks ataraxia through prudent choices, modest living, and stable friendships.',
  },
  {
    id: 'en-10',
    lang: 'en',
    type: 'tf',
    prompt: 'True or False: Mohism defends impartial concern for all people.',
    answer: true,
    source: { articleSlug: 'mohism-universal-care', section: 'Principle of jian ai' },
    explanationContext:
      'Mozi\'s jian ai promotes universal care beyond clan favoritism and partial loyalty.',
  },
  {
    id: 'uz-1',
    lang: 'uz',
    type: 'mcq',
    prompt: 'Konfutsiychilikda marosimiy tartibni ifodalovchi tushuncha qaysi?',
    options: ['Li', 'Logos', 'Apatheia', 'Fa'],
    answer: 'Li',
    source: { articleSlug: 'confucianism-ritual-ethics', section: 'Asosiy yonalish' },
    explanationContext:
      'Li Konfutsiychilikda odob va ijtimoiy tartibni amaliy marosimlar orqali mustahkamlaydi.',
  },
  {
    id: 'uz-2',
    lang: 'uz',
    type: 'tf',
    prompt: 'Togri yoki notogri: Daochilik tabiatga qarshi zoravon bosimni maqullaydi.',
    answer: false,
    source: { articleSlug: 'daoism-natural-harmony', section: 'Wu wei tamoyili' },
    explanationContext:
      'Daochilik wu wei orqali ortiqcha bosimsiz, holatga mos harakatni tavsiya qiladi.',
  },
  {
    id: 'uz-3',
    lang: 'uz',
    type: 'short',
    prompt: 'Buddaviylikdagi azob va uning yechimini tushuntiruvchi tortlik tizim nomi nima?',
    answer: 'Tort oliy haqiqat',
    acceptedAnswers: ['to`rt oliy haqiqat', 'tort oliy haqiqat', 'four noble truths'],
    source: { articleSlug: 'buddhism-path-liberation', section: 'Tort oliy haqiqat' },
    explanationContext:
      'To`rt oliy haqiqat buddaviylikda muammo-sabab-yechim-yo`l tartibida tushuntiriladi.',
  },
  {
    id: 'uz-4',
    lang: 'uz',
    type: 'mcq',
    prompt: 'Legizmda lavozim kuchi tushunchasi qaysi atama bilan beriladi?',
    options: ['Shi', 'Ren', 'Junzi', 'Ataraxia'],
    answer: 'Shi',
    source: { articleSlug: 'legalism-state-order', section: 'Boshqaruv texnikasi' },
    explanationContext:
      'Shi hokimiyatning shaxsiy fazilatdan ko`ra mansab pozitsiyasidan kelishini bildiradi.',
  },
  {
    id: 'uz-5',
    lang: 'uz',
    type: 'mcq',
    prompt: 'Sokratik savol-javob usuli qanday ataladi?',
    options: ['Elenxus', 'Tetrafarmakos', 'Anekantavada', 'Wu wei'],
    answer: 'Elenxus',
    source: { articleSlug: 'socrates-examined-life', section: 'Elenxus usuli' },
    explanationContext:
      'Elenxus ziddiyatlarni ochib, da`volarni mantiqiy tekshirishga xizmat qiladi.',
  },
  {
    id: 'uz-6',
    lang: 'uz',
    type: 'tf',
    prompt: 'Togri yoki notogri: Platonda adolat ruh va davlatdagi vazifalar uyg`unligi sifatida talqin qilinadi.',
    answer: true,
    source: { articleSlug: 'plato-forms-justice', section: 'Adolat tushunchasi' },
    explanationContext:
      'Platon adolatni har bir qism o`z vazifasini to`g`ri bajaradigan uyg`unlik deb tasvirlaydi.',
  },
  {
    id: 'uz-7',
    lang: 'uz',
    type: 'short',
    prompt: 'Arastuda fazilatning ikki og`ish oraligidagi meyoriy modeli nima deyiladi?',
    answer: 'Oltin ortalik',
    acceptedAnswers: ['oltin ortalik', 'golden mean'],
    source: { articleSlug: 'aristotle-virtue-reason', section: 'Oltin ortalik' },
    explanationContext:
      'Oltin ortalik fazilatni haddan oshish va yetishmovchilik o`rtasidagi muvozanat sifatida ko`rsatadi.',
  },
  {
    id: 'uz-8',
    lang: 'uz',
    type: 'mcq',
    prompt: 'Stoitsizmda koinotdagi oqilona tartib qaysi atama bilan ifodalanadi?',
    options: ['Logos', 'Li', 'Jian ai', 'Aparigraha'],
    answer: 'Logos',
    source: { articleSlug: 'stoicism-inner-freedom', section: 'Logos va tabiat' },
    explanationContext:
      'Stoiklar logosni borliqdagi ratsional tartib deb biladi va unga mos yashashni tavsiya qiladi.',
  },
  {
    id: 'uz-9',
    lang: 'uz',
    type: 'short',
    prompt: 'Epikurizmda ruhiy bezovtalikdan xoli holat qanday nomlanadi?',
    answer: 'Ataraxia',
    acceptedAnswers: ['ataraxia', 'ataraksiya'],
    source: { articleSlug: 'epicureanism-pleasure-prudence', section: 'Dostlik va sodda hayot' },
    explanationContext:
      'Epikuriylar ataraxiyani ehtiyotkor tanlov, dostlik va sodda hayot bilan bog`laydi.',
  },
  {
    id: 'uz-10',
    lang: 'uz',
    type: 'tf',
    prompt: 'Togri yoki notogri: Jaynizmda ahimsa fikr, soz va amalda zoravonlikdan tiyilishni talab qiladi.',
    answer: true,
    source: { articleSlug: 'jainism-nonviolence-truth', section: 'Ahimsa markaziyligi' },
    explanationContext:
      'Jayn axloqida ahimsa barcha tirik mavjudotlarga nisbatan zarar yetkazmaslik tamoyilidir.',
  },
];

export function getQuestionsByLang(lang: 'uz' | 'en') {
  return quizzes.filter((item) => item.lang === lang);
}
