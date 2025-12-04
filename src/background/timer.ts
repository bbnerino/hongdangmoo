import { Settings } from '../content/script/types';

let currentSettings: Settings | null = null;

// 현재 설정 가져오기
export function getCurrentSettings(): Settings | null {
  return currentSettings;
}

// 타이머 시작
export function startPracticeTimer(settings: Settings): void {
  // 기존 알람 제거
  chrome.alarms.clear('practiceTimer').then(() => {
    currentSettings = settings;
    
    // interval이 1보다 작으면 분 단위로 변환 (예: 10초 = 10/60 = 0.167분)
    const delayInMinutes = settings.interval;
    
    const displayTime = settings.interval < 1 
      ? `${Math.round(settings.interval * 60)}초`
      : `${settings.interval}분`;
    
    console.log(`[Hongdangmoo BG] Timer started: ${displayTime} (${delayInMinutes}분)`);

    chrome.alarms.create('practiceTimer', {
      delayInMinutes: delayInMinutes
    }).then(() => {
      console.log('[Hongdangmoo BG] Alarm created successfully');
    }).catch((error) => {
      console.error('[Hongdangmoo BG] Failed to create alarm:', error);
    });
  }).catch((error) => {
    console.error('[Hongdangmoo BG] Failed to clear alarm:', error);
  });
}

// 타이머 중지
export function stopPracticeTimer(): void {
  chrome.alarms.clear('practiceTimer');
}

