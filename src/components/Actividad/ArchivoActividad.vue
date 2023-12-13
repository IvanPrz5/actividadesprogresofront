<template>
  <v-card class="mt-2">
    <v-card-title class="bg-info">
      Archivos de Actividad {{ numActividad }}</v-card-title>
    <v-divider></v-divider>
    <v-row class="mt-1 mx-1">
      <v-col align-items="center" cols="12">
        <v-form enctype="multipart/form-data">
          <v-row v-if="desserts.length == 0">
            <v-col cols="12">
              <div class="text-subtitle-1 text-medium-emphasis">
                Selecciona tus archivos:*
              </div>
              <v-file-input v-model="archivo" multiple @change="fileAdded">
                <template v-slot:selection="{ fileNames }"></template>
              </v-file-input>
              <p class="text-error" v-if="validar == true">Campo requerido *</p>
              <v-row no-gutters v-if="archivoList.length">
                <v-col cols="12">
                  <div class="text-subtitle-1 text-medium-emphasis">
                    Archivos:
                  </div>
                  <v-card class="mb-3">
                    <v-list style="height: 150px">
                      <template v-for="(item, i) in archivoList">
                        <v-row no-gutters>
                          <v-col cols="10">
                            <v-list-item :subtitle="item.name"></v-list-item>
                          </v-col>
                          <v-col cols="2">
                            <v-btn variant="text" icon="mdi-delete" color="error" @click="remove(i)"></v-btn>
                          </v-col>
                        </v-row>
                      </template>
                    </v-list>
                  </v-card>
                </v-col>
              </v-row>
            </v-col>
          </v-row>
          <v-row v-if="desserts.length > 0" no-gutters class="mb-5">
            <v-list width="100%">
              <v-card class="control-archivosList mb-5" color="indigo" height="40">
              <v-row align="center" no-gutters>
                <v-col class="d-flex align-center">
                  <div class="pl-12">Usuario</div>
                </v-col>
                <v-col cols="12" lg="6" md="6" sm="6" xs="12"> Archivo </v-col>
                <v-col cols="12" lg="2" md="2" sm="2" xs="2">
                  Opciones
                </v-col>
              </v-row>
            </v-card>
              <v-list-group v-for="(archivo, i) in desserts" :key="archivo.id" :value="i">
                <template v-slot:activator="{ props }">
                  <v-row justify="center" align="center" no-gutters>
                    <v-col class="d-flex align-center">
                      <v-avatar :image="archivo.usuario.icon" class="mr-2"></v-avatar>
                      {{ archivo.usuario.descripcion }}
                    </v-col>
                    <v-col cols="12" lg="6" md="6" sm="6" xs="12">
                      <v-list-item v-bind="props" :subtitle="archivo.nombre"></v-list-item>
                    </v-col>
                    <v-col cols="12" lg="2" md="2" sm="2" xs="2" class="d-flex">
                      <v-tooltip location="bottom">
                        <template v-slot:activator="{ props }">
                          <v-btn v-bind="props" variant="text" icon="mdi-file-document-plus-outline" color="info"
                            @click="mostrarDialogArchivo(archivo.id)"></v-btn>
                        </template>
                        <span>Dejar más archivos</span>
                      </v-tooltip>
                      <v-tooltip location="bottom">
                        <template v-slot:activator="{ props }">
                          <v-btn v-bind="props" variant="text" icon="mdi-download" color="error"
                            @click="descargarArchivo(archivo.id, archivo.nombre)"></v-btn>
                        </template>
                        <span>Descargar Archivo</span>
                      </v-tooltip>
                    </v-col>
                  </v-row>
                </template>
                <v-list-item class="tile bg-green-lighten-4" v-for="archivoDepende in archivo.archivoDepende" :key="archivoDepende.id">
                  <v-row justify="center" align="center" no-gutters>
                    <v-col class="d-flex align-center">
                      <v-avatar :image="archivoDepende.usuario.icon" class="mr-2"></v-avatar>
                      {{ archivoDepende.usuario.descripcion }}
                    </v-col>
                    <v-col cols="12" lg="6" md="6" sm="6" xs="12">
                      <v-list-item v-bind="props" :subtitle="archivoDepende.nombre"></v-list-item>
                    </v-col>
                    <v-col cols="1">
                      <v-tooltip location="bottom">
                        <template v-slot:activator="{ props }">
                          <v-btn v-bind="props" variant="text" icon="mdi-download" color="error" @click="
                            descargarArchivo(
                              archivoDepende.id,
                              archivoDepende.nombre
                            )
                            "></v-btn>
                        </template>
                        <span>Descargar Archivo</span>
                      </v-tooltip>
                    </v-col>
                  </v-row>
                </v-list-item>
              </v-list-group>
            </v-list>
          </v-row>
        </v-form>
      </v-col>
    </v-row>
    <v-row v-if="props['actividadID'] != null" class="ml-4 mb-4" no-gutters>
      <v-spacer></v-spacer>
      <v-col class="mr-4" cols="auto" v-if="desserts.length == 0">
        <v-btn color="info" variant="outlined" @click="agregarArchivos">Guardar Archivo</v-btn>
      </v-col>
    </v-row>
  </v-card>
  <v-dialog width="600" v-model="dialogContestar">
    <v-card>
      <v-card-text>
        <v-row no-gutters>
          <v-col cols="12">
            <div class="text-subtitle-1 text-medium-emphasis">
              Selecciona tus archivos:*
            </div>
            <v-file-input v-model="archivoContestar" multiple @change="fileAddedC">
              <template v-slot:selection="{ fileNames }"></template>
            </v-file-input>
            <p class="text-error" v-if="validar == true">Campo requerido *</p>
            <v-row no-gutters v-if="archivoList2.length">
              <v-col cols="12">
                <div class="text-subtitle-1 text-medium-emphasis">
                  Archivos:
                </div>
                <v-card class="mb-3">
                  <v-list style="height: 150px">
                    <template v-for="(item, i) in archivoList2">
                      <v-row no-gutters>
                        <v-col cols="10">
                          <v-list-item :subtitle="item.name"></v-list-item>
                        </v-col>
                        <v-col cols="2">
                          <v-btn variant="text" icon="mdi-delete" color="error" @click="removeC(i)"></v-btn>
                        </v-col>
                      </v-row>
                    </template>
                  </v-list>
                </v-card>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
        <v-row no-gutters>
          <!--  <v-col cols="9">
            <v-btn color="error" variant="outlined" @click="dialogContestar = false">Cancelar</v-btn>
          </v-col> -->
          <v-spacer></v-spacer>
          <v-col cols="auto">
            <v-btn color="info" variant="outlined" @click="contestarAlArchivo">Aceptar</v-btn>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </v-dialog>
  <v-snackbar v-model="snack" :timeout="1500" color="success">
    Se guardo con exito.
  </v-snackbar>
