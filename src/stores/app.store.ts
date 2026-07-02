import { defineStore } from 'pinia'
import { ref } from 'vue'
import { APP_NAME, STORAGE_KEYS } from '@/constants'
import { storage } from '@/utils'

export const useAppStore = defineStore('app', () => {
  const sidebarOpen = ref(true)
  const sidebarRail = ref(false)
  const globalLoading = ref(false)
  const pageTitle = ref(APP_NAME)

  const theme = ref<'light' | 'dark' | 'system'>(
    storage.get<'light' | 'dark' | 'system'>(STORAGE_KEYS.THEME) ?? 'light',
  )

  function toggleSidebar (): void {
    sidebarOpen.value = !sidebarOpen.value
  }

  function toggleSidebarRail (): void {
    sidebarRail.value = !sidebarRail.value
  }

  function setSidebarOpen (value: boolean): void {
    sidebarOpen.value = value
  }

  function setSidebarRail (value: boolean): void {
    sidebarRail.value = value
  }

  function setGlobalLoading (value: boolean): void {
    globalLoading.value = value
  }

  function setPageTitle (title: string): void {
    pageTitle.value = title
  }

  function setTheme (value: 'light' | 'dark' | 'system'): void {
    theme.value = value
    storage.set(STORAGE_KEYS.THEME, value)
  }

  return {
    sidebarOpen,
    sidebarRail,
    globalLoading,
    pageTitle,
    theme,
    toggleSidebar,
    toggleSidebarRail,
    setSidebarOpen,
    setSidebarRail,
    setGlobalLoading,
    setPageTitle,
    setTheme,
  }
})
