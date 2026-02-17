import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

const SESSION_KEY = 'dualium_welcome_voice_played_v004';

type VoiceStyle = 'female' | 'male';

function pickBestVoice(voices: SpeechSynthesisVoice[], style: VoiceStyle) {
  const englishVoices = voices.filter((voice) => voice.lang.toLowerCase().startsWith('en'));
  if (englishVoices.length === 0) {
    return voices[0];
  }

  const femaleHints = [
    'aria',
    'jenny',
    'samantha',
    'victoria',
    'emma',
    'libby',
    'ava',
    'allison',
    'serena',
    'joanna',
    'luna',
  ];
  const maleHints = ['guy', 'davis', 'daniel', 'ryan', 'christopher', 'alex', 'matthew', 'george', 'tom'];
  const qualityHints = ['natural', 'neural', 'premium', 'enhanced', 'studio', 'online'];

  const scoreVoice = (voice: SpeechSynthesisVoice) => {
    const name = voice.name.toLowerCase();
    const lang = voice.lang.toLowerCase();
    let score = 0;

    if (lang.startsWith('en-us')) {
      score += 28;
    } else if (lang.startsWith('en-gb')) {
      score += 23;
    } else if (lang.startsWith('en')) {
      score += 16;
    }

    if (qualityHints.some((hint) => name.includes(hint))) {
      score += 24;
    }

    if (!voice.localService) {
      score += 10;
    }

    if (voice.default) {
      score += 5;
    }

    if (style === 'female') {
      if (femaleHints.some((hint) => name.includes(hint))) {
        score += 18;
      }
      if (maleHints.some((hint) => name.includes(hint))) {
        score -= 3;
      }
    } else {
      if (maleHints.some((hint) => name.includes(hint))) {
        score += 18;
      }
      if (femaleHints.some((hint) => name.includes(hint))) {
        score -= 3;
      }
    }

    if (name.includes('desktop') || name.includes('espeak')) {
      score -= 14;
    }

    return score;
  };

  return englishVoices.slice().sort((a, b) => scoreVoice(b) - scoreVoice(a))[0];
}

export function WelcomeVoice() {
  const { i18n } = useTranslation();
  const language = i18n.resolvedLanguage?.startsWith('uz') ? 'uz' : 'en';
  const [hasPlayed, setHasPlayed] = useState(false);
  const [isSupported, setIsSupported] = useState(true);
  const [isQueued, setIsQueued] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const timerRef = useRef<number | null>(null);
  const voiceStyle: VoiceStyle = 'female';

  useEffect(() => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      setIsSupported(false);
      return;
    }

    if (window.sessionStorage.getItem(SESSION_KEY) === '1') {
      setHasPlayed(true);
    }
  }, []);

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        window.clearTimeout(timerRef.current);
      }

      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const playWelcome = () => {
    if (!isSupported || typeof window === 'undefined' || isQueued || isSpeaking) {
      return;
    }

    const message =
      'Hello and welcome to Dualium. This platform explores ancient Eastern and Western philosophy. It was created by Izzatillo Davlatov.';

    setIsQueued(true);

    if (timerRef.current) {
      window.clearTimeout(timerRef.current);
    }

    timerRef.current = window.setTimeout(() => {
      const synth = window.speechSynthesis;
      const voices = synth.getVoices();
      const utterance = new SpeechSynthesisUtterance(message);

      if (voices.length > 0) {
        utterance.voice = pickBestVoice(voices, voiceStyle);
        utterance.lang = utterance.voice?.lang || 'en-US';
      } else {
        utterance.lang = 'en-US';
      }

      utterance.rate = 0.9;
      utterance.pitch = 0.98;
      utterance.volume = 1;

      utterance.onstart = () => {
        setIsQueued(false);
        setIsSpeaking(true);
        setHasPlayed(true);
        window.sessionStorage.setItem(SESSION_KEY, '1');
      };

      utterance.onend = () => {
        setIsSpeaking(false);
      };

      utterance.onerror = () => {
        setIsQueued(false);
        setIsSpeaking(false);
      };

      synth.cancel();
      synth.resume();
      synth.speak(utterance);
    }, 1000);
  };

  const buttonText = !isSupported
    ? language === 'uz'
      ? 'Voice mavjud emas'
      : 'Voice unavailable'
    : isQueued
      ? language === 'uz'
        ? '1 soniyadan keyin...'
        : 'Starting in 1 second...'
      : isSpeaking
        ? language === 'uz'
          ? 'Ovoz ijro etilmoqda...'
          : 'Playing voice...'
        : hasPlayed
          ? language === 'uz'
            ? 'Replay welcome'
            : 'Replay welcome'
          : language === 'uz'
            ? 'Play welcome'
            : 'Play welcome';

  return (
    <button
      type="button"
      onClick={playWelcome}
      disabled={!isSupported || isQueued || isSpeaking}
      className="fixed bottom-5 left-4 z-[65] rounded-full border border-zinc-300/80 bg-white/95 px-4 py-2 text-xs font-semibold text-zinc-800 shadow-soft backdrop-blur transition hover:-translate-y-0.5 hover:shadow-aura disabled:cursor-not-allowed disabled:opacity-70 dark:border-zinc-700 dark:bg-zinc-900/95 dark:text-zinc-100"
      aria-label={language === 'uz' ? 'Dualium welcome voice ijro etish' : 'Play Dualium welcome voice'}
    >
      {buttonText}
    </button>
  );
}
