import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CajaRoutingModule } from './caja-routing.module';
import { HistorialcajaComponent } from './historialcaja/historialcaja.component';
import { AdministracajaComponent } from './administracaja/administracaja.component';
import { FormsModule } from '@angular/forms';
import { CargardoComponentComponent } from '../componenteshijos/cargardo-component/cargardo-component.component';
import { ReloadFiltrosComponent } from '../componenteshijos/reload-filtros/reload-filtros.component';
import { CortesxdiaComponent } from './cortesxdia/cortesxdia.component';
import { CortesxsemanaComponent } from './administracaja/cortesxsemana/cortesxsemana.component';


@NgModule({
  declarations: [HistorialcajaComponent, AdministracajaComponent, CargardoComponentComponent, ReloadFiltrosComponent, CortesxdiaComponent, CortesxsemanaComponent],
  imports: [
    CommonModule,
    CajaRoutingModule,
    FormsModule
  ]
})
export class CajaModule { }