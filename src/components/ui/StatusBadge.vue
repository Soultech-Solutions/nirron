<script lang="ts" setup>
  import { computed } from 'vue'
  import type { StatusBadgeVariant } from './types'

  interface Props {
    variant?: StatusBadgeVariant
    label: string
    dot?: boolean
    size?: 'small' | 'default'
  }

  const props = withDefaults(defineProps<Props>(), {
    variant: 'neutral',
    dot: false,
    size: 'default',
  })

  const badgeColor = computed(() => {
    const map: Record<StatusBadgeVariant, string> = {
      success: 'success',
      warning: 'warning',
      danger: 'error',
      info: 'info',
      neutral: 'secondary',
      pending: 'warning',
      primary: 'primary',
    }
    return map[props.variant]
  })
</script>

<template>
  <v-chip
    :class="['status-badge', `status-badge--${size}`]"
    :color="badgeColor"
    :prepend-icon="dot ? 'mdi-circle' : undefined"
    :size="size === 'small' ? 'x-small' : 'small'"
    label
    variant="tonal"
  >
    <slot>{{ label }}</slot>
  </v-chip>
</template>

<style scoped lang="scss">
  .status-badge {
    border: 1px solid currentColor;
    font-weight: 600;
    letter-spacing: 0.02em;

    &--small {
      font-size: 0.6875rem;
    }

    :deep(.v-icon) {
      font-size: 6px !important;
    }
  }
</style>
