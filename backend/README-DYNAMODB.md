# DynamoDB 설정

## 테이블 생성

`reservations` 테이블을 생성한 뒤 백엔드를 실행하세요.

- **테이블 이름**: `reservations`
- **파티션 키**: `id` (String)

### AWS CLI 예시

```bash
aws dynamodb create-table \
  --table-name reservations \
  --attribute-definitions AttributeName=id,AttributeType=S \
  --key-schema AttributeName=id,KeyType=HASH \
  --billing-mode PAY_PER_REQUEST
```

### 항목 속성

| 속성       | 타입   | 설명           |
|-----------|--------|----------------|
| id        | String | PK, UUID       |
| name      | String | 예약자 이름     |
| phone     | String | 연락처         |
| trainer   | String | 트레이너 이름   |
| date      | String | YYYY-MM-DD     |
| time      | String | HH:mm          |
| pt_type   | String | 30min / 60min  |
| status    | String | Confirmed 등   |
| created_at| String | ISO 8601        |

## 인증 (Lambda vs 로컬 Node)

| 환경 | DynamoDB 인증 | 비고 |
|------|----------------|------|
| **Lambda** | IAM Role (자동) | ✅ 사용 중. 별도 Access Key 불필요 |
| **로컬 Node** | AWS_ACCESS_KEY_ID / AWS_SECRET_ACCESS_KEY | 현재 미사용. 로컬에서 API는 Lambda(API Gateway)로 연결 |

`UnrecognizedClientException: The security token included in the request is invalid` → 로컬 Node에서 실제 AWS로 요청할 때 자격 증명(Access Key)이 없거나 잘못된 경우 발생. 로컬 백엔드를 쓰지 않으면 무시해도 됨.

## 환경 변수

- `AWS_REGION`: 리전 (기본값: `ap-northeast-2`)
- **Lambda**: 실행 역할에 DynamoDB 권한 부여
- **로컬 Node** (미사용): `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY` 또는 `AWS_ENDPOINT` (DynamoDB Local)
