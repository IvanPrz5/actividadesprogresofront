<template>
  <v-card>
    <v-card-title class="bg-info">
      Participantes Actividad {{ numActividad }}
      <v-spacer></v-spacer>
    </v-card-title>
    <v-divider></v-divider>
    <v-row class="mt-2 mx-1" no-gutters>
      <v-col cols="12" class="mb-3">
        <v-card class="mx-5 elevation-0">
          <v-list>
            <template v-for="item in usuarios" :key="item.id">
              <v-row no-gutters class="mt-1">
                <v-col cols="2">
                  <v-list-item :title="item.id"></v-list-item>
                </v-col>
                <v-col cols="2">
                  <v-avatar :image="item.icon"></v-avatar>
                </v-col>
                <v-col cols="8">
                  <v-list-item :title="item.descripcion"></v-list-item>
                </v-col>
                <v-divider></v-divider>
              </v-row>
            </template>
          </v-list>
        </v-card>
      </v-col>
    </v-row>
  </v-card>
</template>

<script lang="ts" setup>
import { onMounted, ref } from "vue";
import axios from "axios";
import { loginStore } from "../../store/app";

const props = defineProps(["actividadID"]);
const storeLogin = loginStore();
let numActividad: any = ref("");
let usuarios: any = ref([]);

onMounted(() => {
  if (props.actividadID != undefined) {
    numActividad.value = props.actividadID;
    getUsuariosByActividad();
  }
});

function getUsuariosByActividad() {
  axios
    .get(storeLogin.url + "UsuarioActividad/byIdActividad/" + props.actividadID)
    .then((response) => {
      usuarios.value = response.data
    })
    .catch((e) => {
      console.log(e)
    })
}
</script>
