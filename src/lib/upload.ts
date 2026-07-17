import { put } from "@vercel/blob"

const MAX_SIZE = 5 * 1024 * 1024 // 5MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"]

export class InvalidImageError extends Error {}

export async function uploadImage(file: File, pathPrefix: string): Promise<string> {
  if (!ALLOWED_TYPES.includes(file.type)) {
    throw new InvalidImageError("Solo se admiten imágenes (JPEG, PNG, WEBP, GIF).")
  }
  if (file.size > MAX_SIZE) {
    throw new InvalidImageError("La imagen no puede pesar más de 5 MB.")
  }

  const blob = await put(`${pathPrefix}/${crypto.randomUUID()}-${file.name}`, file, {
    access: "public",
  })
  return blob.url
}
