<script lang="ts" setup>
  import AppButton from './AppButton.vue'
  import type { ToolbarAction } from './types'

  interface Props {
    title?: string
    actions?: ToolbarAction[]
    bordered?: boolean
  }

  withDefaults(defineProps<Props>(), {
    bordered: true,
  })
</script>

<template>
  <div
    :class="['app-toolbar d-flex align-center flex-wrap ga-3', { 'app-toolbar--bordered': bordered }]"
  >
    <div
      v-if="title || $slots.title"
      class="app-toolbar__title text-subtitle-2 font-weight-semibold"
    >
      <slot name="title">{{ title }}</slot>
    </div>

    <v-spacer />

    <div class="d-flex align-center flex-wrap ga-2">
      <slot name="filters" />

      <template
        v-for="(action, index) in actions"
        :key="`${action.label}-${index}`"
      >
        <AppButton
          :disabled="action.disabled"
          :prepend-icon="action.icon"
          :to="action.to as string | undefined"
          :variant="action.variant ?? 'secondary'"
          size="small"
          @click="action.onClick?.()"
        >
          {{ action.label }}
        </AppButton>
      </template>

      <slot name="actions" />
    </div>
  </div>
</template>

<style scoped lang="scss">
  .app-toolbar {
    padding: 12px 0;

    &--bordered {
      border-bottom: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
      margin-bottom: 16px;
    }

    &__title {
      letter-spacing: -0.01em;
    }
  }
</style>
