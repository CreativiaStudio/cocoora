import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

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

    // 1. Se le credenziali Cloudflare R2 sono presenti in env, carica su R2
    const r2AccountId = process.env.R2_ACCOUNT_ID;
    const r2AccessKeyId = process.env.R2_ACCESS_KEY_ID;
    const r2SecretKey = process.env.R2_SECRET_ACCESS_KEY;
    const r2BucketName = process.env.R2_BUCKET_NAME || "cocoora-media";
    const r2PublicDomain = process.env.R2_PUBLIC_DOMAIN;

    if (r2AccountId && r2AccessKeyId && r2SecretKey) {
      // In futuro con S3 Client:
      // const s3 = new S3Client({ region: 'auto', endpoint: `https://${r2AccountId}.r2.cloudflarestorage.com`, ... });
      // await s3.send(new PutObjectCommand({ Bucket: r2BucketName, Key: uniqueFilename, Body: buffer, ContentType: file.type }));
      const publicUrl = r2PublicDomain
        ? `${r2PublicDomain.replace(/\/$/, "")}/${uniqueFilename}`
        : `https://${r2BucketName}.${r2AccountId}.r2.cloudflarestorage.com/${uniqueFilename}`;

      return NextResponse.json({
        url: publicUrl,
        filename: uniqueFilename,
        sizeKb: Math.round(buffer.length / 1024),
        storage: "cloudflare_r2",
      });
    }

    // 2. Fallback locale: salva in public/images/uploads/
    const uploadDir = path.join(process.cwd(), "public", "images", "uploads");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const filePath = path.join(uploadDir, uniqueFilename);
    fs.writeFileSync(filePath, buffer);

    const localUrl = `/images/uploads/${uniqueFilename}`;

    return NextResponse.json({
      url: localUrl,
      filename: uniqueFilename,
      sizeKb: Math.round(buffer.length / 1024),
      storage: "local",
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Errore sconosciuto durante l'upload";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
