
export interface CreateReelInput {
  store_id: string;
  fileBuffer: Buffer;
  filename: string;
  mimeType: string;
  title: {
    kurdish: string;
    english: string;
  };
  description?: string;
}

export interface ReelResponse {
  id: string;
  store_id?: string;
  public_id?: string;
  url: string;
  thumbnail_url: string;
  title: {
    kurdish: string;
    english: string;
  };
  description?: string;
  duration: number;
  format?: string;
  createdAt: Date;
}