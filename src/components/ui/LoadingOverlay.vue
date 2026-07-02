<script lang="ts" setup>
  interface Props {
    modelValue?: boolean
    message?: string
    contained?: boolean
  }

  withDefaults(defineProps<Props>(), {
    modelValue: false,
    message: 'Carregando...',
    contained: false,
  })
</script>

<template>
  <v-overlay
    :contained="contained"
    :model-value="modelValue"
    class="loading-overlay align-center justify-center"
    persistent
    scrim="background"
    :opacity="0.85"
  >
    <div class="loading-overlay__content d-flex flex-column align-center ga-4">
      <v-progress-circular
        color="primary"
        indeterminate
        size="48"
        width="3"
      />
      <span class="text-body-2 text-medium-emphasis font-weight-medium">
        {{ message }}
      </span>
    </div>
  </v-overlay>
</template>

<style scoped lang="scss">
  .loading-overlay__content {
    padding: 24px;
    border-radius: 14px;
    background: rgb(var(--v-theme-surface));
    box-shadow: 0 8px 24px rgba(16, 24, 40, 0.12);
  }
</style>
