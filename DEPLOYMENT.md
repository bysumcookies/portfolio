# 배포 가이드

## 추천 배포 방식

- 프론트엔드: Vercel
- 백엔드: Render Web Service

이 조합을 추천하는 이유는 다음과 같습니다.

- Vercel은 Next.js 배포가 가장 간단한 편입니다.
- Render는 Flask 백엔드를 올리기 비교적 쉽습니다.
- GitHub 저장소와 연결해서 배포 흐름을 만들기 편합니다.

## 현재 코드에서 정리된 내용

- 백엔드는 `POST /api/chat` API를 사용합니다.
- 백엔드는 `GET /api/health` 헬스체크 경로를 제공합니다.
- CORS는 `CORS_ALLOWED_ORIGINS` 환경변수로 제어합니다.
- 프론트는 `NEXT_PUBLIC_API_BASE_URL` 값을 읽어서 백엔드 주소를 결정합니다.
- 채팅 요청은 이제 쿼리스트링이 아니라 JSON 본문으로 전송합니다.
- 운영 환경에서 실행할 수 있도록 `gunicorn` 기준으로 맞춰두었습니다.

## 로컬 실행 방법

### 프론트엔드

프로젝트 루트의 `.env.local` 파일:

```env
NEXT_PUBLIC_API_BASE_URL=http://127.0.0.1:5000
```

실행:

```bash
npm run dev
```

### 백엔드

`backend/.env` 파일:

```env
GEMINI_API_KEY=여기에_실제_API_KEY
GEMINI_MODEL=gemini-2.5-flash
CORS_ALLOWED_ORIGINS=http://localhost:3000,http://127.0.0.1:3000
```

실행:

```bash
backend\.venv\Scripts\python.exe backend\app.py
```

## Render 백엔드 배포 방법

### 방법 1. 웹 화면에서 직접 설정

1. 현재 저장소를 GitHub에 올립니다.
2. Render에서 `New +`를 누릅니다.
3. `Web Service`를 선택합니다.
4. GitHub 저장소를 연결합니다.
5. Root Directory는 `backend`로 설정합니다.
6. 아래 값을 입력합니다.

```text
Build Command: pip install -r requirements.txt
Start Command: gunicorn app:app
```

7. 환경변수를 추가합니다.

```text
GEMINI_API_KEY=실제_API_KEY
GEMINI_MODEL=gemini-2.5-flash
CORS_ALLOWED_ORIGINS=https://배포된-프론트주소.vercel.app
```

8. 배포를 시작합니다.
9. 배포가 끝나면 아래 주소를 열어봅니다.

```text
https://내-render-주소.onrender.com/api/health
```

정상이라면 `ok: true`가 보입니다.

### 방법 2. render.yaml 사용

저장소 루트에 있는 `render.yaml`을 Render가 읽도록 사용할 수도 있습니다.
처음에는 웹 화면에서 직접 설정하는 방식이 더 이해하기 쉬울 수 있습니다.

## Vercel 프론트엔드 배포 방법

1. Vercel에서 GitHub 저장소를 불러옵니다.
2. 프로젝트 루트는 저장소 루트 그대로 둡니다.
3. 환경변수에 아래 값을 추가합니다.

```text
NEXT_PUBLIC_API_BASE_URL=https://내-render-주소.onrender.com
```

4. 배포를 진행합니다.

배포가 끝나면 프론트는 아래 주소로 채팅 요청을 보냅니다.

```text
https://내-render-주소.onrender.com/api/chat
```

## 실제 배포 순서

1. 먼저 Render에 백엔드를 배포합니다.
2. Render 배포 주소를 확인합니다.
3. 그 주소를 Vercel의 `NEXT_PUBLIC_API_BASE_URL`에 넣습니다.
4. 프론트를 Vercel에 배포합니다.
5. 마지막으로 Render의 `CORS_ALLOWED_ORIGINS`를 실제 Vercel 주소로 맞춥니다.

## 꼭 확인할 것

- `backend/profile.txt` 내용이 내가 원하는 정보로 정리되어 있는지 확인합니다.
- `backend/.env`와 `.env.local`은 실제 실행용 파일이고 Git에 올리지 않습니다.
- 백엔드가 배포돼도 `profile.txt` 내용이 부실하면 챗봇 답변 품질도 떨어집니다.
