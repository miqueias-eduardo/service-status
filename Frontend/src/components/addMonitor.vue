<script lang="ts" setup>
import { ref } from 'vue'

const url = ref('')
const apelido = ref('')
const resultado = ref('')
const carregando = ref(false)

const emit = defineEmits<{
  monitorAdicionado: []
}>()

async function adicionarMonitor() {
  resultado.value = ''
  carregando.value = true

  try {
    const response = await fetch(
      'https://service-status-2m8e.onrender.com/monitors',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          url: url.value,
          apelido: apelido.value
        })
      }
    )

    const data = await response.json()

    if (!response.ok) {
      resultado.value = data.erro || 'Erro ao adicionar monitor'
      return
    }

    resultado.value = data.mensagem

    url.value = ''
    apelido.value = ''

    emit('monitorAdicionado')
  } catch (error) {
    resultado.value = 'API não iniciada ou indisponível'
  } finally {
    carregando.value = false
  }
}
</script>

<template>
  <section class="panel">
    <div class="panel-title">
      Adicionar Monitor
    </div>

    <div class="input-row">
      <input
        type="url"
        v-model="url"
        placeholder="https://api.exemplo.com"
        :disabled="carregando"
      />

      <input
        type="text"
        v-model="apelido"
        placeholder="Apelido (ex: minha-api)"
        :disabled="carregando"
      />
    </div>

    <div class="btn-row">
      <button
        class="btn-green"
        @click="adicionarMonitor"
        :disabled="carregando"
      >
        {{ carregando ? 'Adicionando...' : '+ Adicionar' }}
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

.input-row {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 12px;
}

input {
  background: var(--bg2);
  border: 1px solid var(--border2);
  border-radius: 7px;
  padding: 9px 12px;
  font-family: inherit;
  font-size: 12px;
  color: var(--text);
  outline: none;
  transition: border-color 0.2s;
  width: 100%;
}

input:focus {
  border-color: var(--green);
}

input::placeholder {
  color: var(--text-muted);
}

input:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-row {
  display: flex;
  gap: 8px;
}

.btn-green {
  width: 100%;
  background: var(--green-dim);
  border: 1px solid rgba(35, 206, 107, 0.35);
  color: var(--green);
  font-family: inherit;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.5px;
  border-radius: 7px;
  padding: 9px 16px;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-green:hover:not(:disabled) {
  background: rgba(35, 206, 107, 0.2);
  box-shadow: 0 0 12px rgba(35, 206, 107, 0.15);
}

.btn-green:disabled {
  opacity: 0.55;
  cursor: not-allowed;
}

.resultado {
  margin-top: 12px;
  font-size: 10px;
  line-height: 1.5;
  color: var(--text-dim);
}
</style>
