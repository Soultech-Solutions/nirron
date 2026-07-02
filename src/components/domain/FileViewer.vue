<script lang="ts" setup>
  import { AppCard, EmptyState } from '@/components/ui'

  interface Props {
    fileName?: string
    fileUrl?: string
    mimeType?: string
    loading?: boolean
  }

  withDefaults(defineProps<Props>(), {
    loading: false,
  })

  const isPdf = (mime?: string, name?: string): boolean => {
    return mime === 'application/pdf' || Boolean(name?.endsWith('.pdf'))
  }

  const isImage = (mime?: string): boolean => {
    return Boolean(mime?.startsWith('image/'))
  }
</script>

<template>
  <AppCard
    :subtitle="fileName"
    title="Visualizador"
  >
    <div
      v-if="loading"
      class="file-viewer__loading d-flex align-center justify-center"
    >
      <v-progress-circular
        color="primary"
        indeterminate
      />
    </div>

    <iframe
      v-else-if="fileUrl && isPdf(mimeType, fileName)"
      :src="fileUrl"
      class="file-viewer__frame"
      title="Visualização do documento"
    />

    <v-img
      v-else-if="fileUrl && isImage(mimeType)"
      :src="fileUrl"
      class="file-viewer__image"
      max-height="480"
    />

    <EmptyState
      v-else
      description="Selecione um documento para visualizar."
      icon="mdi-file-eye-outline"
      title="Nenhum arquivo selecionado"
    />
  </AppCard>
</template>

<style scoped lang="scss">
  .file-viewer__frame {
    width: 100%;
    height: 480px;
    border: none;
    border-radius: 8px;
    background: rgb(var(--v-theme-surface-variant));
  }

  .file-viewer__loading {
    height: 320px;
  }
</style>
