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
  showImageSelector = this.imageSelectorService.showImageSelector.asReadonly()

    id = signal<string | undefined>(undefined);


imageRef = this.imageSelectorService.getAllImages(this.id);
isLoading = this.imageRef.isLoading;
images = this.imageRef.value    


hideImageSelector()
{
  this.imageSelectorService.hideImageSelector();
}


imageSelectorUploadForm = new FormGroup({
  file : new FormControl<File | null | undefined>(null,  {
    nonNullable :  true,
    validators : [Validators.required]
  }),

  imageTitle : new FormControl<string>('', {
    nonNullable:  true,
    validators : [Validators.required , Validators.maxLength(100)]
  }),
  fileName : new FormControl<string>('' , {
    nonNullable : true,
    validators : [Validators.required , Validators.maxLength(100)]

  })

});



onFileSelected(event : Event)
{
  const input =  event.target as HTMLInputElement;
  if(!input.files || input.files.length === 0)
  {
    return; 
  }
  const file = input.files[0]
  this.imageSelectorUploadForm.patchValue({
    file : file
  });

}
  onSelectImage(image : productImage)
  {
    this.imageSelectorService.selectImage(image.url)
  }

onSubmit()
{
  if(this.imageSelectorUploadForm.valid)
  {
    const formRawValues = this.imageSelectorUploadForm.getRawValue();
    console.log(formRawValues);

    this.imageSelectorService.uploadImage(
      formRawValues.file!,
      formRawValues.fileName,
      formRawValues.imageTitle
    ).subscribe({
      next : (response) => {
          this.id.set(response.id);
          this.imageSelectorUploadForm.reset()
       
      },
      error : () => {
        console.error("something went wrong")
      }
    })
  }

}



}
