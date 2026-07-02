<script lang="ts" setup>
  import { useThemeMode } from '@/composables/useThemeMode'
  import { onMounted } from 'vue'
  import { useAuthStore } from '@/stores'

  const authStore = useAuthStore()
  useThemeMode()

  onMounted(() => {
    authStore.initialize()
  })
</script>

<template>
  <router-view />
</template>
