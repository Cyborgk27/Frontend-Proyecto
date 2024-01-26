import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { ActivatedRoute, Router } from '@angular/router';
import { Producto } from 'src/app/interfaces/Producto';
import { Opciones } from 'src/app/interfaces/Opciones';
import { MatSnackBar } from '@angular/material/snack-bar';


@Component({
  selector: 'app-principal',
  templateUrl: './principal.component.html',
  styleUrls: ['./principal.component.css']
})
export class PrincipalComponent implements AfterViewInit {
  form: FormGroup;
  listaProducto: Producto[] = [];

  listaDisponibilidad: Opciones[] = [
    { id: 1, valor: 'Disponible' },
    { id: 2, valor: 'No Disponible' },
  ];

  listaCategoria: Opciones[] = [
    { id: 1, valor: 'Limpieza' },
    { id: 2, valor: 'Comestibles' },
    { id: 3, valor: 'Bebidas' },
    { id: 4, valor: 'Salud' },
    { id: 5, valor: 'Mascotas' },
    { id: 6, valor: 'Hogar' },
  ];

  displayedColumns: string[] = ['codigoProducto', 'nombreProducto', 'infoProducto', 'disponibilidad', 'categoria', 'fechaProducto', 'precioProducto'];
  dataSource = new MatTableDataSource<Producto>();
  #loading: boolean = false;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  ngOnInit(): void {
    //this.obtenerMascota();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;

    this.dataSource.sort = this.sort;

    if (this.dataSource.data.length > 0) {
      this.paginator._intl.itemsPerPageLabel = 'Items por pag';
    }
  }

  agregarProducto(): void {
    const cod = this.form.value.codigoProducto;


    const codExistente = this.listaProducto.some((Producto) => Producto.codigoProducto === cod);

    if (codExistente) {
      this.mensajeError('Esta prodcuto ya existe, por favor verifique.');
      this.form.reset();
    } else {
      const producto: Producto = {
        codigoProducto: cod,
        nombreProducto: this.form.value.nombreProducto,
        infoProducto: this.form.value.infoProducto,
        disponibilidad: this.form.value.disponibilidad,
        categoria: this.form.value.categoria,
        fechaProducto: this.form.value.fechaProducto,
        precioProducto: this.form.value.precioProducto,
      }

      this.listaProducto.push(producto);
      this.dataSource.data = this.listaProducto;

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
    this._snackBar.open(`El producto fue ${texto} con exito`, 'Sistema', {
      duration: 4000,
      horizontalPosition: 'right',
      verticalPosition: 'top'
    });
  }

  eliminarEstudiante(codigoProducto: string): void {
    const indice = this.listaProducto.findIndex(element => element.codigoProducto == codigoProducto)
    console.log(indice);
    this.listaProducto.splice(indice, 1);
    this.dataSource.data = this.listaProducto;
  }

  mostrar(element: Producto): void {
    console.log(element.nombreProducto);
    console.log(JSON.stringify(element));
    this.router.navigate(['mostrar', JSON.stringify(element)]);
  }

  cancelar(): void {
    this.form.reset();
    //this.router.navigate(['listado']);
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  constructor(private fb: FormBuilder,
    private router: Router,
    private _snackBar: MatSnackBar,
    private aRoute: ActivatedRoute) {

    this.form = this.fb.group({
      codigoProducto: ['',
        [
          Validators.required,
          Validators.maxLength(10),
          Validators.minLength(10),
          Validators.pattern(/^([0-9])*$/)
        ]
      ],

      nombreProducto: ['', Validators.required],
      infoProducto: ['', Validators.required],
      disponibilidad: ['', Validators.required],
      categoria: ['', Validators.required],
      fechaProducto: ['', Validators.required],
      precioProducto: ['',
        [
          Validators.required,
          Validators.pattern(/^([0-9]+([,][0-9]*)?)?$/)

        ]],

    })


  }


}
