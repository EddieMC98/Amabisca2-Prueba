import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ModalDismissReasons, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { BodyOutputType, Toast, ToasterConfig, ToasterService } from 'angular2-toaster';
import { LocalDataSource } from 'ng2-smart-table';
import { InventarioService } from '../../../@core/data/inventario.service';
import { Inventario } from '../../../@core/modelos/inventario';
import { InventarioModalComponent } from './inventario-modal.component';

@Component({
  selector: 'ngx-inventario',
  templateUrl: './inventario.component.html',
  styleUrls: ['./inventario.component.scss']
})
export class InventarioComponent implements OnInit {
  source: LocalDataSource = new LocalDataSource();
  private items: Inventario[];
  public item = new Inventario();
  modalRef: NgbModalRef;

  config: ToasterConfig;

  position = 'toast-top-right';
  animationType = 'fade';
  timeout = 5000;
  toastsLimit = 5;

  constructor(public inventarioService: InventarioService, private modalService: NgbModal, private toasterService: ToasterService, private datePipe: DatePipe) { }

  settings = {
    mode: 'external',
    actions: {
      position: 'right',
      add: false,
      delete:false,
      columnTitle: "Acciones",
      custom: [
      ]
    },
    edit: {
      confirmSave: true,
      editButtonContent: '<i class="fas fa-user-edit"></i>',
    },

    columns: {
      codInventario: {
        title: 'ID',
        type: 'number',

      },
      nombreInventario: {
        title: 'Inventario',
        type: 'string',

      },
      estadoActivo: {
        title: 'Estado',
        valuePrepareFunction: (value) => { return value === 1 ? 'Habilitado' : 'Deshabilitado' },
        filter: {
          type: 'list',
          config: {
            selectText: 'Estado',
            list: [
              { value: '0', title: 'Deshabilitado' },
              { value: '1', title: 'Habilitado' },

            ],
          },
        },

      },
    }
  };


  ngOnInit() {
    this.getAll();
  }

  getAll() {
    this.inventarioService.findAll().subscribe(
      items => {
        this.items = items;

        this.source.load(this.items);
      },
      err => {
        console.log(err);
      }

    );
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return '';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return '';
    } else {
      return `${reason}`;
    }
  }

  private showToast(type: string, title: string, body: string) {
    this.config = new ToasterConfig({
      positionClass: this.position,
      timeout: this.timeout,
      newestOnTop: true,
      tapToDismiss: true,
      preventDuplicates: true,
      animation: this.animationType,
      limit: this.toastsLimit,
    });
    const toast: Toast = {
      type: type,
      title: title,
      body: body,
      timeout: this.timeout,
      showCloseButton: true,
      bodyOutputType: BodyOutputType.TrustedHtml,
    };
    this.toasterService.popAsync(toast);
  }

  editarRegistro(value) {
    this.modalRef = this.modalService.open(InventarioModalComponent, { size: 'lg', container: 'nb-layout' });

    this.inventarioService.findById(value.data.codInventario)
      .subscribe(
        data => {
          this.modalRef.componentInstance.modalHeader = 'Editar Inventario';
          this.modalRef.componentInstance.item = data;
          this.modalRef.componentInstance.esNuevo = false;
          this.modalRef.result.then((data) => {
            this.showToast("info", "Editar", data);
            this.getAll();
          }, (reason) => {
            if (`${this.getDismissReason(reason)}` != "undefined") {
              this.showToast("error", "Error", `${this.getDismissReason(reason)}`);
            }
            this.getAll();
          });
        },
        error => {
          //console.log(error);
        },
        () => {

        });
  }

  nuevoRegistro() {
    this.modalRef = this.modalService.open(InventarioModalComponent, { size: 'lg', container: 'nb-layout' });

    this.modalRef.componentInstance.modalHeader = 'Nuevo Inventario';
    this.modalRef.componentInstance.item = new Inventario();
    this.modalRef.componentInstance.esNuevo = true;
    this.modalRef.result.then((data) => {

      console.log(data);
      this.showToast("info", "Guardar", data);
      this.getAll();
    }, (reason) => {
      if (`${this.getDismissReason(reason)}` != "undefined") {
        this.showToast("error", "Error", `${this.getDismissReason(reason)}`);
      }

      this.getAll();
    });
  }


}
