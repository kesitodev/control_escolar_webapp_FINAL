import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-editar-materia',
  templateUrl: './editar-materia.component.html',
  styleUrls: ['./editar-materia.component.scss']
})
export class EditarMateriaComponent implements OnInit {

  constructor(
    private dialogRef: MatDialogRef<EditarMateriaComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit(): void {
    console.log("Datos del modal:", this.data);
  }

  public cerrar_modal() {
    this.dialogRef.close(false);
  }

  public confirmar() {
  this.dialogRef.close({ isUpdate: true });
}

}
