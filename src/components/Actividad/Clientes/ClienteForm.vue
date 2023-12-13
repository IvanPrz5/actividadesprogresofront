<template>
  <v-card>
    <v-card-title class="bg-info"> Agregar Cliente </v-card-title>
    <v-form ref="formCliente">
      <v-card-text>
        <v-text-field v-model="descripcion" label="Municio ó Dependencia" :rules="[rules.requerido]"></v-text-field>
        <v-row no-gutters>
          <v-col>
            <v-btn @click="cerrarClienteForm" color="error">
              Cerrar
            </v-btn>
          </v-col>
          <v-col style="display:flex; justify-content: end;">
            <v-btn @click="agregarCliente" color="success">
              Agregar
            </v-btn>
          </v-col>
        </v-row>
      </v-card-text>
    </v-form>
  </v-card>
</template>

<script lang="ts" setup>
import { loginStore } from "@/store/app";
import { ref } from "vue";
import Rules from "@/Clases/Rules";
import axios from 'axios';

const storeLogin = loginStore();
const rules = new Rules();
const formCliente: any = ref(null);
let descripcion: any = ref();
const emit = defineEmits(["cerrarCliente"]);

async function agregarCliente() {
  const { valid } = await formCliente.value.validate();
  if (valid) {
    axios
      .post(storeLogin.url + "Clientes/add", {
        descripcion: descripcion.value.toUpperCase(),
        status: true,
        idEmpresa: {
          id: storeLogin.idEmpresaSelecionada
        }
      })
      .then((response) => {
        cerrarClienteForm();
      })
      .catch((e) => {
        console.log("Fatal" + e)
      })
  }
}

function cerrarClienteForm() {
  formCliente.value.reset();
  emit("cerrarCliente");
}
</script>
