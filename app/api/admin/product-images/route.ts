import { NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { createClient } from "@/lib/supabase/server";

export const runtime = "nodejs";
export const maxDuration = 30;

const allowed = new Set(["image/jpeg", "image/png", "image/webp", "image/avif"]);

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Sign in required." }, { status: 401 });
  const { data: role, error: roleError } = await supabase.rpc("current_role");
  if (roleError || role !== "admin") return NextResponse.json({ error: "Administrator access required." }, { status: 403 });

  const form = await request.formData();
  const file = form.get("file");
  if (!(file instanceof File)) return NextResponse.json({ error: "Choose an image file." }, { status: 400 });
  if (!allowed.has(file.type)) return NextResponse.json({ error: "Use JPG, PNG, WebP or AVIF images." }, { status: 415 });
  if (file.size < 1 || file.size > 10 * 1024 * 1024) return NextResponse.json({ error: "Image must be no larger than 10 MB." }, { status: 413 });

  const safeName = file.name.normalize("NFKD").replace(/[^a-zA-Z0-9._-]+/g, "-").slice(-100) || "product-image";
  try {
    const blob = await put(`products/${safeName}`, file, { access: "public", addRandomSuffix: true, contentType: file.type });
    return NextResponse.json({ url: blob.url, pathname: blob.pathname, contentType: file.type, size: file.size });
  } catch (error) {
    console.error("Product image upload failed", error instanceof Error ? error.message : "unknown");
    return NextResponse.json({ error: "Image upload failed. Please try again." }, { status: 500 });
  }
}
