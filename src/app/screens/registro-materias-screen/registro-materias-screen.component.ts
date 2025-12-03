import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { FacadeService } from 'src/app/services/facade.service';
import { MateriasService } from 'src/app/services/materias.service';
import { MaestrosService } from 'src/app/services/maestros.service';
import { EditarMateriaComponent } from '../../modals/editar-materia/editar-materia.component';

@Component({
  selector: 'app-registro-materias-screen',
  templateUrl: './registro-materias-screen.component.html',
  styleUrls: ['./registro-materias-screen.component.scss']
})
export class RegistroMateriasScreenComponent implements OnInit {

  public materia: any = { dias: [] };
  public errors: any = {};
  public editar: boolean = false;
  public idMateria: number = 0;
  public listaMaestros: any[] = [];

  public diasSemana = [
    { nombre: 'Lunes', value: 'Lunes' },
    { nombre: 'Martes', value: 'Martes' },
    { nombre: 'Miércoles', value: 'Miercoles' },
    { nombre: 'Jueves', value: 'Jueves' },
    { nombre: 'Viernes', value: 'Viernes' }
  ];

  public programas: string[] = [
    'Ingeniería en Ciencias de la Computación',
    'Licenciatura en Ciencias de la Computación',
    'Ingeniería en Tecnologías de la Información'
  ];

  constructor(
    private location: Location,
    private router: Router,
    public activatedRoute: ActivatedRoute,
    private materiasService: MateriasService,
    private maestrosService: MaestrosService,
    private dialog: MatDialog,
    private facadeService: FacadeService
  ) { }

  ngOnInit(): void {
    this.obtenerMaestros();
    if (this.activatedRoute.snapshot.params['id'] != undefined) {
      this.editar = true;
      this.idMateria = +this.activatedRoute.snapshot.params['id'];

      // Cargar datos de la materia
      this.materiasService.obtenerMateriaPorID(this.idMateria).subscribe(
        (response) => {
          this.materia = response;

          if(this.materia.hora_inicio) this.materia.hora_inicio = this.tConvert(this.materia.hora_inicio);
          if(this.materia.hora_fin) this.materia.hora_fin = this.tConvert(this.materia.hora_fin);
          if(this.materia.profesor) this.materia.profesor = Number(this.materia.profesor);

          console.log("Datos cargados", this.materia);
        },
        (error) => { alert("No se pudo cargar la materia"); }
      );
    } else {
      this.materia = this.materiasService.esquemaMateria();
    }
  }

  public obtenerMaestros() {
    this.maestrosService.obtenerListaMaestros().subscribe(
      (response) => { this.listaMaestros = response;
        console.log("Maestros:", this.listaMaestros);
       },
      (error) => { console.error(error); }
    );
  }

  public regresar() { this.location.back(); }

  public checkboxChange(event: any, dia: string) {
    if (event.checked) {
      this.materia.dias.push(dia);
    } else {
      this.materia.dias = this.materia.dias.filter((d: string) => d !== dia);
    }

    console.log("Días seleccionados:", this.materia.dias);
  }

  public registrar() {

    console.log("Intentando registrar el siguiente objeto:", this.materia);
    this.errors = this.materiasService.validarMateria(this.materia);
    if (Object.keys(this.errors).length > 0) return false;

    this.materiasService.registrarMateria(this.materia).subscribe(
      (response) => {
        alert("Materia registrada correctamente");
        this.router.navigate(["/lista-materias"]);
      },
      (error) => { alert("Error al registrar materia"); }
    );
  }

  // --- LÓGICA ACTUALIZAR ---

public actualizar() {
  this.errors = this.materiasService.validarMateria(this.materia);
  if (Object.keys(this.errors).length > 0) return;

  const dialogRef = this.dialog.open(EditarMateriaComponent, {
    data: {
      title: 'Editar Materia',
      message: 'Estás a punto de editar esta materia. Se guardarán los cambios.',
      confirmText: 'Actualizar'
    },
    height: '280px',
    width: '350px',
  });

  dialogRef.afterClosed().subscribe(result => {
    if (result && result.isUpdate) {

      this.materiasService.actualizarMateria(this.idMateria, this.materia).subscribe(
        (response) => {
          alert("Materia actualizada correctamente");
          this.router.navigate(["/lista-materias"]);
        },
        (error) => {
          alert("Error al actualizar la materia");
        }
      );

    }
  });
}


  public tConvert(time: any) {
    if(!time) return "";
    let timeString = time.toString();
    if (timeString.length > 5) timeString = timeString.substr(0, 5);
    const H = +timeString.substr(0, 2);
    const h = (H % 12) || 12;
    const ampm = (H < 12) ? "AM" : "PM";
    const m = timeString.substr(3, 2);
    return h + ":" + m + " " + ampm;
  }

  public soloLetras(event: KeyboardEvent) {
    const charCode = event.key.charCodeAt(0);
    if (!(charCode >= 65 && charCode <= 90) && !(charCode >= 97 && charCode <= 122) && charCode !== 32) {
      event.preventDefault();
    }
  }

  public soloAlfanumerico(event: KeyboardEvent) {
    const charCode = event.key.charCodeAt(0);
    if (!(charCode >= 65 && charCode <= 90) && !(charCode >= 97 && charCode <= 122) && !(charCode >= 48 && charCode <= 57) && charCode !== 32) {
      event.preventDefault();
    }
  }
}
