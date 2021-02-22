import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import {
  CameraResultType,
  CameraSource,
  Capacitor,
  Plugins,
} from '@capacitor/core';
import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-image-picker',
  templateUrl: './image-picker.component.html',
  styleUrls: ['./image-picker.component.scss'],
})
export class ImagePickerComponent implements OnInit {
  @ViewChild('filePicker') filePickerRef: ElementRef<HTMLInputElement>;
  @Output() imagePick = new EventEmitter<string | File>();
  @Input() showPreview = false;
  selectedImage: string;
  usePicker = false;
  constructor(private platForm: Platform) {}

  ngOnInit() {
    console.log('Mobile: ', this.platForm.is('mobile'));
    console.log('Hybrid: ', this.platForm.is('hybrid'));
    console.log('Desktop: ', this.platForm.is('desktop'));
    console.log('Ios: ', this.platForm.is('ios'));
    console.log('Android: ', this.platForm.is('android'));
    console.log('PWA: ', this.platForm.is('pwa'));
    if (
      (this.platForm.is('mobile') && !this.platForm.is('hybrid')) ||
      this.platForm.is('desktop')
    ) {
      this.usePicker = true;
    }
  }

  onPickImage() {
    if (!Capacitor.isPluginAvailable('Camera')) {
      this.filePickerRef.nativeElement.click();
      return;
    }
    Plugins.Camera.getPhoto({
      quality: 50,
      source: CameraSource.Prompt,
      correctOrientation: true,
      width: 600,
      resultType: CameraResultType.Base64,
    })
      .then((image) => {
        this.selectedImage = image.base64String;
        this.imagePick.emit(image.base64String);
      })
      .catch((error) => {
        console.log(error);
        if (this.usePicker) {
          this.filePickerRef.nativeElement.click(); //Needs the package ionic/pwa-elements for the camera 'npm install --save @ionic/pwa-elements
        }
        return false;
      });
  }

  onFileChosen(event: Event) {
    console.log(event);
    const pickedFile = (event.target as HTMLInputElement).files[0];
    if (!pickedFile) {
      return;
    }
    const fr = new FileReader();
    fr.onload = () => {
      const dataUrl = fr.result.toString();
      this.selectedImage = dataUrl;
      this.imagePick.emit(pickedFile);
    };
    fr.readAsDataURL(pickedFile);
  }
}

// resultType: CameraResultType.DataUrl
// this.selectedImage = image.DataUrl;
//       this.imagePick.emit(image.DataUrl);
