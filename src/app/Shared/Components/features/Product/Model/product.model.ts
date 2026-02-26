import { Category } from "../../Category/Model/category.model"

export interface ProductVariant {
    id: string; // The GUID from the backend
    colorId: string;
    colorName: string;
    colorHex: string;
    sizeId: string;
    sizeName: string;
    quantity: number;
}

// The variant info we SEND to the server
export interface AddProductVariantDto {
    colorId: string;
    sizeId: string;
    quantity: number;
}

export interface addProductDto {
     
    title : string;
    price : number; 
    description : string;
    featuredImageUrl : string;
    urlHandle : string;
    categories : string[];
    variants: AddProductVariantDto[];

}

export interface product  {
    id : string;
    title : string;
    price : number; 
    originalPrice?: number; 
    isTrending?: boolean;   
    description : string;
    featuredImageUrl : string;
    urlHandle : string;
    categories : Category[];
    variants: ProductVariant[];
    
}


export interface EditProductDto {
      id: string;  
    title : string;
    price : number | null; 
    description : string;
    featuredImageUrl : string;
    urlHandle : string;
    categories : string[];
    variants: {
    colorId: string;
    sizeId: string;
    quantity: number;
  }[];
}

export interface Color {
    id: string;
    name: string;
    hexCode: string;
}

export interface Size {
    id: string;
    name: string;
}