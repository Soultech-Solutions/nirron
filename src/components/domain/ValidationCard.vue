<script lang="ts" setup>
  import { computed } from 'vue'
  import { AppButton, AppCard, SectionTitle, StatusBadge } from '@/components/ui'
  import type { ValidationCardData } from './types'
  import { ValidationResultEnum, ValidationStageEnum } from '@/enums'

  interface Props {
    data: ValidationCardData
    loading?: boolean
    actionLoading?: boolean
  }

  const props = defineProps<Props>()

  const emit = defineEmits<{
    click: []
    'validate-mercante': []
  }>()

  const isCeMercante = computed(() => props.data.stage === ValidationStageEnum.CE_MERCANTE)

  function statusVariant (status: ValidationResultEnum) {
    const map: Record<ValidationResultEnum, 'success' | 'danger' | 'warning' | 'pending' | 'neutral'> = {
      [ValidationResultEnum.APPROVED]: 'success',
      [ValidationResultEnum.REJECTED]: 'danger',
      [ValidationResultEnum.WARNING]: 'warning',
      [ValidationResultEnum.SKIPPED]: 'neutral',
      [ValidationResultEnum.PENDING]: 'pending',
    }
    return map[status]
  }
</script>

<template>
  <AppCard
    class="validation-card"
    hoverable
    @click="emit('click')"
  >
    <div class="d-flex align-start justify-space-between mb-3">
      <div>
        <SectionTitle :title="data.title" />
      </div>
      <StatusBadge
        :label="data.status"
        :variant="statusVariant(data.status)"
        dot
      />
    </div>

    <v-progress-linear
      :model-value="data.progress"
      class="mb-3"
      color="primary"
      height="6"
      rounded
    />

    <div class="d-flex align-center justify-space-between ga-3 flex-wrap">
      <div class="d-flex ga-4 text-caption text-medium-emphasis">
        <span>{{ data.fieldsApproved }}/{{ data.fieldsTotal }} aprovados</span>
        <span
          v-if="data.fieldsRejected"
          class="text-error"
        >{{ data.fieldsRejected }} rejeitados</span>
      </div>

      <v-tooltip
        v-if="isCeMercante"
        location="top"
        text="Consultar no Mercante"
      >
        <template #activator="{ props: tooltipProps }">
          <AppButton
            v-bind="tooltipProps"
            :loading="actionLoading"
            prepend-icon="mdi-ferry"
            size="small"
            variant="tonal"
            @click.stop="emit('validate-mercante')"
          >
            Validar dados
          </AppButton>
        </template>
      </v-tooltip>
    </div>

    <p
      v-if="data.aiSummary"
      class="text-caption text-medium-emphasis mt-3 mb-0"
    >
      {{ data.aiSummary }}
    </p>
  </AppCard>
</template>

<style scoped lang="scss">
  .validation-card {
    cursor: pointer;
  }
</style>
