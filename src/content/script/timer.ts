import { Settings } from './types';
import { loadSentences, getRandomSentence } from './data';
import { startCountdown, createPracticePopup, closePracticePopup, hasPracticePopup } from './q';
import { resetAnswerState } from './a';
import { attachShakeListener, detachShakeListener, resetShakeState } from './shake';

let practiceTimer: number | null = null;
let currentSettings: Settings | null = null;

// 학습 팝업 표시
async function showPracticePopup(settings: Settings): Promise<void> {
  // 이미 팝업이 떠있으면 카운트다운 시작하지 않음
  if (hasPracticePopup()) {
    console.log('[Hongdangmoo] Popup already exists, skipping countdown');
    // 다음 주기 시작
    startPracticeTimer(settings);
    return;
  }

  const sentences = await loadSentences(settings.difficulty);
  const sentence = getRandomSentence(sentences);

  if (!sentence) {
    console.error('No sentences available');
    return;
  }

  resetShakeState();
  resetAnswerState();

  startCountdown(() => {
    createPracticePopup(sentence, () => {
      closePracticePopup();
      detachShakeListener();
      resetAnswerState();
      // 팝업이 닫히면 타이머 다시 시작
      if (currentSettings) {
        startPracticeTimer(currentSettings);
      }
    });
    attachShakeListener();
  });
}

// 주기별 팝업 시작
export function startPracticeTimer(settings: Settings): void {
  if (practiceTimer) {
    clearTimeout(practiceTimer);
  }

  // 현재 설정 저장
  currentSettings = settings;

  const intervalMs = settings.interval * 60 * 100; // 분을 밀리초로 변환
  console.log(`[Hongdangmoo] Timer started: ${settings.interval}분 (${intervalMs}ms)`);

  practiceTimer = window.setTimeout(() => {
    console.log('[Hongdangmoo] Timer triggered, showing popup');
    showPracticePopup(settings);
    // showPracticePopup 내부에서 다음 주기 시작 여부 결정
  }, intervalMs);
}

// 타이머 중지
export function stopPracticeTimer(): void {
  if (practiceTimer) {
    clearTimeout(practiceTimer);
    practiceTimer = null;
  }
  closePracticePopup();
  detachShakeListener();
}

