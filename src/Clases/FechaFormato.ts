export class FechaFormato{
  formatDate(date: any) {
    let day = date.getDate();
    let month = date.getMonth() + 1;
    let year = date.getFullYear();
  
    let hora = date.getHours();
    let minutes = date.getMinutes();
  
    if (day < 10) {
      day = "0" + date.getDate();
    }
    if (month < 10) {
      month = "0" + (date.getMonth() + 1);
    }
    if (hora < 10) {
      hora = "0" + date.getHours();
    }
    if (minutes < 10) {
      minutes = "0" + date.getMinutes();
    }
    return `${year}/${month}/${day}` + " " + `${hora}:${minutes}`;
  }
  
  sendDate(date: any) {
    let uno = date.replaceAll("/", "-")
    let dos = uno.replace(" ", "T")
    var seconds = ":00.000Z"
    let fechaFinal = dos.concat(seconds);
    return fechaFinal;
  }
}
