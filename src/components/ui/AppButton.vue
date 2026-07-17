<script lang="ts" setup>
  import { computed } from 'vue'
  import type { AppButtonSize, AppButtonVariant } from './types'

  interface Props {
    variant?: AppButtonVariant
    size?: AppButtonSize
    icon?: string
    prependIcon?: string
    appendIcon?: string
    loading?: boolean
    disabled?: boolean
    block?: boolean
    to?: string
    href?: string
    type?: 'button' | 'submit' | 'reset'
  }

  const props = withDefaults(defineProps<Props>(), {
    variant: 'primary',
    size: 'default',
    loading: false,
    disabled: false,
    block: false,
    type: 'button',
  })

  const emit = defineEmits<{
    click: [event: MouseEvent]
  }>()

  const vuetifyVariant = computed(() => {
    const map: Record<AppButtonVariant, 'flat' | 'outlined' | 'text' | 'tonal'> = {
      primary: 'flat',
      secondary: 'outlined',
      ghost: 'text',
      danger: 'flat',
      success: 'flat',
      tonal: 'tonal',
    }
    return map[props.variant]
  })

  const vuetifyColor = computed(() => {
    const map: Record<AppButtonVariant, string | undefined> = {
      primary: 'primary',
      secondary: 'on-surface',
      ghost: 'on-surface',
      danger: 'error',
      success: 'success',
      tonal: 'primary',
    }
    return map[props.variant]
  })

  const density = computed(() => {
    const map: Record<AppButtonSize, 'compact' | 'default' | 'comfortable'> = {
      'x-small': 'compact',
      small: 'compact',
      default: 'default',
      large: 'comfortable',
    }
    return map[props.size]
  })
</script>

<template>
  <v-btn
    :append-icon="appendIcon"
    :block="block"
    :color="vuetifyColor"
    :density="density"
    :disabled="disabled"
    :href="href"
    :icon="icon && !$slots.default ? icon : undefined"
    :loading="loading"
    :prepend-icon="prependIcon"
    :size="size"
    :to="to"
    :type="type"
    :variant="vuetifyVariant"
    class="app-button"
    rounded="lg"
    @click="emit('click', $event)"
  >
    <slot />
  </v-btn>
</template>

<style scoped lang="scss">
  .app-button {
    font-weight: 500;
    letter-spacing: 0.01em;
    text-transform: none;

    &:focus-visible {
      outline: 2px solid rgb(var(--v-theme-primary));
      outline-offset: 2px;
    }

    :deep(.v-btn__overlay) {
      opacity: 0;
    }

    &:hover :deep(.v-btn__overlay) {
      opacity: var(--v-hover-opacity);
    }
  }
</style>
