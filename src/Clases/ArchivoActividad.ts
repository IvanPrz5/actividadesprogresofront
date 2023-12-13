import { Catalogo } from "./Catalogo";

export class ArchivoActividad{
    id: number | null = null;
    ruta: any
    url: String = "";
    icon: String = "";
    fechaSubida: any;
    Usuario: Catalogo[] = [];
    Actividad: Catalogo[] = [];
    // Archivo: Catalogo[] = [];
}