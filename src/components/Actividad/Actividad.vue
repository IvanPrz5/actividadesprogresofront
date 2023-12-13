<template>
  <v-card class="elevation-5">
    <v-card-title class="bg-info"> {{ titulo }} ACTIVIDAD {{ numActividad }}</v-card-title>
    <v-card-text>
      <v-container>
        <v-form ref="formActividad" fast-fail @submit.prevent>
          <v-row no-gutters>
            <v-col cols="12" xl="6" lg="6" class="mr-4 mb-2">
              <div class="text-subtitle-1 text-medium-emphasis">
                Inicia el día:*
              </div>
              <VueDatepicker placeholder="Fecha de Inicio" v-model="actividadClass.fechaInicio" auto-apply
                allow-prevent-default locale="es-MX" :start-time="startTime" time-picker-inline :state="state"
                :format="formatDate" />
              <p class="text-error" v-if="none == true">Campo requerido</p>
              <p class="text-error" v-if="fechasInvalida == true">No puede ser mayor a fecha fin</p>
            </v-col>
            <v-col>
              <div class="text-subtitle-1 text-medium-emphasis">Termina:</div>
              <VueDatepicker placeholder="Fecha de Entrega" v-model="actividadClass.fechaFin" auto-apply
                allow-prevent-default locale="es-MX" :start-time="endTime" time-picker-inline :state="state"
                :min-date="actividadClass.fechaInicio" :format="formatDate" />
              <p class="text-error" v-if="none == true">Campo requerido</p>
            </v-col>
          </v-row>
          <v-row class="mt-2" no-gutters>
            <v-col cols="12" class="mr-4">
              <div class="text-subtitle-1 text-medium-emphasis">
                Tipo de actividad:*
              </div>
              <v-autocomplete density="compact" :items="tipoActividad" item-title="descripcion" :item-value="['id']"
                v-model="actividadClass.idTipoActividad" :rules="[rules.requerido]"
                return-object @update:model-value="muestraMunicipioCombo"></v-autocomplete>
            </v-col>
            <v-col v-if="boxMunicipio === true" cols="12" class="mr-4">
              <div class="text-subtitle-1 text-medium-emphasis">
                Municipio ó Dependencia:*
              </div>
              <div class="d-flex">
                <v-combobox density="compact" :items="clientesItems" :item-title="['descripcion']"
                  v-model="actividadClass.idCliente" :item-value="['id']" :rules="[rules.requerido]"></v-combobox>
                <v-btn style="height: 44px;" class="ml-2" color="indigo" @click="agregarCliente">
                  <v-icon size="x-large">mdi-plus</v-icon>
                  <v-tooltip activator="parent" location="bottom">Agregar Municipio/Dependecia</v-tooltip>
                </v-btn>
              </div>
            </v-col>
            <v-col>
              <div class="text-subtitle-1 text-medium-emphasis">
                Grado de la Actividad:*
              </div>
              <v-combobox density="compact" :items="jerarquiaActividad" :item-title="['descripcion']"
                v-model="actividadClass.idJerarquiaActividad" :item-value="['id']"
                :rules="[rules.requerido]"></v-combobox>
            </v-col>
          </v-row>
          <v-row no-gutters>
            <v-col cols="12">
              <div class="text-subtitle-1 text-medium-emphasis">
                Seleccionar participantes:*
              </div>
              <v-autocomplete density="compact" :items="participantes" item-title="descripcion" chips closable-chips
                multiple item-value="id" v-model="idUsuariosAsignados">
                <template v-slot:chip="{ props, item }">
                  <v-chip v-bind="props" :prepend-avatar="item?.raw?.['icon']" :text="item?.raw?.['descripcion']"
                    @click:close="eliminarUsuariodeActividad(item.raw)"></v-chip>
                </template>
                <template v-slot:item="{ props, item }">
                  <v-list-item v-bind="props" :prepend-avatar="item?.raw?.['icon']" :title="item?.raw?.['descripcion']"
                    @click="aggUsuario(item.raw)"></v-list-item>
                </template>
              </v-autocomplete>
              <p class="text-error" v-if="none == true">Campo requerido</p>
            </v-col>
          </v-row>
          <v-row no-gutters>
            <v-col>
              <div class="text-subtitle-1 text-medium-emphasis">
                Agrega una descripción:*
              </div>
              <v-textarea counter no-resize density="compact" v-model="actividadClass.descripcion"
                :rules="[rules.requerido]"></v-textarea>
            </v-col>
          </v-row>
          <v-row v-if="props.actividadObjeto != null" no-gutters>
            <v-spacer></v-spacer>
            <v-col cols="auto">
              <v-btn color="success" variant="tonal" @click="tipoRuta">Guardar</v-btn>
            </v-col>
          </v-row>
        </v-form>
      </v-container>
    </v-card-text>
    <v-snackbar v-model="snack" :timeout="1500" :color="snackColor">
      {{ msg }}
    </v-snackbar>
    <v-dialog width="500" v-model="dialogAgregarCliente">
      <ClienteForm @cerrarCliente="cerrarCliente"/>
    </v-dialog>
  </v-card>
