<script lang="ts" setup>
import { ref } from 'vue'

const ativo = ref(false)
const intervalo = ref(5)
const resultado = ref('')

async function iniciarMonitor() {
  try {
    const response = await fetch(
      'https://service-status-2m8e.onrender.com/monitors/iniciar',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          intervaloMinutos: intervalo.value
        })
      }
    )

    const data = await response.json()

    if (!response.ok) {
      resultado.value = data.erro || 'Erro ao iniciar monitor'
      return
    }

    resultado.value = data.mensagem
    ativo.value = true
  } catch (error) {
    resultado.value = 'API não iniciada ou indisponível'
  }
}

async function pararMonitor() {
  try {
    const response = await fetch(
      'https://service-status-2m8e.onrender.com/monitors/parar',
      {
        method: 'POST'
      }
    )

    const data = await response.json()

    if (!response.ok) {
      resultado.value = data.erro || 'Erro ao parar monitor'
      return
    }

    resultado.value = data.mensagem
    ativo.value = false
  } catch (error) {
    resultado.value = 'API não iniciada ou indisponível'
  }
}

async function atualizarStatus() {
  try {
    const response = await fetch(
      'https://service-status-2m8e.onrender.com/monitors/status'
    )

    const data = await response.json()

    if (!response.ok) {
      resultado.value = data.erro || 'Erro ao atualizar status'
      return
    }

    resultado.value = 'Status atualizado'

    // Por enquanto apenas verificamos a resposta da API.
    // Depois vamos usar esses dados no MonitorList.
    console.log(data)
  } catch (error) {
    resultado.value = 'API não iniciada ou indisponível'
  }
}
</script>

<template>
  <section class="panel">
    <div class="panel-title">
      Controle do Monitor
    </div>

    <div class="control-row">
      <label for="intervalo">
        Intervalo:
      </label>

      <input
        id="intervalo"
        v-model.number="intervalo"
        type="number"
        min="1"
      />

      <span class="unit">
        minutos
      </span>
    </div>

    <div class="button-row">
      <button
        class="btn btn-start"
        :disabled="ativo"
        @click="iniciarMonitor"
      >
        ▶ Iniciar
      </button>

      <button
        class="btn btn-stop"
        :disabled="!ativo"
        @click="pararMonitor"
      >
        ■ Parar
      </button>

      <button
        class="btn btn-refresh"
        @click="atualizarStatus"
      >
        ↺ Atualizar status
      </button>
    </div>

    <p
      v-if="resultado"
      class="resultado"
    >
      {{ resultado }}
    </p>
  </section>
</template>

<style scoped>
.panel {
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 20px;
}

.panel-title {
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 2px;
  color: var(--text-dim);
  margin-bottom: 14px;
  text-transform: uppercase;
}

.control-row {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
}

label {
  font-size: 11px;
  color: var(--text-dim);
}

input {
  width: 70px;
  background: var(--bg2);
  border: 1px solid var(--border2);
  border-radius: 7px;
  padding: 8px 10px;
  font-family: inherit;
  font-size: 11px;
  color: var(--text);
  outline: none;
}

input:focus {
  border-color: var(--green);
}

.unit {
  font-size: 11px;
  color: var(--text-dim);
}

.button-row {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.btn {
  border-radius: 7px;
  padding: 9px 14px;
  font-family: inherit;
  font-size: 11px;
  font-weight: 600;
  cursor: pointer;
  transition:
    background 0.2s,
    border-color 0.2s,
    opacity 0.2s;
}

.btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.btn-start {
  background: var(--green-dim);
  border: 1px solid rgba(35, 206, 107, 0.35);
  color: var(--green);
}

.btn-start:hover:not(:disabled) {
  background: rgba(35, 206, 107, 0.2);
}

.btn-stop {
  background: rgba(255, 77, 94, 0.08);
  border: 1px solid rgba(255, 77, 94, 0.3);
  color: var(--red);
}

.btn-stop:hover:not(:disabled) {
  background: rgba(255, 77, 94, 0.15);
}

.btn-refresh {
  background: var(--bg2);
  border: 1px solid var(--border2);
  color: var(--text-dim);
}

.btn-refresh:hover {
  color: var(--text);
  border-color: var(--border);
}

.resultado {
  margin-top: 12px;
  font-size: 10px;
  line-height: 1.5;
  color: var(--text-dim);
}
</style>
