<script lang="ts" setup>
  import { computed } from 'vue'
  import { storeToRefs } from 'pinia'
  import { useNotificationStore } from '@/stores'

  const notificationStore = useNotificationStore()
  const { items } = storeToRefs(notificationStore)

  const snackbarMessages = computed({
    get: () =>
      items.value.map((item) => ({
        id: item.id,
        text: item.message ? `${item.title}: ${item.message}` : item.title,
        color: item.type,
        timeout: item.timeout ?? 5000,
        closable: item.closable ?? true,
      })),
    set: (messages) => {
      const remainingIds = new Set(messages.map((m) => m.id))
      items.value
        .filter((item) => !remainingIds.has(item.id))
        .forEach((item) => notificationStore.remove(item.id))
    },
  })
</script>

<template>
  <v-snackbar-queue
    v-model="snackbarMessages"
    closable
    location="top right"
  />
</template>
