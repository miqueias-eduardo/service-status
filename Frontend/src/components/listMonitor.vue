
<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import cardMonitor from './cardMonitor.vue'

interface UltimoStatus {
  status?: string
  statusCode?: number
  tempoResposta?: number
  timestamp?: string
}

interface Monitor {
  id: number
  url: string
  apelido: string
  ultimoStatus: UltimoStatus | null
}

const monitores = ref<Monitor[]>([])
const carregando = ref(false)
const resultado = ref('')

async function listarMonitores() {
  resultado.value = ''
  carregando.value = true

  try {
    const response = await fetch(
      'https://service-status-2m8e.onrender.com/monitors/'
    )

    const data = await response.json()

    if (!response.ok) {
      resultado.value = data.erro || 'Erro ao listar monitores'
      return
    }

    monitores.value = data.dados
  } catch (error) {
    resultado.value = 'API não iniciada ou indisponível'
  } finally {
    carregando.value = false
  }
}

function obterStatus(monitor: Monitor) {
  if (!monitor.ultimoStatus) {
    return 'unknown'
  }

  if (monitor.ultimoStatus.status === 'online') {
    return 'online'
  }

  if (monitor.ultimoStatus.status === 'offline') {
    return 'offline'
  }

  return 'unknown'
}

function formatarResposta(monitor: Monitor) {
  if (monitor.ultimoStatus?.tempoResposta == null) {
    return '—'
  }

  return `${monitor.ultimoStatus.tempoResposta}ms`
}

onMounted(() => {
  listarMonitores()
})
</script>

<template>
  <section class="monitor-section">

    <div class="list-header">
      <div class="list-title">
        Monitores
      </div>

      <div class="list-actions">
        <span class="count-badge">
          {{ monitores.length }}
          {{ monitores.length === 1 ? 'serviço' : 'serviços' }}
        </span>

        <button
          class="refresh-button"
          :disabled="carregando"
          @click="listarMonitores"
        >
          <span class="refresh-icon">↺</span>
          {{ carregando ? 'Atualizando...' : 'Atualizar' }}
        </button>
      </div>
    </div>

    <div class="monitor-list">

      <div
        v-if="carregando && monitores.length === 0"
        class="empty-state"
      >
        <span class="spinner"></span>
        <div>Carregando monitores...</div>
      </div>

      <div
        v-else-if="resultado"
        class="empty-state error-state"
      >
        <div>{{ resultado }}</div>
      </div>

      <div
        v-else-if="monitores.length === 0"
        class="empty-state"
      >
        <div class="empty-icon">◌</div>
        <div>Nenhum monitor cadastrado.</div>
      </div>

      <cardMonitor
  v-for="monitor in monitores"
  :key="monitor.id"
  :monitor="monitor"
  @monitor-excluido="listarMonitores"
/>

    </div>
  </section>
</template>

<style scoped>
.monitor-section {
  width: 100%;
}

.list-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 14px;
  gap: 12px;
}

.list-title {
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 2px;
  color: var(--text-dim);
  text-transform: uppercase;
}

.list-actions {
  display: flex;
  gap: 8px;
  align-items: center;
}

.count-badge {
  display: inline-flex;
  align-items: center;
  border-radius: 20px;
  padding: 4px 10px;
  background: var(--bg2);
  border: 1px solid var(--border);
  color: var(--text-dim);
  font-size: 9.5px;
  font-weight: 600;
}

.refresh-button {
  background: transparent;
  border: 1px solid var(--border2);
  border-radius: 6px;
  padding: 5px 10px;
  font-family: var(--font);
  font-size: 10px;
  color: var(--text-dim);
  cursor: pointer;
  transition:
    border-color 0.2s,
    color 0.2s,
    opacity 0.2s;
}

.refresh-button:hover:not(:disabled) {
  border-color: var(--green);
  color: var(--green);
}

.refresh-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.refresh-icon {
  display: inline-block;
  margin-right: 2px;
}

.monitor-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.monitor-card {
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: 10px;
  padding: 16px 18px;
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 12px;
  align-items: center;
  transition: border-color 0.2s;
  position: relative;
  overflow: hidden;
  animation: fadeIn 0.3s ease;
}

.monitor-card::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 3px;
  border-radius: 0 2px 2px 0;
}

.monitor-card.online::before {
  background: var(--green);
}

.monitor-card.offline::before {
  background: var(--red);
}

.monitor-card.unknown::before {
  background: var(--text-muted);
}

.monitor-card:hover {
  border-color: var(--border2);
}

.monitor-content {
  min-width: 0;
}

.monitor-name {
  font-size: 13px;
  font-weight: 600;
  color: var(--text);
  margin-bottom: 3px;
}

.monitor-url {
  font-size: 10.5px;
  color: var(--text-dim);
  margin-bottom: 8px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 400px;
}

.monitor-meta {
  display: flex;
  gap: 10px;
  align-items: center;
  flex-wrap: wrap;
}

.status-badge {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  border-radius: 20px;
  padding: 3px 10px;
  font-size: 9.5px;
  font-weight: 700;
}

.status-online {
  background: var(--green-dim);
  border: 1px solid rgba(35, 206, 107, 0.3);
  color: var(--green);
}

.status-offline {
  background: var(--red-dim);
  border: 1px solid rgba(231, 76, 60, 0.3);
  color: var(--red);
}

.status-unknown {
  background: rgba(42, 64, 85, 0.3);
  border: 1px solid var(--border);
  color: var(--text-dim);
}

.status-dot {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  flex-shrink: 0;
}

.status-online .status-dot {
  background: var(--green);
}

.status-offline .status-dot {
  background: var(--red);
}

.status-unknown .status-dot {
  background: var(--text-muted);
}

.monitor-stat {
  font-size: 10px;
  color: var(--text-dim);
}

.monitor-stat span {
  color: var(--text);
  font-weight: 600;
}

.monitor-time {
  font-size: 9px;
  color: var(--text-muted);
}

.monitor-side {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 8px;
  min-width: 100px;
}

.monitor-response {
  font-size: 22px;
  font-weight: 700;
  line-height: 1;
}

.monitor-response.online {
  color: var(--green);
}

.monitor-response.offline {
  color: var(--red);
}

.monitor-response.unknown {
  color: var(--text-muted);
}

.monitor-http {
  font-size: 12px;
  font-weight: 700;
  color: var(--blue);
}

.empty-state {
  text-align: center;
  padding: 48px 24px;
  color: var(--text-dim);
  border: 1px dashed var(--border2);
  border-radius: 12px;
  font-size: 12px;
  line-height: 1.8;
}

.empty-icon {
  font-size: 28px;
  margin-bottom: 10px;
  opacity: 0.5;
}

.error-state {
  color: var(--red);
}

.spinner {
  display: inline-block;
  width: 12px;
  height: 12px;
  margin-bottom: 8px;
  border: 2px solid var(--border2);
  border-top-color: var(--green);
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(8px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 600px) {
  .list-header {
    align-items: flex-start;
  }

  .list-actions {
    flex-wrap: wrap;
    justify-content: flex-end;
  }

  .monitor-card {
    grid-template-columns: 1fr;
  }

  .monitor-url {
    max-width: 200px;
  }

  .monitor-side {
    align-items: flex-start;
    flex-direction: row;
  }

  .monitor-response {
    font-size: 16px;
  }
}
</style>
```
