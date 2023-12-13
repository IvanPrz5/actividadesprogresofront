import { Catalogo } from "./Catalogo";
export class Actividad {
  id: any;
  fechaInicio: any;
  fechaFin: any;
  descripcion: String = "";
  idStatusActividad = 1;
  idTipoActividad: any;
  idCliente: any;
  idJerarquiaActividad:  any;
  idUsuarioAsigno: [] = [];
  idUsuarioTermino: [] = [];
  idEmpresa: any;
  tipoActividad: Catalogo[] = [];
  jerarquiaActividad: Catalogo[] = [];
  usuarioTermino: Catalogo[] = [];
}