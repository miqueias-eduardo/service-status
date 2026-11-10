<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'

const apiOnline = ref(false)
const carregando = ref(true)

let intervaloStatus: ReturnType<typeof setInterval> | undefined

async function verificarStatus() {
  try {
    const response = await fetch(
      'https://service-status-2m8e.onrender.com/monitors/status'
    )

    const data = await response.json()

    if (!response.ok) {
      apiOnline.value = false
      return
    }

    apiOnline.value = data.ativo === true
  } catch (error) {
    apiOnline.value = false
  } finally {
    carregando.value = false
  }
}

onMounted(() => {
  verificarStatus()

  intervaloStatus = setInterval(() => {
    verificarStatus()
  }, 30000)
})

onUnmounted(() => {
  if (intervaloStatus) {
    clearInterval(intervaloStatus)
  }
})
</script>

<template>
  <header class="dashboard-header">

    <div class="header-brand">
      <h1>SERVICE-STATUS</h1>

      <p>API Monitoring Dashboard</p>
    </div>

    <div
      class="api-status"
      :class="{
        online: apiOnline,
        offline: !apiOnline
      }"
    >
      <span class="status-indicator"></span>

      <span v-if="carregando">
        Verificando API...
      </span>

      <span v-else>
        API {{ apiOnline ? 'Online' : 'Offline' }}
      </span>
    </div>

  </header>
</template>

<style scoped>
.dashboard-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 20px;
  margin-bottom: 28px;
}

.header-brand h1 {
  margin: 0;
  font-size: 20px;
  font-weight: 700;
  letter-spacing: 3px;
  color: var(--text);
}

.header-brand p {
  margin: 6px 0 0;
  color: var(--text-dim);
  font-size: 11px;
}

.api-status {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding: 6px 10px;
  border-radius: 20px;
  font-size: 10px;
  font-weight: 600;
  white-space: nowrap;
}

.api-status.online {
  color: var(--green);
  background: var(--green-dim);
  border: 1px solid rgba(35, 206, 107, 0.3);
}

.api-status.offline {
  color: var(--red);
  background: var(--red-dim);
  border: 1px solid rgba(231, 76, 60, 0.3);
}

.status-indicator {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  flex-shrink: 0;
}

.api-status.online .status-indicator {
  background: var(--green);
  box-shadow: 0 0 7px rgba(35, 206, 107, 0.5);
}

.api-status.offline .status-indicator {
  background: var(--red);
}

@media (max-width: 600px) {
  .dashboard-header {
    align-items: flex-start;
  }

  .header-brand h1 {
    font-size: 17px;
  }

  .header-brand p {
    font-size: 10px;
  }

  .api-status {
    font-size: 9px;
  }
}
</style>
