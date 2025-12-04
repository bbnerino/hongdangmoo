import { Settings } from './types';

// 설정 불러오기
export function loadSettings(callback: (settings: Settings) => void): void {
  chrome.storage.sync.get(['interval', 'difficulty'], (result) => {
    console.log('[Hongdangmoo] Storage result:', result);
    const settings: Settings = {
      interval: typeof result.interval === 'number' ? result.interval : 5,
      difficulty: (result.difficulty === 'beginner' || result.difficulty === 'intermediate' || result.difficulty === 'advanced')
        ? result.difficulty
        : 'beginner'
    };
    console.log('[Hongdangmoo] Parsed settings:', settings);
    callback(settings);
  });
}

// 설정 변경 리스너 등록
export function onSettingsChanged(callback: (settings: Settings) => void): void {
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === 'SETTINGS_CHANGED' && message.settings) {
      callback(message.settings);
    }
  });
}

