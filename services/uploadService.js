import { S3 } from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";

const verifyAwsConfig = () => {
  const requiredConfig = {
    accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY,
    region: process.env.NEXT_PUBLIC_AWS_REGION,
    bucketName: process.env.NEXT_PUBLIC_BUCKET_NAME
  };

  const missingVars = Object.entries(requiredConfig)
    .filter(([_, value]) => !value)
    .map(([key]) => key);

  if (missingVars.length > 0) {
    throw new Error(`Missing AWS configuration: ${missingVars.join(', ')}`);
  }

  return requiredConfig;
};

export const uploadFile = async (file, onProgress) => {
  if (!file) return null;

  const config = verifyAwsConfig();
  const s3Client = new S3({
    credentials: {
      accessKeyId: config.accessKeyId,
      secretAccessKey: config.secretAccessKey,
    },
    region: config.region
  });

  const upload = new Upload({
    client: s3Client,
    params: {
      Bucket: config.bucketName,
      Key: `menu-items/${Date.now()}-${file.name}`,
      Body: file,
      ContentType: file.type,
    }
  });

  upload.on("httpUploadProgress", (p) => {
    onProgress?.(p.loaded / p.total);
  });

  const result = await upload.done();
  return result.Location;
};
