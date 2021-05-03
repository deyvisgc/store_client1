import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { UserService } from '../../service/Administracion/user/user.service';
import { AuthenticationService } from '../../service/Authentication/authentication.service';
declare const sendRespuesta: any;
import iziToast from 'izitoast';
import { ReloadformComponent } from '../../reload/reloadform/reloadform.component';
import { PeopleService } from '../../service/Administracion/people/people.service';
declare const $: any;
@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.scss']
})
export class PerfilComponent implements OnInit {
  constructor(private userSer: UserService, private authser: AuthenticationService, private perSer: PeopleService) { }
  SecretRol = 'K56QSxGeKImwBRmiY';
  keyword = 'name';
  countries = [];
  rolNameStorage = localStorage.getItem('rol_name');
  rolName = '';
  Password = 1;
  isLoading = false;
  errorActual = '';
  errorNueva = '';
  errorRepet = '';
  errorUers = '';
  errors = {
    errorActual: '',
    errorNueva: '',
    errorRepet: '',
    errorUers: '',
    errorNombre: '',
    errorApellidos: '',
    errorDni: '',
    errorTelefono: '',
    errorDireccion: ''
  };
  person = {
    idPersona: 0,
    name: '',
    lastName: '',
    address: '',
    phone: '',
    docNumber: '',
    alias: '',
    perfil: true,
    typePerson : 'null',
    typeDocument : 'null'
  };
  credenciales = {
    usuario: '',
    Password: '',
    rol: '',
    idUsuario: ''
  };
  updatePassword = {
    passwordActual: '',
    passwordNueva: '',
    passwordRepet: '',
    us_usuario: localStorage.getItem('usuario')
  };
  title = '';
  idUsuario = localStorage.getItem('idUsuario');
  ShowPasswordIcon = false;
  ngOnInit() {
    this.getPerfil();
    this.closeModal();
  }
  getPerfil() {
    const vm = this;
    vm.rolName = this.authser.CryptoJSAesDecrypt(this.SecretRol, this.rolNameStorage);
    vm.userSer.getUserInfo(+vm.idUsuario).then(res => {
      const rpta = sendRespuesta(res);
      if (rpta.status) {
        iziToast.success({
          title: 'OK',
          position: 'topRight',
          message: rpta.message,
        });
        vm.person.idPersona = rpta.data[0].id_persona;
        vm.person.name = rpta.data[0].per_nombre;
        vm.person.lastName = rpta.data[0].per_apellido;
        vm.person.phone = rpta.data[0].per_celular;
        vm.person.docNumber = rpta.data[0].per_numero_documento;
        vm.person.address = rpta.data[0].per_direccion;
        vm.credenciales.usuario =  rpta.data[0].us_usuario;
        vm.credenciales.rol =  vm.rolName;
        vm.credenciales.Password = rpta.data[0].us_passwor_view;
        localStorage.setItem('passwordview', rpta.data[0].us_passwor_view);
        const alias = vm.person.name.concat(' ').concat(vm.person.lastName);
        const aliasSplit = alias.split(' ');
        vm.person.alias = (aliasSplit[0].substring(0 , 1).concat(aliasSplit[1].substring(0 , 1))).toUpperCase() ;
      } else {
        iziToast.error({
          title: 'Error',
          position: 'topRight',
          message: rpta.message,
        });
      }
      console.log(res);
    }).catch((err) => {
      console.log('Error', err);
    }).finally(() => {
      console.log('finally');
    });
  }
  ShowPassword() {
    const password = document.getElementById('password');
    const passwordview = localStorage.getItem('passwordview');
    if (password['type'] === 'password') {
      password['type'] = 'text';
      this.credenciales.Password = this.authser.CryptoJSAesDecrypt(this.SecretRol, passwordview);
      this.ShowPasswordIcon = true;
    } else {
      password['type'] = 'password';
      this.credenciales.Password = passwordview;
      this.ShowPasswordIcon = false;
    }
  }
  showUpdatePassword() {
    const vm = this;
    vm.title = 'Actualizar Contraseña';
    vm.Password = 1;
    $('#modalContraseña').modal('show');
  }
  showUpdateUsers() {
    const vm = this;
    vm.Password = 2;
    vm.title = 'Actualizar Usuario';
    $('#modalContraseña').modal('show');
  }
  showUpdateDatosPersonales() {
    const vm = this;
    vm.Password = 3;
    vm.title = 'Actualizar Datos Personales';
    $('#modalContraseña').modal('show');
  }
  Actualizar() {
    const vm = this;
    const isValidate = vm.validarPassword();
    if (isValidate) {
      vm.isLoading = true;
      vm.userSer.updatePassword(vm.updatePassword).then(res => {
        const rpta = sendRespuesta(res);
        if (rpta.status === 1) {
          iziToast.success({
            title: 'OK',
            position: 'topRight',
            message: rpta.message,
          });
          $('#modalContraseña').modal('hide');
          this.getPerfil();
        }
        if (rpta.status === 2) {
          document.getElementById('actual').style.borderColor = 'red';
          vm.errorActual = rpta.message;
        }
        if (rpta.status === 3) {
          iziToast.error({
            title: 'Error',
            position: 'topRight',
            message: rpta.message,
          });
        }
      }).catch((err) => {
        console.log('Error', err);
      }).finally(() => {
        vm.isLoading = false;
      });
    }
  }
  ActualizarUsuario() {
    const vm = this;
    if (!vm.credenciales.usuario) {
      document.getElementById('usuario').style.borderColor = 'red';
      vm.errorUers = 'Usuario requerido';
      return false;
    } else {
      document.getElementById('usuario').style.borderColor = '#48c78e';
      vm.errorUers = '';
    }
    vm.isLoading = true;
    vm.credenciales.idUsuario = vm.idUsuario;
    vm.userSer.updateUsuario(vm.credenciales).then( res => {
      const rpta = sendRespuesta(res);
      if (rpta.status === 1) {
        document.getElementById('usuario').style.borderColor = 'red';
        vm.errorUers = rpta.message;
        return false;
      }
      if (rpta.status === 2) {
        iziToast.success({
          title: 'OK',
          position: 'topRight',
          message: rpta.message,
        });
        $('#modalContraseña').modal('hide');
        this.getPerfil();
        return true;
      }
      if (rpta.status === 3) {
        iziToast.error({
          title: 'Error',
          position: 'topRight',
          message: rpta.message,
        });
        $('#modalContraseña').modal('hide');
        this.getPerfil();
        return true;
      }
    }).catch((err) => {
      console.log('Error', err);
    }).finally(() => {
      vm.isLoading = false;
    });
  }
  ActualizarPersona() {
    const vm = this;
    const isValidate = vm.validarPerson();
    if (isValidate) {
      vm.isLoading = true;
      vm.perSer.updatePerson(this.person).then( res => {
        const rpta = sendRespuesta(res);
        if (rpta.status) {
          iziToast.success({
            title: 'OK',
            position: 'topRight',
            message: rpta.message,
          });
        } else {
          iziToast.error({
            title: 'Error',
            position: 'topRight',
            message: rpta.message,
          });
        }
      }).catch((err) => {
        console.log('Error', err);
      }).finally(() => {
        this.getPerfil();
        $('#modalContraseña').modal('hide');
        vm.isLoading = false;
      });
    }
  }
  validarPassword() {
    const vm = this;
    if (!this.updatePassword.passwordActual) {
      document.getElementById('actual').style.borderColor = 'red';
      vm.errorActual = 'Contraseña actual es requerida';
      return false;
    } else {
      vm.errorActual = '';
      document.getElementById('actual').style.borderColor = '#48c78e';
    }
    if (!this.updatePassword.passwordNueva) {
      document.getElementById('nueva').style.borderColor = 'red';
      vm.errorNueva = 'Contraseña Nueva es requerida';
      return false;
    } else {
      vm.errorNueva = '';
      document.getElementById('nueva').style.borderColor = '#48c78e';
    }
    if (this.updatePassword.passwordNueva.length < 8) {
      document.getElementById('nueva').style.borderColor = 'red';
      vm.errorNueva = 'Contraseña Nueva debe tener como minimo 9 caracteres';
      return false;
    } else {
      vm.errorNueva = '';
      document.getElementById('nueva').style.borderColor = '#48c78e';
    }
    if (!this.updatePassword.passwordRepet) {
      document.getElementById('repet').style.borderColor = 'red';
      vm.errorRepet = 'Contraseña Repetida  es requerida';
      return false;
    } else {
      vm.errorRepet = '';
      document.getElementById('repet').style.borderColor = '#48c78e';
    }
    if (this.updatePassword.passwordNueva !== this.updatePassword.passwordRepet) {
      document.getElementById('nueva').style.borderColor = 'red';
      document.getElementById('repet').style.borderColor = 'red';
      vm.errorRepet = 'La contraseña nueva y  repetida son diferentes';
      vm.errorNueva = 'La contraseña nueva y  repetida son diferentes';
      return false;
    } else {
      vm.errorRepet = '';
      vm.errorNueva = '';
      document.getElementById('nueva').style.borderColor = '#48c78e';
      document.getElementById('repet').style.borderColor = '#48c78e';
    }
    return true;
  }
  validarPerson() {
    const vm = this;
    if (!this.person.name) {
      document.getElementById('nombre').style.borderColor = 'red';
      vm.errors.errorNombre = 'Nombre es requerido';
      return false;
    } else {
      vm.errors.errorNombre = '';
      document.getElementById('nombre').style.borderColor = '#48c78e';
    }
    if (!this.person.lastName) {
      document.getElementById('apellidos').style.borderColor = 'red';
      vm.errors.errorApellidos = 'Apellidos es requerido';
      return false;
    } else {
      vm.errors.errorApellidos = '';
      document.getElementById('apellidos').style.borderColor = '#48c78e';
    }
    if (!this.person.docNumber) {
      document.getElementById('dni').style.borderColor = 'red';
      vm.errors.errorDni = 'Numero dni es requerido';
      return false;
    } else {
      vm.errors.errorDni = '';
      document.getElementById('dni').style.borderColor = '#48c78e';
    }
    if (!this.person.phone) {
      document.getElementById('telefono').style.borderColor = 'red';
      vm.errors.errorTelefono = 'Numero telefonico es requerido';
      return false;
    } else {
      vm.errors.errorTelefono = '';
      document.getElementById('telefono').style.borderColor = '#48c78e';
    }
    if (!this.person.address) {
      document.getElementById('direccion').style.borderColor = 'red';
      vm.errors.errorDireccion = 'Direccion es requerida';
      return false;
    } else {
      vm.errors.errorDireccion = '';
      document.getElementById('direccion').style.borderColor = '#48c78e';
    }
    return true;
  }
  buscarUsuario(event) {
    if (event.key === 'Enter') {
      const vm = this;
      alert(event.target.value);
    }
  }
  closeModal() {
    const vm = this;
    $('body').on('hidden.bs.modal', '.modal', () => {
      if (vm.Password === 1) {
        vm.errorActual = '';
        document.getElementById('actual').style.borderColor = '#48c78e';
        vm.errorNueva = '';
        document.getElementById('nueva').style.borderColor = '#48c78e';
        vm.errorRepet = '';
        document.getElementById('repet').style.borderColor = '#48c78e';
        vm.updatePassword = {
          passwordActual: '',
          passwordNueva: '',
          passwordRepet: '',
          us_usuario: localStorage.getItem('usuario')
        };
      }
      if (vm.Password === 2) {
        document.getElementById('usuario').style.borderColor = '#48c78e';
        vm.errorUers = '';
      }
    });
  }
    selectEvent(item) {
    // do something with selected item
  }

  onChangeSearch(search: string) {
     
  }
}