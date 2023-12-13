<template>
  <v-card class="mt-2">
    <v-card-title class="d-flex bg-info title-recursos">
      Recursos de la Actividad {{ numActividad }}
      <v-spacer></v-spacer>
      <v-btn color="warning" class="mb-2" @click="abrirDialog">
        <v-icon>
          mdi-plus
        </v-icon>
      </v-btn>
    </v-card-title>
    <v-divider></v-divider>
    <v-row class="mt-2 mx-1" no-gutters>
      <v-col cols="12" class="mb-3">
        <v-data-table class="elevation-0" :headers="headers" :items="desserts" item-key="id" v-model:expanded="expanded"
          show-expand>
          <template v-slot:headers></template>
          <template v-slot:bottom></template>
          <template v-slot:item.actions="{ item }">
            <v-btn class="ms-1" elevation="0" icon="mdi-delete" @click="eliminarUsarActividad(item)">
            </v-btn>
          </template>
          <template v-slot:expanded-row="{ columns, item }">
            <tr>
              <td :colspan="columns.length">
                Observaciones : {{ item.raw.descripcion }}
                <br>
                Fechas : 
                {{ fecha(new Date(item.raw.inicio)) }}    a      
                {{ fecha(new Date(item.raw.fin)) }}
                <br>
                Hora : {{ hora(new Date(item.raw.inicio)) }} -- {{ hora(new Date(item.raw.fin)) }}
              </td>
            </tr>
          </template>
        </v-data-table>
      </v-col>
    </v-row>
    <v-dialog v-model="dialogFormBien" width="850" height="600">
      <v-card>
        <v-card-title>Selecciona los Recursos</v-card-title>
        <v-divider></v-divider>
        <v-row class="mt-2 mx-1">
          <v-col align-items="center" cols="12">
            <v-form ref="formUsar" fast-fail @submit.prevent>
              <p class="text-error" v-if="none == false">Campo requerido *</p>
              <v-row no-gutters>
                <v-col class="d-flex">
                  <v-combobox label="Seleccionar Recursos" density="compact" :items="itemsBienActividad"
                    :item-title="['descripcion']" :item-value="['id']" v-model="usarActividadClass.idBienActividad"
                    @update:model-value="getFechasOcupadas(usarActividadClass.idBienActividad)" return-object>
                  </v-combobox>
                  <!-- <v-tooltip location="bottom">
                    <template v-slot:activator="{ props }">
                      <v-btn @click="getFechasOcupadas(usarActividadClass.idBienActividad)" color="indigo" icon v-bind="props">
                        <v-icon>
                          mdi-alert-circle-outline
                        </v-icon>
                      </v-btn>
                    </template>
                    <span>Fechas Ocupadas</span>
                  </v-tooltip> -->
                </v-col>
              </v-row>
              <v-row v-if="fechas.length > 0" class="mb-2" no-gutters>
                <v-col>
                  <v-card :elevation="1">
                    <!-- <label>Fechas Ocupadas</label> -->
                    <v-list style="height: 150px;">
                      <template v-for="(fec, i) in fechas">
                        <v-row no-gutters>
                          <v-list-item :subtitle="'Ocupada el :  ' + fecha(new Date(fec.nombreUsuario)) + ' (' + hora(new Date(fec.nombreUsuario)) + ')' " ></v-list-item>
                          <v-list-item :subtitle="'Hasta el :  ' + fecha(new Date(fec.nombreArchivo)) + ' (' + hora(new Date(fec.nombreArchivo)) + ')' "></v-list-item>
                        </v-row>
                      </template>
                    </v-list>
                  </v-card>
                </v-col>
              </v-row>
              <v-row class="mb-4" no-gutters>
                <p class="text-error" v-if="none == false">Ambas fechas requeridas</p>
                <p class="text-error" v-if="fechasInvalida == true">No puede ser mayor a fecha de entrega</p>
                <v-col class="mb-2 mr-2" cols="12" xl="6">
                  <VueDatepicker placeholder="Fecha de Inicio" v-model="usarActividadClass.inicio" :teleport="true"
                    allow-prevent-default locale="es" :start-time="startTime" time-picker-inline :state="state" auto-apply :format="formatDate"/>
                </v-col>
                <v-col>
                  <VueDatepicker placeholder="Fecha de Entrega" v-model="usarActividadClass.fin" :teleport="true"
                    allow-prevent-default locale="es" :start-time="endTime" time-picker-inline :state="state"
                    :min-date="usarActividadClass.inicio" auto-apply :format="formatDate"/>
                </v-col>
              </v-row>
              <v-row no-gutters class="mt-2">
                <v-col cols="12">
                  <v-textarea rows="5" label="Observaciones del recurso al salir"
                    v-model="usarActividadClass.observacionesSalida" no-resize :rules="[rules.requerido]"></v-textarea>
                </v-col>
              </v-row>
              <v-row class="mb-4 mt-1" no-gutters>
                <v-col cols="12" class="d-flex">
                  <v-btn variant="outlined" color="error" @click="cerrarBien">
                    Ocultar
                  </v-btn>
                  <v-spacer></v-spacer>
                  <!-- @click="guardarRecursoProp" -->
                  <v-btn variant="outlined" color="success" @click="guardarRecursoProp">
                    Apartar
                  </v-btn>
                </v-col>
              </v-row>
            </v-form>
          </v-col>
        </v-row>
      </v-card>
    </v-dialog>
    <v-snackbar v-model="snack" :timeout="1500" :color="snackColor">
      {{ msg }}
    </v-snackbar>
  </v-card>
