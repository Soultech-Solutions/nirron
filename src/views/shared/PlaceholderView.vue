<script lang="ts" setup>
  import { computed } from 'vue'
  import { useRoute } from 'vue-router'
  import { EmptyState } from '@/components/ui'

  const route = useRoute()

  const title = computed(() => (route.meta.title as string) ?? 'Em breve')
  const description = computed(
    () => (route.meta.description as string) ?? 'Esta seção está em desenvolvimento.',
  )
</script>

<template>
  <EmptyState
    :description="description"
    icon="mdi-hammer-wrench"
    :title="title"
  />
</template>
