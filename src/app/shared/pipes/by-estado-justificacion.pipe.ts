import { Pipe, PipeTransform } from '@angular/core';
import { EstadoJustificacionEnum } from '@shared/enums/estado-justificacion.enum';
import { JustificationModell } from '@shared/models/justification-model';


@Pipe({
  name: 'byEstadoJustificacion',
  standalone: true
})
export class ByEstadoJustificacionPipe implements PipeTransform {

  transform(justificaciones:JustificationModell[],estado?:EstadoJustificacionEnum): JustificationModell[] {
    if(!estado) return justificaciones;
    if(estado === EstadoJustificacionEnum.PENDIENTE){
      
      return justificaciones.filter((justificacion)=>{        
        return !justificacion.aprobation?.state;
      })
    }
    return justificaciones.filter((justificacion)=>{
      return justificacion.aprobation?.state === estado;
    });

  }

}
