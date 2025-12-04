// Background script - 메인 초기화
import { Settings } from '../content/script/types';
import { loadSettings, onSettingsChanged } from './settings';
import { sendMessageToActiveTab } from './messaging';
import { startPracticeTimer, stopPracticeTimer, getCurrentSettings } from './timer';

let isPopupOpen = false;

// 초기화
function init(): void {
  console.log('[Hongdangmoo BG] Background script initialized');

  // 설정 불러오기 및 타이머 시작
  loadSettings((settings: Settings) => {
    console.log('[Hongdangmoo BG] Settings loaded:', settings);
    startPracticeTimer(settings);
  });

  // 설정 변경 리스너
  onSettingsChanged((settings: Settings) => {
    console.log('[Hongdangmoo BG] Settings changed:', settings);
    stopPracticeTimer();
    startPracticeTimer(settings);
  });

  // 알람 리스너 (타이머 완료)
  chrome.alarms.onAlarm.addListener((alarm) => {
    console.log('[Hongdangmoo BG] Alarm triggered:', alarm.name);
    if (alarm.name === 'practiceTimer') {
      console.log('[Hongdangmoo BG] Timer triggered, sending message to tabs');
      console.log('[Hongdangmoo BG] isPopupOpen:', isPopupOpen);
      
      // 팝업이 이미 열려있으면 타이머만 재시작
      if (isPopupOpen) {
        console.log('[Hongdangmoo BG] Popup already open, restarting timer');
        const settings = getCurrentSettings();
        if (settings) {
          startPracticeTimer(settings);
        }
        return;
      }

      // 활성화된 탭에만 팝업 표시 메시지 전송
      sendMessageToActiveTab({ type: 'SHOW_POPUP' });
      
      // 타이머 재시작하지 않음 (팝업이 닫힐 때 시작)
    }
  });

  // 메시지 리스너
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === 'POPUP_CLOSED') {
      console.log('[Hongdangmoo BG] Popup closed, restarting timer');
      isPopupOpen = false;
      const settings = getCurrentSettings();
      if (settings) {
        startPracticeTimer(settings);
      }
    } else if (message.type === 'POPUP_OPENED') {
      console.log('[Hongdangmoo BG] Popup opened');
      isPopupOpen = true;
    }
  });
}

// Background script 시작
init();
