import { Catalogo } from "./Catalogo";

export class UsarActividad {
  id: number | null = null;
  inicio: any;
  fin: any;
  observacionesSalida: String = "";
  observacionesEntrega: String = "";
  fechaAlta: any;
  fechaEntrega: any;
  Actividad: Catalogo[] = [];
  BienActividad: Catalogo[] = [];
  idBienActividad: any;
}