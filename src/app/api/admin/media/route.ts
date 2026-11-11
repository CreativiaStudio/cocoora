import { NextResponse } from "next/server";
import path from "path";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "Nessun file fornito" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Sanitizza nome file
    const ext = path.extname(file.name) || ".jpg";
    const baseName = path
      .basename(file.name, ext)
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "-")
      .replace(/-+/g, "-");
    const uniqueFilename = `${baseName}-${Date.now()}${ext}`;

    const r2AccountId = process.env.R2_ACCOUNT_ID;
    const r2AccessKeyId = process.env.R2_ACCESS_KEY_ID;
    const r2SecretKey = process.env.R2_SECRET_ACCESS_KEY;
    const r2BucketName = process.env.R2_BUCKET_NAME || "cocoora";
    const r2PublicUrl =
      process.env.R2_PUBLIC_URL ||
      process.env.R2_PUBLIC_DOMAIN ||
      "https://pub-173fdd79a4fa47c0a2201f7ea94ed1b2.r2.dev";

    if (!r2AccountId || !r2AccessKeyId || !r2SecretKey) {
      return NextResponse.json(
        { error: "Credenziali Cloudflare R2 non configurate" },
        { status: 500 }
      );
    }

    const s3 = new S3Client({
      region: "auto",
      endpoint: process.env.R2_ENDPOINT || `https://${r2AccountId}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId: r2AccessKeyId,
        secretAccessKey: r2SecretKey,
      },
    });

    const key = `images/uploads/${uniqueFilename}`;
    await s3.send(
      new PutObjectCommand({
        Bucket: r2BucketName,
        Key: key,
        Body: buffer,
        ContentType: file.type || "application/octet-stream",
        CacheControl: "public, max-age=31536000, immutable",
      })
    );

    return NextResponse.json({
      url: `${r2PublicUrl.replace(/\/$/, "")}/${key}`,
      filename: uniqueFilename,
      sizeKb: Math.round(buffer.length / 1024),
      storage: "cloudflare_r2",
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Errore sconosciuto durante l'upload";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
