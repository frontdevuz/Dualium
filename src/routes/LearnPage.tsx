import { useDeferredValue, useEffect, useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { SeoMeta } from '../components/SeoMeta';
import { SectionTitle } from '../components/SectionTitle';
import {
  fetchArticles,
  fetchConcepts,
  fetchPhilosophers,
  getLocalizedArticleSummary,
  getLocalizedArticleTitle,
} from '../lib/content';
import { getArticleVisual } from '../lib/visuals';

export function LearnPage() {
  const { t, i18n } = useTranslation();
  const language = i18n.resolvedLanguage?.startsWith('uz') ? 'uz' : 'en';
  const location = useLocation();

  const [search, setSearch] = useState('');
  const [region, setRegion] = useState<'all' | 'east' | 'west'>('all');
  const [school, setSchool] = useState('all');
  const [concept, setConcept] = useState('all');
  const deferredSearch = useDeferredValue(search);

  const { data: articles = [] } = useQuery({
    queryKey: ['articles'],
    queryFn: fetchArticles,
  });

  const { data: conceptList = [] } = useQuery({
    queryKey: ['concepts'],
    queryFn: fetchConcepts,
  });

  const { data: philosophers = [] } = useQuery({
    queryKey: ['philosophers'],
    queryFn: fetchPhilosophers,
  });

  const schools = useMemo(() => ['all', ...new Set(articles.map((article) => article.school))], [articles]);
  const schoolCount = schools.filter((item) => item !== 'all').length;
  const conceptNameBySlug = useMemo(() => {
    return new Map(conceptList.map((item) => [item.slug, language === 'uz' ? item.name_uz : item.name_en]));
  }, [conceptList, language]);
  const articleIndex = useMemo(() => {
    return articles.map((article) => {
      const title = getLocalizedArticleTitle(article, language);
      const summary = getLocalizedArticleSummary(article, language);
      const conceptNames = article.concepts.map((slug) => conceptNameBySlug.get(slug) ?? slug);

      return {
        article,
        title,
        summary,
        conceptNames,
        titleNorm: title.toLowerCase(),
        summaryNorm: summary.toLowerCase(),
        schoolNorm: article.school.toLowerCase(),
        conceptNorm: conceptNames.join(' ').toLowerCase(),
      };
    });
  }, [articles, conceptNameBySlug, language]);
  const benefits = useMemo(
    () =>
      language === 'uz'
        ? [
            'Tanqidiy fikrlashni kuchaytiradi: dalilni faktlardan ajratib ko`rishni o`rgatadi.',
            'Qaror qabul qilish sifatini oshiradi: murakkab vaziyatlarda mezon bilan tanlashga yordam beradi.',
            'Muloqot madaniyatini rivojlantiradi: fikrni aniq, dalilli va hurmat bilan ifodalashni shakllantiradi.',
            'Axloqiy yo`nalish beradi: adolat, mas`uliyat va vijdon haqida chuqurroq tushuncha beradi.',
            'Stressda xotirjamlikni oshiradi: Stoik, Buddaviy va boshqa amaliy yondashuvlar bilan ruhiy barqarorlikni mustahkamlaydi.',
          ]
        : [
            'Builds critical thinking by separating claims from evidence.',
            'Improves decision quality through clear ethical and logical frameworks.',
            'Strengthens communication with precise and respectful argumentation.',
            'Develops moral clarity around justice, responsibility, and character.',
            'Supports emotional stability through practical methods from Stoic, Buddhist, and related traditions.',
          ],
    [language],
  );
  const teaches = useMemo(
    () =>
      language === 'uz'
        ? [
            'Konfutsiychilik: ijtimoiy mas`uliyat, odob, oilaviy va fuqarolik burchi.',
            'Daosizm: tabiiylik, muvozanat va ortiqcha nazoratdan voz kechish.',
            'Buddaviylik/Jaynizm: ongni boshqarish, zarar bermaslik, ichki intizom.',
            'Sokrat va Platon: savol berish san`ati, haqiqatni izlash, bilimni tekshirish.',
            'Arastu: odat orqali fazilat, amaliy donolik va muvozanatli hayot.',
            'Stoitsizm va Epikur: hissiyotlarni boshqarish, xotirjamlik va ongli hayot sifati.',
          ]
        : [
            'Confucianism: responsibility, social ethics, and civic character.',
            'Daoism: balance, simplicity, and alignment with nature.',
            'Buddhism/Jainism: attention discipline, non-harm, and inner mastery.',
            'Socrates and Plato: inquiry, intellectual honesty, and tested knowledge.',
            'Aristotle: virtue through habit, practical wisdom, and balanced action.',
            'Stoicism and Epicureanism: emotional regulation, resilience, and a steady life.',
          ],
    [language],
  );
  const learningTips = useMemo(
    () =>
      language === 'uz'
        ? [
            'Har bir maqolada kamida 2 ta asosiy g`oyani yozib boring.',
            'Bir sharq va bir g`arb maktabini taqqoslab mini xulosa yozing.',
            'Maqoladan keyin test yechib, xatolaringiz bo`yicha AI izohdan foydalaning.',
          ]
        : [
            'Write down at least 2 key ideas from every article.',
            'Compare one Eastern and one Western school in a short note.',
            'Take the quiz after reading and use AI explanations for mistakes.',
          ],
    [language],
  );

  useEffect(() => {
    const params = new URLSearchParams(location.search);

    const q = params.get('q');
    if (q !== null) {
      setSearch(q);
    }

    const queryRegion = params.get('region');
    if (queryRegion === 'east' || queryRegion === 'west') {
      setRegion(queryRegion);
    }

    const querySchool = params.get('school');
    if (querySchool && schools.includes(querySchool)) {
      setSchool(querySchool);
    }

    const queryConcept = params.get('concept');
    if (queryConcept && conceptList.some((item) => item.slug === queryConcept)) {
      setConcept(queryConcept);
    }
  }, [conceptList, location.search, schools]);

  const filteredArticles = useMemo(() => {
    const normalizedSearch = deferredSearch.trim().toLowerCase();

    return articleIndex
      .filter((item) => {
        const schoolMatch = school === 'all' || item.article.school === school;
        const regionMatch = region === 'all' || item.article.region === region;
        const conceptMatch = concept === 'all' || item.article.concepts.includes(concept);
        const searchMatch =
          normalizedSearch.length === 0 ||
          item.titleNorm.includes(normalizedSearch) ||
          item.summaryNorm.includes(normalizedSearch) ||
          item.schoolNorm.includes(normalizedSearch) ||
          item.conceptNorm.includes(normalizedSearch);

        return schoolMatch && regionMatch && conceptMatch && searchMatch;
      })
      .map((item) => item.article);
  }, [articleIndex, concept, deferredSearch, region, school]);

  return (
    <>
      <SeoMeta
        title={`${t('learn.title')} | Dualium`}
        description={t('learn.subtitle')}
        canonical="https://dualium.vercel.app/learn"
        ogTitle={`${t('learn.title')} | Dualium`}
        ogDescription={t('learn.subtitle')}
        lang={language}
      />

      <SectionTitle title={t('learn.title')} description={t('learn.subtitle')} />

      <section className="mb-8 grid gap-4 xl:grid-cols-3">
        <article className="effect-card rounded-2xl border border-zinc-200/70 bg-white/82 p-5 shadow-soft dark:border-zinc-800 dark:bg-zinc-900/72">
          <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
            {language === 'uz' ? 'Nega falsafa foydali?' : 'Why Philosophy Is Useful'}
          </h2>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-300">
            {language === 'uz'
              ? 'Falsafa faqat nazariya emas. U kundalik hayotda fikrlash, qaror qabul qilish va shaxsiy intizomni kuchaytiradigan amaliy ko`nikmalarni beradi.'
              : 'Philosophy is not only theory. It trains practical thinking, better decisions, and personal discipline for real life.'}
          </p>
          <ul className="mt-3 space-y-2">
            {benefits.map((item) => (
              <li key={item} className="text-xs leading-relaxed text-zinc-700 dark:text-zinc-200">
                - {item}
              </li>
            ))}
          </ul>
        </article>

        <article className="effect-card rounded-2xl border border-zinc-200/70 bg-white/82 p-5 shadow-soft dark:border-zinc-800 dark:bg-zinc-900/72">
          <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
            {language === 'uz' ? 'Faylasuflar nimani o`rgatadi?' : 'What Philosophers Teach You'}
          </h2>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-300">
            {language === 'uz'
              ? 'Dualiumda har bir maktabdan amaliy va tushunarli darslar bor: axloq, mantiq, xulq, tafakkur va hayot strategiyasi.'
              : 'Dualium turns each school into practical lessons about ethics, logic, character, and life strategy.'}
          </p>
          <ul className="mt-3 space-y-2">
            {teaches.map((item) => (
              <li key={item} className="text-xs leading-relaxed text-zinc-700 dark:text-zinc-200">
                - {item}
              </li>
            ))}
          </ul>
        </article>

        <article className="effect-card rounded-2xl border border-zinc-200/70 bg-white/82 p-5 shadow-soft dark:border-zinc-800 dark:bg-zinc-900/72">
          <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
            {language === 'uz' ? 'O`rganish statistikasi' : 'Learning Snapshot'}
          </h2>
          <div className="mt-3 grid grid-cols-2 gap-2">
            <div className="rounded-xl border border-zinc-200/70 bg-zinc-50/85 p-3 dark:border-zinc-700 dark:bg-zinc-900/70">
              <p className="text-[11px] uppercase tracking-[0.12em] text-zinc-500 dark:text-zinc-400">
                {language === 'uz' ? 'Maqolalar' : 'Articles'}
              </p>
              <p className="mt-1 text-lg font-bold text-zinc-900 dark:text-zinc-100">{articles.length}</p>
            </div>
            <div className="rounded-xl border border-zinc-200/70 bg-zinc-50/85 p-3 dark:border-zinc-700 dark:bg-zinc-900/70">
              <p className="text-[11px] uppercase tracking-[0.12em] text-zinc-500 dark:text-zinc-400">
                {language === 'uz' ? 'Faylasuflar' : 'Philosophers'}
              </p>
              <p className="mt-1 text-lg font-bold text-zinc-900 dark:text-zinc-100">{philosophers.length}</p>
            </div>
            <div className="rounded-xl border border-zinc-200/70 bg-zinc-50/85 p-3 dark:border-zinc-700 dark:bg-zinc-900/70">
              <p className="text-[11px] uppercase tracking-[0.12em] text-zinc-500 dark:text-zinc-400">
                {language === 'uz' ? 'Maktablar' : 'Schools'}
              </p>
              <p className="mt-1 text-lg font-bold text-zinc-900 dark:text-zinc-100">{schoolCount}</p>
            </div>
            <div className="rounded-xl border border-zinc-200/70 bg-zinc-50/85 p-3 dark:border-zinc-700 dark:bg-zinc-900/70">
              <p className="text-[11px] uppercase tracking-[0.12em] text-zinc-500 dark:text-zinc-400">
                {language === 'uz' ? 'Konseptlar' : 'Concepts'}
              </p>
              <p className="mt-1 text-lg font-bold text-zinc-900 dark:text-zinc-100">{conceptList.length}</p>
            </div>
          </div>

          <p className="mt-4 text-[11px] font-semibold uppercase tracking-[0.12em] text-zinc-500 dark:text-zinc-400">
            {language === 'uz' ? 'Ideal o`rganish usuli' : 'Recommended Study Flow'}
          </p>
          <ul className="mt-2 space-y-2">
            {learningTips.map((tip) => (
              <li key={tip} className="text-xs leading-relaxed text-zinc-700 dark:text-zinc-200">
                - {tip}
              </li>
            ))}
          </ul>
        </article>
      </section>

      <section className="mb-8 rounded-2xl border border-zinc-200/70 bg-white/80 p-4 dark:border-zinc-800 dark:bg-zinc-900/70">
        <div className="grid gap-3 md:grid-cols-4">
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder={t('learn.searchPlaceholder')}
            className="rounded-xl border border-zinc-300 bg-white px-4 py-2 text-sm outline-none ring-jade/30 transition focus:ring-2 dark:border-zinc-700 dark:bg-zinc-950"
          />

          <select
            value={region}
            onChange={(event) => setRegion(event.target.value as 'all' | 'east' | 'west')}
            className="rounded-xl border border-zinc-300 bg-white px-4 py-2 text-sm outline-none ring-jade/30 transition focus:ring-2 dark:border-zinc-700 dark:bg-zinc-950"
          >
            <option value="all">{t('learn.allRegions')}</option>
            <option value="east">{t('common.east')}</option>
            <option value="west">{t('common.west')}</option>
          </select>

          <select
            value={school}
            onChange={(event) => setSchool(event.target.value)}
            className="rounded-xl border border-zinc-300 bg-white px-4 py-2 text-sm outline-none ring-jade/30 transition focus:ring-2 dark:border-zinc-700 dark:bg-zinc-950"
          >
            {schools.map((schoolName) => (
              <option key={schoolName} value={schoolName}>
                {schoolName === 'all' ? t('learn.allSchools') : schoolName}
              </option>
            ))}
          </select>

          <select
            value={concept}
            onChange={(event) => setConcept(event.target.value)}
            className="rounded-xl border border-zinc-300 bg-white px-4 py-2 text-sm outline-none ring-jade/30 transition focus:ring-2 dark:border-zinc-700 dark:bg-zinc-950"
          >
            <option value="all">{t('learn.allConcepts')}</option>
            {conceptList.map((item) => (
              <option key={item.slug} value={item.slug}>
                {language === 'uz' ? item.name_uz : item.name_en}
              </option>
            ))}
          </select>
        </div>

        <button
          type="button"
          onClick={() => {
            setSearch('');
            setRegion('all');
            setSchool('all');
            setConcept('all');
          }}
          className="mt-3 text-sm font-semibold text-zinc-600 hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-zinc-100"
        >
          {t('common.reset')}
        </button>
      </section>

      {filteredArticles.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-zinc-300 bg-white/70 p-8 text-center text-zinc-500 dark:border-zinc-700 dark:bg-zinc-900/60 dark:text-zinc-400">
          {t('learn.empty')}
        </div>
      ) : (
        <section className="content-auto grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filteredArticles.map((article) => {
            const localizedTakeaways = language === 'uz' ? article.keyTakeaways_uz : article.keyTakeaways_en;

            return (
              <article
                key={article.id}
                className="effect-card rounded-2xl border border-zinc-200/70 bg-white/80 p-5 transition hover:-translate-y-0.5 hover:shadow-soft dark:border-zinc-800 dark:bg-zinc-900/70"
              >
                <div className="relative mb-4 overflow-hidden rounded-xl border border-zinc-200/70 dark:border-zinc-700/70">
                  <img
                    src={getArticleVisual(article.slug)}
                    alt={getLocalizedArticleTitle(article, language)}
                    className="h-44 w-full object-cover transition duration-500 hover:scale-[1.03]"
                    loading="lazy"
                    decoding="async"
                  />
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-zinc-950/45 via-transparent to-transparent" />
                  <p className="absolute right-2 bottom-2 rounded-full border border-white/40 bg-black/30 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-white">
                    Live Visual
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-xs font-semibold uppercase tracking-[0.12em] text-zinc-500 dark:text-zinc-400">{article.school}</p>
                  <span className="rounded-full border border-zinc-300/80 bg-zinc-50 px-2.5 py-0.5 text-[11px] font-semibold text-zinc-600 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
                    {article.region === 'east' ? t('common.east') : t('common.west')}
                  </span>
                  <span className="rounded-full border border-zinc-300/80 bg-zinc-50 px-2.5 py-0.5 text-[11px] font-semibold text-zinc-600 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
                    {article.timelineYear}
                  </span>
                </div>

                <h3 className="mt-2 text-xl font-semibold text-zinc-900 dark:text-zinc-100">
                  {getLocalizedArticleTitle(article, language)}
                </h3>
                <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-300 line-clamp-4">
                  {getLocalizedArticleSummary(article, language)}
                </p>

                <div className="mt-3 rounded-xl border border-zinc-200/70 bg-zinc-50/80 p-3 dark:border-zinc-700 dark:bg-zinc-900/70">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-zinc-500 dark:text-zinc-400">
                    {language === 'uz' ? 'Nimani o`rganasiz' : 'What you will learn'}
                  </p>
                  <ul className="mt-2 space-y-1.5">
                    {localizedTakeaways.slice(0, 3).map((point) => (
                      <li key={point} className="text-xs leading-relaxed text-zinc-700 dark:text-zinc-200">
                        - {point}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  {article.concepts.slice(0, 4).map((item) => (
                    <span
                      key={item}
                      className="rounded-full border border-zinc-300 px-2.5 py-1 text-xs text-zinc-600 dark:border-zinc-700 dark:text-zinc-300"
                    >
                      {conceptNameBySlug.get(item) ?? item}
                    </span>
                  ))}
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-xs text-zinc-500 dark:text-zinc-400">
                    {t('common.readingTime', { minutes: article.readingTime })}
                  </span>
                  <Link to={`/learn/${article.slug}`} className="text-sm font-semibold text-jade hover:underline">
                    {t('common.readMore')} &rarr;
                  </Link>
                </div>
              </article>
            );
          })}
        </section>
      )}
    </>
  );
}
