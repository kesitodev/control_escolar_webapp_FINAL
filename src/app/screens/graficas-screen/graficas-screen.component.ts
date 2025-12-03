import { Component, OnInit } from '@angular/core';
import DatalabelsPlugin from 'chartjs-plugin-datalabels';
import { AdministradoresService } from 'src/app/services/administradores.service';

@Component({
  selector: 'app-graficas-screen',
  templateUrl: './graficas-screen.component.html',
  styleUrls: ['./graficas-screen.component.scss']
})
export class GraficasScreenComponent implements OnInit{

  public total_user: any = {};

  public labels_graficas = ["Administradores", "Maestros", "Alumnos"];

  lineChartData: any = {
    labels: this.labels_graficas,
    datasets: [
      {
        data: [0, 0, 0],
        label: 'Registro de Usuarios',
        backgroundColor: '#F88406',
        fill: true,
      }
    ]
  };
  lineChartOption = { responsive:false };
  lineChartPlugins = [ DatalabelsPlugin ];

  // 2. Barras (Bar Chart)
  barChartData: any = {
    labels: this.labels_graficas,
    datasets: [
      {
        data: [0, 0, 0],
        label: 'Usuarios Registrados',
        backgroundColor: [ '#F88406', '#FCFF44', '#82D3FB' ]
      }
    ]
  };
  barChartOption = { responsive:false };
  barChartPlugins = [ DatalabelsPlugin ];

  // 3. Circular (Pie Chart)
  pieChartData: any = {
    labels: this.labels_graficas,
    datasets: [
      {
        data: [0, 0, 0],
        backgroundColor: [ '#FCFF44', '#F1C8F2', '#31E731' ]
      }
    ]
  };
  pieChartOption = { responsive:false };
  pieChartPlugins = [ DatalabelsPlugin ];

  // 4. Dona (Doughnut Chart)
  doughnutChartData: any = {
    labels: this.labels_graficas,
    datasets: [
      {
        data: [0, 0, 0],
        backgroundColor: [ '#F88406', '#FCFF44', '#31E7E7' ]
      }
    ]
  };
  doughnutChartOption = { responsive:false };
  doughnutChartPlugins = [ DatalabelsPlugin ];

  constructor(
    private administradoresServices: AdministradoresService
  ) { }

  ngOnInit(): void {
    this.obtenerTotalUsers();
  }

  public obtenerTotalUsers(){
    this.administradoresServices.getTotalUsuarios().subscribe(
      (response)=>{
        this.total_user = response;
        console.log("Total usuarios: ", this.total_user);


        const listaDatos = [
            this.total_user.admins,
            this.total_user.maestros,
            this.total_user.alumnos
        ];

        // Actualizar gráficas
        this.actualizarGraficas(listaDatos);

      }, (error)=>{
        console.log("Error al obtener total de usuarios ", error);
        alert("No se pudo obtener el total de cada rol de usuarios");
      }
    );
  }

  public actualizarGraficas(data: any[]) {

    // Lineal
    this.lineChartData = {
      labels: this.labels_graficas,
      datasets: [{
        data: data,
        label: 'Registro de Usuarios',
        backgroundColor: '#F88406',
        fill: true
      }]
    };

    // Barras
    this.barChartData = {
      labels: this.labels_graficas,
      datasets: [{
        data: data,
        label: 'Usuarios',
        backgroundColor: [ '#F88406', '#FCFF44', '#82D3FB' ]
      }]
    };

    // Pastel
    this.pieChartData = {
      labels: this.labels_graficas,
      datasets: [{
        data: data,
        backgroundColor: [ '#FCFF44', '#e7614dff', '#31E731' ]
      }]
    };

    // Dona
    this.doughnutChartData = {
      labels: this.labels_graficas,
      datasets: [{
        data: data,
        backgroundColor: [ '#F88406', '#FCFF44', '#31E7E7' ]
      }]
    };
  }
}
