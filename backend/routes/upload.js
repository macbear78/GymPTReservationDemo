import { Router } from 'express';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { randomUUID } from 'crypto';

const router = Router();

const region = process.env.AWS_REGION || 'ap-northeast-2';
const bucket = process.env.S3_BUCKET;

const s3Client = new S3Client({
  region,
  ...(process.env.AWS_ENDPOINT && { endpoint: process.env.AWS_ENDPOINT }),
});

/**
 * GET /api/upload-url
 * query:
 *   contentType=image/jpeg | image/png | image/webp
 */
router.get('/upload-url', async (req, res) => {
  try {
    if (!bucket) {
      return res.status(500).json({
        message: 'S3_BUCKET 환경 변수가 설정되지 않았습니다.',
      });
    }

    const contentType = req.query.contentType || 'image/jpeg';

    // 🔒 이미지 파일만 허용
    if (!contentType.startsWith('image/')) {
      return res.status(400).json({
        message: '이미지 파일만 업로드 가능합니다.',
      });
    }

    // 📁 확장자 자동 처리
    let extension = 'jpg';
    if (contentType === 'image/png') extension = 'png';
    if (contentType === 'image/webp') extension = 'webp';
    if (contentType === 'image/jpeg') extension = 'jpg';

    const key = `trainer-images/${randomUUID()}.${extension}`;

    // 📤 업로드용 presigned URL
    const putCommand = new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      ContentType: contentType,
    });

    const uploadUrl = await getSignedUrl(s3Client, putCommand, {
      expiresIn: 300, // 5분
    });

    // 🌐 저장된 이미지 접근 URL (영구 URL)
    const fileUrl = `https://${bucket}.s3.${region}.amazonaws.com/${key}`;

    res.json({
      uploadUrl,
      fileUrl,
    });
  } catch (err) {
    console.error('Upload URL error:', err);
    res.status(500).json({
      message: err.message || 'Presigned URL 생성에 실패했습니다.',
    });
  }
});

export const uploadRouter = router;