// OnlineModule.ts
export interface OnlineModule {
  name: string;
  path: string;
  blob: string;
  url: string;
  size: number
  languages: object;
  stars: number;
  forks: number;
}
