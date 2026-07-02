import type { UploadResponseDto } from '@/dtos'
import type { IRequestConfig } from '@/interfaces'
import { httpClient } from './http.client'

export interface UploadOptions extends IRequestConfig {
  onProgress?: (percent: number) => void
  fieldName?: string
}

export async function uploadFile (
  url: string,
  file: File,
  options?: UploadOptions,
): Promise<UploadResponseDto> {
  const formData = new FormData()
  formData.append(options?.fieldName ?? 'file', file)

  const response = await httpClient.post<{ data: UploadResponseDto }>(url, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    skipAuth: options?.skipAuth,
    onUploadProgress: (event) => {
      if (options?.onProgress && event.total) {
        options.onProgress(Math.round((event.loaded * 100) / event.total))
      }
    },
  })

  return response.data.data
}

export async function uploadFiles (
  url: string,
  files: File[],
  options?: UploadOptions,
): Promise<UploadResponseDto[]> {
  return Promise.all(files.map((file) => uploadFile(url, file, options)))
}
