<template>
  <v-card class="mt-2">
    <v-card-title class="bg-info">
      Notas de la Actividad {{ numActividad }}
    </v-card-title>
    <v-divider></v-divider>
    <!-- <v-row class="mt-2 mx-1">
      <v-col align-items="center" cols="12"> -->
    <v-card class="d-flex flex-column fill-height mb-5 mx-5 mt-3" :elevation="0">
      <v-card-text v-if="messages.length > 0"
        style="border-radius: 5px; border: 1px solid rgb(208, 209, 208); height: 222px;" class="overflow-y-auto">
        <div v-for="(msg, i) in messages" :key="msg.id" :class="{
          'd-flex flex-row-reverse flex-column':
            msg['id_Usuario'] != storeLogin.usuario.id,
        }">
          <v-chip :color="msg['id_Usuario'] == storeLogin.usuario.id ? 'info' : ''
            " style="height: auto; white-space: normal" class="pa-2 mb-1" label>
            {{ msg["descripcion"] }}
          </v-chip>
          <v-card-subtitle> {{ msg.nombre }} {{ msg.ap_Paterno }}</v-card-subtitle>
        </div>
      </v-card-text>
      <div class="text-subtitle-1 text-medium-emphasis">Escribe una nota:</div>
      <v-form ref="formNotas" fast-fail @submit.prevent>
        <v-card-text style="border-radius: 5px; border: 1px solid rgb(208, 209, 208)"
          class="d-flex flex-shrink-1 mt-1">
          <v-text-field v-model="notasActividad.descripcion" @keyup.enter="enviarNota" density="compact"
            :rules="[rules.requerido]"></v-text-field>
          <v-btn size="small" color="success" class="ml-5" icon="mdi-send" @click="enviarNota()"></v-btn>
        </v-card-text>
      </v-form>
    </v-card>
    <!-- </v-col>
    </v-row> -->
  </v-card>
</template>

<script setup lang="ts" >
import { loginStore } from "@/store/app";
import axios from "axios";
import { ref, onMounted } from "vue";
import Rules from "@/Clases/Rules";

const emit = defineEmits(['cerrarNota']);
const props = defineProps(["actividadID", "actividadIDCreada"]);

const storeLogin = loginStore();
const rules = new Rules();
const notasActividad = storeLogin.notasActividad;
const messages: any = ref([]);
const formNotas = ref(null) as any;
let numActividad: any = ref("");

onMounted(() => {
  if (props['actividadIDCreada'] != null) {
    enviarArrayNotas(props['actividadIDCreada'])
  }
  if (props['actividadID'] != null) {
    numActividad.value = props.actividadID;
    getMensajes(props['actividadID'])
  }
});

function getMensajes(id: any) {
  axios
    .get(storeLogin.url + "NotasActividad/byActividad/" + id)
    .then((response) => {
      messages.value = response.data;
    })
    .catch((e) => {
      console.log("Fatal " + e);
    });
}

async function enviarNota() {
  const { valid } = await formNotas.value.validate();
  if (props['actividadID'] != null) {
    if (valid) {
      tipoMensaje(notasActividad.descripcion, props['actividadID']);
      await formNotas.value.reset()
    }
  } else {
    if (valid) {
      messages.value.push({
        descripcion: notasActividad.descripcion
      });
      await formNotas.value.reset();
    }
  }
}

async function enviarArrayNotas(idActividadCreada: any) {
  if (messages.value.length > 0) {
    for (let i = 0; i < messages.value.length; i++) {
      tipoMensaje(messages.value[i].descripcion, idActividadCreada)
    }
  }
}

function tipoMensaje(mensaje: any, idActividad: any) {
  axios
    .post(storeLogin.url + "NotasActividad/add", {
      descripcion: mensaje,
      idUsuario: { id: storeLogin.usuario.id },
      idActividad: { id: idActividad },
    })
    .then(() => {
      if (props['actividadID'] != null) {
        getMensajes(props['actividadID']);
      }
      notasActividad.descripcion = ""
    })
    .catch((e) => {
      console.log("Fatal " + e);
    });
}

function cerrarNota() {
  emit("cerrarNota");
}

defineExpose({
  getMensajes,
  enviarArrayNotas,
})
</script>