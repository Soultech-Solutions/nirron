<script lang="ts" setup>
  import { computed } from 'vue'
  import { StatusBadge } from '@/components/ui'
  import { ApprovalStatusEnum } from '@/enums'

  interface Props {
    status: ApprovalStatusEnum | string
    label?: string
    size?: 'small' | 'default'
  }

  const props = withDefaults(defineProps<Props>(), {
    size: 'default',
  })

  const config = computed(() => {
    const map: Record<string, { label: string; variant: 'success' | 'danger' | 'warning' | 'pending'; icon: string }> = {
      [ApprovalStatusEnum.AUTHORIZED]: { label: 'Autorizado', variant: 'success', icon: 'mdi-check-circle' },
      [ApprovalStatusEnum.NOT_AUTHORIZED]: { label: 'Não Autorizado', variant: 'danger', icon: 'mdi-close-circle' },
      [ApprovalStatusEnum.BLOCKED]: { label: 'Bloqueado', variant: 'danger', icon: 'mdi-block-helper' },
      [ApprovalStatusEnum.PENDING]: { label: 'Pendente', variant: 'pending', icon: 'mdi-clock-outline' },
    }
    return map[props.status] ?? { label: String(props.status), variant: 'pending' as const, icon: 'mdi-help-circle' }
  })
</script>

<template>
  <div class="approval-status d-flex align-center ga-2">
    <v-icon
      :color="config.variant === 'success' ? 'success' : config.variant === 'danger' ? 'error' : 'warning'"
      :icon="config.icon"
      :size="size === 'small' ? 18 : 22"
    />
    <StatusBadge
      :label="label ?? config.label"
      :variant="config.variant"
      :size="size"
      dot
    />
  </div>
</template>
