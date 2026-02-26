import { Component, inject, signal } from '@angular/core';
import { ImageSelectorService } from './image-selector-service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { productImage } from './image.model';

@Component({
  selector: 'app-image-selector',
  imports: [ReactiveFormsModule],
  templateUrl: './image-selector.html',
  styleUrl: './image-selector.css',
})
export class ImageSelector {
private imageSelectorService = inject(ImageSelectorService);
  
  showImageSelector = this.imageSelectorService.showImageSelector.asReadonly();
  id = signal<string | undefined>(undefined);

  // Get data from service
  imageRef = this.imageSelectorService.getAllImages(this.id);
  images = this.imageRef.value;
  isLoading = this.imageRef.isLoading;

  imageSelectorUploadForm = new FormGroup({
    file: new FormControl<File | null>(null, [Validators.required]),
    imageTitle: new FormControl<string>('', [Validators.required, Validators.maxLength(100)]),
    fileName: new FormControl<string>('', [Validators.required, Validators.maxLength(100)])
  });

  hideImageSelector() {
    this.imageSelectorService.hideImageSelector();
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.imageSelectorUploadForm.patchValue({ file: input.files[0] });
    }
  }

  onSelectImage(image: productImage) {
    this.imageSelectorService.selectImage(image.url);
  }

  onSubmit() {
    if (this.imageSelectorUploadForm.valid) {
      const form = this.imageSelectorUploadForm.getRawValue();
      
      this.imageSelectorService.uploadImage(
        form.file!,
        form.fileName!,
        form.imageTitle!
      ).subscribe({
        next: (response) => {
          this.id.set(response.id);
          this.imageSelectorUploadForm.reset();
        },
        error: (err) => console.error("Upload failed", err)
      });
    }
  }
}