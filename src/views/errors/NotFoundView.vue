<script lang="ts" setup>
  import { ROUTE_PATHS } from '@/constants'
</script>

<template>
  <v-container class="fill-height">
    <v-row
      align="center"
      justify="center"
    >
      <v-col
        class="text-center"
        cols="12"
        md="6"
      >
        <v-icon
          class="mb-4"
          color="primary"
          icon="mdi-map-marker-question-outline"
          size="64"
        />

        <h1 class="text-h4 font-weight-bold mb-2">
          404
        </h1>

        <p class="text-body-1 text-medium-emphasis mb-6">
          A página que você procura não foi encontrada.
        </p>

        <v-btn
          :to="ROUTE_PATHS.DASHBOARD"
          color="primary"
          prepend-icon="mdi-home-outline"
          variant="flat"
        >
          Voltar ao início
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>
