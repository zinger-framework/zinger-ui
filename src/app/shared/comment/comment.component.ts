import {Component, Input} from '@angular/core';
import {BaseComponent} from "../../base.component";

@Component({
  selector: 'comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.css']
})
export class CommentComponent extends BaseComponent {
  @Input() userName;
  @Input() time;
  @Input() message;
  image;

  constructor() {
    super()
    this.image = 'https://www.gravatar.com/avatar/19950ba08782d91c3e50e7bd2287d3c3.jpg';
  }
}
