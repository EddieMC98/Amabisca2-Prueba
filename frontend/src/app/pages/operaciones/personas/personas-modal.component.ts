import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Persona} from '../../../@core/modelos/persona';
import { PersonaService } from '../../../@core/data/persona.service';
import { NgbDateStruct, NgbDateParserFormatter} from '@ng-bootstrap/ng-bootstrap';
import { DatePipe } from '@angular/common';
import { TipoDescarte } from '../../../@core/modelos/tipo-descarte';
import { TipoDescarteService } from '../../../@core/data/tipo-descarte.service';
import { TipoComponente } from '../../../@core/modelos/tipo_componente';
import { TipoComponenteService } from '../../../@core/data/tipo-componente.service';
import { TipoSangre } from '../../../@core/modelos/tipo-sangre';
import { GrupoEtnico } from '../../../@core/modelos/grupo-etnico';
import { TipoSangreService } from '../../../@core/data/tipo-sangre.service';
import { GrupoEtnicoService } from '../../../@core/data/grupo-etnico.service';
@Component({
  selector: 'ngx-personas-modal',
  styleUrls: ['./personas-modal.component.scss'],
  templateUrl: './personas-modal.component.html',
})
export class PersonasModalComponent {
  public item = new Persona();
  modalHeader: string;
  public esNuevo: Boolean = false;
  public fec_creacion;
  private lstTipoSangre : TipoSangre[];
  private lstGrupoEtnico : GrupoEtnico[];
  
  constructor(private activeModal: NgbActiveModal, private service: PersonaService, private serviceTipoSangre: TipoSangreService, private serviceGrupo: GrupoEtnicoService) {
    this.serviceTipoSangre.findAll().subscribe(
      items => {
        this.lstTipoSangre = items;
      },
      err => {
        console.log(err);
      }
 
    );

    this.serviceGrupo.findAll().subscribe(
      items => {
        this.lstGrupoEtnico = items;
      },
      err => {
        console.log(err);
      }
  
    );
  }

  guardar() {
    if (this.esNuevo){
      this.service.guardar(this.item).subscribe(
              data => {
                this.activeModal.close("Registro guardado exitósamente");
              },
              error => {
                this.activeModal.dismiss(error);
              }
      );
    }else{
      this.service.actualizar(this.item).subscribe(
              data => {
                this.activeModal.close("Registro actualizado exitósamente");
              },
              error => {
                this.activeModal.dismiss(error);
              }
      );
    }
  }

  closeModal() {
    this.activeModal.dismiss();
  }
}