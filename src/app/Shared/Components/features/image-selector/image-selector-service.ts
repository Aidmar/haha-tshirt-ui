import { HttpClient, httpResource, HttpResourceRef } from '@angular/common/http';
import { inject, Injectable, signal, WritableSignal } from '@angular/core';
import { Observable } from 'rxjs';
import { productImage } from './image.model';

@Injectable({
  providedIn: 'root',
})
export class ImageSelectorService {
  http = inject(HttpClient);

  showImageSelector = signal<Boolean>(false);

  selectedImage = signal<string | null>(null);


  private apiBaseUrl = 'https://localhost:7004';

  displayImageSelector() {
    this.showImageSelector.set(true);
  }

  hideImageSelector() {
    this.showImageSelector.set(false);
  }

  uploadImage(file: File, fileName: string, title: string): Observable<productImage> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('fileName', fileName);
    formData.append('title', title);
    return this.http.post<productImage>(`${this.apiBaseUrl}/api/Images`, formData);
  }

  getAllImages(
    id: WritableSignal<string | undefined>,
  ): HttpResourceRef<productImage[] | undefined> {
    return httpResource<productImage[]>(() => {
       id();
      return `${this.apiBaseUrl}/api/Images`;
    });
  }

    selectImage(imageUrl: string) {
    this.selectedImage.set(imageUrl);
    this.hideImageSelector();
  }

}
