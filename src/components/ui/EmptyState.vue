<script lang="ts" setup>
  import AppButton from './AppButton.vue'

  interface Props {
    icon?: string
    title: string
    description?: string
    actionLabel?: string
    compact?: boolean
  }

  withDefaults(defineProps<Props>(), {
    icon: 'mdi-inbox-outline',
    compact: false,
  })

  const emit = defineEmits<{
    action: []
  }>()
</script>

<template>
  <div
    :class="['empty-state', { 'empty-state--compact': compact }]"
    class="d-flex flex-column align-center justify-center text-center"
  >
    <v-avatar
      class="empty-state__icon mb-4"
      color="surface-variant"
      :size="compact ? 56 : 72"
      variant="flat"
    >
      <v-icon
        :icon="icon"
        :size="compact ? 28 : 36"
        color="primary"
      />
    </v-avatar>

    <h3 class="text-subtitle-1 font-weight-semibold mb-2">
      {{ title }}
    </h3>

    <p
      v-if="description"
      class="empty-state__description text-body-2 text-medium-emphasis mb-4"
    >
      {{ description }}
    </p>

    <slot />

    <AppButton
      v-if="actionLabel"
      class="mt-2"
      @click="emit('action')"
    >
      {{ actionLabel }}
    </AppButton>
  </div>
</template>

<style scoped lang="scss">
  .empty-state {
    padding: 48px 24px;

    &--compact {
      padding: 24px 16px;
    }

    &__description {
      max-width: 360px;
    }

    &__icon {
      border: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
    }
  }
</style>
