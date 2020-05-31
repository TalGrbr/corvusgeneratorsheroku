import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {UsersService} from '../../server-handlers/users.service';
import {AuthService} from '../Auth/auth.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.css']
})
export class AddUserComponent implements OnInit {
  addUserForm: FormGroup;
  private usersService: UsersService;

  constructor(private fb: FormBuilder, usersService: UsersService, private authService: AuthService, private router: Router) {
    this.addUserForm = fb.group({
      username: new FormControl('', [Validators.required])
    });
    this.usersService = usersService;
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
