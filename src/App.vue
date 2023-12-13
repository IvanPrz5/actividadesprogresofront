<template>
  <v-app id="inspire">
    <v-app-bar color="blue">
      <v-app-bar-nav-icon v-if="storeLogin.logiado.token" @click="ocultarDraer"></v-app-bar-nav-icon>
      <!-- <v-container> -->
      <v-row no-gutters>
        <v-col cols="12" xl="2" lg="2" md="2" sm="2" xs="2">
          <div class="mt-8 title-control">Sistema de Actividades</div>
        </v-col>
        <v-col v-if="storeLogin.logiado.token" cols="3" class="auto-control">
          <v-autocomplete class="mt-5" v-model="storeLogin.idEmpresaSelecionada" label="Empresa"
            :items="storeLogin.usuario.empresas" variant="solo-filled" density="compact" item-title="descripcion"
            :item-value="['id']" @update:model-value="ActualizarEmpresa">
          </v-autocomplete>
        </v-col>
        <!-- <v-col v-if="storeLogin.logiado.token" cols="12" lg="6" md="6" sm="6"> -->
        <v-row v-if="storeLogin.logiado.token" no-gutters class="pl-5 action-control">
          <v-col cols="3">
            <v-badge :dot="dotModel" :content="numActividades" class="mt-8 mr-2 pointer" :color="colorDot"
              @click="consultaActividad(4)">
              <v-icon icon="mdi-bell" size="large"></v-icon>
              <v-tooltip activator="parent" location="bottom">Actividades Pendientes</v-tooltip>
            </v-badge>
          </v-col>
          <v-col cols="3">
            <v-badge :dot="dotModel2" :content="numRecursos" class="mt-8 mr-2 pointer" :color="colorDot2"
              @click="consultaActividad(5)">
              <v-icon icon="mdi-car" size="large"></v-icon>
              <v-tooltip activator="parent" location="bottom">Recursos por Entregar</v-tooltip>
            </v-badge>
          </v-col>
          <v-col cols="3">
            <v-badge dot inline class="mt-8 mr-2 pointer" color="info" @click="dialogActividad()">
              <v-icon icon="mdi-bell-plus" size="large"></v-icon>
              <v-tooltip activator="parent" location="bottom">Crear Actividad</v-tooltip>
            </v-badge>
          </v-col>
          <v-col cols="3">
            <v-icon class="mt-8 mr-2" @click="cambioDeThema" density="comfortable" icon="mdi-theme-light-dark"
              size="large"></v-icon>
          </v-col>
        </v-row>
        <!-- </v-col> -->
        <v-col cols="2" v-if="storeLogin.logiado.token">
          <v-btn @click="ValidaSession()" class="mt-8">
            <span class="mr-2 salir-text">{{
              storeLogin.logiado.descripcion
            }}</span>
            <v-icon size="large" density="comfortable" icon="mdi-logout"></v-icon>
          </v-btn>
        </v-col>
      </v-row>
      <!-- </v-container> -->
    </v-app-bar>
    <v-navigation-drawer v-model="storeLogin.abrirMenu" v-if="storeLogin.logiado.token" width="300">
      <v-sheet class="pa-4">
        <v-row>
          <v-col cols="6">
            <v-avatar class="mb-4" color="grey-darken-1" size="64">
              <v-img :src="storeLogin.usuario.icon.toString()" cover></v-img>
            </v-avatar>
          </v-col>
          <v-col cols="3">
            <v-btn color="#ffffff00" elevation="0" icon="mdi-calendar" @click="goCalendar"></v-btn>
          </v-col>
          <v-col cols="3">
            <v-btn color="#ffffff00" elevation="0" icon="mdi-cog" @click="ajustes"></v-btn>
          </v-col>
        </v-row>
        <div v-if="storeLogin.usuario != null">
          {{ storeLogin.usuario.email }}
        </div>
        <v-btn-toggle elevation="3" rounded="0" color="deep-purple-accent-3" group>
          <v-btn value="left" @click="consultaActividad(1)">
            HOY
            <v-icon end> mdi-calendar </v-icon>
          </v-btn>

          <v-btn value="center" @click="consultaActividad(2)">
            SEM
            <v-icon end> mdi-calendar-range </v-icon>
          </v-btn>
          <v-btn value="right" @click="consultaActividad(3)">
            MES
            <v-icon end> mdi-calendar-month </v-icon>
          </v-btn>
        </v-btn-toggle>
      </v-sheet>
      <v-divider></v-divider>
      <v-row class="mx-1 empresa-responsive">
        <v-col v-if="storeLogin.logiado.token" cols="12">
          <v-autocomplete class="mt-5" v-model="storeLogin.idEmpresaSelecionada" label="Empresa"
            :items="storeLogin.usuario.empresas" variant="solo-filled" density="compact" item-title="descripcion"
            :item-value="['id']" @update:model-value="ActualizarEmpresa">
          </v-autocomplete>
        </v-col>
      </v-row>
      <template v-slot:append>
        <div class="pa-2"></div>
      </template>
    </v-navigation-drawer>
    <v-main>
      <!-- <ActividadesFijas /> -->
      <router-view></router-view>
    </v-main>
    <v-dialog v-model="nuevaActividad" width="1100">
      <v-card class="elevation-0" color="#FFFFFF00">
        <v-card-text>
          <ActividadCompleta ref="actividad" @cancelarActividad="cancelarActividad"></ActividadCompleta>
        </v-card-text>
      </v-card>
    </v-dialog>
    <v-dialog v-model="successDialog" persistent>
      <div class="text-center">
        <v-sheet elevation="12" max-width="600" rounded="lg" width="100%" class="pa-4 text-center mx-auto">
          <v-icon class="mb-5" color="success" icon="mdi-check-circle" size="112"></v-icon>
          <h2 class="text-h5 mb-6">
            Se creo la Actividad {{ idActividadCreada }}
          </h2>
        </v-sheet>
      </div>
    </v-dialog>
  </v-app>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { loginStore } from "../src/store/app";
