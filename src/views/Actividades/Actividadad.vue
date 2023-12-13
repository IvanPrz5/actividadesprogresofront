<template>
  <h1 class="text-center">ACTIVIDADES {{ tipoActividad }}</h1>
  <v-row v-if="props.tipo != 5 && props.tipo != 4" no-gutters>
    <v-col cols="12" lg="8" md="6" sm="12">
      <v-radio-group v-model="model" inline>
        <v-radio color="warning" label="Me asignaron" :value="false"></v-radio>
        <v-radio color="primary" label="Asigne" :value="true"></v-radio>
        <v-radio color="info" label="Todas" value="todas"></v-radio>
      </v-radio-group>
    </v-col>
    <!-- <v-spacer></v-spacer> -->
    <v-col cols="12" lg="4" md="3" sm="12">
      <v-radio-group v-model="model2" inline>
        <v-radio color="success" label="Activas" :value="false"></v-radio>
        <v-radio color="error" label="Finalizadas" :value="true"></v-radio>
      </v-radio-group>
    </v-col>
  </v-row>
  <v-card class="ma-2 control-card-title" color="info" elevation="2">
    <v-container>
      <v-row no-gutters>
        <v-col class="d-flex align-center" cols="12" lg="4" md="4" sm="4" xs="4">
          <div style="width: 75%;" class="control-title">
            ID - Descripción
          </div>
          <div>
            Urgencia
          </div>
        </v-col>
        <v-col class="d-flex align-center" cols="12" lg="3" md="3" sm="4" xs="12">
          <div class="control-title">
            Detalles
          </div>
        </v-col>
        <v-col class="d-flex align-center" cols="12" lg="2" md="2" sm="3" xs="12">
          <div class="control-title">
            Inicio - Fin
          </div>
        </v-col>
        <v-col cols="12" lg="3" md="3" sm="12" xs="12">
          <div class="accion-col">
            Opciones
          </div>
        </v-col>
      </v-row>
    </v-container>
  </v-card>
  <v-card v-for="(actividad, i) in DataActividades" :key="i" class="ma-2" elevation="2">
    <v-container>
      <v-row no-gutters>
        <v-col v-if="props.tipo != 5 && actividad.isMensual == 'false'" cols="12" lg="1" md="1" sm="1" xs="1">
          <v-icon size="large" :icon="icono(actividad.prioridad)" :color="color(actividad.prioridad)"></v-icon>
        </v-col>
        <v-col v-if="props.tipo != 5 && actividad.isMensual == 'true'" cols="12" lg="1" md="1" sm="1" xs="1">
          <v-icon size="large" icon="mdi-asterisk-circle-outline" :color="color(actividad.prioridad)"></v-icon>
        </v-col>
        <v-col v-if="props.tipo == 5" cols="12" lg="1" md="1" sm="1" xs="1">
          <v-icon size="large" :icon="actividad.bienActividad.icon"></v-icon>
        </v-col>
        <v-col class="d-flex align-center" v-if="props.tipo != 5" cols="12" lg="3" md="3" sm="3" xs="12">
          <div class="actividad-data">
            {{ actividad.id }} .- {{ actividad.descripcion }}.
          </div>
          <v-tooltip location="right" class="urgencia-div">
            <template v-slot:activator="{ props }">
              <v-btn icon v-bind="props" class="elevation-0">
                <v-icon size="large" :icon="iconoUrgencia(actividad.jerarquiaActividad.id)"
                  :color="colorUrgencia(actividad.jerarquiaActividad.id)"></v-icon>
              </v-btn>
            </template>
            <span>{{ actividad.jerarquiaActividad.descripcion }}</span>
          </v-tooltip>
        </v-col>
        <v-col v-if="props.tipo == 5" cols="12" lg="3" md="3" sm="3" xs="12">
          {{ actividad.bienActividad.id }} .- {{ actividad.bienActividad.descripcion }}.
        </v-col>
        <v-col cols="12" lg="3" md="3" sm="4" xs="12">
          {{ tipoAsigno }} : {{ actividad.usuarioAsigno.descripcion }}.
          <div v-if="props.tipo != 5">
            Estatus : {{ actividad.tipo }}.
          </div>
          <div v-if="props.tipo == 5">
            Núm. Actividad : {{ actividad.idactividad }}.
          </div>
          <div v-if="props.tipo != 4 && props.tipo != 5 && model2 == true">
            Finalizó : {{ actividad.usuarioTermino.descripcion }}.
          </div>
        </v-col>
        <v-col cols="12" lg="2" md="2" sm="3" xs="12" v-if="props.tipo != 5">
          {{ fecha(new Date(actividad.fechaInicio)) }} a
          {{ fecha(new Date(actividad.fechaFin)) }}
        </v-col>
        <v-col cols="12" lg="2" md="2" sm="3" xs="12" v-if="props.tipo == 5">
          {{ fecha(new Date(actividad.inicio)) }} a
          {{ fecha(new Date(actividad.fin)) }}
        </v-col>
        <v-col cols="12" lg="3" md="3" sm="12" xs="12">
          <v-btn-toggle multiple variant="outlined" divided>
            <v-menu v-if="props.tipo != 5 && !model2">
              <template v-slot:activator="{ props }">
                <v-btn icon="mdi-dots-vertical" v-bind="props" class="bg-indigo"></v-btn>
              </template>
              <v-list class="pa-0 ma-0">
                <v-list-item class="pa-0 ma-0">
                  <v-btn variant="tonal" elevation="0" size="large" @click="mostrarBien(actividad.id)" class="bg-orange">
                    <v-icon size="x-large">mdi-car</v-icon>
                    <v-tooltip activator="parent" location="end">Recursos</v-tooltip>
                  </v-btn>
                </v-list-item>
                <v-list-item class="pa-0 ma-0">
                  <v-btn elevation="0" size="large" @click="mostrarArchivo(actividad.id)" class="bg-blue-lighten-2">
                    <v-icon size="x-large">mdi-file-document-plus-outline</v-icon>
                    <v-tooltip activator="parent" location="end">Archivos</v-tooltip>
                  </v-btn>
                </v-list-item>
                <v-list-item class="pa-0 ma-0">
                  <v-btn elevation="0" size="large" @click="mostrarNotas(actividad.id)" class="bg-secondary">
                    <v-icon size="x-large">mdi-text-box-edit-outline</v-icon>
                    <v-tooltip activator="parent" location="end">Notas</v-tooltip>
                  </v-btn>
                </v-list-item>
                <v-list-item class="pa-0 ma-0">
                  <v-btn elevation="0" size="large" @click="mostrarParticipantes(actividad.id)" class="bg-primary">
                    <v-icon size="x-large">mdi-account-group</v-icon>
                    <v-tooltip activator="parent" location="end">Participantes</v-tooltip>
                  </v-btn>
                </v-list-item>
                <v-list-item class="pa-0 ma-0" v-if="actividad.tipoActividad.id == 1 || actividad.tipoActividad.id == 2">
                  <v-btn elevation="0" size="large" @click="descargarFormato(actividad.id)" class="bg-error">
                    <v-icon size="x-large">mdi-file-pdf-box</v-icon>
                    <v-tooltip activator="parent" location="end">Descargar Formato</v-tooltip>
                  </v-btn>
                </v-list-item>
              </v-list>
            </v-menu>
            <v-btn v-if="actividad.usuarioAsigno.id == idUsuario && props.tipo != 5 && !model2"
              @click="editarActividad(actividad)" class="bg-info">
              <v-icon size="x-large">mdi-pencil</v-icon>
              <v-tooltip activator="parent" location="bottom">Editar Actividad</v-tooltip>
            </v-btn>
            <v-btn v-if="actividad.status != 'false'" class="bg-success" @click="cambiarStatus(actividad.id, false)">
              <v-icon size="x-large">mdi-check-bold</v-icon>
              <v-tooltip activator="parent" location="bottom">Entregar Actividad</v-tooltip>
            </v-btn>
            <v-btn v-if="actividad.status != 'true' && props.tipo != 5" @click="regresarActividad(actividad.id, true)"
              class="bg-indigo">
              <v-icon size="x-large">mdi-backup-restore</v-icon>
              <v-tooltip activator="parent" location="bottom">Restaurar Actividad</v-tooltip>
            </v-btn>
          </v-btn-toggle>
        </v-col>
      </v-row>
    </v-container>
  </v-card>
  <v-dialog width="700" v-model="dialogActividad">
    <Actividad @actualizar="cargarActividades" :actividadObjeto="actividadObjeto" @cerrarActividad="cerrarActividad" />
  </v-dialog>
  <v-dialog width="700" v-model="dialogBien">
    <UsarActividad :actividadID="actividadID" @cerrarBien="cerrarBien" />
  </v-dialog>
  <v-dialog width="700" v-model="dialogArchivo">
    <ArchivoActividad :actividadID="actividadID" @cerrarArchivo="cerrarArchivo" />
  </v-dialog>
  <v-dialog width="700" v-model="dialogNota">
    <NotasActividad :actividadID="actividadID" @cerrarNota="cerrarNota" />
  </v-dialog>
  <v-dialog width="500" v-model="dialogEntregar">
    <v-card>
      <v-card-text>
        <v-row no-gutters>
          <v-col cols="12">
            <div class="text-subtitle-1 text-medium-emphasis">
              Condiciones del recurso al entregar: *
            </div>
            <v-form ref="formEntregar">
              <v-textarea counter no-resize density="compact" v-model="obsEntrega" :rules="[rules.file]"></v-textarea>
              <v-btn color="success" @click="entregarRecurso">Entregar</v-btn>
            </v-form>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </v-dialog>
  <v-dialog width="450" v-model="dialogParticipantes">
    <Participantes :actividadID="actividadID" />
  </v-dialog>
  <v-snackbar v-model="snack" :timeout="1500" :color="snackColor">
    {{ msg }}
  </v-snackbar>
