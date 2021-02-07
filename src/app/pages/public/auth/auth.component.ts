import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit {
  component;

  constructor() {
  }

  ngOnInit(): void {
    this.component = 'login';
  }

}