</template>

<script  lang="ts" setup default>
import axios from "axios";
import { loginStore } from "@/store/app";
import { ref, onMounted, watch, inject } from "vue";
import VueDatepicker from "@vuepic/vue-datepicker";
import "@vuepic/vue-datepicker/dist/main.css";
import Rules from "@/Clases/Rules";
import ClienteForm from "./Clientes/ClienteForm.vue";

const storeLogin = loginStore();
const rules = new Rules();
const startTime = ref({ hours: 0, minutes: 0 });
const endTime = ref({ hours: 23, minutes: 59 });
const props = defineProps(["editarProp", "actividadObjeto"]);
const emit = defineEmits(["cerrarActividad", "actualizar"]);
let participantes: any = ref([]);
const idUsuariosAsignados: any = ref([]);
const actividadClass = storeLogin.actividad;
const idActividadCreada = ref();
const titulo: any = ref("CREAR");
const formActividad = ref(null) as any;
const none: any = ref(false);
const tipoActividad: any = ref([]);
const jerarquiaActividad: any = ref([]);
const clientesItems: any = ref([]);
const state: any = ref(false);
const fechasValidas: any = ref(false);
const fechasInvalida: any = ref(false);
const emitter: any = inject('emitter');
// actividadClass.fechaInicio.value = [startDate];
const idActividadEditar: any = ref();
let numActividad: String = "";
const snack: any = ref(false);
const dialogAgregarCliente: any = ref(false);
const boxMunicipio: any = ref(false);
let snackColor = "";
let msg: String = "";

emitter.on('resetActividad', () => {
  resetForm2();
});

watch(idActividadCreada, (nuevoValor) => {
  idActividadCreada.value = nuevoValor;
})

onMounted(() => {
  getTipoActividadApi();
  getJerarquiaActividadApi();
  getClientesByEmpresa();
  if (props["actividadObjeto"] != null) {
    titulo.value = "EDITAR";
    getUsuarioApi(storeLogin.url + "Usuarios/byActividadAndEmpresa/" + props.actividadObjeto.id + "/" + storeLogin.idEmpresaSelecionada);
    numActividad = props.actividadObjeto.id;
    cargarDatos();
  } else {
    getUsuarioApi(storeLogin.url + "Usuarios/byEmpresa/" + storeLogin.idEmpresaSelecionada);
  }
});

function muestraMunicipioCombo() {
  if (actividadClass.idTipoActividad.id  == 1 || actividadClass.idTipoActividad.id == 2) {
    boxMunicipio.value = true;
  } else {
    boxMunicipio.value = false;
  }
}

