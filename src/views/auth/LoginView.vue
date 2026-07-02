<script lang="ts" setup>
  import { AppButton } from '@/components/ui'
  import { DEMO_CREDENTIALS } from '@/mocks/auth.mock'
  import { useLogin } from '@/composables/useAuthForms'

  const { email, password, showPassword, isValid, loading, submit } = useLogin()
</script>

<template>
  <v-card
    class="auth-card pa-6"
    max-width="400"
    rounded="lg"
    variant="outlined"
  >
    <h2 class="text-h6 font-weight-bold mb-1">
      Entrar
    </h2>
    <p class="text-body-2 text-medium-emphasis mb-6">
      Acesse a plataforma de conferência aduaneira
    </p>

    <v-form @submit.prevent="submit">
      <v-text-field
        v-model="email"
        autocomplete="email"
        density="comfortable"
        label="E-mail"
        prepend-inner-icon="mdi-email-outline"
        type="email"
        variant="outlined"
      />

      <v-text-field
        v-model="password"
        :type="showPassword ? 'text' : 'password'"
        autocomplete="current-password"
        density="comfortable"
        label="Senha"
        prepend-inner-icon="mdi-lock-outline"
        variant="outlined"
        :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
        @click:append-inner="showPassword = !showPassword"
      />

      <div class="d-flex justify-end mb-4">
        <router-link
          class="text-caption text-primary text-decoration-none"
          to="/auth/esqueci-senha"
        >
          Esqueci minha senha
        </router-link>
      </div>

      <AppButton
        :disabled="!isValid"
        :loading="loading"
        block
        type="submit"
      >
        Entrar
      </AppButton>
    </v-form>

    <v-alert
      class="mt-4"
      density="compact"
      type="info"
      variant="tonal"
    >
      Demo: {{ DEMO_CREDENTIALS.email }} / {{ DEMO_CREDENTIALS.password }}
    </v-alert>
  </v-card>
</template>

<style scoped lang="scss">
  .auth-card {
    width: 100%;
    text-align: left;
  }
</style>
