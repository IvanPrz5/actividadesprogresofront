// Utilities
import { Catalogo } from "@/Clases/Catalogo";
import { Empresa } from "@/Clases/Empresa";
import { Menu } from "@/Clases/Menu";
import { Usuario } from "@/Clases/Usuario";
import { defineStore } from "pinia";
import { Actividad } from "@/Clases/Actividad"
import { ref } from "vue";
import { UsarActividad } from "@/Clases/UsarActividad";
import { NotasActividad } from "@/Clases/NotasActividad";
import { ArchivoActividad } from "@/Clases/ArchivoActividad";
import { FechaFormato } from "@/Clases/FechaFormato";

export const loginStore = defineStore("variablesGlobales", () => {
  const token = ref("");
  const idActividadCreada = ref("");
  const usuario: Usuario | null = new Usuario();

  const logiado = ref({
    descripcion: "INICIAR SESION",
    token: false,
  });

  const idEmpresaSelecionada: string | null = "";
  const bienesUnicos: string | null = "";

  const menu: Menu[] = [];
  const catalogo: Catalogo[] = [];

  const actividad: Actividad | null = new Actividad();
  const usarActividad: UsarActividad | null = new UsarActividad();
  const notasActividad: NotasActividad | null = new NotasActividad();
  const archivoActividad: ArchivoActividad | null = new ArchivoActividad();
  const fechaFormato: FechaFormato | null = new FechaFormato();
  
  const abrirMenu = false;

  const url = "http://localhost:8090/";
  // const url = "http://172.16.50.244:8080/actividadesProgreso-0.0.1-SNAPSHOT/";
  // const url = "http://189.250.143.56:8080/actividadesProgreso-0.0.1-SNAPSHOT/";

  return {
    token,
    logiado,
    menu,
    abrirMenu,
    url,
    idEmpresaSelecionada,
    bienesUnicos,
    usuario,
    actividad,
    catalogo,
    usarActividad,
    notasActividad,
    archivoActividad,
    fechaFormato,
    idActividadCreada,
  };
});
