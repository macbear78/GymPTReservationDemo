# IAM 권한 설정 (DynamoDB)

`AccessDeniedException: ... is not authorized to perform: dynamodb:Scan` 오류는 IAM 사용자/역할에 DynamoDB 권한이 없을 때 발생합니다.

## 해결 방법

### 1. 정책 생성 및 연결 (콘솔)

1. **AWS 콘솔** → **IAM** → **사용자** → `github-deploy` 선택
2. **권한** 탭 → **권한 추가** → **정책 직접 연결**
3. **정책 생성** 클릭 후:
   - **JSON** 탭 선택
   - `iam-dynamodb-policy.json` 내용 붙여넣기
   - **다음** → 이름 예: `GymPT-DynamoDB-Reservations` → **정책 생성**
4. 방금 만든 정책을 선택해 `github-deploy` 사용자에 **권한 추가**

### 2. 리소스 ARN 수정

다른 리전/계정을 쓰는 경우 `iam-dynamodb-policy.json` 안의 ARN을 바꿉니다.

- `ap-northeast-2` → 사용 중인 리전
- `378486979399` → 사용 중인 AWS 계정 ID
- `reservations` → 실제 테이블 이름

### 3. 최소 권한만 쓰고 싶을 때

현재 백엔드에서 쓰는 API만 허용하려면 아래처럼 줄일 수 있습니다.

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "dynamodb:Scan",
        "dynamodb:PutItem",
        "dynamodb:DeleteItem",
        "dynamodb:GetItem"
      ],
      "Resource": "arn:aws:dynamodb:ap-northeast-2:378486979399:table/reservations"
    },
    {
      "Effect": "Allow",
      "Action": "dynamodb:ListTables",
      "Resource": "*"
    }
  ]
}
```

정책 적용 후 몇 분 지나면 권한이 반영됩니다. 그 다음에도 같은 오류가 나오면 IAM 사용자/역할과 테이블 리전·계정이 맞는지 다시 확인하세요.