</template>

<script lang="ts" setup>
import { computed, onMounted, ref } from "vue";
import axios from "axios";
import { loginStore } from "../../store/app";
import Actividad from "@/components/Actividad/Actividad.vue";
import UsarActividad from "@/components/Actividad/UsarActividad.vue";
import NotasActividad from "@/components/Actividad/NotasActividad.vue";
import ArchivoActividad from "@/components/Actividad/ArchivoActividad.vue";
import Participantes from "@/components/Actividad/Participantes.vue";
import { inject } from 'vue'
import Rules from "@/Clases/Rules";

const props = defineProps(["tipo"]);

const storeLogin = loginStore();
const rules = new Rules();

let apiTipo: string = "";
let dialogParticipantes: any = ref(false);
let dialogActividad: any = ref(false);
let dialogNota: any = ref(false);
let dialogBien: any = ref(false);
let dialogArchivo: any = ref(false);
let dialogEntregar: any = ref(false);
let actividadID: any = ref(-1);
let idUsuario = JSON.parse(localStorage.getItem("usuario")!).id;
let actividadObjeto: any = ref(false);
let DataActividades: any = ref([]);
let model: any = ref(false);
let model2: any = ref(false);
let tipoAsigno: String = "Asigno? ";
const snack: any = ref(false);
let snackColor = "";
let msg: String = "";
const emitter: any = inject('emitter');
let obsEntrega: any = ref();
const formEntregar = ref(null) as any;
const idUsarActividad: any = ref();

