<script lang="ts" setup>
  import { onMounted, ref } from 'vue'
  import { useRoute } from 'vue-router'
  import { AppButton } from '@/components/ui'
  import { useResetPassword } from '@/composables/useAuthForms'

  const route = useRoute()
  const token = ref('')

  const { password, passwordConfirmation, showPassword, isValid, loading, submit } = useResetPassword()

  onMounted(() => {
    token.value = (route.query.token as string) ?? 'demo-token'
  })
</script>

<template>
  <v-card
    class="auth-card pa-6"
    max-width="400"
    rounded="lg"
    variant="outlined"
  >
    <h2 class="text-h6 font-weight-bold mb-1">
      Redefinir senha
    </h2>
    <p class="text-body-2 text-medium-emphasis mb-6">
      Crie uma nova senha para sua conta
    </p>

    <v-form @submit.prevent="submit(token)">
      <v-text-field
        v-model="password"
        :type="showPassword ? 'text' : 'password'"
        density="comfortable"
        label="Nova senha"
        prepend-inner-icon="mdi-lock-outline"
        variant="outlined"
      />

      <v-text-field
        v-model="passwordConfirmation"
        :type="showPassword ? 'text' : 'password'"
        density="comfortable"
        label="Confirmar senha"
        prepend-inner-icon="mdi-lock-check-outline"
        variant="outlined"
      />

      <AppButton
        :disabled="!isValid"
        :loading="loading"
        block
        type="submit"
      >
        Redefinir senha
      </AppButton>
    </v-form>
  </v-card>
</template>

<style scoped lang="scss">
  .auth-card {
    width: 100%;
    text-align: left;
  }
</style>
