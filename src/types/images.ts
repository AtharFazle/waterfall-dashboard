export interface Image {
  id: number;
  url: string;
  title: string;
  description: string;
  order: number;
  uploadDate: string;
  isActive: boolean;
  // file?: File;
}

export type CreateImagePayload = Omit<Image, "id" | "url" | "order" > 
& { image: File | null; 
  url?: string; 
  order?: number;
  uploadDate?: string };
