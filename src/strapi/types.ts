// types.ts

export interface Review{
  id: number;
  title: string;
  user:string,
  rating:number,
  comment:string
}

export interface ProductImage {
    id: number;
    documentId: string;
    name: string;
    url: string;
    formats: {
      small: {
        ext: string;
        url: string;
        width: number;
        height: number;
      };
      thumbnail: {
        ext: string;
        url: string;
        width: number;
        height: number;
      };
      large: {
        ext: string;
        url: string;
        width: number;
        height: number;
      };
    };
  }
  
  export interface Product {
    id: string;
    documentId: string;
    name: string;
    price: number;
    productStatus: string;
    productDescription: string;
    features: string;
    growingSeason: string;
    sunExposure: string;
    wateringNeeds: string;
    spacing: string;
    harvestTime: string;
    soilRequirements: string;
    plantingDepth: string;
    companions: string;
    SKU: string;
    Brand: string;
    ShelfLife: string;
    Category: string;
    Storage: string;
    Certification: string;
    shippingReturns: string;
    verified: boolean;
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
    slug: string;
    productimg: ProductImage[];
    isNew:boolean,
    discount?:number,
    rating:number
    reviews:Review[]
  }
  
  export interface ProductsResponse {
    data: Product[];
    meta: {
      pagination: {
        page: number;
        pageSize: number;
        pageCount: number;
        total: number;
      };
    };
  }
  
