<template>
  <v-container>
    <div class="container">
      <v-row class="mt-5" no-gutters>
        <v-col cols="12" lg="10">
          <h1>{{ mes }} / {{ year }}</h1>
        </v-col>
        <v-col cols="2" class="d-flex">
          <v-btn @click="antes" color="indigo">
            <v-icon icon="mdi-calendar-arrow-left" size="x-large"></v-icon>
          </v-btn>
          <v-btn class="ml-5" @click="siguiente" color="indigo">
            <v-icon icon="mdi-calendar-arrow-right" size="x-large"></v-icon>
          </v-btn>
        </v-col>
      </v-row>
      <v-row class="calendar">
        <v-card class="diasSemana d-flex justify-center align-center" v-for="i in dias" :key="i" height="40">
          {{ i.substring(0,1) }}
        </v-card>
        <!-- <v-card class="diasSemana d-flex justify-center align-center" v-for="i in dias" :key="i" height="40">
          {{ i }}
        </v-card> -->
        <v-card v-for="j in daySquare" :key="j" class="diasCard" :color="j.isToday ? j.color : undefined"
          @click="mostrarCard(j.value)">
          <div class="inicio" v-if="j.value == j.inicio">
            <v-badge class="inicioBadge" color="warning" inline>
              <v-icon style="display: none"></v-icon>
            </v-badge>
          </div>
          <div class="number">
            {{ j.value === "padding" ? "" : j.value }}
          </div>
          <div class="fin" v-if="j.value == j.fin">
            <v-badge class="inicioBadge" color="red" inline>
              <v-icon style="display: none"></v-icon>
            </v-badge>
          </div>
        </v-card>
        <!-- <div class="padding"></div> -->
      </v-row>
    </div>
    <v-dialog width="550" v-model="dialog">
      <ItemAgenda :fechaProp="fechaProp" @cerrarItem="cerrarItem"></ItemAgenda>
    </v-dialog>
  </v-container>
</template>

<script lang="ts" setup>
import { ref, onMounted } from "vue";
import axios from "axios";
import { loginStore } from "@/store/app";
import ItemAgenda from "@/components/Actividad/Agenda/ItemAgenga.vue";

const storeLogin = loginStore();
let fechaProp: any = ref();
const dias = [
  "Domingo",
  "Lunes",
  "Martes",
  "Miércoles",
  "Jueves",
  "Viernes",
  "Sábado",
];
let daySquare: any = ref([]);
let arrayActividades = [] as any;
let arrayActividades2 = [] as any;
const options = { month: "long" } as any;
let year: any = ref();
let mes: any = ref();
let mesAux: any = ref();
let nav = 0;
let dialog: any = ref(false);
let arrayInicio = [] as any;
let arrayFin = [] as any;

const date2 = new Date();
const primerDia2 = new Date(date2.getFullYear(), date2.getMonth(), 1);
const ultimoDia2 = new Date(date2.getFullYear(), date2.getMonth() + 1, 0);

onMounted(() => {
  mostrarDias();
  if(convert(date2) == convert(ultimoDia2)){

  }
});

function mostrarCard(day: any) {
  if (day != "padding") {
    dialog.value = true;
    let aux = year.value + "-" + mesAux.value + "-" + day;
    fechaProp.value = aux;
  }
}

function cerrarItem() {
  dialog.value = false;
}

