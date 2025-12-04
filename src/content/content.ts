// 메인 초기화 파일
import { Settings } from './script/types';
import { loadSettings, onSettingsChanged } from './script/storage';
import { startPracticeTimer, stopPracticeTimer } from './script/timer';

// 설정 불러오기 및 초기화
function init(): void {
  console.log('[Hongdangmoo] Content script initialized');
  
  loadSettings((settings: Settings) => {
    console.log('[Hongdangmoo] Settings loaded:', settings);
    startPracticeTimer(settings);
  });

  // 설정 변경 리스너
  onSettingsChanged((settings: Settings) => {
    console.log('[Hongdangmoo] Settings changed:', settings);
    stopPracticeTimer();
    startPracticeTimer(settings);
  });
}

// 페이지 로드 시 초기화
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