function aggUsuario(item: any) {
  let idUsuario = item.id
  if (props.actividadObjeto != undefined) {
    guardarUsuarioActividad(props.actividadObjeto.id, idUsuario);
  }
}

function objetoEnviar() {
  const fechaInicio = convert(actividadClass.fechaInicio);
  const fechaFin = convert(actividadClass.fechaFin);

  const objeto = {
    fechaInicio: fechaInicio,
    fechaFin: fechaFin,
    descripcion: actividadClass.descripcion,
    idTipoActividad: { id: actividadClass.idTipoActividad.id },
    idJerarquiaActividad: {
      id: actividadClass.idJerarquiaActividad.id,
    },
    idUsuarioAsigno: { id: storeLogin.usuario.id },
    idStatusActividad: { id: actividadClass.idStatusActividad },
    idEmpresa: { id: storeLogin.idEmpresaSelecionada },
  } as any;
  if (actividadClass.idCliente != undefined) {
    objeto.idClientes = {
      id: actividadClass.idCliente.id,
    }
  }

  return objeto;
}

async function tipoRuta() {
  const { valid } = await formActividad.value.validate();
  if (actividadClass.fechaInicio != undefined && actividadClass.fechaFin != undefined) {
    state.value = true
  } else {
    state.value = false
  }
  let inicioAux = convert(actividadClass.fechaInicio);
  let finAux = convert(actividadClass.fechaFin);
  if (inicioAux <= finAux) {
    fechasValidas.value = true;
  } else {
    fechasValidas.value = false;
  }
  if (valid && state.value && fechasValidas.value && idUsuariosAsignados.value.length > 0) {
    const objeto = objetoEnviar();
    let ruta = "";
    let tipoAxios = axios.post;
    if (props.actividadObjeto != undefined) {
      const idActividad = props.actividadObjeto.id;
      objeto.id = idActividad;
      ruta = storeLogin.url + "Actividad/editar/" + idActividad;
      tipoAxios = axios.put
    } else {
      ruta = storeLogin.url + "Actividad/add";
    }
    await tipoAxios(ruta, objeto)
      .then((response) => {
        if (props.actividadObjeto != undefined) {
          emit("cerrarActividad");
          emit("actualizar");
          emitter.emit('numActividades');
          emitter.emit('actualizarHoyRetrasadas');
          // resetForm();
        } else {
          idActividadCreada.value = response.data;
          for (let i = 0; i < idUsuariosAsignados.value.length; i++) {
            guardarUsuarioActividad(response.data, idUsuariosAsignados.value[i]);
          }
          emit("actualizar");
          emitter.emit('actualizar');
          emitter.emit('actualizarHoyRetrasadas');
          // resetForm();
        }
      })
      .catch((e: any) => {
        console.log("Fatal " + e);
      })
    if (props.actividadObjeto == undefined) {
      return idActividadCreada.value;
    }
  } else {
    if (!fechasValidas.value) {
      fechasInvalida.value = true;
    } else {
      none.value = true;
    }
  }
}

function getTipoActividadApi() {
  axios
    .get(storeLogin.url + "TipoActividad/byStatus")
    .then((response) => {
      tipoActividad.value = response.data;
    })
    .catch((error) => {
      console.log("Fatal " + error);
    });
}

function getJerarquiaActividadApi() {
  axios
    .get(storeLogin.url + "JerarquiaActividad/byStatus")
    .then((response) => {
      jerarquiaActividad.value = response.data;
    })
    .catch((error) => {
      console.log("Fatal " + error);
    });
}

function getUsuarioApi(ruta: any) {
  axios
    .get(ruta)
    .then((response) => {
      participantes.value = response.data;
    })
    .catch((error) => {
      console.log("Fatal " + error);
    });
}

