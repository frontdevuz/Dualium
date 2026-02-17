import type { Region } from '../data';

type SlideItem = {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  region: Region | 'mixed';
};

const GLOBAL_VISUALS = [
  '/visuals/east-harmony.svg',
  '/visuals/east-meditation.svg',
  '/visuals/west-agora.svg',
  '/visuals/west-stoa.svg',
  '/visuals/duality-bridge.svg',
  '/visuals/knowledge-scroll.svg',
];

const ARTICLE_VISUALS: Record<string, string> = {
  'confucianism-ritual-ethics': '/covers/confucianism-ritual-ethics.svg',
  'daoism-natural-harmony': '/covers/daoism-natural-harmony.svg',
  'legalism-state-order': '/covers/legalism-state-order.svg',
  'mohism-universal-care': '/covers/mohism-universal-care.svg',
  'buddhism-path-liberation': '/covers/buddhism-path-liberation.svg',
  'jainism-nonviolence-truth': '/covers/jainism-nonviolence-truth.svg',
  'socrates-examined-life': '/covers/socrates-examined-life.svg',
  'plato-forms-justice': '/covers/plato-forms-justice.svg',
  'aristotle-virtue-reason': '/covers/aristotle-virtue-reason.svg',
  'stoicism-inner-freedom': '/covers/stoicism-inner-freedom.svg',
  'epicureanism-pleasure-prudence': '/covers/epicureanism-pleasure-prudence.svg',
  'hellenistic-stoic-epicurean-debate': '/covers/hellenistic-stoic-epicurean-debate.svg',
  'mencius-moral-sprouts': '/covers/mencius-moral-sprouts.svg',
  'xunzi-ritual-human-nature': '/covers/xunzi-ritual-human-nature.svg',
  'nagarjuna-emptiness-middle-way': '/covers/nagarjuna-emptiness-middle-way.svg',
  'chanakya-arthashastra-statecraft': '/covers/chanakya-arthashastra-statecraft.svg',
  'cynicism-diogenes-simple-life': '/covers/cynicism-diogenes-simple-life.svg',
  'neoplatonism-plotinus-the-one': '/covers/neoplatonism-plotinus-the-one.svg',
  'al-farabi-virtuous-city': '/covers/al-farabi-virtuous-city.svg',
  'ibn-sina-reason-and-medicine': '/covers/ibn-sina-reason-and-medicine.svg',
  'al-biruni-comparative-knowledge': '/covers/al-biruni-comparative-knowledge.svg',
  'al-khwarizmi-algorithmic-reason': '/covers/al-khwarizmi-algorithmic-reason.svg',
  'alisher-navoi-ethics-and-language': '/covers/alisher-navoi-ethics-and-language.svg',
  'maturidi-reason-faith-balance': '/covers/maturidi-reason-faith-balance.svg',
  'ulugh-beg-observatory-method': '/covers/ulugh-beg-observatory-method.svg',
  'al-ghazali-ethics-and-certainty': '/covers/al-ghazali-ethics-and-certainty.svg',
  'rumi-ethical-love-and-self': '/covers/rumi-ethical-love-and-self.svg',
  'ibn-rushd-commentary-and-reason': '/covers/ibn-rushd-commentary-and-reason.svg',
};

const PHILOSOPHER_PORTRAITS: Record<string, string> = {
  confucius: '/portraits/confucius.jpg',
  laozi: '/portraits/laozi.png',
  'han-feizi': '/portraits/han-feizi.jpg',
  mozi: '/portraits/mozi.jpg',
  'gautama-buddha': '/portraits/gautama-buddha.jpg',
  mahavira: '/portraits/mahavira.jpg',
  socrates: '/portraits/socrates.jpg',
  plato: '/portraits/plato.jpg',
  aristotle: '/portraits/aristotle.jpg',
  'zeno-of-citium': '/portraits/zeno-of-citium.jpg',
  epictetus: '/portraits/epictetus.jpg',
  epicurus: '/portraits/epicurus.jpg',
  mencius: '/portraits/mencius.jpg',
  xunzi: '/portraits/xunzi.jpg',
  nagarjuna: '/portraits/nagarjuna.jpg',
  chanakya: '/portraits/chanakya.jpg',
  diogenes: '/portraits/diogenes.jpg',
  plotinus: '/portraits/plotinus.jpg',
  'al-farabi': '/portraits/al-farabi.jpg',
  'ibn-sina': '/portraits/ibn-sina.jpg',
  'al-biruni': '/portraits/al-biruni.jpg',
  'al-khwarizmi': '/portraits/al-khwarizmi.jpg',
  'alisher-navoi': '/portraits/alisher-navoi.jpg',
  'al-maturidi': '/portraits/al-maturidi.jpg',
  'ulugh-beg': '/portraits/ulugh-beg.jpg',
  'al-ghazali': '/portraits/al-ghazali.png',
  rumi: '/portraits/rumi.jpg',
  'ibn-rushd': '/portraits/ibn-rushd.jpg',
};

