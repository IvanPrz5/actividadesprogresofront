<template>
  <v-container class="settings-container" fluid>
    <div>
      <v-row no-gutters class="d-flex justify-space-between mt-10 mb-6">
        <h1 class="page-title">Ajustes</h1>
      </v-row>
    </div>
    <v-row>
      <v-col cols="12" lg="4" md="4" sm="6" xs="12">
        <v-card>
          <v-img height="428px" :src="imageSrc" cover>
            <v-toolbar color="#ffffff00">
              <template v-slot:append>
                <div id="inspire">
                  <v-file-input class="browse-file mt-15" v-model="archivo" @change="fileAdded" prepend-icon="mdi-pencil"
                    accept="image/png, image/jpeg" />
                </div>
              </template>
            </v-toolbar>
          </v-img>
        </v-card>
      </v-col>
      <v-col cols="12" lg="8" md="8" sm="6" xs="12">
        <v-card class="mx-1 mb-1">
          <v-card-title class="pa-6 pb-3">
            <p>Editar Perfil</p>
          </v-card-title>
          <v-card-text class="pa-4 pt-0">
            <v-form ref="formPerfil" fast-fail @submit.prevent>
              <v-row no-gutters class="typography-widget pb-6">
                <v-col cols="12" lg="6" md="6" sm="12" xs="12">
                  <v-text-field class="pa-2" v-model="storeLogin.usuario.nombre" density="compact" label="Nombre(s)*"
                    required :rules="[rules.requerido]"></v-text-field>
                </v-col>
                <v-col cols="12" lg="6" md="6" sm="12" xs="12">
                  <v-text-field class="pa-2" v-model="storeLogin.usuario.paterno" density="compact"
                    label="Apellido Paterno*" required :rules="[rules.requerido]"></v-text-field>
                </v-col>
                <v-col cols="12" lg="4" md="4" sm="12" xs="12">
                  <v-text-field class="pa-2" v-model="storeLogin.usuario.email" density="compact" label="Email" readonly
                    required></v-text-field>
                </v-col>
                <v-col cols="12" lg="4" md="4" sm="12" xs="12">
                  <v-text-field :append-inner-icon="visible ? 'mdi-eye-off' : 'mdi-eye'" :type="visible ? 'text' : 'password'"
                    density="compact" label="Nueva Contraseña" prepend-inner-icon="mdi-lock-outline"
                    @click:append-inner="visible = !visible" v-model="contraseña"
                    class="pa-2"></v-text-field>
                </v-col>
                <v-col cols="12" lg="4" md="4" sm="12" xs="12">
                  <v-text-field class="pa-2" v-model="storeLogin.usuario.telefono" density="compact" label="Telefono"
                    required :rules="[rules.requerido, rules.numero]"></v-text-field>
                    {{storeLogin.usuario.telefono.length}}
                </v-col>
                <v-col cols="12">
                  <div class="text-subtitle-1 text-medium-emphasis pl-2">
                    Fecha de Nacimiento:*
                  </div>
                  <VueDatepicker class="pa-2 mb-5" placeholder="Fecha de Inicio"
                    v-model="storeLogin.usuario.fechaNacimiento" allow-prevent-default locale="es-MX" :teleport="true"
                    :enable-time-picker="false" :clearable="false" />
                </v-col>
                <v-col cols="12">
                  <v-btn block class="pa-6" color="indigo" @click="updatePerfil"> Actualizar Perfil </v-btn>
                </v-col>
              </v-row>
            </v-form>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <v-dialog v-model="dialog" persistent width="auto">
      <v-card color="info">
        <v-card-text>
          Actualizando Perfil. Por favor espere.
          <v-progress-linear indeterminate color="white" class="mb-0"></v-progress-linear>
        </v-card-text>
      </v-card>
    </v-dialog>
    <v-snackbar v-model="snack" :timeout="1800" color="success">
      Se guardaron los cambios.
    </v-snackbar>
  </v-container>
</template>


