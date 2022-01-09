import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Producto } from '../interfaces/producto.interface';

@Injectable({
  providedIn: 'root'
})
export class ProductosService {

  cargando = true;
  productos: Producto[] = [];
  productosFiltrados: Producto[] = [];

  constructor( private http: HttpClient) { 
    this.cargarProductos();
  }

  // No se porque no va si pongo (resp: Producto[]) en vez de (resp: any) //En la insterfaz no esta puesto que el valor pueda o no aparecer
  private cargarProductos() {

    return new Promise<void>(( resolve, rejects)=>{
      this.http.get('https://portafolio-angular-ebe82-default-rtdb.firebaseio.com/productos_idx.json')
        .subscribe( (resp: any) =>{
          this.productos = resp;
          this.cargando = false;
          resolve();
        });
    });

    
  }

  getProducto(id: string){
    return this.http.get(`https://portafolio-angular-ebe82-default-rtdb.firebaseio.com/productos/${id}.json`);
  }

  buscarProducto( termino: string){
    
    if (this.productos.length === 0) {
      //Cargar productos
      this.cargarProductos().then(()=>{
        //Ejecutar después de tener los productos
        //Aplicar filtros
        this.filtrarProductos(termino);
      });
    }else{
      //Aplicar filtro
      this.filtrarProductos(termino);
    }

  }

  private filtrarProductos( termino: string){
    this.productosFiltrados = [];

    termino = termino.toLowerCase();

    this.productos.forEach( prod =>{
      const tituloLower = prod.titulo.toLowerCase();
      if(prod.categoria.indexOf(termino)>=0 || tituloLower.indexOf(termino)>=0){
        this.productosFiltrados.push(prod);
      }
    })
  }
}
