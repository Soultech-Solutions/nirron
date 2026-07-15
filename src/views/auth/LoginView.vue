<script lang="ts" setup>
  import { ref } from 'vue'
  import { AppButton } from '@/components/ui'
  import { useLogin } from '@/composables/useAuthForms'
  import { USE_MOCK_AUTH } from '@/services'

  const { email, password, showPassword, isValid, loading, submit } = useLogin()

  // Carrega a credencial demo apenas em modo mock, mantendo o módulo de mocks
  // fora do carregamento em produção.
  const demoCredentials = ref<{ email: string, password: string } | null>(null)
  if (USE_MOCK_AUTH) {
    import('@/mocks/auth.mock').then(module => {
      demoCredentials.value = module.DEMO_CREDENTIALS
    })
  }
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
        :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
        autocomplete="current-password"
        density="comfortable"
        label="Senha"
        prepend-inner-icon="mdi-lock-outline"
        :type="showPassword ? 'text' : 'password'"
        variant="outlined"
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
        block
        :disabled="!isValid"
        :loading="loading"
        type="submit"
      >
        Entrar
      </AppButton>
    </v-form>

    <v-alert
      v-if="demoCredentials"
      class="mt-4"
      density="compact"
      type="info"
      variant="tonal"
    >
      Demo: {{ demoCredentials.email }} / {{ demoCredentials.password }}
    </v-alert>
  </v-card>
</template>

<style scoped lang="scss">
  .auth-card {
    width: 100%;
    text-align: left;
  }
</style>
