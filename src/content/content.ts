// 마우스를 따라다니는 팝업 생성
let mousePopup: HTMLDivElement | null = null;
let isEnabled: boolean = true;

// 로고 이미지 URL 가져오기
function getLogoUrl(): string {
  return chrome.runtime.getURL('dangmoo.png');
}

// 팝업 요소 생성
function createMousePopup(): void {
  if (mousePopup) {
    return;
  }

  mousePopup = document.createElement('div');
  mousePopup.id = 'mouse-follow-popup';
  
  // 로고 이미지 추가
  const logoImg = document.createElement('img');
  logoImg.src = getLogoUrl();
  logoImg.style.width = '30px';
  logoImg.style.height = '30px';
  logoImg.style.objectFit = 'contain';
  
  mousePopup.appendChild(logoImg);
  
  // 스타일 적용
  Object.assign(mousePopup.style, {
    position: 'fixed',
    padding: '4px',
    backgroundColor: 'transparent',
    borderRadius: '6px',
    pointerEvents: 'none',
    zIndex: '999999',
    opacity: '0',
    transition: 'opacity 0.2s',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  });

  document.body.appendChild(mousePopup);
}

// 마우스 이동 이벤트 핸들러
function handleMouseMove(e: MouseEvent): void {
  if (!isEnabled || !mousePopup) {
    return;
  }

  const offsetX = 15;
  const offsetY = 15;

  mousePopup.style.left = `${e.clientX + offsetX}px`;
  mousePopup.style.top = `${e.clientY + offsetY}px`;
  mousePopup.style.opacity = '1';
}

// 마우스가 화면을 벗어날 때 숨기기
function handleMouseLeave(): void {
  if (mousePopup) {
    mousePopup.style.opacity = '0';
  }
}

// 초기화
function init(): void {
  createMousePopup();
  document.addEventListener('mousemove', handleMouseMove);
  document.addEventListener('mouseleave', handleMouseLeave);
}

// 페이지 로드 시 초기화
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

