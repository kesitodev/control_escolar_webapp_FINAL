import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ValidatorService } from './tools/validator.service';
import { ErrorsService } from './tools/errors.service';
import { FacadeService } from './facade.service';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class MateriasService {

  constructor(
    private http: HttpClient,
    private validatorService: ValidatorService,
    private errorService: ErrorsService,
    private facadeService: FacadeService
  ) { }

  public esquemaMateria() {
    return {
      'nrc': '',
      'nombre': '',
      'seccion': '',
      'dias': [],
      'hora_inicio': '',
      'hora_fin': '',
      'salon': '',
      'programa_educativo': '',
      'profesor': '',
      'creditos': ''
    }
  }

  public validarMateria(data: any) {
    let error: any = {};

    // NRC 5 numeros
    if (!this.validatorService.required(data["nrc"])) {
      error["nrc"] = "El NRC es obligatorio";
    } else if (!this.validatorService.numeric(data["nrc"])) {
      error["nrc"] = "Solo se permiten números";
    } else if (data["nrc"].toString().length !== 5) {
      error["nrc"] = "El NRC requiere exactamente 5 dígitos";
    }

    // Nombre de la materia
    if (!this.validatorService.required(data["nombre"])) {
      error["nombre"] = "El nombre de la materia es obligatorio";

    }

    // Sección 3 dígitos máximo
    if (!this.validatorService.required(data["seccion"])) {
      error["seccion"] = "La sección es obligatoria";
    } else if (data["seccion"].toString().length > 3) {
      error["seccion"] = "Solo 3 dígitos permitidos";
    }

    // Días de la semana
    if (!data["dias"] || data["dias"].length === 0) {
      error["dias"] = "Seleccionar al menos un día";
    }

    // Horario
    if (!this.validatorService.required(data["hora_inicio"])) {
      error["hora_inicio"] = "Selecciona la hora de inicio";
    }
    if (!this.validatorService.required(data["hora_fin"])) {
      error["hora_fin"] = "Selecciona la hora de fin";
    }

    // Lógica Inicio < Fin
    if (data["hora_inicio"] && data["hora_fin"]) {
      if (this.convertToMinutes(data["hora_inicio"]) >= this.convertToMinutes(data["hora_fin"])) {
        error["hora_inicio"] = "La hora inicio debe ser menor";
        error["hora_fin"] = "La hora fin debe ser mayor";
      }
    }

    // Salón dolo 15 caracteres
    if (!this.validatorService.required(data["salon"])) {
      error["salon"] = "El salón es obligatorio";
    } else if (data["salon"].length > 15) {
      error["salon"] = "Máximo 15 caracteres";
    }

    // Programa eduacativo
    if (!this.validatorService.required(data["programa_educativo"])) {
      error["programa_educativo"] = "Selecciona una carrera";
    }

    // Profesor
    if (!this.validatorService.required(data["profesor"])) {
      error["profesor"] = "Debes asignar un profesor";
    }

    // Créditos entero positivo solo 2 dígitos
    if (!this.validatorService.required(data["creditos"])) {
      error["creditos"] = "Ingresa los créditos";
    } else if (data["creditos"] < 1) {
      error["creditos"] = "Debe ser mayor a 0";
    } else if (data["creditos"].toString().length > 2) {
      error["creditos"] = "Máximo 2 dígitos";
    }

    return error;
  }

  private convertToMinutes(timeString: string): number {
    if (!timeString) return 0;
    const [time, modifier] = timeString.split(' ');
    let [hours, minutes] = time.split(':').map(Number);
    if (hours === 12 && modifier === 'AM') hours = 0;
    if (modifier === 'PM' && hours !== 12) hours += 12;
    return hours * 60 + minutes;
  }

  public registrarMateria(data: any): Observable<any> {
    const token = this.facadeService.getSessionToken();
    let headers: HttpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' });
    if (token) headers = headers.set('Authorization', 'Bearer ' + token);
    return this.http.post<any>(`${environment.apiUrl}/materia/`, data, { headers });
  }

  public obtenerListaMaterias(): Observable<any> {
    const token = this.facadeService.getSessionToken();
    let headers: HttpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' });
    if (token) headers = headers.set('Authorization', 'Bearer ' + token);
    return this.http.get<any>(`${environment.apiUrl}/lista-materias/`, { headers });
  }

  public obtenerMateriaPorID(idMateria: number): Observable<any> {
    const token = this.facadeService.getSessionToken();
    let headers: HttpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' });
    if (token) headers = headers.set('Authorization', 'Bearer ' + token);
    return this.http.get<any>(`${environment.apiUrl}/materia/?id=${idMateria}`, { headers });
  }

  public actualizarMateria(idMateria: number, data: any): Observable<any> {
  const token = this.facadeService.getSessionToken();
  let headers: HttpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' });
  if (token) headers = headers.set('Authorization', 'Bearer ' + token);

  const payload = { ...data, id: idMateria };

  return this.http.put<any>(`${environment.apiUrl}/materia/`, payload, { headers });
}


  public eliminarMateria(idMateria: number): Observable<any> {
    const token = this.facadeService.getSessionToken();
    let headers: HttpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' });
    if (token) headers = headers.set('Authorization', 'Bearer ' + token);
    return this.http.delete<any>(`${environment.apiUrl}/materia/?id=${idMateria}`, { headers });
  }
}