async function mostrarDias() {
  const date = new Date();

  if (nav !== 0) {
    date.setMonth(new Date().getMonth() + nav);
  }

  await getActividades();

  const primerDia = new Date(date.getFullYear(), date.getMonth(), 1);
  const ultimoDia = new Date(date.getFullYear(), date.getMonth() + 1, 0);
  const dateString = primerDia.toLocaleDateString("es-MX", {
    weekday: "long",
    year: "numeric",
    month: "numeric",
    day: "numeric",
  });

  let diasMx = dateString.charAt(0).toUpperCase() + dateString.slice(1);
  mes.value = new Intl.DateTimeFormat("es-MX", options)
    .format(date)
    .toUpperCase();
  year.value = date.getFullYear();
  mesAux.value = new Intl.DateTimeFormat("es-MX", { month: "numeric" })
    .format(date)
    .toUpperCase();

  const paddingDays = dias.indexOf(diasMx.split(", ")[0]);
  daySquare.value = [];

  for (let i = 1; i <= paddingDays + ultimoDia.getDate(); i++) {
    if (i > paddingDays) {
      daySquare.value.push({
        value: i - paddingDays,
        isToday: i - paddingDays === date.getDate() && nav === 0,
        color: "indigo",
        date: year.value + "-" + mesAux.value + "-" + i,
        inicio: [],
        fin: [],
        tam: [],
      });
    } else {
      daySquare.value.push({
        value: "padding",
      });
    }
    for (let j = 0; j < i; j++) {
      if (i - paddingDays == arrayInicio[j]) {
        daySquare.value[i - 1].inicio = arrayInicio[j];
      }
      if (i - paddingDays == arrayFin[j]) {
        daySquare.value[i - 1].fin = arrayFin[j];
      }
    }
  }
}

async function getActividades() {
  const date = new Date();

  if (nav !== 0) {
    date.setMonth(new Date().getMonth() + nav);
  }

  const primerDia = new Date(date.getFullYear(), date.getMonth(), 1);
  const ultimoDia = new Date(date.getFullYear(), date.getMonth() + 1, 0);

  arrayInicio = [];
  arrayFin = [];
  await axios
    .get(
      storeLogin.url +
      "Actividad/porMes/" +
      storeLogin.usuario.id +
      "/" +
      storeLogin.idEmpresaSelecionada +
      "/" +
      convert(primerDia) +
      "/" +
      convert(ultimoDia)
    )
    .then((response) => {
      for (let i = 0; i < response.data.length; i++) {
        arrayActividades[i] = convertToDay(response.data[i].fechaInicio);
        arrayActividades2[i] = convertToDay(response.data[i].fechaFin);
        const elemento = arrayActividades[i];
        const elemento2 = arrayActividades2[i];
        if (!arrayInicio.includes(arrayActividades[i])) {
          arrayInicio.push(elemento);
        }
        if (!arrayFin.includes(arrayActividades2[i])) {
          arrayFin.push(elemento2);
        }
      }
    })
    .catch((e) => {
      console.log("Fatal " + e);
    });
}

async function insertActividadesMensuales(){
  /* let arrayFechas = [{
    fechaInicio = '2023'
  }] as any; */
  /* await axios
    .get(storeLogin.url + "Actividad/addMensuales",{

    })
    .then((response) => {
      console.log(response.data)
    })
    .catch((e) => {
      console.log("Fatal " + e)
    }) */
}

function convert(date: any) {
  return date.toLocaleDateString("sv", { timeZone: "America/Mexico_City" });
}

function convertToDay(date: any) {
  let day = date[8] + date[9];
  return day;
}

function siguiente() {
  nav++;
  mostrarDias();
}

function antes() {
  nav--;
  mostrarDias();
}
</script>

<style scoped>
.container {
  margin: auto;
  width: 85%;
}

.calendar {
  gap: 10px;
}

.diasSemana {
  width: calc(100% / 7 - 10px);
  font-weight: 600;
}

.diasCard {
  width: calc(100% / 7 - 10px);
  height: 100px;
  display: flex;
  justify-content: space-between;
  justify-content: center;
  /* align-items: center; */
}

.inicio {
  display: flex;
  justify-content: start;
  align-items: start;
  width: 10%;
}

.number {
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.fin {
  display: flex;
  justify-content: end;
  align-items: end;
  width: 10%;
}

@media (max-width: 600px) {
  .container {
  margin: auto;
  width: 90%;
}
  .diasCard {
    height: 60px;
  }
}

/* .padding {
  cursor: default !important;
  background-color: #FFFCFF !important;
  box-shadow: none !important;
} */
</style>
