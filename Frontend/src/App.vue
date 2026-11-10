<script setup lang="ts">
import Header from './components/header.vue'
import AddMonitor from './components/addMonitor.vue'
import ControllerMonitor from './components/controllerMonitor.vue'
import ListMonitor from './components/listMonitor.vue'
</script>

<template>
  <main class="dashboard">
    <div class="dashboard-container">

      <Header />

      <section class="dashboard-controls">
        <AddMonitor />
        <ControllerMonitor />
      </section>

      <ListMonitor />

    </div>
  </main>
</template>

<style>
.dashboard {
  width: 100%;
  min-height: 100vh;
  padding: 2.5rem 10rem 5rem;

  background-color: #070b10;

  background-image:
    linear-gradient(
      rgba(35, 206, 107, 0.025) 1px,
      transparent 1px
    ),
    linear-gradient(
      90deg,
      rgba(35, 206, 107, 0.025) 1px,
      transparent 1px
    );

  background-size: 40px 40px;
}

.dashboard-controls {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-top: 36px;
  margin-bottom: 30px;
}
</style>
