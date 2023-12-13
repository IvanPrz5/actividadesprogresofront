import { Catalogo } from "./Catalogo";

export class Usuario{
    id:String = "";
    nombre:String = "";
    paterno:String = "";
    email:String = "";
    icon: String = "";
    telefono:String = "";
    fechaNacimiento: any; 
    roles:Catalogo[] = [];
    areas:Catalogo[] = [];
    empresas:Catalogo[] = [];

    nombreCompleto(): String{
        console.log("entro al metotodo " + this.nombre+ " " +this.paterno  );
        return this.nombre+ " " +this.paterno ;
    }
}