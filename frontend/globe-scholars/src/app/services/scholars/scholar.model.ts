export interface Scholar {
  id: number;
  username: string;
  firstName: string;
  lastName: string;
  fullName: string;
  bio: string;
  affiliation: string;
  country: string;
  website: string;
  createdAt: Date;
  uploadCount: number;
}

export interface ScholarsResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Scholar[];
}

