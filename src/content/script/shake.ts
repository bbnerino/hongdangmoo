import { showAnswer, getIsShowingAnswer } from './a';
import { hasPracticePopup, closePracticePopup } from './q';

let lastMousePosition = { x: 0, y: 0 };
const shakeThreshold = 50; // 흔들기 감지 임계값
let shakeCount = 0;
let mouseMoveHandler: ((e: MouseEvent) => void) | null = null;

// 마우스 흔들기 감지 핸들러
export function handleMouseMove(e: MouseEvent): void {
  if (!hasPracticePopup()) return;

  // 첫 번째 마우스 이동 시 위치 초기화
  if (lastMousePosition.x === 0 && lastMousePosition.y === 0) {
    lastMousePosition = { x: e.clientX, y: e.clientY };
    return;
  }

  const deltaX = Math.abs(e.clientX - lastMousePosition.x);
  const deltaY = Math.abs(e.clientY - lastMousePosition.y);
  const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

  if (distance > shakeThreshold) {
    shakeCount++;
    
    // 정답이 아직 표시되지 않았으면 정답 표시
    if (!getIsShowingAnswer()) {
      if (shakeCount >= 3) {
        showAnswer();
        shakeCount = 0; // 정답 표시 후 카운트 리셋
      }
    } else {
      // 정답이 이미 표시되었으면 흔들어서 닫기
      if (shakeCount >= 3) {
        closePracticePopup();
        detachShakeListener();
      }
    }
  }

  lastMousePosition = { x: e.clientX, y: e.clientY };
}

// 마우스 이벤트 리스너 등록
export function attachShakeListener(): void {
  mouseMoveHandler = handleMouseMove;
  document.addEventListener('mousemove', mouseMoveHandler);
}

// 마우스 이벤트 리스너 제거
export function detachShakeListener(): void {
  if (mouseMoveHandler) {
    document.removeEventListener('mousemove', mouseMoveHandler);
    mouseMoveHandler = null;
  }
}

// 흔들기 상태 초기화
export function resetShakeState(): void {
  lastMousePosition = { x: 0, y: 0 };
  shakeCount = 0;
}

