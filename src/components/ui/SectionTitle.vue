<script lang="ts" setup>
  interface Props {
    title: string
    subtitle?: string
    actionLabel?: string
  }

  defineProps<Props>()

  const emit = defineEmits<{
    action: []
  }>()
</script>

<template>
  <div class="section-title d-flex align-center justify-space-between mb-4">
    <div>
      <h2 class="section-title__heading text-subtitle-1 font-weight-semibold mb-0">
        {{ title }}
      </h2>
      <p
        v-if="subtitle"
        class="section-title__subtitle text-caption text-medium-emphasis mb-0 mt-1"
      >
        {{ subtitle }}
      </p>
    </div>

    <div class="d-flex align-center ga-2">
      <slot name="actions" />
      <v-btn
        v-if="actionLabel"
        class="text-none"
        color="primary"
        size="small"
        variant="text"
        @click="emit('action')"
      >
        {{ actionLabel }}
        <v-icon
          end
          icon="mdi-chevron-right"
          size="16"
        />
      </v-btn>
    </div>
  </div>
</template>

<style scoped lang="scss">
  .section-title__heading {
    letter-spacing: -0.01em;
  }
</style>
