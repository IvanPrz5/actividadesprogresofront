<template>
  <v-container class="container-main">
    <v-card class="elevation-0 card-class" color="#FFFFFF00">
      <v-card-text>
        <v-row>
          <v-col cols="12" xl="6" lg="6" md="6">
            <Actividad :editarProp="editarProp" @cancelar="cancelarActividad" ref="actividad" />
          </v-col>
          <v-col>
            <v-card class="elevation-3">
              <v-card-title>Necesitas algo más?</v-card-title>
              <v-divider></v-divider>
              <v-row>
                <v-col>
                  <v-row no-gutters class="pl-4 pr-2 pt-4 pb-3">
                    <v-col class="pr-2 pb-2" cols="12" xl="4" md="4" sm="4" xs="4">
                      <v-card @click="dejarNota()" class="elevation-3" color="cardNotas">
                        <v-card-item>
                          <div justify="center" align="center">
                            <div class="text-overline mb-1">Notas</div>
                            <v-icon size="60" icon="mdi-text-box-edit-outline"></v-icon>
                          </div>
                        </v-card-item>
                      </v-card>
                    </v-col>
                    <v-col cols="12" xl="4" md="4" sm="4" xs="4" class="pr-2 pb-2">
                      <v-card @click="apartarBien()" class="elevation-3" color="cardRecursos">
                        <v-card-item>
                          <div justify="center" align="center">
                            <div class="text-overline mb-1">Recursos</div>
                            <v-icon size="60" icon="mdi-car"></v-icon>
                          </div>
                        </v-card-item>
                      </v-card>
                    </v-col>
                    <v-col class="pr-2 pb-2">
                      <v-card @click="dejarArchivo()" class="elevation-3" color="cardArchivos">
                        <v-card-item>
                          <div justify="center" align="center">
                            <div class="text-overline mb-1">Archivos</div>
                            <v-icon size="60" icon="mdi-file-document-plus-outline"></v-icon>
                          </div>
                        </v-card-item>
                      </v-card>
                    </v-col>
                  </v-row>
                </v-col>
              </v-row>
            </v-card>
            <v-row no-gutters>
              <v-col>
                <v-window v-model="step">
                  <v-window-item :value="1">
                    <NotasActividad @cerrarNota="cerrarNota" ref="notasActividad" />
                  </v-window-item>
                  <v-window-item :value="2">
                    <UsarActividad @cerrarBien="cerrarBien" ref="usarActividad" />
                  </v-window-item>
                  <v-window-item :value="3">
                    <ArchivoActividad @cerrarArchivo="cerrarArchivo" ref="archivoActividad" />
                  </v-window-item>
                </v-window>
              </v-col>
            </v-row>
            <v-row class="mt-3" no-gutters>
              <v-col>
                <v-btn height="65" size="large" color="success" @click="crearActividad" block>
                  Crear Actividad
                </v-btn>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
    <v-snackbar v-model="snack" :timeout="1500" color="error">
      La actividad no se creo.
    </v-snackbar>
  </v-container>
</template>

<script lang="ts" setup>
import { ref, inject } from "vue";
import Actividad from "@/components/Actividad/Actividad.vue";
import ArchivoActividad from "@/components/Actividad/ArchivoActividad.vue";
import UsarActividad from "@/components/Actividad/UsarActividad.vue";
import NotasActividad from "@/components/Actividad/NotasActividad.vue";

const actividad = ref<InstanceType<typeof Actividad> | null>(null);
const usarActividad = ref<InstanceType<typeof UsarActividad> | null>(null);
const archivoActividad = ref<InstanceType<typeof ArchivoActividad> | null>(
  null
);
const notasActividad = ref<InstanceType<typeof NotasActividad> | null>(null);

let editarProp: any = ref(true);
let mostrarNotas: any = ref(false);
let mostrarBien: any = ref(false);
let mostrarArchivo: any = ref(false);
let step: any = ref(1);
const emit = defineEmits(["cancelarActividad", "actualizar"]);
const snack: any = ref(false);
const emitter: any = inject('emitter');

async function crearActividad() {
  const idActividadCreada = await actividad.value?.tipoRuta();
  if(idActividadCreada != null){
    await notasActividad.value?.enviarArrayNotas(idActividadCreada);
    await archivoActividad.value?.guardarArchivo(idActividadCreada);
    await usarActividad.value?.guardarRecurso(idActividadCreada);
    emitter.emit('idActividadCreada', idActividadCreada)
    emitter.emit('numActividades');
    cancelarActividad();
  }else{
    snack.value = true;
  }
}

async function cancelarActividad() {
  emit("actualizar");
  emit("cancelarActividad");
}

function dejarNota() {
  step.value = 1;
}

function cerrarNota() {
  mostrarNotas.value = false;
}

function apartarBien() {
  step.value = 2;
}

function cerrarBien() {
  mostrarBien.value = false;
}

function dejarArchivo() {
  step.value = 3;
}

function cerrarArchivo() {
  mostrarArchivo.value = false;
}
</script>

<style scoped>
  @media(max-width: 600px){
    .container-main{
      margin: 0;
      padding: 0;
      min-width: 280px;
    }
   /*  .card-class{
      width: 400px;
    } */
  }
</style>