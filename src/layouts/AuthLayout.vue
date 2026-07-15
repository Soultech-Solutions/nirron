<script lang="ts" setup>
  import { NirronLogo } from '@/components/brand'
  import AppSnackbar from '@/components/layout/AppSnackbar.vue'
  import { APP_DESCRIPTION, BRAND } from '@/constants'
</script>

<template>
  <v-app class="auth-layout">
    <v-main class="auth-layout__main">
      <div class="auth-layout__grid">
        <aside class="auth-layout__brand-panel d-none d-md-flex">
          <div class="auth-layout__brand-content">
            <NirronLogo
              :height="48"
              mode="full"
              variant="light"
            />

            <p class="auth-layout__tagline">
              {{ BRAND.tagline }}
            </p>

            <h1 class="auth-layout__slogan">
              {{ BRAND.slogan }}
            </h1>

            <p class="auth-layout__description">
              {{ APP_DESCRIPTION }}
            </p>

            <a
              :href="BRAND.website"
              class="auth-layout__website"
              rel="noopener noreferrer"
              target="_blank"
            >
              Conheça a NIRRON →
            </a>
          </div>
        </aside>

        <section class="auth-layout__form-panel">
          <div class="auth-layout__form-inner">
            <div class="auth-layout__mobile-brand d-md-none text-center mb-8">
              <NirronLogo
                :height="40"
                class="mb-3"
                mode="full"
                variant="dark"
              />
              <p class="text-body-2 text-medium-emphasis">
                {{ BRAND.productName }}
              </p>
            </div>

            <router-view />
          </div>
        </section>
      </div>
    </v-main>

    <AppSnackbar />
  </v-app>
</template>

<style scoped lang="scss">
  @use '@/styles/variables' as *;

  .auth-layout {
    &__main {
      min-height: 100vh;
      background: rgb(var(--v-theme-background));
    }

    &__grid {
      display: flex;
      min-height: 100vh;
    }

    &__brand-panel {
      flex: 0 0 44%;
      max-width: 520px;
      background: linear-gradient(160deg, $nirron-brand-dark 0%, $nirron-brand-surface 55%, $nirron-primary 100%);
      color: #fff;
      padding: 48px;
      align-items: center;
    }

    &__brand-content {
      max-width: 380px;
    }

    &__tagline {
      margin: 28px 0 12px;
      font-size: 0.75rem;
      font-weight: 600;
      letter-spacing: 0.12em;
      text-transform: uppercase;
      color: $nirron-on-brand-muted;
    }

    &__slogan {
      font-size: 1.75rem;
      font-weight: 700;
      line-height: 1.25;
      letter-spacing: -0.02em;
      margin-bottom: 16px;
    }

    &__description {
      font-size: 0.9375rem;
      line-height: 1.6;
      color: $nirron-on-brand-muted;
      margin-bottom: 32px;
    }

    &__website {
      display: inline-flex;
      align-items: center;
      font-size: 0.875rem;
      font-weight: 600;
      color: #fff;
      text-decoration: none;
      padding: 10px 0;
      border-bottom: 1px solid rgba(255, 255, 255, 0.35);
      transition: border-color 0.15s ease;

      &:hover {
        border-bottom-color: #fff;
      }
    }

    &__form-panel {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 32px 24px;
    }

    &__form-inner {
      width: 100%;
      max-width: 420px;
    }
  }
</style>
