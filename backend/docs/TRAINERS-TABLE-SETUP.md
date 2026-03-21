# 트레이너 DynamoDB 테이블 (POST /api/trainers)

## 환경 변수

| 변수 | 설명 |
|------|------|
| `TRAINERS_TABLE` | 테이블 이름 (기본값: `trainers`) |

## 테이블 스키마

- **테이블 이름**: `trainers` (또는 `TRAINERS_TABLE` 값)
- **파티션 키**: `id` (String)

## AWS 콘솔에서 생성

1. DynamoDB → 테이블 만들기
2. 테이블 이름: `trainers`
3. 파티션 키: `id` (문자열)
4. 나머지 기본값 사용 후 생성

## IAM 권한

Lambda 또는 로컬용 사용자에 다음 권한 추가:

- `dynamodb:PutItem` (등록)
- `dynamodb:GetItem` (ID 중복 확인)
- `dynamodb:Scan` (목록 조회)

리소스: `arn:aws:dynamodb:{region}:{account}:table/trainers`
