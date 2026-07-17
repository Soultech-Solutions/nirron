<script lang="ts" setup>
  import { onMounted } from 'vue'
  import {
    DashboardAlerts,
    DashboardKpiGrid,
    DashboardMonthlyChart,
    DashboardProductivity,
    DashboardRecentOperations,
    DashboardStageStatus,
    DashboardTimeline,
  } from '@/components/dashboard'
  import { AppButton, PageHeader } from '@/components/ui'
  import { useDashboard } from '@/dashboard/composables/useDashboard'

  const { loading, errorMessage, data, fetchDashboard } = useDashboard()

  onMounted(() => {
    fetchDashboard()
  })
</script>

<template>
  <div class="dashboard">
    <PageHeader
      subtitle="Visão geral das operações de conferência aduaneira em tempo real."
      title="Dashboard"
    >
      <template #actions>
        <AppButton
          prepend-icon="mdi-refresh"
          variant="secondary"
          :loading="loading"
          @click="fetchDashboard"
        >
          Atualizar
        </AppButton>
      </template>
    </PageHeader>

    <v-alert
      v-if="errorMessage"
      class="mb-6"
      density="compact"
      type="error"
      variant="tonal"
    >
      {{ errorMessage }}
    </v-alert>

    <DashboardKpiGrid
      class="mb-6"
      :items="data.kpis"
      :loading="loading"
    />

    <DashboardProductivity
      class="mb-6"
      :items="data.productivity"
      :loading="loading"
    />

    <v-row class="mb-6">
      <v-col
        cols="12"
        lg="8"
      >
        <DashboardMonthlyChart
          :data="data.monthlyChart"
          :loading="loading"
        />
      </v-col>
      <v-col
        cols="12"
        lg="4"
      >
        <DashboardStageStatus
          :loading="loading"
          :stages="data.stageStatus"
        />
      </v-col>
    </v-row>

    <v-row class="mb-6">
      <v-col
        cols="12"
        lg="5"
      >
        <DashboardTimeline
          :items="data.timeline"
          :loading="loading"
        />
      </v-col>
      <v-col
        cols="12"
        lg="7"
      >
        <DashboardAlerts
          :alerts="data.alerts"
          :loading="loading"
        />
      </v-col>
    </v-row>

    <DashboardRecentOperations
      :loading="loading"
      :operations="data.recentOperations"
    />
  </div>
</template>

<style scoped lang="scss">
  .dashboard {
    animation: fadeIn 0.3s ease;
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(4px);
    }

    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
</style>
