<template>
  <v-container>
    <v-img class="mx-auto my-5" max-width="200" src="/SIAC.png"></v-img>
    <v-card class="mx-auto pa-12 pb-8" elevation="8" max-width="448" rounded="lg">
      <v-form ref="formRegister" fast-fail @submit.prevent>
        <v-row no-gutters>
          <v-col cols="12" class="mb-3">
            <v-text-field density="compact" label="Nombre" prepend-inner-icon="mdi-account-outline" variant="outlined"
              v-model="credenciales.nombre" :rules="[rules.requerido]"></v-text-field>
          </v-col>
          <v-col cols="12" class="mb-3">
            <v-text-field density="compact" label="Apellido Paterno" prepend-inner-icon="mdi-account-outline"
              variant="outlined" v-model="credenciales.apPaterno" :rules="[rules.requerido]"></v-text-field>
          </v-col>
          <!-- <v-col cols="12" class="mb-3">
            <v-text-field density="compact" label="Apellido Materno" prepend-inner-icon="mdi-account-outline"
          variant="outlined" v-model="credenciales.apMaterno" :rules="[rules.requerido]"></v-text-field>
          </v-col> -->
          <v-col cols="12" class="mb-3">
            <v-text-field density="compact" label="Teléfono" prepend-inner-icon="mdi-phone-outline" variant="outlined"
              v-model="credenciales.telefono" :rules="[rules.requerido, rules.numero, rules.minimoDeCaracteres(credenciales.telefono, 10),
              rules.maximoDeCaracteres(credenciales.telefono, 11)]"></v-text-field>
          </v-col>
          <v-col cols="12" class="mb-3">
            <v-text-field density="compact" label="Correo Electrónico" prepend-inner-icon="mdi-email-outline"
              variant="outlined" v-model="credenciales.email" :rules="[rules.emailRules]"></v-text-field>
          </v-col>
          <v-col cols="12">
            <v-text-field :append-inner-icon="visible ? 'mdi-eye-off' : 'mdi-eye'" :type="visible ? 'text' : 'password'"
              density="compact" label="Ingresa tu contraseña" prepend-inner-icon="mdi-lock-outline" variant="outlined"
              @click:append-inner="visible = !visible" v-model="credenciales.password"
              :rules="[rules.requerido]"></v-text-field>
          </v-col>
        </v-row>
      </v-form>
      <v-btn block class="mb-5" color="info" size="large" variant="tonal" @click="enviarCredenciales">
        Registrarse
      </v-btn>
      <v-card-text class="text-center registerLink">
        <a class="text-blue text-decoration-none" rel="noopener noreferrer" @click="login">
          Ya tienes una cuenta?
        </a>
      </v-card-text>
    </v-card>
  </v-container>
  <v-dialog v-model="dialog" persistent width="auto">
    <v-card color="success">
      <v-card-text>
        El usuario se registro exitosamente. Seras redireccionado al Login.
        <v-progress-linear indeterminate color="white" class="mb-0"></v-progress-linear>
      </v-card-text>
    </v-card>
  </v-dialog>
  <v-snackbar v-model="snack" :timeout="2050" :color="snackColor">
    {{ msg }}
  </v-snackbar>
</template>

<script lang="ts" setup>
import { ref, inject } from "vue";
import axios from "axios";
import { loginStore } from "../../store/app";
import { useRouter } from "vue-router";
import Rules from "@/Clases/Rules";

const rules = new Rules();
const router = useRouter();
const storeLogin = loginStore();
const formRegister = ref(null) as any;
let visible: any = ref(false);
const dialog: any = ref(false);
const snack: any = ref(false);
let snackColor = "";
let msg: String = "";
let credenciales: any = ref({
  nombre: "",
  apPaterno: "",
  telefono: "",
  email: "",
  password: "",
});

async function enviarCredenciales() {
  const { valid } = await formRegister.value.validate();
  if (valid) {
    axios
      .post(storeLogin.url + "register", credenciales.value)
      .then((response) => {
        if (!response.data.error) {
          dialog.value = true;
          setTimeout(login, 2200);
        }
        if (response.data.result == 2) {
          mostrarSnack('error', 'El email ya existe');
        }
      })
      .catch((error) => {
        console.log("No se puede cargar  -> " + error);
      });
  }
}

function login() {
  router.push({ path: "/login" });
}

function mostrarSnack(color: any, msgSnack: any) {
  snackColor = color;
  msg = msgSnack;
  snack.value = true;
}
</script>

<style scoped>
.registerLink a {
  cursor: pointer;
}
</style>
