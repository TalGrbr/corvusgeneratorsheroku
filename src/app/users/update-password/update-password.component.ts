import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {AuthService} from '../Auth/auth.service';
import {Router} from '@angular/router';
import {ManagementDataService} from '../../server-handlers/management-data.service';
import {ModalDismissReasons, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {ToastService} from '../../logging/toast.service';

@Component({
  selector: 'app-update-password',
  templateUrl: './update-password.component.html',
  styleUrls: ['./update-password.component.css']
})
export class UpdatePasswordComponent implements OnInit, AfterViewInit {
  passwordForm: FormGroup;
  closeResult = '';
  fieldTextType = false;
  @ViewChild('content') content: ElementRef;

  constructor(private fb: FormBuilder,
              private mds: ManagementDataService,
              private authService: AuthService,
              private modalService: NgbModal,
              private toastService: ToastService) {
    this.passwordForm = fb.group({
      password: new FormControl('',
        [Validators.required, Validators.pattern('^(?=.*\\d)(?=.*[a-z])(?=.*[A-Z])[a-zA-Z0-9\\W\\_]{8,15}$')]),
      passwordConfirm: new FormControl('', [Validators.required]),
    }, {validator: this.checkIfMatchingPasswords('password', 'passwordConfirm')});
  }

  ngOnInit(): void {
  }

  ngAfterViewInit() {
    this.open();
  }

  toggleFieldTextType() {
    this.fieldTextType = !this.fieldTextType;
    console.log('click');
  }

  updatePassword() {
    this.mds.updatePassword(this.authService.getUsername(), this.passwordForm.getRawValue().password).subscribe(data => {
      if (data.body['message']) {
        this.toastService.showSuccess(data.body['message']);
        localStorage.setItem('init_pass', '0');
      }
    }, error => this.toastService.showDanger(error.error.message));
  }

  private checkIfMatchingPasswords(passwordKey: string, passwordConfirmationKey: string) {
    return (group: FormGroup) => {
      const passwordInput = group.controls[passwordKey];
      const passwordConfirmationInput = group.controls[passwordConfirmationKey];
      if (passwordInput.value !== passwordConfirmationInput.value) {
        return passwordConfirmationInput.setErrors({notEquivalent: true});
      } else {
        return passwordConfirmationInput.setErrors(null);
      }
    };
  }

  open() {
    this.modalService.open(this.content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
      console.log(this.closeResult);
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      console.log(this.closeResult);
    });
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }
}
