import { Component, Input, OnInit } from '@angular/core';
declare const $: any;
@Component({
  selector: 'app-cargardo-component',
  templateUrl: './cargardo-component.component.html',
  styleUrls: ['./cargardo-component.component.css']
})
export class CargardoComponentComponent implements OnInit {
  messageProceso = '';
  modal;
  constructor() { }
  ngOnInit() {
  }
  openModal(message) {
  const vm = this;
  vm.messageProceso = message;
  $('#isModalTransaccion').modal('show');
}
 closeModal() {
  $('#isModalTransaccion').modal('hide');
//   $('#isModalTransaccion').one('shown.bs.modal', function(){
//     $(this).modal("hide");
// });
}
}
