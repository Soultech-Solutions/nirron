<script lang="ts" setup>
  import type { BreadcrumbItem } from './types'

  interface Props {
    title: string
    subtitle?: string
    breadcrumbs?: BreadcrumbItem[]
  }

  defineProps<Props>()
</script>

<template>
  <header class="page-header mb-6">
    <v-breadcrumbs
      v-if="breadcrumbs?.length"
      :items="breadcrumbs"
      class="page-header__breadcrumbs px-0 mb-2"
      density="compact"
    >
      <template #divider>
        <v-icon
          icon="mdi-chevron-right"
          size="14"
        />
      </template>
      <template #item="{ item }">
        <v-breadcrumbs-item
          :disabled="item.disabled"
          :to="item.to"
          class="text-caption"
        >
          {{ item.title }}
        </v-breadcrumbs-item>
      </template>
    </v-breadcrumbs>

    <div class="d-flex flex-wrap align-center justify-space-between ga-4">
      <div>
        <h1 class="page-header__title text-h5 font-weight-bold mb-1">
          {{ title }}
        </h1>
        <p
          v-if="subtitle"
          class="page-header__subtitle text-body-2 text-medium-emphasis mb-0"
        >
          {{ subtitle }}
        </p>
      </div>

      <div
        v-if="$slots.actions"
        class="d-flex flex-wrap align-center ga-2"
      >
        <slot name="actions" />
      </div>
    </div>

    <div
      v-if="$slots.tabs"
      class="mt-4"
    >
      <slot name="tabs" />
    </div>
  </header>
</template>

<style scoped lang="scss">
  .page-header {
    &__title {
      letter-spacing: -0.02em;
      line-height: 1.3;
    }

    &__subtitle {
      max-width: 640px;
    }

    &__breadcrumbs {
      :deep(.v-breadcrumbs-item) {
        font-size: 0.75rem;
      }
    }
  }
</style>
