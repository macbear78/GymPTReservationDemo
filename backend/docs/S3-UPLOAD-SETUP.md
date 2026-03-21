# S3 이미지 업로드 (Presigned URL) 설정

## API

- **GET /api/upload-url**  
  - 응답: `{ "uploadUrl": "PUT용 presigned URL", "fileUrl": "조회용 presigned URL" }`  
  - 클라이언트는 `uploadUrl`로 PUT 업로드 후, `fileUrl`로 이미지 표시

## 환경 변수

| 변수 | 설명 |
|------|------|
| `S3_BUCKET` | 이미지를 저장할 S3 버킷 이름 (필수) |
| `AWS_REGION` | 버킷 리전 (기본: ap-northeast-2) |

로컬: `.env`에 `S3_BUCKET=버킷이름` 설정.  
Lambda: 환경 변수에 `S3_BUCKET` 설정, IAM Role에 아래 권한 부여.

## S3 버킷 생성 (콘솔)

1. S3 → 버킷 만들기 → 이름·리전 선택
2. 퍼블릭 액세스는 “차단” 유지 (presigned URL로만 접근)
3. CORS(선택): 업로드 도메인에서 PUT 허용

```json
[
  {
    "AllowedHeaders": ["*"],
    "AllowedMethods": ["PUT", "GET"],
    "AllowedOrigins": ["http://localhost:5173", "https://your-front-domain.com"],
    "ExposeHeaders": []
  }
]
```

## IAM 권한 (Lambda / 로컬용 사용자)

버킷 `arn:aws:s3:::YOUR-BUCKET/*` 에 대해:

- `s3:PutObject`
- `s3:GetObject`

예시 정책:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": ["s3:PutObject", "s3:GetObject"],
      "Resource": "arn:aws:s3:::YOUR-BUCKET/uploads/*"
    }
  ]
}
```

## 패키지 설치

```bash
cd backend
npm install
```
