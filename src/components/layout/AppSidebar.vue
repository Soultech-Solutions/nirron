<script lang="ts" setup>
  import { computed } from 'vue'
  import { useRoute } from 'vue-router'
  import { useDisplay } from 'vuetify'
  import { NirronLogo } from '@/components/brand'
  import { ADMIN_NAVIGATION, BRAND, MAIN_NAVIGATION, type NavigationItem } from '@/constants'
  import { useAppStore } from '@/stores'

  const route = useRoute()
  const display = useDisplay()
  const appStore = useAppStore()

  const drawerWidth = 260
  const railWidth = 72

  const isRail = computed(() => display.mdAndUp.value && appStore.sidebarRail)
  const isPermanent = computed(() => display.mdAndUp.value)

  function isActive (item: NavigationItem): boolean {
    if (item.routeName) {
      return route.name === item.routeName || String(route.name ?? '').startsWith(`${item.routeName}-`)
    }
    return route.path === item.to || route.path.startsWith(`${item.to}/`)
  }
</script>

<template>
  <v-navigation-drawer
    v-model="appStore.sidebarOpen"
    :permanent="isPermanent"
    :rail="isRail"
    :rail-width="railWidth"
    :temporary="!isPermanent"
    :width="drawerWidth"
    class="app-sidebar"
    theme="dark"
  >
    <div
      :class="{ 'app-sidebar__brand--rail': isRail }"
      class="app-sidebar__brand"
    >
      <router-link
        class="app-sidebar__brand-link"
        to="/dashboard"
      >
        <NirronLogo
          :height="isRail ? 32 : 34"
          :mode="isRail ? 'icon' : 'full'"
          variant="light"
        />
      </router-link>

      <p
        v-if="!isRail"
        class="app-sidebar__tagline"
      >
        {{ BRAND.productName }}
      </p>
    </div>

    <v-divider class="app-sidebar__divider" />

    <v-list
      class="app-sidebar__nav py-2"
      density="compact"
      nav
    >
      <template
        v-for="item in MAIN_NAVIGATION"
        :key="item.key"
      >
        <v-list-item
          :active="isActive(item)"
          :prepend-icon="item.icon"
          :title="isRail ? undefined : item.title"
          :to="item.to"
          base-color="white"
          color="primary"
          rounded="lg"
          :value="item.key"
        >
          <template
            v-if="item.badge && !isRail"
            #append
          >
            <v-badge
              :content="item.badge"
              color="error"
              inline
            />
          </template>
        </v-list-item>
      </template>
    </v-list>

    <v-divider class="app-sidebar__divider my-2" />

    <div
      v-if="!isRail"
      class="px-4 py-2 text-overline app-sidebar__section-label"
    >
      Administração
    </div>

    <v-list
      class="app-sidebar__nav pb-2"
      density="compact"
      nav
    >
      <template
        v-for="item in ADMIN_NAVIGATION"
        :key="item.key"
      >
        <v-divider
          v-if="item.dividerBefore && !isRail"
          class="app-sidebar__divider my-2"
        />
        <v-list-item
          :active="isActive(item)"
          :prepend-icon="item.icon"
          :title="isRail ? undefined : item.title"
          :to="item.to"
          base-color="white"
          color="primary"
          rounded="lg"
          :value="item.key"
        />
      </template>
    </v-list>

    <template #append>
      <div class="pa-3">
        <v-card
          v-if="!isRail"
          class="app-sidebar__cta"
          rounded="lg"
          variant="flat"
        >
          <v-card-text class="pa-3">
            <div class="text-caption font-weight-semibold mb-1">
              {{ BRAND.slogan }}
            </div>
            <a
              :href="BRAND.website"
              class="app-sidebar__link text-caption"
              rel="noopener noreferrer"
              target="_blank"
            >
              nirron.com.br
            </a>
          </v-card-text>
        </v-card>
      </div>
    </template>
  </v-navigation-drawer>
</template>

<style scoped lang="scss">
  @use '@/styles/variables' as *;

  .app-sidebar {
    background: linear-gradient(
      180deg,
      $nirron-brand-dark 0%,
      $nirron-brand-surface 45%,
      $nirron-brand-mid 100%
    ) !important;
    border-right: 1px solid rgba(0, 0, 0, 0.2) !important;

    &__brand {
      min-height: 88px;
      padding: 20px 16px 16px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.08);

      &--rail {
        min-height: 72px;
        padding: 16px 12px;
        display: flex;
        align-items: center;
        justify-content: center;
      }
    }

    &__brand-link {
      display: inline-flex;
      text-decoration: none;
      outline: none;

      &:focus-visible {
        outline: 2px solid $nirron-primary-light;
        outline-offset: 4px;
        border-radius: 4px;
      }
    }

    &__tagline {
      margin: 10px 0 0;
      font-size: 0.6875rem;
      font-weight: 500;
      letter-spacing: 0.04em;
      text-transform: uppercase;
      color: $nirron-on-brand-muted;
      line-height: 1.35;
    }

    &__divider {
      opacity: 1;
      border-color: rgba(255, 255, 255, 0.1) !important;
    }

    &__section-label {
      color: $nirron-on-brand-subtle;
      letter-spacing: 0.08em;
    }

    &__nav {
      :deep(.v-list-item) {
        margin-inline: 8px;
        margin-bottom: 2px;
        color: $nirron-on-brand-muted;

        .v-list-item__prepend .v-icon {
          opacity: 0.85;
        }
      }

      :deep(.v-list-item:hover:not(.v-list-item--active)) {
        background: $nirron-sidebar-hover;
      }

      :deep(.v-list-item--active) {
        background: $nirron-sidebar-active !important;
        color: $nirron-on-brand !important;

        .v-list-item__prepend .v-icon {
          color: $nirron-primary-light !important;
          opacity: 1;
        }

        .v-list-item-title {
          font-weight: 600;
        }
      }
    }

    &__cta {
      background: $nirron-primary !important;
      border: 1px solid rgba(255, 255, 255, 0.15);
      color: $nirron-on-brand;

      .text-caption {
        color: $nirron-on-brand;
      }
    }

    &__link {
      color: rgba(255, 255, 255, 0.9);
      text-decoration: none;
      font-weight: 500;

      &:hover {
        color: $nirron-on-brand;
        text-decoration: underline;
      }
    }
  }
</style>
