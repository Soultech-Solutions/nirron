<script lang="ts" setup>
  import { onMounted } from 'vue'
  import { useRouter } from 'vue-router'
  import { OperationStatus } from '@/enums'
  import {
    AppButton,
    EmptyState,
    LoadingSkeleton,
    PageHeader,
    StatusBadge,
    Toolbar,
  } from '@/components/ui'
  import { ROUTE_PATHS } from '@/constants'
  import { useImportsList, OPERATION_STATUS_LABELS } from '@/imports/composables/useImports'
  import { formatDateTime, formatNcm } from '@/utils'

  const router = useRouter()

  const {
    loading,
    errorMessage,
    items,
    meta,
    query,
    selectedIds,
    drawerOpen,
    drawerItem,
    statusOptions,
    fetchList,
    setSearch,
    setStatus,
    setPage,
    setSort,
    toggleSelect,
    toggleSelectAll,
    openDrawer,
    closeDrawer,
    exportSelected,
  } = useImportsList()

  onMounted(() => fetchList())

  function statusVariant (status: OperationStatus) {
    const map: Record<OperationStatus, 'success' | 'warning' | 'danger' | 'info' | 'pending' | 'neutral'> = {
      [OperationStatus.PENDING]: 'pending',
      [OperationStatus.IN_REVIEW]: 'info',
      [OperationStatus.IN_CONFERENCE]: 'info',
      [OperationStatus.COMPLETED]: 'success',
      [OperationStatus.APPROVED]: 'success',
      [OperationStatus.BLOCKED]: 'danger',
      [OperationStatus.CANCELLED]: 'neutral',
    }
    return map[status]
  }

  function goToDetail (id: string): void {
    router.push(`${ROUTE_PATHS.IMPORTS}/${id}`)
  }

  let searchTimeout: ReturnType<typeof setTimeout>
  function onSearchInput (value: string): void {
    clearTimeout(searchTimeout)
    searchTimeout = setTimeout(() => setSearch(value), 300)
  }
</script>

