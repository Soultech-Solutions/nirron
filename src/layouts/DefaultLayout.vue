<script lang="ts" setup>
  import AppFooter from '@/components/layout/AppFooter.vue'
  import AppSidebar from '@/components/layout/AppSidebar.vue'
  import AppSnackbar from '@/components/layout/AppSnackbar.vue'
  import AppTopbar from '@/components/layout/AppTopbar.vue'
  import { LoadingOverlay } from '@/components/ui'
  import { useAppStore } from '@/stores'

  const appStore = useAppStore()
</script>

<template>
  <v-app class="default-layout">
    <AppSidebar />
    <AppTopbar />

    <v-main class="default-layout__main">
      <LoadingOverlay :model-value="appStore.globalLoading" />

      <div class="default-layout__content">
        <v-container
          class="default-layout__container py-6"
          fluid
        >
          <router-view />
        </v-container>

        <AppFooter />
      </div>
    </v-main>

    <AppSnackbar />
  </v-app>
</template>

<style scoped lang="scss">
  .default-layout {
    background: rgb(var(--v-theme-background));

    &__main {
      display: flex;
      flex-direction: column;
      min-height: 100vh;
    }

    &__content {
      display: flex;
      flex-direction: column;
      flex: 1;
      min-height: 0;
    }

    &__container {
      max-width: 1440px;
      flex: 1;
    }
  }
</style>

<style lang="scss">
  @use '@/styles/main.scss';
</style>
