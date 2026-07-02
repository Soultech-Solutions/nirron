<script lang="ts" setup>
  import { computed } from 'vue'
  import type { SkeletonType } from './types'

  interface Props {
    type?: SkeletonType
    loading?: boolean
    rows?: number
  }

  const props = withDefaults(defineProps<Props>(), {
    type: 'card',
    loading: true,
    rows: 3,
  })

  const skeletonType = computed(() => {
    const map: Record<SkeletonType, string> = {
      card: 'card',
      text: 'paragraph',
      table: 'table-row@5',
      avatar: 'avatar, text',
      chart: 'image',
    }
    return map[props.type]
  })
</script>

<template>
  <v-skeleton-loader
    v-if="loading"
    :type="skeletonType"
    class="loading-skeleton"
    rounded="lg"
  />
  <slot v-else />
</template>

<style scoped lang="scss">
  .loading-skeleton {
    background: transparent;
  }
</style>
