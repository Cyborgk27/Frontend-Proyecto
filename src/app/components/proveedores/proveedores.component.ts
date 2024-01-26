import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { ActivatedRoute, Router } from '@angular/router';
import { Proveedor } from 'src/app/interfaces/Proveedor';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-proveedores',
  templateUrl: './proveedores.component.html',
  styleUrls: ['./proveedores.component.css']
})
export class ProveedoresComponent implements AfterViewInit {
  form: FormGroup;
  listaProveedor: Proveedor[] = [];

  displayedColumns: string[] = ['ruc', 'nombreProveedor', 'emailProveedor', 'telefonoProveedor'];
  dataSource = new MatTableDataSource<Proveedor>();
  #loading: boolean = false;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private fb: FormBuilder,
    private router: Router,
    private _snackBar: MatSnackBar,
    private aRoute: ActivatedRoute) {

    this.form = this.fb.group({
      ruc: ['',
        [
          Validators.required,
          Validators.maxLength(13),
          Validators.minLength(13),
          Validators.pattern(/^([0-9])*$/)
        ]
      ],
      nombreProveedor: ['', Validators.required],
      emailProveedor: ['', Validators.required],
      telefonoProveedor: ['', Validators.required],
    })
  }

  ngOnInit(): void {
    // Puedes descomentar esto si es necesario
    // this.obtenerMascota();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

    if (this.dataSource.data.length > 0) {
      this.paginator._intl.itemsPerPageLabel = 'Items por página';
    }
  }

  agregarProveedor(): void {
    const ruc = this.form.value.ruc;

    const rucExistente = this.listaProveedor.some((proveedor) => proveedor.ruc === ruc);

    if (rucExistente) {
      this.mensajeError('Este ruc ya existe, por favor verifique.');
      this.form.reset();
    } else {
      const proveedor: Proveedor = {
        ruc: ruc,
        nombreProveedor: this.form.value.nombreProveedor,
        emailProveedor: this.form.value.emailProveedor,
        telefonoProveedor: this.form.value.telefonoProveedor,
      }

      this.listaProveedor.push(proveedor);
      this.dataSource.data = this.listaProveedor;

      this.mensajeExito('registrado');

      this.form.reset();
    }
  }

  mensajeError(texto: string) {
    this._snackBar.open(texto, 'Sistema', {
      duration: 4000,
      horizontalPosition: 'right',
      verticalPosition: 'top',
      panelClass: 'error-snackbar'
    });
  }

  mensajeExito(texto: string) {
    this._snackBar.open(`El proveedor fue ${texto} con éxito`, 'Sistema', {
      duration: 4000,
      horizontalPosition: 'right',
      verticalPosition: 'top'
    });
  }

  eliminarEstudiante(ruc: string): void {
    const indice = this.listaProveedor.findIndex(element => element.ruc == ruc);
    console.log(indice);
    this.listaProveedor.splice(indice, 1);
    this.dataSource.data = this.listaProveedor;
  }

  mostrar(element: Proveedor): void {
    console.log(element.nombreProveedor);
    console.log(JSON.stringify(element));
    this.router.navigate(['mostrar', JSON.stringify(element)]);
  }

  cancelar(): void {
    this.form.reset();
    // this.router.navigate(['listado']);
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}