</template>

<script lang="ts" setup>
import { loginStore } from "@/store/app";
import { ref, onMounted, inject } from "vue";
import VueDatepicker from "@vuepic/vue-datepicker";
import "@vuepic/vue-datepicker/dist/main.css";
import axios from "axios";
import Rules from "@/Clases/Rules";

const storeLogin = loginStore();
const startTime = ref({ hours: 0, minutes: 0 });
const endTime = ref({ hours: 23, minutes: 59 });
const rules = new Rules();
const formUsar = ref(null) as any;
const none: any = ref(true);
const state: any = ref(false);
const snack: any = ref(false);
const disponible: any = ref("");
let snackColor = "";
let msg: String = "";
let dialogFormBien: any = ref(false);
const expanded: any = ref([]);
const fechas: any = ref([]);
const emitter: any = inject('emitter');
const fechasValidas: any = ref(false);
const fechasInvalida: any = ref(false);
const headers: any = ref([
  {
    title: "ID",
    key: "idBienActividad",
  },
  {
    title: "Name",
    key: "nombre",
  },
  { title: "", key: "data-table-expand" },
  { title: "Actions", key: "actions", sortable: false }
]);

const props = defineProps(["actividadID"]);

let desserts: any = ref([]);
const itemsBienActividad: any = ref([]);
const usarActividadClass = storeLogin.usarActividad;
let numActividad: any = ref("");

onMounted(() => {
  if (props.actividadID != null) {
    numActividad.value = props.actividadID;
    getRecursosApi(props.actividadID);
    getBienActividadApi(storeLogin.url + "BienActividad/byIdActividad/" + props.actividadID + "/" + storeLogin.idEmpresaSelecionada);
  } else {
    if(storeLogin.bienesUnicos == 'false' || localStorage.getItem("bienesUnicos") == 'false'){
      getBienActividadApi(storeLogin.url + "BienActividad/byIdEmpresaNull/" + storeLogin.idEmpresaSelecionada);
    }else{
      getBienActividadApi(storeLogin.url + "BienActividad/byIdEmpresa/" + storeLogin.idEmpresaSelecionada);
    }
  }
});

async function guardarRecurso(idActividad: any) {
  tipoGuardado2(idActividad);
}

async function guardarRecursoProp() {
  const { valid } = await formUsar.value.validate();

  if (usarActividadClass.inicio != undefined && usarActividadClass.fin != undefined) {
    state.value = true
  } else {
    state.value = false
  }
  let inicioAux = convert(usarActividadClass.inicio);
  let finAux = convert(usarActividadClass.fin);
  if(inicioAux <= finAux){
    fechasValidas.value = true;
  }else{
    fechasValidas.value = false;
  }

  if (valid && state.value && fechasValidas.value) {
    const fecha = await buscaFecha();
    if (fecha >= 1) {
      snack.value = true;
      snackColor = "warning"
      msg = "Recurso ocupado en esa fecha"
    }
    if (props.actividadID != null && fecha == 0) {
      tipoGuardado(props.actividadID);
    }
    if (props.actividadID == null && fecha == 0) {
      apartar();
    }
  } else {
    if(!fechasValidas.value){
      fechasInvalida.value = true;
    }else{
      none.value = true;
    }
  }
}

async function tipoGuardado(idActividad: any) {
  const inicio = convert(usarActividadClass.inicio);
  const fin = convert(usarActividadClass.fin);
  await axios
    .post(storeLogin.url + "UsarActividad/add", {
      observacionesSalida: usarActividadClass.observacionesSalida,
      inicio: inicio,
      fin: fin,
      idActividad: { id: idActividad },
      idBienActividad: { id: usarActividadClass.idBienActividad.id },
    })
    .then(() => {
      // apartarRecurso(usarActividadClass.idBienActividad.id, false);
      if (props.actividadID != null) {
        getRecursosApi(props.actividadID);
        getBienActividadApi(storeLogin.url + "BienActividad/byIdActividad/" + props.actividadID + "/" + storeLogin.idEmpresaSelecionada);
      }
      formUsar.value.reset();
      usarActividadClass.inicio = undefined;
      usarActividadClass.fin = undefined;
      snackColor = "indigo"
      msg = "El recurso se aparto con exito"
      snack.value = true;
      emitter.emit('numRecursos');
    })
    .catch((e) => {
      console.log("Fatal " + e);
    });
}

