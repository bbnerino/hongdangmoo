import { getCurrentSentence, getPracticePopup, getMousePosition } from './q';

// 로고 이미지 URL 가져오기
function getLogoUrl(): string {
  return chrome.runtime.getURL('dangmoo.png');
}

let isShowingAnswer: boolean = false;

// 정답 표시 여부 확인
export function getIsShowingAnswer(): boolean {
  return isShowingAnswer;
}

// 정답 표시
export function showAnswer(): void {
  const practicePopup = getPracticePopup();
  const currentSentence = getCurrentSentence();
  
  if (!practicePopup || !currentSentence || isShowingAnswer) return;

  isShowingAnswer = true;
  const content = practicePopup.querySelector('.practice-content');
  if (content) {
    // 기존 내용 제거
    while (content.firstChild) {
      content.removeChild(content.firstChild);
    }

    const logoImg = document.createElement('img');
    logoImg.src = getLogoUrl();
    logoImg.alt = 'Logo';
    logoImg.className = 'practice-logo';

    const text = document.createElement('div');
    text.className = 'practice-text practice-answer';
    text.textContent = currentSentence.sentence;

    const hint = document.createElement('div');
    hint.className = 'practice-hint';
    hint.textContent = '흔들어서 닫기';

    content.appendChild(logoImg);
    content.appendChild(text);
    content.appendChild(hint);
  }
}

// 정답 상태 초기화
export function resetAnswerState(): void {
  isShowingAnswer = false;
}

