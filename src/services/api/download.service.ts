import { httpClient } from './http.client'

export interface DownloadOptions {
  fileName?: string
  mimeType?: string
}

export async function downloadFile (url: string, options?: DownloadOptions): Promise<void> {
  const response = await httpClient.get<Blob>(url, { responseType: 'blob' })
  const blob = new Blob([response.data], {
    type: options?.mimeType ?? (response.headers['content-type'] as string | undefined),
  })
  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.download = options?.fileName ?? 'download'
  link.click()
  URL.revokeObjectURL(link.href)
}

export async function downloadFromBlob (blob: Blob, fileName: string): Promise<void> {
  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.download = fileName
  link.click()
  URL.revokeObjectURL(link.href)
}

export function buildExportFileName (prefix: string, format: string): string {
  const date = new Date().toISOString().slice(0, 10)
  return `${prefix}_${date}.${format}`
}
