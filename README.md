# 다다익선 제주 현장학습 워크북

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Live Demo](https://img.shields.io/badge/demo-live-brightgreen.svg)](https://worksheet-hub.github.io/jeju-dadaiksun-workbook/)

대구광역시교육청 글로컬 인재 양성 프로그램 "다다익선" 제주 현장학습(2박3일)을 위한 디지털 워크북입니다.

![제주 워크북 스크린샷](https://via.placeholder.com/800x400?text=Jeju+Workbook+Screenshot)

## 🎯 프로젝트 개요

학생들이 제주도 현장학습 중 실시간으로 활동을 기록하고, 학습 내용을 정리하며, SNS 공유용 이미지를 생성할 수 있는 PWA(Progressive Web App) 기반 디지털 워크북입니다.

### 주요 특징

- ✈️ **2박 3일 일정 완벽 반영**: 실제 여행 일정에 맞춘 일차별 학습 활동
- 📱 **PWA 지원**: 앱처럼 설치하고 오프라인에서도 사용 가능
- 💾 **온디바이스 저장**: 모든 데이터는 본인 기기에만 저장 (프라이버시 보호)
- 👥 **팀 모드**: 핸드폰이 없는 친구를 위한 대표 작성 기능
- 📸 **SNS 이미지 생성**: html2canvas로 일차별 활동 요약 이미지 자동 생성
- 💾 **백업/복원**: 다른 기기에서 작업을 이어갈 수 있는 백업 기능

## 🚀 데모

**라이브 데모**: [https://worksheet-hub.github.io/jeju-dadaiksun-workbook/](https://worksheet-hub.github.io/jeju-dadaiksun-workbook/)

## 🛠️ 기술 스택

- **Frontend**: HTML5, CSS3 (Tailwind CSS), Vanilla JavaScript (ES6+)
- **PWA**: Service Worker, Web App Manifest
- **Storage**: LocalStorage (온디바이스)
- **Libraries**: 
  - [html2canvas](https://html2canvas.hertzen.com/) - SNS 이미지 생성
  - [Tailwind CSS](https://tailwindcss.com/) - 스타일링
- **Hosting**: GitHub Pages

## 📋 주요 기능

### 1. 작성 모드

#### 👤 개인 모드
- 본인 기기로 개별 작성
- 학생 정보: 글로컬 X반 이름

#### 👥 팀 모드
- 핸드폰이 없는 친구를 위한 모드
- 팀장(작성 대표)이 팀원 정보 포함하여 작성
- 팀 소속 반, 팀명, 팀장, 팀원 목록 관리

### 2. 일차별 학습 활동

#### 1일차: 건축, 예술, 자연의 조화
- 오설록티뮤지엄
- 본태박물관
- 곶자왈 도립공원

#### 2일차: 바다와 전통, 그리고 디지털 문화
- 제주해녀박물관
- 하도카약 체험
- 성읍민속마을
- 넥슨컴퓨터박물관

#### 3일차: 제주의 예술과 추억을 담아
- 아르떼뮤지엄
- 마지막 소감 작성

### 3. 상호작용 요소

- 📝 퀴즈: 각 장소별 학습 퀴즈
- 📸 포토 미션: 사진 업로드 및 미리보기
- ✍️ 소감 작성: 자유로운 텍스트 입력
- ✅ 준비물 체크리스트: 출발 전 준비물 확인

### 4. 데이터 관리

- **자동 저장**: 입력 시 자동으로 LocalStorage에 저장
- **백업 내보내기**: .jeju 파일로 백업
- **백업 불러오기**: 다른 기기에서 작업 이어가기
- **전체 초기화**: 모든 데이터 삭제

### 5. SNS 이미지 생성

- 일차별 활동 완료 후 공유용 이미지 자동 생성
- 학생 정보, 팀 정보, 방문 장소, 사진, 소감 포함
- 익명 모드: 개인정보 보호를 위한 익명 표시

## 📦 설치 및 실행

### 로컬 개발 환경

```bash
# 저장소 클론
git clone https://github.com/worksheet-hub/jeju-dadaiksun-workbook.git

# 디렉토리 이동
cd jeju-dadaiksun-workbook

# 로컬 서버 실행 (Python 3)
python -m http.server 8000

# 또는 (Node.js)
npx serve
```

브라우저에서 `http://localhost:8000` 접속

### PWA로 설치

모바일 브라우저에서:
1. 사이트 접속
2. "홈 화면에 추가" 선택
3. 앱처럼 사용 가능

## 🏗️ 프로젝트 구조

```
jeju-dadaiksun-workbook/
├── index.html              # 메인 HTML (52KB)
├── app.js                  # JavaScript 로직
├── sw.js                   # Service Worker
├── manifest.json           # PWA 매니페스트
├── README.md               # 프로젝트 문서
├── LICENSE                 # MIT 라이선스
└── .gitignore             # Git 제외 파일
```

## 💡 사용 방법

### 기본 사용 흐름

1. **시작하기**
   - 사이트 접속
   - 작성 모드 선택 (개인/팀)
   - 학생 정보 입력

2. **여행 중**
   - 일차별 탭으로 이동
   - 퀴즈 풀기
   - 사진 업로드
   - 소감 작성
   - 자동 저장됨

3. **완료 후**
   - 각 일차 완료 버튼 클릭
   - SNS 이미지 다운로드
   - 백업 파일 저장 (선택)

### 백업 관리

```javascript
// 백업 파일명 예시
제주학습백업_20251017.jeju

// 백업 파일 구조 (JSON)
{
  "version": "1.0",
  "date": "2025-10-17T10:30:00Z",
  "formData": {...},
  "photos": {...},
  "progress": {...}
}
```

## 🎨 디자인 시스템

### 색상 팔레트

```css
/* 다크 테마 (기본) */
--bg-gray-900: #111827;
--slate-800: #1e293b;
--slate-700: #334155;

/* 주요 색상 */
--blue-300: #93c5fd;  /* 제목 */
--green-600: #059669; /* 완료 버튼 */
--yellow-300: #fcd34d; /* 강조 */
```

### 반응형 브레이크포인트

- Mobile: < 640px
- Tablet: 640px - 1024px
- Desktop: > 1024px

## 🔐 보안 및 프라이버시

- ✅ **온디바이스 저장**: 모든 데이터는 사용자 기기에만 저장
- ✅ **외부 전송 없음**: 서버로 데이터 전송하지 않음
- ✅ **익명 모드**: 개인정보 보호를 위한 옵션 제공
- ✅ **HTTPS**: GitHub Pages는 기본적으로 HTTPS 지원

## 📈 향후 개선 계획

- [ ] 이미지 압축 기능 추가
- [ ] 오프라인 기능 강화
- [ ] 클라우드 백업 연동 (Google Drive)
- [ ] 다크/라이트 모드 토글
- [ ] 영문 버전
- [ ] 사진 편집 기능
- [ ] PDF 내보내기

## 🤝 기여하기

버그 리포트, 기능 제안, 풀 리퀘스트 환영합니다!

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 라이선스

이 프로젝트는 MIT 라이선스를 따릅니다. 자세한 내용은 [LICENSE](LICENSE) 파일을 참조하세요.

## 👨‍💻 개발자

**AISL Lab** - AI & Smart Learning Laboratory

- 개발: 여한기 선생님
- 문의: [Facebook - 룰루랄라 한기쌤](https://www.facebook.com/playrurulala?locale=ko_KR)

## 🙏 감사의 말

- 대구광역시교육청 글로컬 인재 양성 프로그램 "다다익선"
- 참여 학생 및 인솔 선생님들
- 오픈소스 라이브러리 기여자들

## 📞 문의

프로젝트 관련 문의사항이나 버그 리포트는 [Issues](https://github.com/worksheet-hub/jeju-dadaiksun-workbook/issues)에 남겨주세요.

---

**Made with ❤️ for 글로컬 Students**

*2025년 제주 현장학습을 기념하며*