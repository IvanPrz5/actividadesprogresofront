import { Catalogo } from "./Catalogo";

export default  class ActividadesConsulta {
  id: any;
  fechaInicio: any;
  fechaFin: any;
  descripcion: String = "";
  statusActividad : Catalogo[] = [];


  usuarioAsigno: any;
  idUsuarioTermino: any;
  empresa: Catalogo[] = [];
  tipoActividad: Catalogo[] = [];
  jerarquiaActividad: Catalogo[] = [];
  usuarioTermino: Catalogo[] = [];



  tipo: String =  "";
  status: boolean = true;
  prioridad: number = -1;
}


