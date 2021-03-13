import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProfileComponent implements OnInit {
  name: string;
  email: string;
  mobile: string;
  enable: boolean;
  selectedRole: string;
  roles = ['Admin', 'Manager', 'Delivery'];

  constructor() {
  }

  ngOnInit(): void {
    this.name = 'Logesh';
    this.mobile = '9176786586';
    this.email = 'ddlogesh@gmail.com';
    this.enable = true;
    this.selectedRole = 'Admin';
  }
}
