import { NextResponse } from "next/server";
import path from "path";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const ALLOWED_VIDEO_EXTS = new Set([".mp4", ".webm", ".mov"]);
const MAX_IMAGE_BYTES = 10 * 1024 * 1024; // 10 MB
const MAX_VIDEO_BYTES = 50 * 1024 * 1024; // 50 MB

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "Nessun file fornito" }, { status: 400 });
    }

    const rawExt = path.extname(file.name || "").toLowerCase();
    const isVideo =
      file.type.startsWith("video/") || ALLOWED_VIDEO_EXTS.has(rawExt);
    const isImage = file.type.startsWith("image/") && !isVideo;

    if (!isVideo && !isImage) {
      return NextResponse.json(
        { error: "Formato non supportato. Carica immagini (JPG, PNG, WebP) o video (MP4, WebM, MOV)." },
        { status: 400 }
      );
    }

    const maxBytes = isVideo ? MAX_VIDEO_BYTES : MAX_IMAGE_BYTES;
    if (file.size > maxBytes) {
      return NextResponse.json(
        {
          error: isVideo
            ? "Video troppo pesante (max 50 MB). Comprimi il file MP4 prima del caricamento."
            : "Immagine troppo pesante (max 10 MB).",
        },
        { status: 413 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const ext = rawExt || (isVideo ? ".mp4" : ".jpg");
    const baseName =
      path
        .basename(file.name || "media", rawExt || undefined)
        .toLowerCase()
        .replace(/[^a-z0-9]/g, "-")
        .replace(/-+/g, "-")
        .replace(/^-|-$/g, "") || (isVideo ? "reel" : "media");
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

    const folder = isVideo ? "videos/reels" : "images/uploads";
    const key = `${folder}/${uniqueFilename}`;
    const contentType =
      file.type || (isVideo ? "video/mp4" : "application/octet-stream");

    await s3.send(
      new PutObjectCommand({
        Bucket: r2BucketName,
        Key: key,
        Body: buffer,
        ContentType: contentType,
        CacheControl: "public, max-age=31536000, immutable",
      })
    );

    return NextResponse.json({
      url: `${r2PublicUrl.replace(/\/$/, "")}/${key}`,
      filename: uniqueFilename,
      sizeKb: Math.round(buffer.length / 1024),
      storage: "cloudflare_r2",
      mediaType: isVideo ? "video" : "image",
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Errore sconosciuto durante l'upload";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
