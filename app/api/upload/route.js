import { S3 } from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";

const verifyAwsConfig = () => {
  const requiredConfig = {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION,
    bucketName: process.env.BUCKET_NAME,
  };

  const missingVars = Object.entries(requiredConfig)
    .filter(([_, value]) => !value)
    .map(([key]) => key);

  if (missingVars.length > 0) {
    throw new Error(`Missing AWS configuration: ${missingVars.join(", ")}`);
  }

  return requiredConfig;
};

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!file) {
      return Response.json({ error: "No file provided" }, { status: 400 });
    }

    const config = verifyAwsConfig();
    const s3Client = new S3({
      credentials: {
        accessKeyId: config.accessKeyId,
        secretAccessKey: config.secretAccessKey,
      },
      region: config.region,
    });

    const upload = new Upload({
      client: s3Client,
      params: {
        Bucket: config.bucketName,
        Key: `menu-items/${Date.now()}-${file.name}`,
        Body: file,
        ContentType: file.type,
      },
    });

    const result = await upload.done();
    return Response.json({ url: result.Location });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
