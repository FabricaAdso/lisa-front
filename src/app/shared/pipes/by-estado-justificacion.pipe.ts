import { Pipe, PipeTransform } from '@angular/core';
import { EstadoJustificacionEnum } from '@shared/enums/estado-justificacion.enum';
import { JustificationModel } from '@shared/models/justification-model';


@Pipe({
  name: 'byEstadoJustificacion',
  standalone: true
})
export class ByEstadoJustificacionPipe implements PipeTransform {

  transform(justificaciones:JustificationModel[],estado?:EstadoJustificacionEnum): JustificationModel[] {
    if(!estado) return justificaciones;
    else{
      return justificaciones.filter((justificacion)=>{
        return justificacion.aprobation?.state == estado || justificacion.aprobation?.state == null ;
      });
    }
  }

}