emitter.on('actualizar', () => {
  cargarActividades();
});

emitter.on('actualizarHoyRetrasadas', () => {
    cargarActividadesHoyAndFinalizadas();
});

onMounted(() => {
  cargarActividades();
});

let tipoActividad = computed(() => {
  DataActividades.value = [];
  if (props.tipo == 1) {
    apiTipo = "diario";
    cargarActividades();
    return "DIARIO";
  }
  if (props.tipo == 2) {
    apiTipo = "semanal";
    cargarActividades();
    return "SEMANAL";
  }
  if (props.tipo == 3) {
    apiTipo = "mensual";
    cargarActividades();
    return "MENSUAL";
  }
  if (props.tipo == 4) {
    cargarActividadesHoyAndFinalizadas()
    return "PARA HOY Y RETRASADAS";
  }
  if (props.tipo == 5) {
    getRecursosByUsuario();
    return "RECURSOS"
  }
});

function fecha(fecha: Date) {
  return fecha.toLocaleDateString("es-mx", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function color(id: number) {
  if (id == 0) {
    return "error";
  }
  if (id == 1) {
    return "warning";
  }
  if (id == 2) {
    return "info";
  }
  if (id == 3) {
    return "success";
  }
  if (id == 4) {
    return "indigo";
  }
}

function icono(id: number) {
  if (id == 0) {
    return "mdi-bell-alert";
  }
  if (id == 1) {
    return "mdi-bell-ring";
  }
  if (id == 2) {
    return "mdi-bell-badge";
  }
  if (id == 3) {
    return "mdi-bell";
  }
  if (id == 4) {
    return "mdi-bell-sleep";
  }
}

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

function cargarActividades() {
  if (props.tipo != 4 && props.tipo != 5) {
    const asignaAux = {
      false: "/asignaron",
      true: "/asigne",
      todas: '/todas'
    };
    const statusAux = {
      false: "/true",
      true: "/false",
    };
    const asigna = asignaAux[model.value];
    const status = statusAux[model2.value];
    getActividades(asigna, status);
  }
}

function cambiarStatus(id: any, statusParam: any) {
  const object: any = ref({
    status: statusParam,
    idUsuarioTermino: {
      id: ""
    },
    fechaFinalizoUser: ""
  });
  const date = new Date()
  const fechaFinUser = date.toLocaleString('sv', { timeZone: 'America/Mexico_City' }).replace(' ', 'T');
  if (statusParam == false) {
    object.value.idUsuarioTermino.id = storeLogin.usuario.id;
    object.value.fechaFinalizoUser = fechaFinUser;
  } else {
    delete object.value.idUsuarioTermino;
    delete object.value.fechaFinalizoUser
  }
  if (props.tipo == 5) {
    dialogEntregar.value = true;
    idUsarActividad.value = id;
  } else {
    finalizarRecursoOrActividad("Actividad/delete/", id, object.value)
  }
}

async function entregarRecurso() {
  const { valid } = await formEntregar.value.validate();
  if (valid) {
    const object: any = ref({
      status: false,
      observacionesEntrega: obsEntrega,
    });
    finalizarRecursoOrActividad("UsarActividad/entregarRecurso/", idUsarActividad.value, object.value);
  }
}

function regresarActividad(id: any, statusParam: any) {
  const object: any = ref({
    status: statusParam,
    idUsuarioTermino: {
      id: ""
    },
    fechaFinalizoUser: ""
  });
  axios
    .put(storeLogin.url + "Actividad/delete/" + id, object)
    .then((response) => {
      cargarActividades();
      mostrarSnack("success", "Se activo la actividad");
      emitter.emit('numActividades');
    })
    .catch((e) => {
      console.log(e)
    })
}

async function finalizarRecursoOrActividad(ruta: any, id: any, object: any) {
  await axios
    .put(storeLogin.url + ruta + id, object)
    .then((response) => {
      if (response.data == "entrego") {
        getRecursosByUsuario();
        dialogEntregar.value = false;
        mostrarSnack("indigo", "Se entrego el recurso");
        emitter.emit('numRecursos');
        formEntregar.value.reset();
      }
      if (props.tipo == 4) {
        cargarActividadesHoyAndFinalizadas();
        mostrarSnack("indigo", "Se finalizo la actividad");
        emitter.emit('numActividades');
      }
      if (props.tipo != 4 && props.tipo != 5) {
        cargarActividades();
        mostrarSnack("indigo", "Se finalizo la actividad");
        emitter.emit('numActividades');
      }
    })
    .catch((e) => {
      console.log(e)
    })
}

function getActividades(asigna: any, status: any) {
  let ruta = storeLogin.url + "Actividad/" + apiTipo + asigna + "/" + storeLogin.usuario.id + "/" + storeLogin.idEmpresaSelecionada + status;
  axios
    .get(ruta)
    .then((response) => {
      DataActividades.value = response.data;
      // console.log(response.data)
    })
    .catch((error) => {
      console.log("No se puede cargar  -> " + error);
    });
}

function cargarActividadesHoyAndFinalizadas() {
  if (props.tipo == 4) {
    // console.log("entro")
    let ruta = storeLogin.url + "Actividad/" + "terminanHoy/finalizadas/" + storeLogin.usuario.id + "/" + storeLogin.idEmpresaSelecionada;
    axios
      .get(ruta)
      .then((response) => {
        DataActividades.value = response.data;
        // console.log(response.data)
      })
      .catch((e) => {
        console.log(e)
      })
  }
}

function getRecursosByUsuario() {
  axios
    .get(storeLogin.url + "UsarActividad/byUsuarioEmpresa/" + storeLogin.usuario.id + "/" + storeLogin.idEmpresaSelecionada)
    .then((response) => {
      DataActividades.value = response.data;
    })
    .catch((error) => {
      console.log("No se puede cargar  -> " + error);
    });
}


async function descargarFormato(idActividad: any) {
  await axios({
    url: storeLogin.url + "Formatos/generarFormato/" + idActividad,
    method: "GET",
    responseType: "blob",
  })
    .then((response) => {
      let url = window.URL.createObjectURL(new Blob([response.data]));
      window.open(url);
    })
    .catch((e) => {
      console.log("Fatal " + e);
    });
}

function editarActividad(actividad: any) {
  
  actividadObjeto = actividad;
  let fechaIniAux = actividadObjeto.fechaInicio;
  let fechaIniAux2 = actividadObjeto.fechaFin;
  // 2023-09-23T05:59:00.000Z
  let fechaInicio = fechaIniAux.replace(" ", "T")
  let fechaFin = fechaIniAux2.replace(" ", "T")
  actividadObjeto.fechaInicio = fechaInicio;
  actividadObjeto.fechaFin = fechaFin;
  dialogActividad.value = true;
}

function cerrarActividad() {
  mostrarSnack("success", "Se actualizo la actividad");
  dialogActividad.value = false;
}

function mostrarSnack(color: any, msgSnack: any) {
  snackColor = color;
  msg = msgSnack;
  snack.value = true;
}

function mostrarParticipantes(id: any) {
  actividadID = id;
  dialogParticipantes.value = true;
}

function mostrarNotas(id: any) {
  actividadID = id;
  dialogNota.value = true;
}

function cerrarNota() {
  dialogNota.value = false;
}

function mostrarBien(id: any) {
  actividadID = id;
  dialogBien.value = true;
}

function cerrarBien() {
  dialogBien.value = false;
}

function mostrarArchivo(id: any) {
  actividadID = id;
  dialogArchivo.value = true;
}

function cerrarArchivo() {
  dialogArchivo.value = false;
}
</script>

<style scoped>
.control-title {
  padding-left: 25%;
}

.accion-col {
  padding-left: 10%;
}

@media(max-width: 600px) {
  .control-card-title {
    display: none;
  }

  .accion-col {
    display: none;
  }
}

@media(max-width: 960px) {
  .accion-col {
    display: none;
  }
}

.actividad-data {
  width: 70%;
}

.urgency-div {
  width: 30%;
}</style>