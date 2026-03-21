# AWS Lambda 배포

## 구조

- **app.js** – Express 앱 정의 (라우트 등록)
- **server.js** – 로컬 실행 시 `app`을 import 후 `listen()`
- **lambda/handler.js** – Lambda 핸들러, `@vendia/serverless-express`로 Express 앱 실행

## 로컬 실행

```bash
npm run dev
# 또는
npm start
```

## Lambda 배포 시 설정

- **Handler**: `lambda/handler.handler`
- **Runtime**: Node.js 18.x 이상 (ESM 지원)
- **환경 변수**: `AWS_REGION`, `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY` (또는 Lambda 실행 역할에 DynamoDB 권한 부여)

API Gateway (HTTP API 또는 REST API)에서 Lambda를 연동하면 기존 Express 경로(`/health`, `/api/trainers`, `/api/reservations`)가 그대로 동작합니다.
