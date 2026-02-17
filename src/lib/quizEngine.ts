import {
  articles,
  philosophers,
  type Article,
  type Difficulty,
  type Philosopher,
  type QuizQuestion,
  type QuizResult,
  type QuizScope,
  type QuizSetup,
  type Region,
} from '../data';
import { getLocalizedArticleTitle } from './content';
import { clamp, shuffle, unique } from './utils';

type LanguageCode = 'en' | 'uz';

type QuestionCategory = 'definition' | 'attribution' | 'comparison';

interface QuestionDraft extends QuizQuestion {
  category: QuestionCategory;
}

type AnswerMap = Record<string, string | boolean>;

interface ScopedData {
  selectedArticles: Article[];
  selectedPhilosophers: Philosopher[];
}

const SECTION_NAMES: Record<'summary' | 'takeaways' | 'ideas' | 'comparison', Record<LanguageCode, string>> = {
  summary: {
    en: 'Summary',
    uz: 'Xulosa',
  },
  takeaways: {
    en: 'Key Takeaways',
    uz: 'Asosiy Xulosalar',
  },
  ideas: {
    en: 'Philosopher Key Ideas',
    uz: 'Faylasufning Asosiy Goyalari',
  },
  comparison: {
    en: 'Comparative Lens',
    uz: 'Qiyosiy Tahlil',
  },
};

const LABELS = {
  source: { en: 'Source', uz: 'Manba' },
  true: { en: 'True', uz: 'Togri' },
  false: { en: 'False', uz: 'Notogri' },
} as const;

