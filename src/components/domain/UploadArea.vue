<script lang="ts" setup>
  import { ref } from 'vue'
  import { AppButton } from '@/components/ui'

  interface Props {
    accept?: string
    multiple?: boolean
    maxSizeMb?: number
    disabled?: boolean
  }

  const props = withDefaults(defineProps<Props>(), {
    accept: '.pdf,.xml,.xlsx,.jpg,.png',
    multiple: false,
    maxSizeMb: 25,
    disabled: false,
  })

  const emit = defineEmits<{
    upload: [files: File[]]
    error: [message: string]
  }>()

  const isDragging = ref(false)
  const fileInput = ref<HTMLInputElement | null>(null)

  function validateFiles (files: FileList | null): File[] {
    if (!files?.length) return []
    const valid: File[] = []
    const maxBytes = props.maxSizeMb * 1024 * 1024

    Array.from(files).forEach((file) => {
      if (file.size > maxBytes) {
        emit('error', `${file.name} excede o limite de ${props.maxSizeMb}MB`)
      } else {
        valid.push(file)
      }
    })
    return valid
  }

  function onDrop (event: DragEvent): void {
    isDragging.value = false
    if (props.disabled) return
    const files = validateFiles(event.dataTransfer?.files ?? null)
    if (files.length) emit('upload', files)
  }

  function onFileSelect (event: Event): void {
    const input = event.target as HTMLInputElement
    const files = validateFiles(input.files)
    if (files.length) emit('upload', files)
    input.value = ''
  }

  function openPicker (): void {
    fileInput.value?.click()
  }
</script>

<template>
  <div
    :class="{ 'upload-area--dragging': isDragging, 'upload-area--disabled': disabled }"
    class="upload-area d-flex flex-column align-center justify-center text-center pa-8"
    @dragenter.prevent="isDragging = true"
    @dragleave.prevent="isDragging = false"
    @dragover.prevent
    @drop.prevent="onDrop"
  >
    <input
      ref="fileInput"
      :accept="accept"
      :multiple="multiple"
      class="d-none"
      type="file"
      @change="onFileSelect"
    >

    <v-avatar
      class="mb-4"
      color="primary"
      size="56"
      variant="tonal"
    >
      <v-icon
        icon="mdi-cloud-upload-outline"
        size="28"
      />
    </v-avatar>

    <p class="text-subtitle-2 font-weight-semibold mb-1">
      Arraste arquivos ou clique para enviar
    </p>
    <p class="text-caption text-medium-emphasis mb-4">
      PDF, XML, XLSX, JPG, PNG — máx. {{ maxSizeMb }}MB
    </p>

    <AppButton
      :disabled="disabled"
      prepend-icon="mdi-file-upload-outline"
      variant="secondary"
      @click="openPicker"
    >
      Selecionar arquivos
    </AppButton>
  </div>
</template>

<style scoped lang="scss">
  .upload-area {
    border: 2px dashed rgba(var(--v-border-color), var(--v-border-opacity));
    border-radius: 14px;
    background: rgba(var(--v-theme-primary), 0.02);
    transition: border-color 0.2s ease, background 0.2s ease;
    min-height: 200px;

    &--dragging {
      border-color: rgb(var(--v-theme-primary));
      background: rgba(var(--v-theme-primary), 0.06);
    }

    &--disabled {
      opacity: 0.5;
      pointer-events: none;
    }
  }
</style>
