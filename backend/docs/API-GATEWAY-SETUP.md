# API Gateway 설정 (Lambda 연동)

Lambda 배포 후 HTTP로 API를 쓰려면 API Gateway를 연결해야 합니다.

---

## 1. API Gateway 유형 선택

- **HTTP API** (권장): 단순하고 저렴, Lambda Proxy 연동만 필요할 때
- **REST API**: 요금/기능이 더 많음, 필요 시 사용

아래는 **HTTP API** 기준입니다.

---

## 2. 콘솔에서 HTTP API 만들기

### Step 1: API 생성

1. **AWS 콘솔** → **API Gateway**
2. **API 생성** → **HTTP API** 선택 → **구축**
3. **통합** 선택:
   - **Lambda** 선택
   - 리전: Lambda를 배포한 리전 (예: ap-northeast-2)
   - Lambda 함수: 배포한 함수 이름 선택
4. **API 이름** 입력 (예: `gym-pt-api`) → **다음**
5. **라우팅** 설정:
   - **경로**: `/{proxy+}` (모든 경로를 Lambda로 전달)
   - **메서드**: `ANY` (GET, POST, PUT, DELETE 등 모두)
   - **통합 대상**: 방금 선택한 Lambda
6. **다음** → **생성**

### Step 2: Lambda에 권한 부여

API Gateway가 Lambda를 호출할 수 있도록 **리소스 정책**이 자동으로 붙는 경우가 많습니다.  
첫 요청 시 `Lambda 권한이 없습니다` 같은 오류가 나오면:

1. **Lambda** 콘솔 → 해당 함수 → **구성** → **권한**
2. **리소스 기반 정책**에서 `api-gateway` / `execute-api` 권한이 있는지 확인
3. 없으면 API Gateway 콘솔에서 해당 API → **통합** → Lambda 통합 다시 저장하면 권한이 추가되는 경우가 많음  
   또는 Lambda에 아래 정책을 추가:

```json
{
  "Effect": "Allow",
  "Principal": { "Service": "apigateway.amazonaws.com" },
  "Action": "lambda:InvokeFunction",
  "Resource": "arn:aws:lambda:ap-northeast-2:계정ID:function:함수이름",
  "Condition": {
    "ArnLike": {
      "AWS:SourceArn": "arn:aws:execute-api:ap-northeast-2:계정ID:API_ID/*"
    }
  }
}
```

(계정ID, API_ID, 함수이름은 본인 값으로 바꾸기)

---

## 3. CORS (프론트에서 호출할 때)

브라우저에서 다른 도메인으로 요청하면 CORS가 필요합니다.

1. API Gateway 콘솔 → 해당 **API** → **CORS**
2. **구성**에서:
   - **Access-Control-Allow-Origin**: `*` 또는 프론트 주소 (예: `https://your-frontend.com`)
   - **Access-Control-Allow-Headers**: `Content-Type, Authorization`
   - **Access-Control-Allow-Methods**: `GET, POST, PUT, PATCH, DELETE, OPTIONS`
3. 저장

또는 Express 앱에서 이미 `cors({ origin: true })`를 쓰고 있으므로, Lambda가 반환하는 응답에 CORS 헤더가 포함됩니다.  
그래도 브라우저에서 막히면 위 API Gateway CORS 설정을 함께 확인하세요.

---

## 4. API URL 확인

1. API Gateway → 해당 API 선택
2. **API 엔드포인트** (예: `https://xxxxxxxx.execute-api.ap-northeast-2.amazonaws.com`)
3. **스테이지**: 기본 `$default` 또는 만든 스테이지 이름

호출 예:

- `https://xxxxxxxx.execute-api.ap-northeast-2.amazonaws.com/health/db`
- `https://xxxxxxxx.execute-api.ap-northeast-2.amazonaws.com/api/trainers`
- `https://xxxxxxxx.execute-api.ap-northeast-2.amazonaws.com/api/reservations`

---

## 5. 프론트엔드 연동

프론트에서 백엔드 주소를 API Gateway URL로 바꿉니다.

- **Vite 등**: `.env` 또는 `src/api/index.js` 등에서  
  `VITE_API_URL=https://xxxxxxxx.execute-api.ap-northeast-2.amazonaws.com`  
  형태로 설정 후 `fetch(VITE_API_URL + '/api/...')` 사용
- **기존**: `http://localhost:3001` → 위 API Gateway URL로 교체

---

## 6. 요약 체크리스트

| 단계 | 내용 |
|------|------|
| 1 | API Gateway에서 **HTTP API** 생성 |
| 2 | 통합: **Lambda** + 배포한 함수 선택 |
| 3 | 라우팅: 경로 `/{proxy+}`, 메서드 **ANY** |
| 4 | Lambda 호출 권한(리소스 정책) 확인 |
| 5 | CORS 설정 (프론트 도메인 사용 시) |
| 6 | **API 엔드포인트** URL 복사 → 프론트에 설정 |

이후 `/health`, `/api/trainers`, `/api/reservations` 등 기존 경로가 그대로 동작합니다.
