<template>
  <div>
    <v-card id="settings" class="py-2 px-4" link min-width="80" color="warning">
      <v-icon> mdi-alert </v-icon>
    </v-card>
    <v-menu :close-on-content-click="false" activator="#settings" nudge-left="8" origin="top right"
      transition="scale-transition">
      <v-card class="text-center mb-0 container-cards" width="700">
        <v-card-text>
          <strong class="d-inline-block">ACTIVIDADES OBLIGATORIAS</strong>
          <v-divider class="my-4 mb-6" :thickness="4" />
          <v-row align="center" class="px-3" style="gap: 10px;">
            <v-card class="cards mb-2 px-1" height="180" v-for="i in arrayActividades" :key="i">
              <!-- <v-card-title> {{ i.id }}</v-card-title> -->
              <div class="pb-3 py-3"
                style=" display:flex; flex-direction: column; justify-content: center; align-items: center; height: 80px;">
                {{ i.descripcion }}
                <!-- <v-tooltip location="bottom">
                  <template v-slot:activator="{ props }">
                    <v-btn icon v-bind="props" class="elevation-0" color="blue-grey-lighten-3">
                      <v-icon size="large" icon="mdi-alert-circle" color="success"></v-icon>
                    </v-btn>
                  </template>
                  <span>{{ i.jerarquiaActividad.descripcion }}</span>
                </v-tooltip> -->
              </div>
              <v-card-subtitle>
                {{ fecha(new Date(i.fechaInicio)) }} --- {{ fecha(new Date(i.fechaFin)) }}
                <br>
                {{ hora(new Date(i.fechaInicio)) }} --- {{ hora(new Date(i.fechaFin)) }}
              </v-card-subtitle>
              <!-- <v-card-actions> -->
              <!-- </v-card-actions> -->
              <div class="py-4 px-2">
                <v-btn block class="bg-indigo" @click="terminarActividad(i.id)">
                  Terminar
                </v-btn>
              </div>
            </v-card>
          </v-row>
        </v-card-text>
      </v-card>
    </v-menu>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from "vue";
import { loginStore } from "@/store/app";
import axios from "axios";

const storeLogin = loginStore();
let arrayActividades: any = ref([]);
const date = new Date();
const primerDia = new Date(date.getFullYear(), date.getMonth() + 1, 1);
const ultimoDia = new Date(date.getFullYear(), date.getMonth() + 2, 0);

onMounted(() => {
  console.log(date.getDay())
  getActividadesByIsMensual();
});

function getActividadesByIsMensual() {
  console.log(convert(primerDia));
  axios
    .get(
      storeLogin.url +
      "Actividad/isMensual/" +
      storeLogin.usuario.id +
      "/" +
      storeLogin.idEmpresaSelecionada +
      "/" +
      convert(primerDia) +
      "/" +
      convert(ultimoDia)
    )
    .then((response) => {
      arrayActividades.value = response.data;
      console.log(response.data)
    })
    .catch((e) => {
      console.log("Fatal " + e);
    });
}

function terminarActividad(id: any) {
  console.log("actividaes Fijas" + id);
}

function convert(date: any) {
  return date.toLocaleDateString("sv", { timeZone: "America/Mexico_City" });
}

function fecha(fecha: Date) {
  return fecha.toLocaleDateString("es-mx", {
    year: "numeric",
    month: "numeric",
    day: "numeric",
  });
}

function hora(fecha: Date) {
  let auxHora = fecha.toLocaleDateString("es-mx", {
    hour: 'numeric', minute: 'numeric',
    hour12: true,
  });

  let tempHora = auxHora.split(' ', auxHora.length);
  let hora = tempHora[1] + " " + tempHora[2];
  return hora;
}

</script>

<style scoped>
#settings {
  z-index: 200;
  position: fixed;
  top: 165px;
  right: 30px;
  border-radius: 8px;
  /* background-color: blue; */
}

.cards {
  width: calc(100% / 3 - 7px);
}
</style>
