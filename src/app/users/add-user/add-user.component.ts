import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {AuthService} from '../Auth/auth.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.css']
})
export class AddUserComponent implements OnInit {
  addUserForm: FormGroup;

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
    this.addUserForm = fb.group({
      username: new FormControl('', [Validators.required])
    });
  }

  ngOnInit(): void {

  }

  registerUser() {
    this.authService.register(this.addUserForm.value.username).subscribe((res) => {
      if (res.message) {
        alert(res.message);
        this.addUserForm.reset();
      }
    });
  }
}
