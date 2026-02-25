<template>
  <div class="avatar-wrap" :class="sizeClass" :style="{ background: !src ? bgColor : 'transparent' }">
    <img v-if="src" :src="src" :alt="name" @error="onError" />
    <span v-else class="avatar-text">{{ initials }}</span>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { avatarColor, avatarInitials } from '../utils.js'

const props = defineProps({
  src: { type: String, default: '' },
  name: { type: String, default: '' },
  size: { type: String, default: 'md' } // 'sm' | 'md' | 'lg' | 'xl'
})

const imgFailed = ref(false)

const bgColor = computed(() => avatarColor(props.name))
const initials = computed(() => avatarInitials(props.name))
const sizeClass = computed(() => `avatar-${props.size}`)

function onError() {
  imgFailed.value = true
}
</script>

<style scoped>
.avatar-wrap {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 16px;
  color: #fff;
  flex-shrink: 0;
  overflow: hidden;
}

.avatar-wrap img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.avatar-sm { width: 36px; height: 36px; font-size: 14px; }
.avatar-md { width: 44px; height: 44px; font-size: 16px; }
.avatar-lg { width: 56px; height: 56px; font-size: 20px; }
.avatar-xl { width: 72px; height: 72px; font-size: 28px; }
</style>
