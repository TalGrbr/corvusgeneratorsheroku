import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {AuthService} from '../Auth/auth.service';
import {Router} from '@angular/router';
import {ManagementDataService} from '../../server-handlers/management-data.service';

@Component({
  selector: 'app-update-password',
  templateUrl: './update-password.component.html',
  styleUrls: ['./update-password.component.css']
})
export class UpdatePasswordComponent implements OnInit {
  passwordForm: FormGroup;

  constructor(private fb: FormBuilder, private mds: ManagementDataService, private authService: AuthService) {
    this.passwordForm = fb.group({
      password: new FormControl('', [Validators.required]),
      passwordConfirm: new FormControl('', [Validators.required]),
    }, {validator: this.checkIfMatchingPasswords('password', 'passwordConfirm')});
  }

  ngOnInit(): void {
  }

  updatePassword() {
    this.mds.updatePassword(this.authService.getUsername(), this.passwordForm.getRawValue().password).subscribe(data => {
      if (data.body['message']) {
        alert(data.body['message']);
        localStorage.setItem('init_pass', '0');
      }
    }, error => alert(error.error.message));
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
}
