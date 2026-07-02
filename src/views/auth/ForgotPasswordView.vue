<script lang="ts" setup>
  import { AppButton } from '@/components/ui'
  import { useForgotPassword } from '@/composables/useAuthForms'

  const { email, sent, loading, submit, goToLogin } = useForgotPassword()
</script>

<template>
  <v-card
    class="auth-card pa-6"
    max-width="400"
    rounded="lg"
    variant="outlined"
  >
    <template v-if="!sent">
      <h2 class="text-h6 font-weight-bold mb-1">
        Esqueci minha senha
      </h2>
      <p class="text-body-2 text-medium-emphasis mb-6">
        Informe seu e-mail para receber o link de redefinição
      </p>

      <v-form @submit.prevent="submit">
        <v-text-field
          v-model="email"
          density="comfortable"
          label="E-mail"
          prepend-inner-icon="mdi-email-outline"
          type="email"
          variant="outlined"
        />

        <AppButton
          :disabled="!email.trim()"
          :loading="loading"
          block
          class="mb-3"
          type="submit"
        >
          Enviar link
        </AppButton>

        <AppButton
          block
          variant="ghost"
          @click="goToLogin"
        >
          Voltar ao login
        </AppButton>
      </v-form>
    </template>

    <template v-else>
      <v-icon
        class="mb-4"
        color="success"
        icon="mdi-email-check-outline"
        size="48"
      />
      <h2 class="text-h6 font-weight-bold mb-2">
        E-mail enviado
      </h2>
      <p class="text-body-2 text-medium-emphasis mb-6">
        Verifique sua caixa de entrada e siga as instruções para redefinir sua senha.
      </p>
      <AppButton
        block
        @click="goToLogin"
      >
        Voltar ao login
      </AppButton>
    </template>
  </v-card>
</template>

<style scoped lang="scss">
  .auth-card {
    width: 100%;
    text-align: left;
  }
</style>
