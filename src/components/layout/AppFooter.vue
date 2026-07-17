<script lang="ts" setup>
  import { APP_NAME, APP_VERSION, BRAND } from '@/constants'
</script>

<template>
  <footer class="app-footer">
    <div class="app-footer__inner d-flex flex-wrap align-center justify-space-between ga-2">
      <span class="text-caption text-medium-emphasis">
        © {{ new Date().getFullYear() }}
        <a
          :href="BRAND.website"
          class="app-footer__link"
          rel="noopener noreferrer"
          target="_blank"
        >{{ APP_NAME }}</a>
        · v{{ APP_VERSION }}
      </span>
      <div class="d-flex align-center ga-4">
        <a
          :href="BRAND.website"
          class="app-footer__link text-caption"
          rel="noopener noreferrer"
          target="_blank"
        >nirron.com.br</a>
        <a
          class="app-footer__link text-caption"
          href="#"
        >Documentação</a>
        <a
          class="app-footer__link text-caption"
          href="#"
        >Suporte</a>
      </div>
    </div>
  </footer>
</template>

<style scoped lang="scss">
  .app-footer {
    border-top: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
    padding: 12px 24px;
    margin-top: auto;
    background: linear-gradient(0deg, $nirron-topbar-tint 0%, transparent 100%);

    &__inner {
      max-width: 1440px;
      margin-inline: auto;
    }

    &__link {
      color: rgba(var(--v-theme-on-surface), 0.6);
      text-decoration: none;
      transition: color 0.15s ease;

      &:hover {
        color: rgb(var(--v-theme-primary));
      }
    }
  }
</style>
