<script lang="ts" setup>
  import AppButton from './AppButton.vue'

  interface Props {
    modelValue: boolean
    title: string
    message: string
    confirmLabel?: string
    cancelLabel?: string
    confirmColor?: string
    loading?: boolean
    destructive?: boolean
  }

  withDefaults(defineProps<Props>(), {
    confirmLabel: 'Confirmar',
    cancelLabel: 'Cancelar',
    confirmColor: 'primary',
    loading: false,
    destructive: false,
  })

  const emit = defineEmits<{
    'update:modelValue': [value: boolean]
    confirm: []
    cancel: []
  }>()

  function close (): void {
    emit('update:modelValue', false)
    emit('cancel')
  }

  function confirm (): void {
    emit('confirm')
  }
</script>

<template>
  <v-dialog
    :model-value="modelValue"
    max-width="440"
    @update:model-value="emit('update:modelValue', $event)"
  >
    <v-card
      class="confirm-dialog"
      rounded="lg"
    >
      <v-card-text class="pa-6">
        <div class="d-flex ga-4">
          <v-avatar
            :color="destructive ? 'error' : 'primary'"
            size="44"
            variant="tonal"
          >
            <v-icon :icon="destructive ? 'mdi-alert-circle-outline' : 'mdi-help-circle-outline'" />
          </v-avatar>

          <div>
            <h3 class="text-subtitle-1 font-weight-semibold mb-2">
              {{ title }}
            </h3>
            <p class="text-body-2 text-medium-emphasis mb-0">
              {{ message }}
            </p>
          </div>
        </div>
      </v-card-text>

      <v-card-actions class="pa-6 pt-0">
        <v-spacer />
        <AppButton
          variant="ghost"
          @click="close"
        >
          {{ cancelLabel }}
        </AppButton>
        <AppButton
          :loading="loading"
          :variant="destructive ? 'danger' : 'primary'"
          @click="confirm"
        >
          {{ confirmLabel }}
        </AppButton>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