<template>
  <div class="imports-page">
    <PageHeader
      subtitle="Gerencie todas as operações de importação — DI e DUIMP."
      title="Importações"
    >
      <template #actions>
        <AppButton
          :disabled="!selectedIds.length"
          prepend-icon="mdi-export"
          variant="secondary"
          @click="exportSelected"
        >
          Exportar ({{ selectedIds.length }})
        </AppButton>
        <AppButton
          :to="ROUTE_PATHS.CONFERENCE_NEW"
          prepend-icon="mdi-plus"
        >
          Nova importação
        </AppButton>
      </template>
    </PageHeader>

    <Toolbar bordered>
      <template #filters>
        <v-text-field
          :model-value="query.search"
          density="compact"
          hide-details
          placeholder="Pesquisar referência, cliente..."
          prepend-inner-icon="mdi-magnify"
          style="min-width: 280px"
          variant="outlined"
          @update:model-value="onSearchInput"
        />
        <v-select
          :items="statusOptions"
          density="compact"
          hide-details
          item-title="label"
          item-value="value"
          label="Status"
          style="min-width: 160px"
          variant="outlined"
          @update:model-value="setStatus"
        />
      </template>
    </Toolbar>

    <v-alert
      v-if="errorMessage"
      class="mb-4"
      density="compact"
      type="error"
      variant="tonal"
    >
      {{ errorMessage }}
    </v-alert>

    <LoadingSkeleton
      :loading="loading"
      type="table"
    >
      <v-card
        rounded="lg"
        variant="outlined"
      >
        <v-table
          class="imports-table"
          hover
        >
          <thead>
            <tr>
              <th style="width: 48px">
                <v-btn
                  :icon="selectedIds.length === items.length && items.length > 0
                    ? 'mdi-checkbox-marked'
                    : selectedIds.length > 0
                      ? 'mdi-minus-box'
                      : 'mdi-checkbox-blank-outline'"
                  size="small"
                  variant="text"
                  @click.stop="toggleSelectAll"
                />
              </th>
              <th
                class="sortable"
                @click="setSort('company')"
              >
                Empresa
              </th>
              <th class="d-none d-lg-table-cell">
                Importador
              </th>
              <th class="d-none d-md-table-cell">
                DI / DUIMP
              </th>
              <th class="d-none d-sm-table-cell">
                Invoice
              </th>
              <th class="d-none d-lg-table-cell">
                NCM
              </th>
              <th class="d-none d-md-table-cell">
                Responsável
              </th>
              <th>Status</th>
              <th
                class="d-none d-sm-table-cell sortable"
                @click="setSort('updatedAt')"
              >
                Atualizado
              </th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="item in items"
              :key="item.id"
              class="imports-table__row"
              @click="goToDetail(item.id)"
            >
              <td @click.stop>
                <v-btn
                  :icon="selectedIds.includes(item.id)
                    ? 'mdi-checkbox-marked'
                    : 'mdi-checkbox-blank-outline'"
                  size="small"
                  variant="text"
                  @click="toggleSelect(item.id)"
                />
              </td>
              <td class="font-weight-medium">
                {{ item.company }}
              </td>
              <td class="d-none d-lg-table-cell text-caption">
                {{ item.importer }}
              </td>
              <td class="d-none d-md-table-cell text-caption">
                {{ item.diNumber ?? item.duimpNumber ?? '—' }}
              </td>
              <td class="d-none d-sm-table-cell text-caption">
                {{ item.invoiceNumber }}
              </td>
              <td class="d-none d-lg-table-cell text-caption">
                {{ formatNcm(item.ncm) }}
              </td>
              <td class="d-none d-md-table-cell text-caption">
                {{ item.responsible }}
              </td>
              <td>
                <StatusBadge
                  :label="OPERATION_STATUS_LABELS[item.status]"
                  :variant="statusVariant(item.status)"
                  dot
                  size="small"
                />
              </td>
              <td class="d-none d-sm-table-cell text-caption text-medium-emphasis">
                {{ formatDateTime(item.updatedAt) }}
              </td>
            </tr>
          </tbody>
        </v-table>

        <EmptyState
          v-if="!items.length && !loading"
          class="py-8"
          description="Nenhuma importação encontrada com os filtros aplicados."
          icon="mdi-package-variant"
          title="Sem resultados"
        />

        <div
          v-if="meta.total > 0"
          class="d-flex align-center justify-space-between pa-4"
        >
          <span class="text-caption text-medium-emphasis">
            {{ meta.from }}–{{ meta.to }} de {{ meta.total }}
          </span>
          <v-pagination
            :length="meta.lastPage"
            :model-value="meta.currentPage"
            density="compact"
            @update:model-value="setPage"
          />
        </div>
      </v-card>
    </LoadingSkeleton>

    <v-navigation-drawer
      v-model="drawerOpen"
      location="right"
      temporary
      width="400"
    >
      <template v-if="drawerItem">
        <div class="pa-5">
          <div class="d-flex align-center justify-space-between mb-4">
            <h3 class="text-subtitle-1 font-weight-bold">
              {{ drawerItem.company }}
            </h3>
            <v-btn
              icon="mdi-close"
              size="small"
              variant="text"
              @click="closeDrawer"
            />
          </div>
          <v-list density="compact">
            <v-list-item :title="drawerItem.importer" subtitle="Importador" />
            <v-list-item :title="drawerItem.exporter" subtitle="Exportador" />
            <v-list-item :title="drawerItem.invoiceNumber" subtitle="Invoice" />
            <v-list-item
              :title="drawerItem.diNumber ?? drawerItem.duimpNumber ?? '—'"
              subtitle="DI / DUIMP"
            />
            <v-list-item :title="formatNcm(drawerItem.ncm)" subtitle="NCM" />
            <v-list-item :title="drawerItem.responsible" subtitle="Responsável" />
          </v-list>
          <AppButton
            block
            class="mt-4"
            @click="goToDetail(drawerItem.id)"
          >
            Ver detalhes completos
          </AppButton>
        </div>
      </template>
    </v-navigation-drawer>
  </div>
</template>

<style scoped lang="scss">
  .imports-table {
    :deep(th) {
      font-size: 0.6875rem !important;
      text-transform: uppercase;
      letter-spacing: 0.04em;
      opacity: 0.7;
      white-space: nowrap;
    }

    &__row {
      cursor: pointer;
    }

    .sortable {
      cursor: pointer;
      user-select: none;

      &:hover {
        opacity: 1;
      }
    }
  }
</style>
