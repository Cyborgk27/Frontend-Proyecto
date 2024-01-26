import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PrincipalComponent } from './components/principal/principal.component';
import { ProveedoresComponent } from './components/proveedores/proveedores.component';


const routes: Routes = [

  { path: '', redirectTo: '', pathMatch: 'full' },
  { path: 'principal', component: PrincipalComponent },
  { path: 'proveedores', component: ProveedoresComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
