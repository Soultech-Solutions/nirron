import type { RouteRecordRaw } from 'vue-router'
import { AUTH_ROUTE_NAMES, AUTH_ROUTE_PATHS } from '@/constants/auth.constants'
import AuthLayout from '@/layouts/AuthLayout.vue'

const LoginView = () => import('@/views/auth/LoginView.vue')
const ForgotPasswordView = () => import('@/views/auth/ForgotPasswordView.vue')
const ResetPasswordView = () => import('@/views/auth/ResetPasswordView.vue')

export const authRoutes: RouteRecordRaw[] = [
  {
    path: '/auth',
    component: AuthLayout,
    meta: { requiresAuth: false },
    children: [
      {
        path: 'login',
        name: AUTH_ROUTE_NAMES.LOGIN,
        component: LoginView,
        meta: { title: 'Login', requiresAuth: false },
      },
      {
        path: 'esqueci-senha',
        name: AUTH_ROUTE_NAMES.FORGOT_PASSWORD,
        component: ForgotPasswordView,
        meta: { title: 'Esqueci minha senha', requiresAuth: false },
      },
      {
        path: 'redefinir-senha',
        name: AUTH_ROUTE_NAMES.RESET_PASSWORD,
        component: ResetPasswordView,
        meta: { title: 'Redefinir senha', requiresAuth: false },
      },
      {
        path: '',
        redirect: AUTH_ROUTE_PATHS.LOGIN,
      },
    ],
  },
]
