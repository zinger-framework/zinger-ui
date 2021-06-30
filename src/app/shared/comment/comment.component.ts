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
  @Input() image;

  constructor() {
    super()
    // TODO: Remove below value-assignment when image_url is being introduced - Logesh
    this.image = 'https://www.gravatar.com/avatar/19950ba08782d91c3e50e7bd2287d3c3.png';
  }
}
