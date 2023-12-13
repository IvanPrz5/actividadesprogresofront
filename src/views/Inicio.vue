<template>
  <ConcentradoAgenda></ConcentradoAgenda>
</template>

<script lang="ts" setup>
import { loginStore } from "../store/app";
import ConcentradoAgenda from "@/components/Actividad/Agenda/ConcetradoAgenda.vue";
name: "Inicio";
const storeLogin = loginStore();
</script>
