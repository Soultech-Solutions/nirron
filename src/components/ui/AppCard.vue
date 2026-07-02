<script lang="ts" setup>
  interface Props {
    title?: string
    subtitle?: string
    padding?: boolean
    hoverable?: boolean
    noBorder?: boolean
    loading?: boolean
  }

  withDefaults(defineProps<Props>(), {
    padding: true,
    hoverable: false,
    noBorder: false,
    loading: false,
  })
</script>

<template>
  <v-card
    :class="[
      'app-card',
      { 'app-card--hoverable': hoverable, 'app-card--no-padding': !padding },
    ]"
    :loading="loading"
    :variant="noBorder ? 'flat' : 'outlined'"
    rounded="lg"
  >
    <v-card-item v-if="title || $slots.header">
      <slot name="header">
        <v-card-title class="app-card__title text-subtitle-1 font-weight-semibold">
          {{ title }}
        </v-card-title>
        <v-card-subtitle
          v-if="subtitle"
          class="app-card__subtitle"
        >
          {{ subtitle }}
        </v-card-subtitle>
      </slot>
    </v-card-item>

    <v-card-text
      v-if="$slots.default"
      :class="{ 'pa-0': !padding }"
    >
      <slot />
    </v-card-text>

    <v-card-actions v-if="$slots.actions">
      <slot name="actions" />
    </v-card-actions>

    <slot name="footer" />
  </v-card>
</template>

<style scoped lang="scss">
  .app-card {
    background: rgb(var(--v-theme-surface));
    transition: box-shadow 0.2s ease, border-color 0.2s ease;

    &--hoverable:hover {
      box-shadow: 0 4px 12px rgba(16, 24, 40, 0.08);
    }

    &__title {
      letter-spacing: -0.01em;
      line-height: 1.4;
    }

    &__subtitle {
      opacity: 0.72;
      font-size: 0.8125rem;
    }
  }
</style>
