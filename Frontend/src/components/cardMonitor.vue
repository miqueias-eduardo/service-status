<script lang="ts" setup>
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

const props = defineProps<{
  monitor: Monitor
}>()

const emit = defineEmits<{
  monitorExcluido: []
}>()

function obterStatus() {
  if (!props.monitor.ultimoStatus) {
    return 'unknown'
  }

  if (props.monitor.ultimoStatus.status === 'online') {
    return 'online'
  }

  if (props.monitor.ultimoStatus.status === 'offline') {
    return 'offline'
  }

  return 'unknown'
}

function formatarResposta() {
  const tempo = props.monitor.ultimoStatus?.tempoResposta

  if (tempo == null) {
    return '—'
  }

  return `${tempo}ms`
}

function textoStatus() {
  const status = obterStatus()

  if (status === 'online') {
    return 'Online'
  }

  if (status === 'offline') {
    return 'Offline'
  }

  return 'Sem dados'
}

async function excluirMonitor() {
  const confirmar = window.confirm(
    `Deseja realmente excluir o monitor "${props.monitor.apelido}"?`
  )

  if (!confirmar) {
    return
  }

  try {
    const response = await fetch(
      `https://service-status-2m8e.onrender.com/monitors/${props.monitor.id}`,
      {
        method: 'DELETE'
      }
    )

    const data = await response.json()

    if (!response.ok) {
      window.alert(data.erro || 'Erro ao excluir monitor')
      return
    }

    emit('monitorExcluido')
  } catch (error) {
    window.alert('API não iniciada ou indisponível')
  }
}
</script>

<template>
  <article
    class="monitor-card"
    :class="obterStatus()"
  >
    <div class="monitor-content">

      <div class="monitor-name">
        {{ monitor.apelido }}
      </div>

      <div class="monitor-url">
        {{ monitor.url }}
      </div>

      <div class="monitor-meta">

        <span
          class="status-badge"
          :class="`status-${obterStatus()}`"
        >
          <span class="status-dot"></span>

          {{ textoStatus() }}
        </span>

        <span class="monitor-stat">
          Resposta:
          <span>
            {{ formatarResposta() }}
          </span>
        </span>

        <span
          v-if="monitor.ultimoStatus?.statusCode"
          class="monitor-stat"
        >
          HTTP:
          <span>
            {{ monitor.ultimoStatus.statusCode }}
          </span>
        </span>

        <span
          v-if="monitor.ultimoStatus?.timestamp"
          class="monitor-time"
        >
          {{ monitor.ultimoStatus.timestamp }}
        </span>

      </div>
    </div>

    <div class="monitor-side">

      <div
        class="monitor-response"
        :class="obterStatus()"
      >
        {{ formatarResposta() }}
      </div>

      <div
        v-if="monitor.ultimoStatus?.statusCode"
        class="monitor-http"
      >
        {{ monitor.ultimoStatus.statusCode }}
      </div>

      <div class="monitor-actions">
        <button
          class="icon-button"
          title="Excluir monitor"
          @click="excluirMonitor"
        >
          ×
        </button>
      </div>

    </div>
  </article>
</template>

<style scoped>
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

.monitor-actions {
  display: flex;
  gap: 6px;
}

.icon-button {
  background: transparent;
  border: 1px solid var(--border2);
  border-radius: 6px;
  padding: 5px 8px;
  font-size: 11px;
  color: var(--text-dim);
  cursor: pointer;
  font-family: var(--font);
  transition:
    border-color 0.2s,
    color 0.2s;
}

.icon-button:hover {
  border-color: var(--red);
  color: var(--red);
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
