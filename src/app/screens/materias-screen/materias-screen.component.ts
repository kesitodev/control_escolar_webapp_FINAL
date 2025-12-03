import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { FacadeService } from 'src/app/services/facade.service';
import { MateriasService } from 'src/app/services/materias.service';
import { EliminarUserModalComponent } from 'src/app/modals/eliminar-user-modal/eliminar-user-modal.component';

@Component({
  selector: 'app-materias-screen',
  templateUrl: './materias-screen.component.html',
  styleUrls: ['./materias-screen.component.scss']
})
export class MateriasScreenComponent implements OnInit {

  public displayedColumns: string[] = ['nrc', 'nombre', 'seccion', 'dias', 'horario', 'salon', 'programa', 'profesor'];
  public dataSource = new MatTableDataSource<any>([]);
  public isAdmin: boolean = false;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private materiasService: MateriasService,
    private facadeService: FacadeService,
    private router: Router,
    private location: Location,
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
    if(this.facadeService.getUserGroup() === 'administrador'){
      this.isAdmin = true;
      this.displayedColumns.push('acciones');
    }

    this.obtenerMaterias();
  }

  public goHome(){
    this.location.back();
  }

  public obtenerMaterias(){
    this.materiasService.obtenerListaMaterias().subscribe(
      (response)=>{
        this.dataSource = new MatTableDataSource(response);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;

        this.dataSource.filterPredicate = (data: any, filter: string) => {
          const dataStr = (data.nrc + data.nombre).toLowerCase();
          return dataStr.indexOf(filter) != -1;
        };
      },
      (error)=>{
        alert("Error al obtener materias");
      }
    );
  }

  public applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  public editarMateria(id: number){
    this.router.navigate(["registro-materias/"+id]);
  }

  public eliminarMateria(id: number){
    const dialogRef = this.dialog.open(EliminarUserModalComponent, {
      data: {id: id, rol: 'materia'},
      height: '268px',
      width: '328px',
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result && result.isDelete){
        console.log("Materia eliminada");
        this.obtenerMaterias();
      }
    });
  }
}