</template>

<script lang="ts" setup>
import { loginStore } from "@/store/app";
import axios from "axios";
import { ref, onMounted } from "vue";

const storeLogin = loginStore();
const archivo: any = ref([]);
const archivoList: any = ref([]);
const archivoContestar: any = ref([]);
const archivoList2: any = ref([]);
const emit = defineEmits(["cerrarArchivo"]);
let desserts: any = ref([]);
let dialogContestar: any = ref(false);
let idArchivo: any;
const props = defineProps(["actividadID"]);
let validar: any = ref(false);
const snack: any = ref(false);
let numActividad: any = ref("");

onMounted(() => {
  if (props["actividadID"] != null) {
    numActividad.value = props.actividadID;
    historialArchivos(props["actividadID"]);
  }
});

function algo(archivo: any) {
  console.log(archivo);
}

function mostrarDialogArchivo(id: any) {
  idArchivo = id;
  dialogContestar.value = true;
}

function historialArchivos(id: any) {
  axios
    .get(storeLogin.url + "ArchivoActividad/byIdActividadAndArchivoNull/" + id)
    .then((response) => {
      desserts.value = response.data;
    })
    .catch((e) => {
      console.log("Fatal " + e);
    });
}

function agregarArchivos() {
  guardarArchivo(props.actividadID);
}

async function guardarArchivo(idActividad: any) {
  if (archivoList.value.length > 0) {
    const entity = {
      icon: "prueba Icon",
      url: "prueba Url",
      idUsuario: {
        id: storeLogin.usuario.id,
      },
      idActividad: {
        id: idActividad,
      },
    };

    const entityJson = JSON.stringify(entity);
    const blob = new Blob([entityJson], {
      type: "application/json",
    });

    var formData = new FormData();

    formData.append("file", archivoList.value[0]);
    formData.append("doc", blob);

    axios
      .post(storeLogin.url + "ArchivoActividad/add", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then(() => {
        if (props["actividadID"] != null) {
          historialArchivos(props["actividadID"]);
          dialogContestar.value = false;
          snack.value = true;
        }
      })
      .catch((e) => {
        console.log("Fatal " + e);
      });
  } else {
    validar.value = true;
  }
}

function contestarAlArchivo() {
  if (archivoList2.value.length > 0) {
    let entity = {
      icon: "prueba Icon",
      url: "prueba Url",
      idUsuario: {
        id: storeLogin.usuario.id,
      },
      idActividad: {
        id: props["actividadID"],
      },
      idArchivoActividad: {
        id: idArchivo,
      },
    };

    const entityJson = JSON.stringify(entity);
    const blob = new Blob([entityJson], {
      type: "application/json",
    });
    let formData = new FormData();
    for (let i = 0; i < archivoList2.value.length; i++) {
      formData.append("file", archivoList2.value[i]);
      formData.append("doc", blob);
    }
    axios
      .post(storeLogin.url + "ArchivoActividad/contestar", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then(() => {
        if (props["actividadID"] != null) {
          historialArchivos(props["actividadID"]);
        }
        dialogContestar.value = false;
        snack.value = true;
        archivoList2.value = [];
      })
      .catch((e) => {
        console.log("Fatal " + e);
      });
  } else {
    validar.value = true;
  }
}

function descargarArchivo(idArchivo: any, nombre: any) {
  axios({
    url: storeLogin.url + "ArchivoActividad/descarga/" + idArchivo,
    method: "GET",
    responseType: "blob",
  })
    .then((response) => {
      let url = window.URL.createObjectURL(new Blob([response.data]));
      let link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", nombre);
      document.body.appendChild(link);
      link.click();
    })
    .catch((e) => {
      console.log("Fatal " + e);
    });
}

function cerrarArchivo() {
  emit("cerrarArchivo");
}

function remove(item: any) {
  archivoList.value.splice(item, 1);
}

function fileAdded() {
  archivoList.value = [...archivo.value, ...archivoList.value];
}

function removeC(item: any) {
  archivoList2.value.splice(item, 1);
}

function fileAddedC() {
  archivoList2.value = [...archivoContestar.value, ...archivoList2.value];
}

defineExpose({
  guardarArchivo,
  contestarAlArchivo,
});
</script>

<style scoped>
.tile {
  margin: 5px;
  border-radius: 4px;
}
.control-archivosList {
  display: flex;
}
@media (max-width: 600px) {
  .control-archivosList {
    display: none;
  }
}
</style>
