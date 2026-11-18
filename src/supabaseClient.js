import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = (err) => reject(err);
    reader.readAsDataURL(file);
  });
}

/**
 * Muat naik fail gambar ke Supabase Storage bucket ("item-images")
 * dengan fallback automatik ke API pelayan (/api/upload-image) jika
 * polisi RLS atau sesi pengguna tamat tempoh menyekat muat naik terus.
 */
export async function uploadImageToStorage(
  fileName,
  file,
  bucket = "item-images",
) {
  const { error: uploadError } = await supabase.storage
    .from(bucket)
    .upload(fileName, file, { upsert: true });

  if (!uploadError) {
    const {
      data: { publicUrl },
    } = supabase.storage.from(bucket).getPublicUrl(fileName);
    return { publicUrl, error: null };
  }

  // Fallback melalui backend API (Service Role) jika disekat oleh RLS
  try {
    const fileBase64 = await fileToBase64(file);
    const baseUrl = import.meta.env.VITE_API_URL || "";
    const res = await fetch(`${baseUrl}/api/upload-image`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fileName,
        fileBase64,
        contentType: file.type || "image/png",
        bucket,
      }),
    });

    if (res.ok) {
      const data = await res.json();
      if (data?.publicUrl) {
        return { publicUrl: data.publicUrl, error: null };
      }
    }
  } catch (fallbackErr) {
    console.warn("Fallback upload gagal:", fallbackErr);
  }

  return { publicUrl: null, error: uploadError };
}

/**
 * Masukkan rekod laporan baharu ke jadual "items" dengan fallback
 * automatik ke API pelayan (/api/create-item) jika RLS menyekat operasi.
 */
export async function insertItemWithFallback(itemPayload) {
  const { error } = await supabase.from("items").insert([itemPayload]);

  if (!error) {
    return { error: null };
  }

  try {
    const baseUrl = import.meta.env.VITE_API_URL || "";
    const res = await fetch(`${baseUrl}/api/create-item`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(itemPayload),
    });

    if (res.ok) {
      return { error: null };
    }
  } catch (fallbackErr) {
    console.warn("Fallback insert item gagal:", fallbackErr);
  }

  return { error };
}

