# 크롬 익스텐션 프로젝트

## 설치 방법

1. 의존성 설치
```bash
npm install
```

2. 빌드
```bash
npm run build
```

개발 모드 (자동 재빌드):
```bash
npm run dev
```

## 크롬 익스텐션 로드 방법

1. 크롬 브라우저에서 `chrome://extensions/` 접속
2. 우측 상단의 "개발자 모드" 활성화
3. "압축해제된 확장 프로그램을 로드합니다" 클릭
4. `dist` 폴더 선택

## 기능

- **상단 팝업**: 로그인, 메인, 설정 페이지 (React로 구현)
- **마우스 팝업**: 마우스를 따라다니는 팝업 (content script로 구현)

## 프로젝트 구조

```
├── manifest.json          # 크롬 익스텐션 설정
├── src/
│   ├── popup/            # 상단 팝업 (React)
│   │   ├── App.jsx       # 메인 앱 컴포넌트
│   │   ├── pages/        # 페이지 컴포넌트들
│   │   └── index.jsx     # React 진입점
│   └── content/          # Content Script
│       ├── content.js    # 마우스 팝업 로직
│       └── content.css   # 마우스 팝업 스타일
└── dist/                 # 빌드 결과물 (자동 생성)