const PHILOSOPHER_PORTRAIT_POSITION: Record<string, string> = {
  confucius: 'object-[50%_24%]',
  laozi: 'object-[50%_20%]',
  'han-feizi': 'object-[50%_18%]',
  mozi: 'object-[50%_28%]',
  'gautama-buddha': 'object-[50%_16%]',
  mahavira: 'object-[50%_20%]',
  socrates: 'object-[50%_24%]',
  plato: 'object-[50%_18%]',
  aristotle: 'object-[50%_20%]',
  'zeno-of-citium': 'object-[50%_22%]',
  epictetus: 'object-[50%_20%]',
  epicurus: 'object-[50%_28%]',
  mencius: 'object-[50%_20%]',
  xunzi: 'object-[50%_28%]',
  nagarjuna: 'object-[50%_24%]',
  chanakya: 'object-[50%_22%]',
  diogenes: 'object-[50%_24%]',
  plotinus: 'object-[50%_22%]',
  'al-farabi': 'object-[50%_26%]',
  'ibn-sina': 'object-[50%_18%]',
  'al-biruni': 'object-[50%_34%]',
  'al-khwarizmi': 'object-[50%_14%]',
  'alisher-navoi': 'object-[50%_14%]',
  'al-maturidi': 'object-center',
  'ulugh-beg': 'object-[50%_68%]',
  'al-ghazali': 'object-center',
  rumi: 'object-[50%_16%]',
  'ibn-rushd': 'object-[50%_18%]',
};

const LIVE_SLIDES: SlideItem[] = [
  {
    id: 'east-dualium',
    title: 'Eastern Insight Stream',
    subtitle: 'Confucian, Daoist, Buddhist, Jain texts in live rotation.',
    image: '/visuals/east-harmony.svg',
    region: 'east',
  },
  {
    id: 'west-dualium',
    title: 'Western Debate Stream',
    subtitle: 'Socratic inquiry, Stoic training, and Epicurean reasoning.',
    image: '/visuals/west-agora.svg',
    region: 'west',
  },
  {
    id: 'bridge-dualium',
    title: 'East x West Comparative Lens',
    subtitle: 'Parallel schools and key ideas with timeline-aware context.',
    image: '/visuals/duality-bridge.svg',
    region: 'mixed',
  },
  {
    id: 'mind-dualium',
    title: 'Mind Discipline Channel',
    subtitle: 'Practical ethics, self-mastery, and philosophical training.',
    image: '/visuals/east-meditation.svg',
    region: 'mixed',
  },
];

export function getArticleVisual(slug: string) {
  return ARTICLE_VISUALS[slug] ?? GLOBAL_VISUALS[0];
}

export function getPhilosopherPortrait(slug: string) {
  return PHILOSOPHER_PORTRAITS[slug] ?? '/visuals/knowledge-scroll.svg';
}

export function getPhilosopherPortraitPosition(slug: string) {
  return PHILOSOPHER_PORTRAIT_POSITION[slug] ?? 'object-center';
}

export function getLiveSlides(region: Region | 'mixed' = 'mixed') {
  if (region === 'mixed') {
    return LIVE_SLIDES;
  }

  return LIVE_SLIDES.filter((item) => item.region === region || item.region === 'mixed');
}
