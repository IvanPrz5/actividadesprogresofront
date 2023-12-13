<template>
  <v-card v-if="actividadesDia.length > 0">
    <v-card-title> Actividades {{ props.fechaProp }}</v-card-title>
    <v-divider class="border-opacity-100 mb-4"></v-divider>
    <v-row v-for="i in actividadesDia" :key="i" class="mx-4 mb-4 pb-3 d-flex bg-indigo-lighten-1 rounded-lg" no-gutters>
      <v-col cols="10">
        <v-card-text class="text-h6">
          {{i.id}}.- {{ i.tipoActividad.descripcion }} ({{ i.descripcion }})
        </v-card-text>
        <!-- <v-card-subtitle>
          Te asigno: {{ i.usuarioAsigno.descripcion }}
        </v-card-subtitle> -->
        <v-card-subtitle>
          {{ fecha(new Date(i.fechaInicio)) }} a {{ fecha(new Date(i.fechaFin)) }}
          <br>
          {{ hora(new Date(i.fechaInicio)) }} - {{ hora(new Date(i.fechaFin)) }}
        </v-card-subtitle>
      </v-col>
      <v-col cols="2" class="d-flex align-center">
        <v-tooltip location="bottom">
          <template v-slot:activator="{ props }">
            <v-btn icon v-bind="props" class="elevation-0" color="indigo-lighten-1">
              <v-icon size="large" :icon="iconoUrgencia(i.jerarquiaActividad.id)"
                :color="colorUrgencia(i.jerarquiaActividad.id)"></v-icon>
            </v-btn>
          </template>
          <span>{{ i.jerarquiaActividad.descripcion }}</span>
        </v-tooltip>
      </v-col>
    </v-row>
    <v-card-actions>
      <v-btn @click="cerrarItem" color="error">Cerrar</v-btn>
    </v-card-actions>
  </v-card>
  <v-card v-else>
    <v-card-text>
      No tienes actividades pendientes.
    </v-card-text>
    <v-card-actions>
      <v-btn @click="cerrarItem" color="error">Cerrar</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts" setup>
import { ref, onMounted } from "vue";
import { loginStore } from "@/store/app";
import axios from "axios";

const props = defineProps(["fechaProp"]);
const emit = defineEmits(["cerrarItem"]);
const storeLogin = loginStore();
let actividadesDia: any = ref([]);

onMounted(() => {
  if (props.fechaProp != undefined) {
    getActividadesByDia(props.fechaProp);
  }
});

function iconoUrgencia(nivel: number) {
  if (nivel == 1) {
    return "mdi-alert-circle";
  }
  if (nivel == 2) {
    return "mdi-alert-octagon";
  }
  if (nivel == 3) {
    return "mdi-alert-octagram";
  }
}

function colorUrgencia(nivel: number) {
  if (nivel == 1) {
    return "success";
  }
  if (nivel == 2) {
    return "warning";
  }
  if (nivel == 3) {
    return "error";
  }
}

function getActividadesByDia(date: any) {
  axios
    .get(storeLogin.url + "Actividad/porDia/" + storeLogin.usuario.id + "/" + date + "/" + storeLogin.idEmpresaSelecionada)
    .then((response) => {
      actividadesDia.value = response.data
    })
    .catch((e) => {
      console.log("Fatal " + e)
    })
}


function fecha(fecha: Date) {
  return fecha.toLocaleDateString("es-mx", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function hora(fecha: Date) {
  let auxHora = fecha.toLocaleDateString("es-mx", {
    hour: 'numeric', minute: 'numeric', second: 'numeric',
    hour12: true,
  });

  let tempHora = auxHora.split(' ', auxHora.length);
  let hora = tempHora[1] + " " + tempHora[2];
  return hora;
}

function cerrarItem(){
  emit("cerrarItem")
}
</script>
