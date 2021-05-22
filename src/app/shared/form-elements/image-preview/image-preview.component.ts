import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ToastrService} from "ngx-toastr";

@Component({
  selector: 'image-preview',
  templateUrl: './image-preview.component.html',
  styleUrls: ['./image-preview.component.css']
})
export class ImagePreviewComponent implements OnInit {

  @Input() imageSrc: string;
  @Input() imageType: string;
  @Output() deleteImageEvent = new EventEmitter<string>();
  height=75;
  width=75;
  constructor(public toast: ToastrService) {
  }

  ngOnInit(): void {
    if(this.imageType=='cover_photos'){
      this.height=49;
      this.width=95;
    }
  }

  deleteImage(){
    this.deleteImageEvent.emit(this.imageSrc)
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
