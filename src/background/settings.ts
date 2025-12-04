import { Settings } from '../content/script/types';

// 설정 불러오기
export function loadSettings(callback: (settings: Settings) => void): void {
  chrome.storage.sync.get(['interval', 'difficulty'], (result) => {
    const settings: Settings = {
      interval: typeof result.interval === 'number' ? result.interval : 5,
      difficulty: (result.difficulty === 'beginner' || result.difficulty === 'intermediate' || result.difficulty === 'advanced')
        ? result.difficulty
        : 'beginner'
    };
    callback(settings);
  });
}

// 설정 변경 리스너 등록
export function onSettingsChanged(callback: (settings: Settings) => void): void {
  chrome.storage.onChanged.addListener((changes, areaName) => {
    if (areaName === 'sync' && (changes.interval || changes.difficulty)) {
      loadSettings(callback);
    }
  });
}

