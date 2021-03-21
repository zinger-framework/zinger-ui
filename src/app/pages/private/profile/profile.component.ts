import {ChangeDetectionStrategy, Component} from '@angular/core';
import {BaseComponent} from "../../../base.component";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProfileComponent extends BaseComponent {
  name: string;
  email: string;
  mobile: string;
  enable: boolean;
  selectedRole: string;
  roles = ['Admin', 'Manager', 'Delivery'];

  constructor() {
    super();
  }

  ngOnInit(): void {
    this.name = 'Logesh';
    this.mobile = '9176786586';
    this.email = 'ddlogesh@gmail.com';
    this.enable = true;
    this.selectedRole = 'Admin';
  }
}