async function buscaFecha() {
  const inicio = convert(usarActividadClass.inicio);
  const fin = convert(usarActividadClass.fin);
  await axios
    .get(storeLogin.url + "UsarActividad/byFecha/" + inicio + "/" + fin + "/" + usarActividadClass.idBienActividad.id)
    .then((response) => {
      disponible.value = response.data[0]
    })
    .catch((e) => {
      console.log(e)
    })
  return disponible.value;
}

function eliminarUsarActividad(item: any) {
  if (props.actividadID != null) {
    axios
      .put(storeLogin.url + "UsarActividad/delete/" + item.raw.id, {
        status: false,
      })
      .then(() => {
        // apartarRecurso(item.idBienActividad, true);
        getRecursosApi(props.actividadID);
        getBienActividadApi(storeLogin.url + "BienActividad/byIdActividad/" + props.actividadID + "/" + storeLogin.idEmpresaSelecionada);
        mostrarSnack("error", "Se elimino el recurso de la actividad");
        emitter.emit('numRecursos');
      })
      .catch((e) => {
        console.log("Fatal " + e);
      });
  } else {
    desserts.value.splice(item.index, 1);
    itemsBienActividad.value.push({
      id: item.raw.idBienActividad,
      descripcion: item.raw.nombre,
    });
  }
}

function getRecursosApi(idActividad: any) {
  axios
    .get(storeLogin.url + "UsarActividad/byActividad/" + idActividad)
    .then((response) => {
      desserts.value = response.data;
    })
    .catch((e) => {
      console.log(e)
    })
}

function getFechasOcupadas(idBienActividad: any) {
  if (idBienActividad != undefined) {
    axios
      .get(storeLogin.url + "UsarActividad/inicioFin/" + idBienActividad.id)
      .then((response) => {
        fechas.value = response.data;
      })
      .catch((e) => {
        console.log(e)
      })
  }
}

function getBienActividadApi(ruta: any) {
  axios
    .get(ruta)
    .then((response) => {
      itemsBienActividad.value = response.data;
    })
    .catch((e) => {
      console.log("Fatal " + e);
    });
}

function abrirDialog() {
  dialogFormBien.value = true;
}

function cerrarBien() {
  dialogFormBien.value = false;
  fechas.value = [];
  resetForm()
}

function resetForm(){
  formUsar.value.reset();
  usarActividadClass.inicio = "";
  usarActividadClass.fin = "";
}

async function apartar() {
  const { valid } = await formUsar.value.validate();
  if (valid) {
    desserts.value.push({
      idBienActividad: usarActividadClass.idBienActividad.id,
      nombre: usarActividadClass.idBienActividad.descripcion,
      descripcion: usarActividadClass.observacionesSalida,
      inicio: storeLogin.fechaFormato.formatDate(usarActividadClass.inicio),
      fin: storeLogin.fechaFormato.formatDate(usarActividadClass.fin),
    });
    let nombre = usarActividadClass.idBienActividad.descripcion;
    let posicionArray = itemsBienActividad.value.findIndex(
      (x: any) => x["descripcion"] === nombre
    );
    itemsBienActividad.value.splice(posicionArray, 1);
    resetForm();
    snackColor = "indigo"
    msg = "El recurso se aparto con exito"
    snack.value = true;
  } else {
    none.value = false;
  }
}

async function tipoGuardado2(idActividad: any) {
  if (desserts.value.length > 0) {
    for (let i = 0; i < desserts.value.length; i++) {
      await axios
        .post(storeLogin.url + "UsarActividad/add", {
          observacionesSalida: desserts.value[i].descripcion,
          inicio: storeLogin.fechaFormato.sendDate(desserts.value[i].inicio),
          fin: storeLogin.fechaFormato.sendDate(desserts.value[i].fin),
          idActividad: { id: idActividad },
          idBienActividad: { id: desserts.value[i].idBienActividad },
        })
        .then(() => {
          emitter.emit('numRecursos');
          if (props.actividadID != null) {
            getRecursosApi(props.actividadID);
          }
        })
        .catch((e) => {
          console.log("Fatal " + e);
        });
    }
  } else {
    none.value = false;
  }
}

function convert(date: Date) {
  return date.toLocaleString('sv', { timeZone: 'America/Mexico_City' }).replace(' ', 'T');
}

function mostrarSnack(color:any, msgSnack:any){
  snackColor = color;
    msg = msgSnack;
    snack.value = true;
}

function fecha(fecha: Date) {
  return fecha.toLocaleDateString("es-mx", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function formatDate(date:any){
  let aux = date.toLocaleString('en-GB').replace(' ', ' ');
  let fecha = aux.substring(0, aux.length - 3)
  return fecha;
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

defineExpose({
  guardarRecurso
});
</script>

<style>
@media(max-width: 410px){
  .title-recursos{
    font-size: 15px;
  }
}
</style>