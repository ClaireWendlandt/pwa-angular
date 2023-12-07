import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Dexie } from 'dexie';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ImageService {
  constructor(private http: HttpClient) {}
  db = new Dexie('waitingProduddct');

  async downloadImage(imageUrl: string) {
    console.log('image url :', imageUrl);
    try {
      const response = this.http.get(imageUrl, { responseType: 'blob' });
      if (response) {
        console.log('response :', response);
        const image = await firstValueFrom(response);
        const blobPart = new Blob([image], { type: 'image/jpg' });
        const fileName = imageUrl.split('/').pop();
        const imagePath = `assets/images/${fileName}`;

        if (fileName) {
          // FileSaver.saveAs(blobPart, fileName);
        }
      }
    } catch (error) {
      console.log(error);
    }
  }

  // getImage(imageUrl: string) {
  //   if (navigator.onLine) {
  //     return imageUrl;
  //   } else {
  //     const imagePath = `assets/images/${imageUrl.split('/').pop()}`;
  //     if (window.isFileExists(imagePath)) {
  //       return imagePath;
  //     } else {
  //       return null;
  //     }
  //   }
  // }
}
