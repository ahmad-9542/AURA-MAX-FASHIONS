export type ProductSize =
  | 'XS'
  | 'S'
  | 'M'
  | 'L'
  | 'XL'
  | 'XXL'
  | 'UK 6'
  | 'UK 7'
  | 'UK 8'
  | 'UK 9'
  | 'UK 10'
  | 'UK 11'
  | 'One Size';

export type Department = 'Men' | 'Women' | 'Footwear' | 'Accessories';

export type BrandLine =
  | 'AURA MAX'
  | 'AURA MAX Atelier'
  | 'AURA MAX Studio'
  | 'AURA MAX Archive';

export type CollectionName =
  | 'Urban Essentials'
  | 'Minimalist Classics'
  | 'Summer Collection'
  | 'Premium Streetwear';

export type SortOption =
  | 'featured'
  | 'newest'
  | 'popularity'
  | 'price-asc'
  | 'price-desc';

export type PriceRangeOption =
  | 'all'
  | 'under-3000'
  | '3000-7500'
  | '7500-15000'
  | 'above-15000';

export type StockStatus = 'In Stock' | 'Low Stock' | 'Out of Stock';

export interface ColorOption {
  name: string;
  hex: string;
}

export interface ProductReview {
  id: string;
  author: string;
  city: string;
  rating: number;
  date: string;
  comment: string;
}

export interface Product {
  id: string;
  sku: string;
  name: string;
  brand: BrandLine;
  department: Department;
  subCategory: string;
  category: string;
  collection: CollectionName;
  gender: 'Men' | 'Women' | 'Unisex';
  price: number;
  originalPrice: number;
  discountPercent: number;
  image: string;
  alternateImage?: string;
  galleryImages: string[];
  description: string;
  fabricAndCare: string[];
  sizes: ProductSize[];
  colors: ColorOption[];
  rating: number;
  reviewCount: number;
  reviews: ProductReview[];
  isNewArrival?: boolean;
  isTrending?: boolean;
  isBestSeller?: boolean;
  isRecommended?: boolean;
  newestRank: number;
  stockStatus: StockStatus;
}

export interface DepartmentCardItem {
  id: string;
  department: Department;
  title: string;
  subtitle: string;
  image: string;
  subCategories: string[];
}

export interface CollectionItem {
  id: string;
  name: CollectionName;
  season: string;
  description: string;
  image: string;
}

export interface CartItem {
  key: string;
  product: Product;
  size: ProductSize;
  color: ColorOption;
  quantity: number;
}

export interface Testimonial {
  id: string;
  customerName: string;
  location: string;
  purchasedItem: string;
  quote: string;
  rating: number;
}

export type PolicyKey =
  | 'about'
  | 'support'
  | 'contact'
  | 'faqs'
  | 'shipping'
  | 'returns'
  | 'privacy'
  | 'terms';
