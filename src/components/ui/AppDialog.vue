<script lang="ts" setup>
  interface Props {
    modelValue: boolean
    title?: string
    maxWidth?: string | number
    persistent?: boolean
    scrollable?: boolean
    fullscreen?: boolean
  }

  withDefaults(defineProps<Props>(), {
    maxWidth: 560,
    persistent: false,
    scrollable: false,
    fullscreen: false,
  })

  const emit = defineEmits<{
    'update:modelValue': [value: boolean]
  }>()

  function close (): void {
    emit('update:modelValue', false)
  }
</script>

<template>
  <v-dialog
    :fullscreen="fullscreen"
    :max-width="maxWidth"
    :model-value="modelValue"
    :persistent="persistent"
    :scrollable="scrollable"
    class="app-dialog"
    @update:model-value="emit('update:modelValue', $event)"
  >
    <v-card rounded="lg">
      <v-card-title
        v-if="title || $slots.header"
        class="app-dialog__header d-flex align-center justify-space-between pa-5 pb-0"
      >
        <slot name="header">
          <span class="text-h6 font-weight-semibold">{{ title }}</span>
        </slot>
        <v-btn
          aria-label="Fechar"
          icon="mdi-close"
          size="small"
          variant="text"
          @click="close"
        />
      </v-card-title>

      <v-card-text class="pa-5">
        <slot />
      </v-card-text>

      <v-card-actions
        v-if="$slots.actions"
        class="pa-5 pt-0"
      >
        <slot name="actions" />
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<style scoped lang="scss">
  .app-dialog__header {
    letter-spacing: -0.01em;
  }
</style>