function eliminarUsuariodeActividad(idUserAct: any) {
  if (props["actividadObjeto"] != null) {
    axios
      .put(storeLogin.url + "UsuarioActividad/editStatus/" + props.actividadObjeto.id + "/" + idUserAct.id)
      .then(() => {
        usuariosEnActividad(props.actividadObjeto.id)
        getUsuarioApi(storeLogin.url + "Usuarios/byActividadAndEmpresa/" + props.actividadObjeto.id + "/" + storeLogin.idEmpresaSelecionada);
        mostrarSnack("error", "Se elmino el usuario de la actividad");
      })
      .catch((e) => {
        console.log(e + "en UsuarioActividad")
      })
  }
}

function guardarUsuarioActividad(idActividadCreada: any, idUsuarios: any) {
  axios
    .post(storeLogin.url + "UsuarioActividad/add", {
      idActividad: { id: idActividadCreada },
      idUsuario: { id: idUsuarios },
    })
    .then(() => {
      if (props.actividadObjeto != null) {
        usuariosEnActividad(props.actividadObjeto.id)
        getUsuarioApi(storeLogin.url + "Usuarios/byActividadAndEmpresa/" + props.actividadObjeto.id + "/" + storeLogin.idEmpresaSelecionada);
        mostrarSnack("success", "Se agrego el usuario");
      }
    })
    .catch((e) => {
      console.log("Fatal " + e);
    });
}

function cargarDatos() {
  let actividadObjeto = props["actividadObjeto"];
  actividadClass.fechaInicio = actividadObjeto.fechaInicio;
  actividadClass.fechaFin = actividadObjeto.fechaFin;
  actividadClass.idTipoActividad = actividadObjeto.tipoActividad;
  if (Object.keys(actividadObjeto.cliente).length > 0) {
    actividadClass.idCliente = actividadObjeto.cliente;
    if (props.actividadObjeto != null) {
      if (props.actividadObjeto.tipoActividad.id == 2 || props.actividadObjeto.tipoActividad.id == 1) {
        boxMunicipio.value = true;
      }
      else {
        boxMunicipio.value = false;
      }
    }
  }
  actividadClass.idJerarquiaActividad = actividadObjeto.jerarquiaActividad;
  actividadClass.descripcion = actividadObjeto.descripcion;
  idActividadEditar.value = actividadObjeto.id;
  usuariosEnActividad(props.actividadObjeto.id)
}

function usuariosEnActividad(id: any) {
  axios
    .get(storeLogin.url + "UsuarioActividad/byIdActividad/" + id)
    .then((response) => {
      idUsuariosAsignados.value = response.data;
    })
    .catch((e) => {
      console.log(e)
    })
}

function getClientesByEmpresa() {
  axios
    .get(storeLogin.url + "Clientes/byEmpresa/" + storeLogin.idEmpresaSelecionada)
    .then((response) => {
      clientesItems.value = response.data;
    })
    .catch((e) => {
      console.log(e)
    })
}

function convert(date: Date) {
  return date.toLocaleString('sv', { timeZone: 'America/Mexico_City' }).replace(' ', 'T');
}

function mostrarSnack(color: any, msgSnack: any) {
  snackColor = color;
  msg = msgSnack;
  snack.value = true;
}

function formatDate(date: any) {
  let aux = date.toLocaleString('en-GB').replace(' ', ' ');
  let fecha = aux.substring(0, aux.length - 3)
  return fecha;
}

function resetForm() {
  formActividad.value.reset();
  actividadClass.fechaInicio = "";
  actividadClass.fechaFin = "";
}

function resetForm2() {
  actividadClass.descripcion = "";
  actividadClass.idTipoActividad = "";
  actividadClass.idJerarquiaActividad = "";
  actividadClass.idCliente = "";
  actividadClass.fechaInicio = "";
  actividadClass.fechaFin = "";
}

function agregarCliente() {
  dialogAgregarCliente.value = true;
}

function cerrarCliente() {
  dialogAgregarCliente.value = false;
}

defineExpose({
  tipoRuta,
})
</script>