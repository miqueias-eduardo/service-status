# 🚀 Service Status API

API para monitoramento de disponibilidade de serviços externos (health check), desenvolvida em Node.js com foco em simplicidade, escalabilidade e boas práticas.

---

## 🌐 Deploy

A aplicação está disponível em produção:

👉 [https://service-status-2m8e.onrender.com](https://service-status-2m8e.onrender.com/health)

---

## 📌 Funcionalidades

* ✅ Cadastro de APIs para monitoramento
* ✅ Verificação periódica de status (online/offline)
* ✅ Armazenamento do último status
* ✅ Busca por ID e apelido
* ✅ Remoção de monitores
* ✅ Controle do monitor (iniciar / parar / status)

---

## 🛠️ Tecnologias

* Node.js (ES Modules)
* Express
* Axios
* PostgreSQL

---

## 📂 Estrutura do Projeto

```
src/
 ├── infra/
 │   ├── server.js
 │   └── database.js
 ├── modules/
 │   └── monitor/
 │       ├── monitor.routes.js
 │       └── monitor.service.js
 └── app.js
```

---

## ▶️ Como rodar o projeto

```bash
npm install
npm start
```

Servidor disponível em:

```
http://localhost:3000
```

---

## 🧪 Rotas da API

### 🔹 Health Check

```
GET /health
```

---

### 🔹 Criar monitor

```
POST /monitors
```

Body:

```json
{
  "url": "https://api.github.com",
  "apelido": "GitHub API"
}
```

---

### 🔹 Listar monitores

```
GET /monitors
```

---

### 🔹 Buscar por ID

```
GET /monitors/id/:id
```

---

### 🔹 Buscar por apelido

```
GET /monitors/apelido/:apelido
```

---

### 🔹 Deletar monitor

```
DELETE /monitors/:id
```

---

### 🔹 Iniciar monitoramento

```
POST /monitors/iniciar
```

Body:

```json
{
  "intervaloMinutos": 5
}
```

---

### 🔹 Parar monitoramento

```
POST /monitors/parar
```

---

### 🔹 Status do monitor

```
GET /monitors/status
```

---

## 🧠 Como funciona

* Os monitores são armazenados em um banco PostgreSQL
* O sistema executa verificações periódicas usando `setInterval`
* Cada verificação:

  * Mede tempo de resposta
  * Captura status HTTP
  * Detecta falhas (timeout, erro, etc)
* O resultado é salvo como `ultimoStatus`

---

## 📊 Exemplo de resposta de status

```json
{
  "status": "online",
  "tempoResposta": "120ms",
  "codigoHttp": 200,
  "verificadoEm": "24/03/2026 14:00:00"
}
```

---

## ⚠️ Validações implementadas

* URL e apelido obrigatórios
* Não permite URLs duplicadas
* Não permite apelidos duplicados
* Intervalo mínimo de 5 minutos

---

## 🚧 Melhorias futuras

* Persistência de logs históricos
* Dashboard (frontend)
* Autenticação
* Webhooks/alertas
* Deploy com Docker

---

## 📄 Licença

Este projeto está sob a licença MIT.

---

## 👨‍💻 Autor

**Miqueias Eduardo**
🔗 GitHub:https://github.com/miqueias-eduardo

---

## ⭐ Objetivo do projeto

Este projeto foi criado com foco em aprendizado prático de:

* Arquitetura de APIs
* Organização modular
* Monitoramento de serviços
* Boas práticas com Node.js

---