<script lang="ts" setup>
import { ref } from "vue";
import Rules from "@/Clases/Rules";
import { loginStore } from "../../store/app";
import VueDatepicker from "@vuepic/vue-datepicker";
import "@vuepic/vue-datepicker/dist/main.css";
import axios from "axios";
import { Usuario } from '@/Clases/Usuario';
import { useRouter } from "vue-router";

const rules = new Rules();
const storeLogin = loginStore();
const router = useRouter();
const formPerfil = ref(null) as any;
const imageSrc: any = ref(storeLogin.usuario.icon)
const archivo: any = ref([]);
const archivoList: any = ref([]);
const dialog: any = ref(false);
const snack: any = ref(false);
let visible: any = ref(false);
let contraseña: any = ref();

async function updatePerfil() {
  const { valid } = await formPerfil.value.validate();
  if (valid) {
    const fechaNacimiento2 = convert(storeLogin.usuario.fechaNacimiento)
    const entity = {
      id: storeLogin.usuario.id,
      nombre: storeLogin.usuario.nombre,
      apPaterno: storeLogin.usuario.paterno,
      telefono: storeLogin.usuario.telefono,
      fechaNacimiento: fechaNacimiento2,
    };
    await axios
      .put(storeLogin.url + "Usuarios/edit/" + storeLogin.usuario.id, entity)
      .then(() => {
        if(archivoList.value.length > 0){
          setImage();
        }else{
          getPerfil(storeLogin.url + "Usuarios/byId/" + storeLogin.usuario.id);
          snack.value = true;
        }
        if(contraseña.value != undefined){
          cambiarContraseña();
        }
      })
      .catch((e) => {
        console.log(" Fatal " + e);
      })
  }
}

function cambiarContraseña() {
  axios
    .put(storeLogin.url + "Usuarios/password/" + storeLogin.usuario.id, {
      password: contraseña.value
    })
    .then(() => {
    })
    .catch((e) => {
      console.log("Fatal " + e)
    })
}

async function setImage() {
  const entity = {
    id: storeLogin.usuario.id,
  };

  const entityJson = JSON.stringify(entity);
  const blob = new Blob([entityJson], {
    type: "application/json",
  });

  var formData = new FormData();
  formData.append("file", archivoList.value[0]);
  formData.append("doc", blob);
  await axios
    .post(storeLogin.url + "Usuarios/uploadImage", formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      })
    .then(() => {
      getFoto(storeLogin.url + "Usuarios/img/" + storeLogin.usuario.id);
      storeLogin.usuario.icon = storeLogin.url + "Usuarios/img/" + storeLogin.usuario.id;
    })
    .catch((e) => {
      console.log(" Fatal " + e);
    })
}

function fileAdded() {
  archivoList.value = [
    ...archivo.value,
    ...archivoList.value
  ]
  var algo = URL.createObjectURL(archivo.value[0])
  imageSrc.value = algo
}

function getPerfil(ruta: any) {
  axios
    .get(ruta)
    .then((response) => {
      console.log(response.data)
      storeLogin.usuario.nombre = response.data[0].nombre;
      storeLogin.usuario.paterno = response.data[0].paterno;
      storeLogin.usuario.telefono = response.data[0].telefono;
      storeLogin.usuario.icon = response.data[0].icon;
      storeLogin.usuario.fechaNacimiento = response.data[0].fechaNacimiento;
      localStorage.setItem("usuario", JSON.stringify(<Usuario>response.data[0]));
    })
    .catch((e) => {
      console.log(e)
    })
}

function getFoto(ruta: any) {
  imageSrc.value = ruta
  getPerfil(storeLogin.url + "Usuarios/byId/" + storeLogin.usuario.id);
  dialog.value = true;
  setTimeout(() => {
    dialog.value = false;
    router.go(0);
  }, 2000);
}

function convert(date: Date) {
  return date.toLocaleString('sv', { timeZone: 'America/Mexico_City' }).replace(' ', 'T');
}
</script>

<style scoped>
#inspire {
  background-color: #3F51B5;
}

:deep(#inspire) .v-input__control {
  display: none;
}

:deep(#inspire) .v-input .v-icon {
  color: #FFFFFF;
  padding-left: 15px;
  padding-bottom: 10px;
}
</style>