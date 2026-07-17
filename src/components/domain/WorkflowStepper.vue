<script lang="ts" setup>
  import { computed } from 'vue'
  import { StatusBadge } from '@/components/ui'
  import type { WorkflowStep } from './types'
  import { ValidationResultEnum } from '@/enums'

  interface Props {
    steps: WorkflowStep[]
    currentStage: string
    clickable?: boolean
  }

  const props = withDefaults(defineProps<Props>(), {
    clickable: false,
  })

  const emit = defineEmits<{
    'step-click': [stage: string]
  }>()

  const currentIndex = computed(() =>
    props.steps.findIndex((s) => s.stage === props.currentStage),
  )

  function stepColor (status: ValidationResultEnum): string {
    const map: Record<ValidationResultEnum, string> = {
      [ValidationResultEnum.APPROVED]: 'success',
      [ValidationResultEnum.REJECTED]: 'error',
      [ValidationResultEnum.WARNING]: 'warning',
      [ValidationResultEnum.SKIPPED]: 'secondary',
      [ValidationResultEnum.PENDING]: 'primary',
    }
    return map[status]
  }

  function isComplete (index: number): boolean {
    return index < currentIndex.value
  }

  function isCurrent (index: number): boolean {
    return index === currentIndex.value
  }
</script>

<template>
  <div class="workflow-stepper">
    <div class="workflow-stepper__track d-flex align-center">
      <template
        v-for="(step, index) in steps"
        :key="step.stage"
      >
        <div
          :class="{
            'workflow-stepper__step--complete': isComplete(index),
            'workflow-stepper__step--current': isCurrent(index),
            'workflow-stepper__step--clickable': clickable,
          }"
          class="workflow-stepper__step d-flex flex-column align-center"
          @click="clickable && emit('step-click', step.stage)"
        >
          <v-avatar
            :color="isCurrent(index) ? 'primary' : isComplete(index) ? stepColor(step.status) : 'surface-variant'"
            :variant="isCurrent(index) || isComplete(index) ? 'flat' : 'tonal'"
            size="36"
          >
            <v-icon
              v-if="isComplete(index) && step.status === ValidationResultEnum.APPROVED"
              icon="mdi-check"
              size="18"
            />
            <span
              v-else
              class="text-caption font-weight-bold"
            >{{ index + 1 }}</span>
          </v-avatar>
          <span class="workflow-stepper__label text-caption mt-2 text-center">
            {{ step.label }}
          </span>
          <StatusBadge
            v-if="step.status !== ValidationResultEnum.PENDING"
            :label="step.status === ValidationResultEnum.APPROVED ? 'OK' : step.status === ValidationResultEnum.REJECTED ? 'Erro' : 'Alerta'"
            :variant="step.status === ValidationResultEnum.APPROVED ? 'success' : step.status === ValidationResultEnum.REJECTED ? 'danger' : 'warning'"
            class="mt-1"
            size="small"
          />
        </div>
        <v-divider
          v-if="index < steps.length - 1"
          :class="{ 'workflow-stepper__divider--active': isComplete(index) }"
          class="workflow-stepper__divider flex-grow-1 mx-2"
        />
      </template>
    </div>
  </div>
</template>

<style scoped lang="scss">
  .workflow-stepper {
    overflow-x: auto;
    padding: 8px 0;

    &__track {
      min-width: 720px;
    }

    &__step {
      min-width: 90px;
      flex-shrink: 0;

      &--clickable {
        cursor: pointer;
      }

      &--current .workflow-stepper__label {
        font-weight: 600;
        color: rgb(var(--v-theme-primary));
      }
    }

    &__label {
      max-width: 100px;
      line-height: 1.2;
    }

    &__divider {
      max-width: 60px;
      opacity: 1;
      border-color: rgba(var(--v-theme-on-surface), 0.28) !important;

      &--active {
        border-color: rgb(var(--v-theme-success)) !important;
      }
    }
  }
</style>
