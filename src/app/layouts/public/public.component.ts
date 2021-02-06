import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-public',
  templateUrl: './public.component.html',
  styleUrls: ['./public.component.css']
})
export class PublicComponent implements OnInit {
  @Input() componentName: string;

  constructor() {
  }

  ngOnInit(): void {
  }
}
