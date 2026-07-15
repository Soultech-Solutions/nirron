<script lang="ts" setup>
  import { computed } from 'vue'
  import { useRoute } from 'vue-router'
  import { useDisplay, useTheme } from 'vuetify'
  import { useAuth } from '@/composables'
  import { APP_NAME } from '@/constants'
  import { useAppStore } from '@/stores'
  import AppBreadcrumb from './AppBreadcrumb.vue'

  const route = useRoute()
  const theme = useTheme()
  const display = useDisplay()
  const appStore = useAppStore()
  const { user, logout } = useAuth()

  const username = computed(() => user.value?.name ?? 'Usuário')

  const userInitials = computed(() => {
    const parts = username.value.trim().split(/\s+/)
    const initials = (parts[0]?.[0] ?? '') + (parts.length > 1 ? (parts.at(-1)?.[0] ?? '') : '')
    return initials.toUpperCase() || '?'
  })

  const pageTitle = computed(() => {
    return (route.meta.title as string | undefined) ?? APP_NAME
  })

  function toggleTheme (): void {
    const nextTheme = theme.global.current.value.dark ? 'light' : 'dark'
    theme.change(nextTheme)
    appStore.setTheme(nextTheme)
  }

  function handleMenuToggle (): void {
    if (display.mdAndUp.value) {
      appStore.toggleSidebarRail()
    } else {
      appStore.toggleSidebar()
    }
  }
</script>

<template>
  <v-app-bar
    class="app-topbar"
    elevation="0"
    flat
    height="56"
  >
    <v-app-bar-nav-icon
      class="app-topbar__icon d-md-none"
      variant="text"
      @click="appStore.toggleSidebar()"
    />

    <v-btn
      class="app-topbar__icon d-none d-md-inline-flex"
      icon="mdi-menu"
      size="small"
      variant="text"
      @click="handleMenuToggle"
    />

    <v-divider
      class="app-topbar__divider mx-3 d-none d-md-flex"
      vertical
    />

    <div class="app-topbar__content flex-grow-1 overflow-hidden">
      <AppBreadcrumb class="d-none d-sm-flex" />

      <div class="app-topbar__title text-subtitle-1 font-weight-semibold d-sm-none">
        {{ pageTitle }}
      </div>
    </div>

    <v-spacer />

    <div class="d-flex align-center ga-1">
      <v-btn
        class="app-topbar__icon"
        icon="mdi-magnify"
        size="small"
        variant="text"
      />

      <v-btn
        class="app-topbar__icon"
        icon="mdi-bell-outline"
        size="small"
        variant="text"
      >
        <v-badge
          color="error"
          content="3"
          dot
          floating
        />
      </v-btn>

      <v-btn
        class="app-topbar__icon"
        :icon="theme.global.current.value.dark ? 'mdi-weather-sunny' : 'mdi-weather-night'"
        size="small"
        variant="text"
        @click="toggleTheme"
      />

      <v-divider
        class="app-topbar__divider mx-2"
        vertical
      />

      <v-menu>
        <template #activator="{ props }">
          <v-btn
            v-bind="props"
            class="app-topbar__user"
            variant="text"
          >
            <v-avatar
              class="app-topbar__avatar"
              color="primary"
              size="32"
            >
              <span class="text-caption font-weight-bold text-white">{{ userInitials }}</span>
            </v-avatar>

            <span class="text-body-2 font-weight-medium d-none d-lg-inline ms-2">
              {{ username }}
            </span>

            <v-icon
              class="d-none d-lg-inline app-topbar__icon"
              icon="mdi-chevron-down"
              size="16"
            />
          </v-btn>
        </template>

        <v-list
          density="compact"
          min-width="200"
          rounded="lg"
        >
          <v-list-item
            prepend-icon="mdi-account-outline"
            title="Meu perfil"
          />

          <v-list-item
            prepend-icon="mdi-cog-outline"
            title="Configurações"
          />

          <v-divider class="my-1" />

          <v-list-item
            prepend-icon="mdi-logout"
            title="Sair"
            @click="logout"
          />
        </v-list>
      </v-menu>
    </div>
  </v-app-bar>
</template>

<style scoped lang="scss">
  @use '@/styles/variables' as *;

  .app-topbar {
    background: linear-gradient(180deg, $nirron-topbar-tint 0%, rgb(var(--v-theme-surface)) 100%) !important;
    border-bottom: 2px solid rgba($nirron-primary, 0.12);

    :global(.v-theme--dark) & {
      background: linear-gradient(180deg, rgba($nirron-primary, 0.08) 0%, rgb(var(--v-theme-surface)) 100%) !important;
      border-bottom-color: rgba($nirron-primary, 0.2);
    }

    &__title {
      letter-spacing: -0.01em;
      color: $nirron-brand-dark;
    }

    &__user {
      text-transform: none;
      letter-spacing: normal;
    }

    &__avatar {
      box-shadow: 0 0 0 2px rgba($nirron-primary, 0.2);
    }

    &__icon {
      color: $nirron-brand-surface !important;

      &:hover {
        color: $nirron-primary !important;
        background: rgba($nirron-primary, 0.08) !important;
      }
    }

    &__divider {
      border-color: rgba($nirron-primary, 0.15) !important;
      opacity: 1;
    }
  }
</style>
