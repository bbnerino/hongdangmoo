// Content script - 메시지 리스너 및 팝업 표시
import { Settings } from './script/types';
import { startCountdown, createPracticePopup, closePracticePopup, hasPracticePopup, setOnCloseCallback } from './script/q';
import { resetAnswerState } from './script/a';
import { attachShakeListener, detachShakeListener, resetShakeState } from './script/shake';
import { loadSentences, getRandomSentence } from './script/data';

// 팝업 표시
async function showPracticePopup(): Promise<void> {
  // 이미 팝업이 떠있으면 무시
  if (hasPracticePopup()) {
    console.log('[Hongdangmoo] Popup already exists');
    return;
  }

  // 설정에서 난이도 가져오기
  chrome.storage.sync.get(['difficulty'], (result) => {
    const difficulty = (result.difficulty === 'beginner' || result.difficulty === 'intermediate' || result.difficulty === 'advanced')
      ? result.difficulty
      : 'beginner';

    loadSentences(difficulty).then((sentences) => {
      const sentence = getRandomSentence(sentences);

      if (!sentence) {
        console.error('[Hongdangmoo] No sentences available');
        return;
      }

      resetShakeState();
      resetAnswerState();

      // Background에 팝업 열림 알림
      chrome.runtime.sendMessage({ type: 'POPUP_OPENED' });

      startCountdown(() => {
        // 닫기 콜백 설정
        setOnCloseCallback(() => {
          detachShakeListener();
          resetAnswerState();
          // Background에 팝업 닫힘 알림
          chrome.runtime.sendMessage({ type: 'POPUP_CLOSED' });
        });
        
        createPracticePopup(sentence, () => {
          closePracticePopup();
        });
        attachShakeListener();
      });
    });
  });
}

// 초기화
function init(): void {
  console.log('[Hongdangmoo] Content script initialized');

  // Background에 준비 완료 알림
  chrome.runtime.sendMessage({ type: 'CONTENT_SCRIPT_READY' }).catch(() => {
    // Background가 아직 준비되지 않았을 수 있음 (무시)
  });

  // Background에서 메시지 받기
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log('[Hongdangmoo] Received message:', message.type);
    if (message.type === 'SHOW_POPUP') {
      console.log('[Hongdangmoo] Received SHOW_POPUP message');
      showPracticePopup();
    }
    return true; // 비동기 응답을 위해 true 반환
  });
}

// 페이지 로드 시 초기화
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
