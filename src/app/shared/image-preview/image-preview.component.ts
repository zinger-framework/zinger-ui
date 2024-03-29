import {Component, EventEmitter, Input, Output} from '@angular/core';
import {ToastrService} from "ngx-toastr";
import {BaseComponent} from "../../base.component";

@Component({
  selector: 'image-preview',
  templateUrl: './image-preview.component.html',
  styleUrls: ['./image-preview.component.css']
})
export class ImagePreviewComponent extends BaseComponent {
  @Input() imageSrc: string;
  @Input() imageType: string;
  @Input() imageId: string = '';
  @Input() disableDelete = false;
  @Input() disableSizing = false;
  @Output() deleteImageEvent = new EventEmitter<string>();
  width = 75;
  height = 75;

  constructor(public toast: ToastrService) {
    super()
  }

  ngOnInit(): void {
    if (this.imageType == 'cover_photos') {
      this.width = 95;
      this.height = 49;
    }
  }

  deleteImage() {
    this.deleteImageEvent.emit(this.imageId)
  }

  onImageLoadError(event) {
    switch (this.imageType) {
      case "cover_photos":
        event.target.src = 'https://via.placeholder.com/1024x500.png'
        break;
      default:
        event.target.src = 'https://via.placeholder.com/512x512.png'
        break;
    }
  }
}