function createId(prefix: string) {
  if ('randomUUID' in crypto) {
    return `${prefix}-${crypto.randomUUID()}`;
  }

  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function getScopeData(scope: QuizScope, articleSlug?: string): ScopedData {
  if (scope === 'article' && articleSlug) {
    const selectedArticle = articles.find((item) => item.slug === articleSlug);

    if (selectedArticle) {
      const linkedPhilosophers = philosophers.filter((philosopher) =>
        philosopher.relatedArticles.includes(selectedArticle.slug),
      );

      return {
        selectedArticles: [selectedArticle],
        selectedPhilosophers: linkedPhilosophers,
      };
    }
  }

  const toRegion = (value: QuizScope): Region | 'mixed' => {
    if (value === 'east' || value === 'west') {
      return value;
    }
    return 'mixed';
  };

  const region = toRegion(scope);

  return {
    selectedArticles: region === 'mixed' ? articles : articles.filter((article) => article.region === region),
    selectedPhilosophers:
      region === 'mixed'
        ? philosophers
        : philosophers.filter((philosopher) => philosopher.region === region),
  };
}

function sectionName(section: keyof typeof SECTION_NAMES, language: LanguageCode) {
  return SECTION_NAMES[section][language];
}

function sourceExplanation(
  language: LanguageCode,
  sourceArticleTitle: string,
  sourceSection: string,
  note: string,
) {
  return `${LABELS.source[language]}: ${sourceArticleTitle} -> ${sourceSection}. ${note}`;
}

function pickDistractors(options: string[], answer: string, count: number) {
  return shuffle(unique(options.filter((option) => option !== answer))).slice(0, count);
}

function buildDefinitionQuestions(language: LanguageCode, scopedData: ScopedData): QuestionDraft[] {
  const allSchoolNames = unique(articles.map((article) => article.school));

  return scopedData.selectedArticles.flatMap((article) => {
    const title = getLocalizedArticleTitle(article, language);
    const summary = language === 'uz' ? article.summary_uz : article.summary_en;
    const distractors = pickDistractors(allSchoolNames, article.school, 3);
    const promptPrefix =
      language === 'uz'
        ? 'Quyidagi xulosa qaysi maktabni ifodalaydi?'
        : 'Which school is best described by this summary?';

    const mcq: QuestionDraft = {
      id: createId('def-mcq'),
      type: 'multiple_choice',
      category: 'definition',
      prompt: `${promptPrefix}\n"${summary}"`,
      options: shuffle([article.school, ...distractors]),
      correctAnswer: article.school,
      sourceArticleTitle: title,
      sourceSection: sectionName('summary', language),
      explanation: sourceExplanation(
        language,
        title,
        sectionName('summary', language),
        language === 'uz'
          ? 'Xulosa ushbu maktabning asosiy yonalishini ifodalaydi.'
          : 'The summary directly captures this school\'s orientation.',
      ),
    };

    const wrongSchool = pickDistractors(allSchoolNames, article.school, 1)[0] ?? article.school;
    const isTrue = Math.random() > 0.5;
    const tfSchool = isTrue ? article.school : wrongSchool;

    const tf: QuestionDraft = {
      id: createId('def-tf'),
      type: 'true_false',
      category: 'definition',
      prompt:
        language === 'uz'
          ? `Togri yoki Notogri: "${summary}" tavsifi ${tfSchool} maktabiga tegishli.`
          : `True or False: "${summary}" describes ${tfSchool}.`,
      options: [LABELS.true[language], LABELS.false[language]],
      correctAnswer: isTrue,
      sourceArticleTitle: title,
      sourceSection: sectionName('summary', language),
      explanation: sourceExplanation(
        language,
        title,
        sectionName('summary', language),
        language === 'uz'
          ? `Maqoladagi xulosa aslida ${article.school} maktabiga tegishli.`
          : `The article summary belongs to ${article.school}.`,
      ),
    };

    return [mcq, tf];
  });
}

function buildAttributionQuestions(language: LanguageCode, scopedData: ScopedData): QuestionDraft[] {
  const allPhilosopherNames = unique(philosophers.map((item) => item.name));
  const allSchoolNames = unique(articles.map((item) => item.school));

  const articleQuestions = scopedData.selectedArticles.flatMap((article) => {
    const title = getLocalizedArticleTitle(article, language);
    const takeaways = language === 'uz' ? article.keyTakeaways_uz : article.keyTakeaways_en;

    return takeaways.slice(0, 2).flatMap((takeaway, index) => {
      const mcOptions = shuffle([article.school, ...pickDistractors(allSchoolNames, article.school, 3)]);
      const schoolQuestion: QuestionDraft = {
        id: createId(`att-school-${index}`),
        type: 'multiple_choice',
        category: 'attribution',
        prompt:
          language === 'uz'
            ? `Qaysi maktab ushbu goyaga mos keladi?\n"${takeaway}"`
            : `Which school matches this idea?\n"${takeaway}"`,
        options: mcOptions,
        correctAnswer: article.school,
        sourceArticleTitle: title,
        sourceSection: sectionName('takeaways', language),
        explanation: sourceExplanation(
          language,
          title,
          sectionName('takeaways', language),
          language === 'uz'
            ? `Bu xulosa ${article.school} maqolasining asosiy fikrlar bolimidan olingan.`
            : `This statement comes from the ${article.school} key takeaways section.`,
        ),
      };

      const shortQuestion: QuestionDraft = {
        id: createId(`att-short-${index}`),
        type: 'short_answer',
        category: 'attribution',
        prompt:
          language === 'uz'
            ? `Quyidagi fikr qaysi maktabga tegishli?\n"${takeaway}"`
            : `Type the school name associated with this claim:\n"${takeaway}"`,
        correctAnswer: article.school,
        sourceArticleTitle: title,
        sourceSection: sectionName('takeaways', language),
        explanation: sourceExplanation(
          language,
          title,
          sectionName('takeaways', language),
          language === 'uz'
            ? 'Javob maqolaning asosiy xulosalaridan tekshiriladi.'
            : 'The answer is verified from the article key takeaways.',
        ),
      };

      return [schoolQuestion, shortQuestion];
    });
  });

  const philosopherQuestions = scopedData.selectedPhilosophers.flatMap((philosopher) => {
    const ideas = language === 'uz' ? philosopher.keyIdeas_uz : philosopher.keyIdeas_en;
    const sourceArticle = articles.find((article) => article.slug === philosopher.relatedArticles[0]);
    const sourceTitle = sourceArticle
      ? getLocalizedArticleTitle(sourceArticle, language)
      : language === 'uz'
        ? `${philosopher.name} profili`
        : `${philosopher.name} profile`;

    return ideas.slice(0, 2).flatMap((idea, index) => {
      const options = shuffle([philosopher.name, ...pickDistractors(allPhilosopherNames, philosopher.name, 3)]);

      const mcq: QuestionDraft = {
        id: createId(`att-philo-mcq-${index}`),
        type: 'multiple_choice',
        category: 'attribution',
        prompt:
          language === 'uz'
            ? `Ushbu goya kimga tegishli?\n"${idea}"`
            : `Who is associated with this idea?\n"${idea}"`,
        options,
        correctAnswer: philosopher.name,
        sourceArticleTitle: sourceTitle,
        sourceSection: sectionName('ideas', language),
        explanation: sourceExplanation(
          language,
          sourceTitle,
          sectionName('ideas', language),
          language === 'uz'
            ? `Mazkur goya ${philosopher.name}ning asosiy goyalari ichida berilgan.`
            : `This idea is listed under ${philosopher.name}'s key ideas.`,
        ),
      };

      const wrongName = pickDistractors(allPhilosopherNames, philosopher.name, 1)[0] ?? philosopher.name;
      const isTrue = Math.random() > 0.5;
      const presentedName = isTrue ? philosopher.name : wrongName;

      const tf: QuestionDraft = {
        id: createId(`att-philo-tf-${index}`),
        type: 'true_false',
        category: 'attribution',
        prompt:
          language === 'uz'
            ? `Togri yoki Notogri: "${idea}" fikri ${presentedName} bilan boglanadi.`
            : `True or False: "${idea}" is linked to ${presentedName}.`,
        options: [LABELS.true[language], LABELS.false[language]],
        correctAnswer: isTrue,
        sourceArticleTitle: sourceTitle,
        sourceSection: sectionName('ideas', language),
        explanation: sourceExplanation(
          language,
          sourceTitle,
          sectionName('ideas', language),
          language === 'uz' ? `Asl boglanish: ${philosopher.name}.` : `Correct attribution: ${philosopher.name}.`,
        ),
      };

      const short: QuestionDraft = {
        id: createId(`att-philo-short-${index}`),
        type: 'short_answer',
        category: 'attribution',
        prompt:
          language === 'uz'
            ? `Ushbu goya egasining ismini yozing:\n"${idea}"`
            : `Type the philosopher connected to this idea:\n"${idea}"`,
        correctAnswer: philosopher.name,
        sourceArticleTitle: sourceTitle,
        sourceSection: sectionName('ideas', language),
        explanation: sourceExplanation(
          language,
          sourceTitle,
          sectionName('ideas', language),
          language === 'uz' ? 'Javob faylasufning asosiy goyalari bilan tekshirildi.' : 'Checked against philosopher key ideas.',
        ),
      };

      return [mcq, tf, short];
    });
  });

  return [...articleQuestions, ...philosopherQuestions];
}

function buildComparisonQuestions(language: LanguageCode, scopedData: ScopedData): QuestionDraft[] {
  const comparisonPairs = shuffle(scopedData.selectedArticles).slice(0, 6);
  const allSchools = unique(articles.map((item) => item.school));

  const questions: QuestionDraft[] = [];

  for (let i = 0; i < comparisonPairs.length - 1; i += 1) {
    const first = comparisonPairs[i];
    const second = comparisonPairs[i + 1];

    const firstConcept = first.concepts[0] ?? 'concept';
    const secondConcept = second.concepts[0] ?? 'concept';

    const sourceTitle = getLocalizedArticleTitle(first, language);
    const sourceSection = sectionName('comparison', language);

    const correct = `${first.school} -> ${firstConcept}; ${second.school} -> ${secondConcept}`;
    const distractorA = `${first.school} -> ${secondConcept}; ${second.school} -> ${firstConcept}`;

    const otherSchool = pickDistractors(allSchools, first.school, 1)[0] ?? first.school;
    const distractorB = `${otherSchool} -> ${firstConcept}; ${second.school} -> ${secondConcept}`;

    const mcq: QuestionDraft = {
      id: createId('cmp-mcq'),
      type: 'multiple_choice',
      category: 'comparison',
      prompt:
        language === 'uz'
          ? 'Qaysi juftlik maktab va konseptni togri boglaydi?'
          : 'Which pair correctly matches schools to concepts?',
      options: shuffle([correct, distractorA, distractorB]),
      correctAnswer: correct,
      sourceArticleTitle: sourceTitle,
      sourceSection,
      explanation: sourceExplanation(
        language,
        sourceTitle,
        sourceSection,
        language === 'uz'
          ? 'Taqqoslash ikki maqolaning asosiy konseptlariga tayangan.'
          : 'The comparison is built from concepts highlighted in selected articles.',
      ),
    };

    const isTrue = Math.random() > 0.5;
    const statement = isTrue
      ? `${first.school} and ${second.school} pursue different emphases in ${firstConcept} and ${secondConcept}.`
      : `${first.school} and ${second.school} teach exactly the same emphasis in ${firstConcept}.`;

    const tf: QuestionDraft = {
      id: createId('cmp-tf'),
      type: 'true_false',
      category: 'comparison',
      prompt:
        language === 'uz'
          ? `Togri yoki Notogri: ${statement}`
          : `True or False: ${statement}`,
      options: [LABELS.true[language], LABELS.false[language]],
      correctAnswer: isTrue,
      sourceArticleTitle: sourceTitle,
      sourceSection,
      explanation: sourceExplanation(
        language,
        sourceTitle,
        sourceSection,
        language === 'uz'
          ? 'Bu savol ikki maktab ortasidagi qiyosiy farqqa tayangan.'
          : 'This item relies on contrast between two schools in the dataset.',
      ),
    };

    questions.push(mcq, tf);
  }

  return questions;
}

function typeTargets(difficulty: Difficulty, total: number) {
  const weightMap: Record<Difficulty, { mcq: number; tf: number; short: number }> = {
    easy: { mcq: 0.45, tf: 0.45, short: 0.1 },
    medium: { mcq: 0.4, tf: 0.3, short: 0.3 },
    hard: { mcq: 0.35, tf: 0.2, short: 0.45 },
  };

  const target = weightMap[difficulty];
  const mcq = Math.round(total * target.mcq);
  const tf = Math.round(total * target.tf);
  const short = Math.max(0, total - mcq - tf);

  return { mcq, tf, short };
}

function takeByType(questions: QuestionDraft[], count: number, type: QuizQuestion['type']) {
  return shuffle(questions.filter((question) => question.type === type)).slice(0, count);
}

export function generateQuizQuestions(setup: QuizSetup): QuizQuestion[] {
  const language: LanguageCode = setup.language;
  const scopedData = getScopeData(setup.scope, setup.articleSlug);

  const definitionQuestions = buildDefinitionQuestions(language, scopedData);
  const attributionQuestions = buildAttributionQuestions(language, scopedData);
  const comparisonQuestions = buildComparisonQuestions(language, scopedData);

  const pool = [...definitionQuestions, ...attributionQuestions, ...comparisonQuestions];

  if (pool.length === 0) {
    return [];
  }

  const { mcq, tf, short } = typeTargets(setup.difficulty, setup.questionCount);

  const selected = [
    ...takeByType(pool, mcq, 'multiple_choice'),
    ...takeByType(pool, tf, 'true_false'),
    ...takeByType(pool, short, 'short_answer'),
  ];

  if (selected.length < setup.questionCount) {
    const selectedIds = new Set(selected.map((item) => item.id));
    const fallback = shuffle(pool.filter((question) => !selectedIds.has(question.id))).slice(
      0,
      setup.questionCount - selected.length,
    );
    selected.push(...fallback);
  }

  return shuffle(selected)
    .slice(0, setup.questionCount)
    .map(({ category: _category, ...rest }) => rest);
}

function normalizeText(value: string | boolean) {
  if (typeof value === 'boolean') {
    return value ? 'true' : 'false';
  }

  return value.trim().toLowerCase();
}

function isAnswerCorrect(question: QuizQuestion, userAnswer: string | boolean) {
  if (question.type === 'short_answer') {
    return normalizeText(userAnswer) === normalizeText(String(question.correctAnswer));
  }

  if (typeof question.correctAnswer === 'boolean') {
    if (typeof userAnswer === 'boolean') {
      return userAnswer === question.correctAnswer;
    }

    const normalized = normalizeText(userAnswer);
    if (normalized === 'true') {
      return question.correctAnswer === true;
    }
    if (normalized === 'false') {
      return question.correctAnswer === false;
    }
    return false;
  }

  return normalizeText(userAnswer) === normalizeText(question.correctAnswer);
}

export function evaluateQuiz(setup: QuizSetup, questions: QuizQuestion[], answers: AnswerMap): QuizResult {
  const items = questions.map((question) => {
    const answer = answers[question.id] ?? '';
    const isCorrect = isAnswerCorrect(question, answer);

    return {
      question,
      userAnswer: answer,
      isCorrect,
    };
  });

  const correctCount = items.filter((item) => item.isCorrect).length;
  const incorrectCount = items.length - correctCount;
  const score = items.length > 0 ? Math.round(clamp((correctCount / items.length) * 100, 0, 100)) : 0;

  return {
    id: createId('result'),
    createdAt: new Date().toISOString(),
    setup,
    score,
    correctCount,
    incorrectCount,
    items,
  };
}
