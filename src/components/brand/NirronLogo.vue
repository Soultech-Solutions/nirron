<script lang="ts" setup>
  import { computed } from 'vue'
  import logoWhite from '@/assets/brand/nirron-logo-white.png'
  import { BRAND } from '@/constants/design.constants'

  interface Props {
    /** light = logo branco (fundos escuros); dark = logo escuro (fundos claros) */
    variant?: 'light' | 'dark'
    /** icon = apenas símbolo; full = símbolo + wordmark */
    mode?: 'full' | 'icon'
    height?: number
  }

  const props = withDefaults(defineProps<Props>(), {
    variant: 'light',
    mode: 'full',
    height: 36,
  })

  const iconSize = computed(() => props.height)

  const fullWidth = computed(() => Math.round(props.height * 2.25))
</script>

<template>
  <div
    :class="['nirron-logo', `nirron-logo--${variant}`, `nirron-logo--${mode}`]"
    :style="{ '--logo-height': `${height}px`, '--icon-size': `${iconSize}px` }"
  >
    <img
      v-if="mode === 'full'"
      :alt="`NIRRON — ${BRAND.tagline}`"
      :height="height"
      :src="logoWhite"
      :width="fullWidth"
      class="nirron-logo__image"
      decoding="async"
    >

    <span
      v-else
      :aria-label="`NIRRON — ${BRAND.tagline}`"
      class="nirron-logo__icon-crop"
      role="img"
    />
  </div>
</template>

<style scoped lang="scss">
  .nirron-logo {
    display: inline-flex;
    align-items: center;
    line-height: 0;

    &__image {
      height: var(--logo-height);
      width: auto;
      max-width: 100%;
      object-fit: contain;
      display: block;
    }

    &__icon-crop {
      display: block;
      width: var(--icon-size);
      height: var(--icon-size);
      background-image: url('@/assets/brand/nirron-logo-white.png');
      background-repeat: no-repeat;
      background-position: left center;
      background-size: calc(var(--icon-size) * 5.6) auto;
      flex-shrink: 0;
    }

    &--light {
      .nirron-logo__image,
      .nirron-logo__icon-crop {
        filter: none;
      }
    }

    &--dark {
      .nirron-logo__image,
      .nirron-logo__icon-crop {
        filter: brightness(0) saturate(100%);
      }
    }
  }
</style>
