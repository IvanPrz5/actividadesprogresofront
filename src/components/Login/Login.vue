<template>
  <v-container>
    <v-img class="mx-auto my-10" max-width="250"
      src="/SIAC.png"></v-img>
    <v-card class="mx-auto pa-12 pb-8" elevation="8" max-width="448" rounded="lg">
      <v-form ref="formLogin" fast-fail @submit.prevent>
        <v-row no-gutters>
          <v-col cols="12" class="mb-3">
            <v-text-field density="compact" label="Email" prepend-inner-icon="mdi-email-outline"
              variant="outlined" v-model="credenciales.email" :rules="[rules.requerido]"></v-text-field>
          </v-col>
          <v-col cols="12">
            <v-text-field :append-inner-icon="visible ? 'mdi-eye-off' : 'mdi-eye'" :type="visible ? 'text' : 'password'"
              density="compact" label="Contraseña" prepend-inner-icon="mdi-lock-outline" variant="outlined"
              @click:append-inner="visible = !visible" v-model="credenciales.password"
              :rules="[rules.requerido]" @keyup.enter="enviarCredenciales"></v-text-field>
          </v-col>
        </v-row>
      </v-form>
      <v-btn block class="mb-5" color="info" size="large" variant="tonal" @click="enviarCredenciales">
        Iniciar Sesión
      </v-btn>
      <v-card-text class="text-center registerLink">
        <a class="text-blue text-decoration-none" rel="noopener noreferrer" @click="register">
          Registrate Aquí <v-icon icon="mdi-chevron-right"></v-icon>
        </a>
      </v-card-text>
    </v-card>
  </v-container>
  <v-snackbar v-model="snack" :timeout="1900" color="error">
    Revisa tu credenciales.
  </v-snackbar>
</template>
  

<script lang="ts" setup>
import { ref, inject } from 'vue';
import axios from "axios";
import { loginStore } from "../../store/app";
import { Usuario } from '@/Clases/Usuario';
import { Menu } from '@/Clases/Menu';
import { useRouter } from 'vue-router';
import Rules from "@/Clases/Rules";

const router = useRouter()
const storeLogin = loginStore();
const rules = new Rules();
const emitter: any = inject('emitter');
const formLogin = ref(null) as any;
let visible: any = ref(false);
let credenciales: any = ref({
  email: "",
  password: "",
});
let snack: any = ref(false);

function menu(idRol: any) {
  axios
    .get(storeLogin.url + "Menu/" + idRol)
    .then((response) => {
      storeLogin.menu = <Menu[]>response.data;
      localStorage.setItem("menu", JSON.stringify(storeLogin.menu))
    })
    .catch((error) => {
      console.log("No se puede cargar  -> " + error);
    });
}

function register() {
  router.push({ path: "/register" });
}

async function enviarCredenciales() {
  const { valid } = await formLogin.value.validate();
  if (valid) {
    axios
      .post(storeLogin.url + "login", credenciales.value)
      .then((response) => {
        if (response.data.data.usuario[0].empresas.length > 0) {
          localStorage.setItem("token", response.data.data.token);
          storeLogin.usuario = <Usuario>response.data.data.usuario[0];
          localStorage.setItem("usuario", JSON.stringify(<Usuario>response.data.data.usuario[0]));
          storeLogin.token = response.data.data.token;
          menu(storeLogin.usuario.roles[0].id);

          try {
            storeLogin.idEmpresaSelecionada = storeLogin.usuario.empresas[0].id + "";
            storeLogin.bienesUnicos = storeLogin.usuario.empresas[0].bienes_unicos + "";
            localStorage.setItem("empresaSelecionada", storeLogin.idEmpresaSelecionada);
            localStorage.setItem("bienesUnicos", storeLogin.bienesUnicos);
          } catch (exepcion) {
            console.log("no hay empresa asignadas");
          }

          storeLogin.logiado.descripcion = "CERRAR SESION";
          storeLogin.logiado.token = true;
          storeLogin.abrirMenu = true;
          emitter.emit('numeroNotifi')
          router.push({ path: "/" });
        } else {
          router.push({ path: "/noempresa" });
        }
      })
      .catch((error) => {
        snack.value = true
        console.log("No se puede cargar  -> " + error);
      });
  }
}
</script>

<style scoped>
.registerLink a {
  cursor: pointer;
}
</style>