import { onMounted } from 'vue'
import { useTheme } from 'vuetify'
import { useAppStore } from '@/stores'

export function useThemeMode () {
  const theme = useTheme()
  const appStore = useAppStore()

  function applyStoredTheme (): void {
    const stored = appStore.theme
    if (stored === 'system') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      theme.change(prefersDark ? 'dark' : 'light')
    } else {
      theme.change(stored)
    }
  }

  onMounted(() => {
    applyStoredTheme()
  })

  return {
    applyStoredTheme,
  }
}
