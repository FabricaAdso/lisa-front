import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedDataService {

  constructor() { }

  private dataSubject = new BehaviorSubject<number | null>(null); // Inicializa con null
  public data$ = this.dataSubject.asObservable(); // Observable para suscribirse

  // Método para actualizar los datos
  updateData(data: number) {
    this.dataSubject.next(data); // Emite el nuevo valor
  }

}
