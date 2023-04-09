/*export interface Item {
  id?: number;
  key: number;
  name: string;
  description: string;
  productImageURL: string;
}*/

export interface ShowItem {
  id: number;
  key: number;
  name: string;
  description: string;
  productImageURL: string;
}

export interface FullItem {
  id: number;
  name: string;
  description: string;
  productImageURL: string;
}

export interface ItemBeforePost {
  key: number;
  name: string;
  description: string;
  imageB46: string;
}

export interface ItemReadyForPost {
  name: string;
  description: string;
  imageB64: string;
}

export interface ItemBeforeUpdate {
  id: number;
  key: number;
  name?: string;
  description?: string;
  imageB64?: string;
}

export interface ItemReadyForUpdate {
  id: number;
  name?: string;
  description?: string;
  imageB64?: string;
}