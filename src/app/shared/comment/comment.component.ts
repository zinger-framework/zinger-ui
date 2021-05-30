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

  constructor() {
    super()
  }
}
