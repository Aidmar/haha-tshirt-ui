import { HttpClient, httpResource, HttpResourceRef } from '@angular/common/http';
import { computed, inject, Injectable, signal, WritableSignal } from '@angular/core';
import { Observable } from 'rxjs';
import { productImage } from './image.model';

@Injectable({
  providedIn: 'root',
})
export class ImageSelectorService {
showImageSelector = signal<boolean>(false);
  selectedImage = signal<string | null>(null);
  

  private imagesList = signal<productImage[]>([]);

  constructor() {
    this.loadFromStorage();
  }

  private loadFromStorage() {
    const saved = localStorage.getItem('demo_images');
    if (saved) {
      this.imagesList.set(JSON.parse(saved));
    } else {
    
      this.imagesList.set([
        { id: '1', fileName: 'sample', fileExtention: '.jpg', url: 'https://placehold.co/400x400?text=Sample+1', title: 'Sample 1', dateCreated: new Date().toISOString() }
      ]);
    }
  }

  displayImageSelector() { this.showImageSelector.set(true); }
  hideImageSelector() { this.showImageSelector.set(false); }

  selectImage(imageUrl: string) {
    this.selectedImage.set(imageUrl);
    this.hideImageSelector();
  }

  getAllImages(idSignal: WritableSignal<string | undefined>) {
 
    return {
      value: computed(() => this.imagesList()),
      isLoading: signal(false),
      error: signal(null)
    };
  }

  uploadImage(file: File, fileName: string, title: string): Observable<productImage> {
    return new Observable<productImage>(observer => {
      const reader = new FileReader();
      
      reader.onload = () => {
        const newImage: productImage = {
          id: Math.random().toString(36).substr(2, 9),
          fileName: fileName,
          title: title,
          fileExtention: file.name.split('.').pop() || '',
          url: reader.result as string, 
          dateCreated: new Date().toISOString()
        };

        this.imagesList.update(list => [newImage, ...list]);
        localStorage.setItem('demo_images', JSON.stringify(this.imagesList()));
        
        observer.next(newImage);
        observer.complete();
      };

      reader.readAsDataURL(file); // Converts image to string for local storage
    });
  }
}


