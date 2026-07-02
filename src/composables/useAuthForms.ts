import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { AUTH_ROUTE_PATHS } from '@/constants/auth.constants'
import { useAuthStore } from '@/stores'
import { useNotification } from '@/composables'
import { getErrorMessage } from '@/utils'

export function useLogin () {
  const authStore = useAuthStore()
  const router = useRouter()
  const { success, error } = useNotification()

  const email = ref('')
  const password = ref('')
  const showPassword = ref(false)

  const isValid = computed(() => email.value.trim() && password.value.length >= 6)

  async function submit (): Promise<void> {
    if (!isValid.value) return
    try {
      await authStore.login({ email: email.value.trim(), password: password.value })
      success('Bem-vindo ao NIRRON')
      await router.push('/dashboard')
    } catch (err) {
      error('Falha no login', getErrorMessage(err))
    }
  }

  return { email, password, showPassword, isValid, loading: computed(() => authStore.loading), submit }
}

export function useForgotPassword () {
  const authStore = useAuthStore()
  const router = useRouter()
  const { success, error } = useNotification()
  const email = ref('')
  const sent = ref(false)

  async function submit (): Promise<void> {
    try {
      await authStore.forgotPassword(email.value.trim())
      sent.value = true
      success('E-mail enviado', 'Verifique sua caixa de entrada.')
    } catch (err) {
      error('Erro', getErrorMessage(err))
    }
  }

  function goToLogin (): void {
    router.push(AUTH_ROUTE_PATHS.LOGIN)
  }

  return { email, sent, loading: computed(() => authStore.loading), submit, goToLogin }
}

export function useResetPassword () {
  const authStore = useAuthStore()
  const router = useRouter()
  const { success, error } = useNotification()
  const password = ref('')
  const passwordConfirmation = ref('')
  const showPassword = ref(false)

  const isValid = computed(() =>
    password.value.length >= 8 && password.value === passwordConfirmation.value,
  )

  async function submit (token: string): Promise<void> {
    if (!isValid.value) return
    try {
      await authStore.resetPassword({ token, password: password.value, passwordConfirmation: passwordConfirmation.value })
      success('Senha redefinida')
      await router.push(AUTH_ROUTE_PATHS.LOGIN)
    } catch (err) {
      error('Erro', getErrorMessage(err))
    }
  }

  return { password, passwordConfirmation, showPassword, isValid, loading: computed(() => authStore.loading), submit }
}