import { useTheme } from "vuetify";
import { inject } from "vue";
import ActividadCompleta from "@/components/Actividad/ActividadCompleta.vue";
import ActividadesFijas from "@/components/Actividad/Fijas/ActividadesFijas.vue";
import axios from "axios";

export default defineComponent({
  name: "App",
  components: {
    ActividadCompleta,
    ActividadesFijas
  },
  watch: {
    successDialog(val) {
      if (!val) return;
      setTimeout(() => (this.successDialog = false), 2000);
    },
  },
  data() {
    const storeLogin = loginStore();
    let open = ["Users"];
    return {
      drawer: false,
      nuevaActividad: false,
      logiado: {
        descripcion: "INICIAR SESION",
        token: false,
      },
      storeLogin,
      open,
      successDialog: false,
      numActividades: "",
      numRecursos: "",
      idActividadCreada: "",
      dotModel: false,
      colorDot: "orange",
      dotModel2: false,
      colorDot2: "red",
    };
  },
  setup() {
    const emitter: any = inject("emitter");
    const theme = useTheme();
    return {
      theme,
      emitter,
    };
  },
  created() {
    const token = localStorage.getItem("token");
    if (token == null) {
      this.storeLogin.logiado.descripcion = "INICIAR SESSION";
      this.storeLogin.logiado.token = false;
      this.storeLogin.token = "";
      this.storeLogin.menu = [];
      // this.storeLogin.idUsuario = -1;
      this.storeLogin.abrirMenu = false;
      this.$router.push("/login");
    } else {
      this.storeLogin.logiado.descripcion = "CERRAR SESSION";
      this.storeLogin.logiado.token = true;

      let empleado: any = localStorage.getItem("usuario");
      this.storeLogin.usuario = JSON.parse(empleado);

      let menu: any = localStorage.getItem("menu");
      this.storeLogin.menu = JSON.parse(menu);

      let empresaSele: any = localStorage.getItem("empresaSelecionada");
      this.storeLogin.idEmpresaSelecionada = empresaSele;

      let empresasCarga = localStorage.getItem("empresasUsuario");
      let empresaSelecionada =
        localStorage.getItem("empresaSelecionada") == null
          ? ""
          : localStorage.getItem("empresaSelecionada");

      this.storeLogin.token = token;
      this.storeLogin.abrirMenu = true;
    }

    if (this.storeLogin.logiado.token) {
      this.getTotalRetrazadasAndHoy();
      this.getTotalRecursos();
    } else {
      this.emitter.on("numeroNotifi", () => {
        this.getTotalRetrazadasAndHoy();
        this.getTotalRecursos();
      });
    }

    this.emitter.on("idActividadCreada", (id: any) => {
      this.idActividadCreada = id;
    }),
      this.emitter.on("numActividades", () => {
        this.getTotalRetrazadasAndHoy();
      }),
      this.emitter.on("numRecursos", () => {
        this.getTotalRecursos();
      });
  },
  methods: {
    dialogActividad() {
      this.nuevaActividad = true;
      this.emitter.emit("resetActividad");
    },

    consultaActividad(tipo: any) {
      this.$router.push({ path: "/detalleActividad/" + tipo });
    },

    ValidaSession() {
      if (this.storeLogin.logiado.token) {
        this.logOut();
      } else {
        this.Login();
      }
    },

    ajustes() {
      this.$router.push({ path: "/ajustes" });
    },

    goCalendar() {
      this.$router.push({ path: "/" });
    },

    Login() {
      this.$router.push({
        path: "/login",
      });
    },

    logOut: function () {
      localStorage.removeItem("token");
      localStorage.removeItem("empresasUsuario");

      this.storeLogin.logiado.descripcion = "INICIAR SESSION";
      this.storeLogin.logiado.token = false;
      this.storeLogin.token = "";
      // this.storeLogin.empresasUsuario = [];
      this.storeLogin.menu = [];
      // this.storeLogin.idUsuario = -1;
      // this.storeLogin.empresaSelecionada  = [];
      this.storeLogin.abrirMenu = false;

      this.$router.push("/login");
    },

    ocultarDraer() {
      this.storeLogin.abrirMenu = !this.storeLogin.abrirMenu;
    },

    cambioDeThema() {
      this.theme.global.name.value = this.theme.global.current.value.dark
        ? "MyTheme"
        : "dark";
      // this.theme.global.name.value = this.theme.global.current.value ? 'dark' : 'MyTheme'
      localStorage.setItem("theme", this.theme.global.name.value);
    },

    getTotalRetrazadasAndHoy() {
      axios
        .get(
          this.storeLogin.url +
          "Actividad/totalActividades/" +
          this.storeLogin.usuario.id +
          "/" +
          this.storeLogin.idEmpresaSelecionada
        )
        .then((response) => {
          this.numActividades = response.data.toString();
          if (response.data.toString() == 0) {
            this.colorDot = "info";
            this.dotModel = true;
          } else {
            this.colorDot = "orange";
            this.dotModel = false;
          }
        })
        .catch((e) => {
          console.log(e);
        });
    },

    getTotalRecursos() {
      axios
        .get(
          this.storeLogin.url +
          "UsarActividad/totalRecursos/" +
          this.storeLogin.usuario.id +
          "/" +
          this.storeLogin.idEmpresaSelecionada
        )
        .then((response) => {
          this.numRecursos = response.data.toString();
          if (response.data.toString() == 0) {
            this.colorDot2 = "info";
            this.dotModel2 = true;
          } else {
            this.colorDot2 = "red";
            this.dotModel2 = false;
          }
        })
        .catch((e) => {
          console.log(e);
        });
    },

    ActualizarEmpresa(item: any) {
      axios
        .get(this.storeLogin.url + "Empresas/byEmpresa/" + item)
        .then((response) => {
          localStorage.setItem("bienesUnicos", response.data);
          this.storeLogin.bienesUnicos = response.data;
          localStorage.setItem("empresaSelecionada", item);
          this.storeLogin.idEmpresaSelecionada = item;
          this.$router.go(0);
        })
        .catch((e) => {
          console.log(e);
        });
    },

    async cancelarActividad() {
      this.successDialog = true;
      this.nuevaActividad = false;
    },
  },
});
</script>

<style scoped>
.pointer {
  cursor: pointer;
}

.empresa-responsive {
  display: none;
}

@media (max-width: 900px) {
  .title-control {
    display: none;
  }

  .salir-text {
    display: none;
  }
}

@media (max-width: 450px) {
  .auto-control {
    display: none;
  }

  .action-control {
    display: flex;
    margin-bottom: 7%;
  }

  .empresa-responsive {
    display: block;
  }
}
</style>
