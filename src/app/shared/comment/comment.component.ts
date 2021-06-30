import {Component, Input} from '@angular/core';
import {BaseComponent} from "../../base.component";
import md5 from 'crypto-js/md5';

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
    this.image = `https://www.gravatar.com/avatar/${md5('ddlogesh@gmail.com').toString()}.png`;
  }
}
