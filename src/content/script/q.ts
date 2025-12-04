import { Sentence } from './types';

// 로고 이미지 URL 가져오기
function getLogoUrl(): string {
  return chrome.runtime.getURL('dangmoo.png');
}

let practicePopup: HTMLDivElement | null = null;
let countdownPopup: HTMLDivElement | null = null;
let currentSentence: Sentence | null = null;
let mousePosition = { x: 0, y: 0 };
let practicePopupTracker: ((e: MouseEvent) => void) | null = null;

// 마우스 위치 업데이트
function updateMousePosition(e: MouseEvent): void {
  mousePosition = { x: e.clientX, y: e.clientY };
}

// 현재 문장 가져오기 (answer.ts에서 사용)
export function getCurrentSentence(): Sentence | null {
  return currentSentence;
}

// 팝업 요소 가져오기 (answer.ts에서 사용)
export function getPracticePopup(): HTMLDivElement | null {
  return practicePopup;
}

// 마우스 위치 가져오기
export function getMousePosition(): { x: number; y: number } {
  return mousePosition;
}

// 카운트다운 팝업 존재 여부 확인
export function hasPracticePopup(): boolean {
  return practicePopup !== null;
}

// 카운트다운 팝업 생성
export function createCountdownPopup(): void {
  if (countdownPopup) {
    return;
  }

  // 현재 마우스 위치 저장
  const currentMousePos = mousePosition.x > 0 && mousePosition.y > 0 
    ? mousePosition 
    : { x: window.innerWidth / 2, y: window.innerHeight / 2 };

  countdownPopup = document.createElement('div');
  countdownPopup.id = 'countdown-popup';

  const content = document.createElement('div');
  content.className = 'countdown-content';

  const number = document.createElement('div');
  number.className = 'countdown-number';
  number.textContent = '3';

  content.appendChild(number);
  countdownPopup.appendChild(content);

  const offsetX = 15;
  const offsetY = 15;

  Object.assign(countdownPopup.style, {
    position: 'fixed',
    top: `${currentMousePos.y + offsetY}px`,
    left: `${currentMousePos.x + offsetX}px`,
    width: '60px',
    height: '60px',
    backgroundColor: '#FF6B9D',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: '999999',
    boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
    pointerEvents: 'none',
    transform: 'translate(0, 0)'
  });

  document.body.appendChild(countdownPopup);
}

// 카운트다운 시작
export function startCountdown(callback: () => void): void {
  // 마우스 위치 추적 시작 (이벤트 리스너로 최신 위치 유지)
  const mouseTracker = (e: MouseEvent) => {
    updateMousePosition(e);
    // 카운트다운 팝업이 있으면 위치 업데이트
    if (countdownPopup && mousePosition.x > 0 && mousePosition.y > 0) {
      const offsetX = 15;
      const offsetY = 15;
      countdownPopup.style.left = `${mousePosition.x + offsetX}px`;
      countdownPopup.style.top = `${mousePosition.y + offsetY}px`;
    }
  };
  document.addEventListener('mousemove', mouseTracker);
  
  // 현재 마우스 위치가 없으면 기본값 설정 (화면 중앙)
  if (mousePosition.x === 0 && mousePosition.y === 0) {
    mousePosition = { 
      x: window.innerWidth / 2, 
      y: window.innerHeight / 2 
    };
  }
  
  createCountdownPopup();
  let count = 3;

  const updateCountdown = (): void => {
    if (!countdownPopup) return;

    if (count > 0) {
      const numberElement = countdownPopup.querySelector('.countdown-number');
      if (numberElement) {
        numberElement.textContent = count.toString();
      }
      count--;
      setTimeout(updateCountdown, 1000);
    } else {
      document.removeEventListener('mousemove', mouseTracker);
      if (countdownPopup) {
        countdownPopup.remove();
        countdownPopup = null;
      }
      callback();
    }
  };

  updateCountdown();
}

// 질문 팝업 생성
export function createPracticePopup(sentence: Sentence, onClose: () => void): void {
  if (practicePopup) {
    practicePopup.remove();
  }

  currentSentence = sentence;
  practicePopup = document.createElement('div');
  practicePopup.id = 'practice-popup';
  
  const content = document.createElement('div');
  content.className = 'practice-content';

  const logoImg = document.createElement('img');
  logoImg.src = getLogoUrl();
  logoImg.alt = 'Logo';
  logoImg.className = 'practice-logo';

  const text = document.createElement('div');
  text.className = 'practice-text';
  text.textContent = sentence.description;

  const hint = document.createElement('div');
  hint.className = 'practice-hint';
  hint.textContent = '흔들어서 정답 보기';

  content.appendChild(logoImg);
  content.appendChild(text);
  content.appendChild(hint);
  practicePopup.appendChild(content);

  // 마우스 위치 옆에 표시
  const currentMousePos = mousePosition.x > 0 && mousePosition.y > 0 
    ? mousePosition 
    : { x: window.innerWidth / 2, y: window.innerHeight / 2 };
  
  const offsetX = 20;
  const offsetY = 20;

  Object.assign(practicePopup.style, {
    position: 'fixed',
    top: `${currentMousePos.y + offsetY}px`,
    left: `${currentMousePos.x + offsetX}px`,
    minWidth: '300px',
    maxWidth: '400px',
    backgroundColor: '#fff',
    borderRadius: '12px',
    padding: '20px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
    zIndex: '999999',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '15px',
    transform: 'translate(0, 0)'
  });

  // 학습 팝업도 마우스를 따라다니도록 설정
  practicePopupTracker = (e: MouseEvent) => {
    updateMousePosition(e);
    if (practicePopup && mousePosition.x > 0 && mousePosition.y > 0) {
      const offsetX = 20;
      const offsetY = 20;
      practicePopup.style.left = `${mousePosition.x + offsetX}px`;
      practicePopup.style.top = `${mousePosition.y + offsetY}px`;
    }
  };
  document.addEventListener('mousemove', practicePopupTracker);

  document.body.appendChild(practicePopup);
}

// 팝업 닫기 콜백
let onCloseCallback: (() => void) | null = null;

// 팝업 닫기 콜백 설정
export function setOnCloseCallback(callback: () => void): void {
  onCloseCallback = callback;
}

// 팝업 닫기
export function closePracticePopup(): void {
  // 학습 팝업 추적 리스너 제거
  if (practicePopupTracker) {
    document.removeEventListener('mousemove', practicePopupTracker);
    practicePopupTracker = null;
  }
  
  if (practicePopup) {
    practicePopup.remove();
    practicePopup = null;
  }
  if (countdownPopup) {
    countdownPopup.remove();
    countdownPopup = null;
  }
  currentSentence = null;
  
  // 닫기 콜백 실행
  if (onCloseCallback) {
    onCloseCallback();
    onCloseCallback = null;
  }
}

