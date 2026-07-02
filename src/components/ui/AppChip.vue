<script lang="ts" setup>
  import { computed } from 'vue'
  import type { AppChipSize, AppChipVariant } from './types'

  interface Props {
    label?: string
    variant?: AppChipVariant
    size?: AppChipSize
    color?: string
    icon?: string
    closable?: boolean
    disabled?: boolean
  }

  const props = withDefaults(defineProps<Props>(), {
    variant: 'tonal',
    size: 'small',
    color: 'primary',
    closable: false,
    disabled: false,
  })

  const emit = defineEmits<{
    close: []
    click: [event: MouseEvent | KeyboardEvent]
  }>()

  const vuetifyVariant = computed(() => {
    const map: Record<AppChipVariant, 'flat' | 'outlined' | 'text' | 'tonal'> = {
      filled: 'flat',
      tonal: 'tonal',
      outlined: 'outlined',
      text: 'text',
    }
    return map[props.variant]
  })
</script>

<template>
  <v-chip
    :closable="closable"
    :color="color"
    :disabled="disabled"
    :prepend-icon="icon"
    :size="size"
    :variant="vuetifyVariant"
    class="app-chip"
    label
    rounded="lg"
    @click="emit('click', $event)"
    @click:close="emit('close')"
  >
    <slot>{{ label }}</slot>
  </v-chip>
</template>

<style scoped lang="scss">
  .app-chip {
    font-weight: 500;
  }
</style>
