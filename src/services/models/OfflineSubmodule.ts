// OfflineSubmodule.ts
export interface OfflineSubmodule {
  name: string;
  path: string;
  size: number;
  currentBlob: string;
  currentBlobURL: string;
  currentBlobLanguages: object;
  lastBlob: string ;
  lastBlobURL: string;
  lastBlobLanguages: object;
  stat: string ;
}
