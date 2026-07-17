<script lang="ts" setup>
  import { computed } from 'vue'
  import { useRoute } from 'vue-router'
  import type { BreadcrumbItem } from '@/components/ui/types'
  import { APP_NAME } from '@/constants'

  const route = useRoute()

  const breadcrumbs = computed<BreadcrumbItem[]>(() => {
    const items: BreadcrumbItem[] = [
      { title: APP_NAME, to: '/' },
    ]

    const matched = route.matched.filter((r) => r.meta?.title && r.name !== 'home')

    matched.forEach((record, index) => {
      const isLast = index === matched.length - 1
      items.push({
        title: record.meta.title as string,
        to: isLast ? undefined : { name: record.name },
        disabled: isLast,
      })
    })

    return items
  })
</script>

<template>
  <v-breadcrumbs
    :items="breadcrumbs"
    class="app-breadcrumb px-0"
    density="compact"
  >
    <template #divider>
      <v-icon
        class="app-breadcrumb__divider"
        icon="mdi-chevron-right"
        size="14"
      />
    </template>
    <template #item="{ item }">
      <v-breadcrumbs-item
        :class="[
          'app-breadcrumb__item text-caption',
          { 'app-breadcrumb__item--root': item.title === APP_NAME && !item.disabled },
        ]"
        :disabled="item.disabled"
        :to="item.to"
      >
        {{ item.title }}
      </v-breadcrumbs-item>
    </template>
  </v-breadcrumbs>
</template>

<style scoped lang="scss">
  .app-breadcrumb {
    min-height: 28px;

    &__item {
      font-weight: 500;
      color: rgb(var(--v-theme-on-surface-variant));
      opacity: 1;

      &--root:not(.v-breadcrumbs-item--disabled) {
        color: rgb(var(--v-theme-primary)) !important;
        font-weight: 600;

        &:hover {
          text-decoration: underline;
          text-underline-offset: 3px;
        }
      }
    }

    :deep(.v-breadcrumbs-item--disabled) {
      opacity: 0.95 !important;
      color: rgb(var(--v-theme-on-surface)) !important;
    }

    &__divider {
      color: rgb(var(--v-theme-on-surface-variant)) !important;
      opacity: 0.8;
    }
  }
</style>
