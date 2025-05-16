export interface Suspect {
  name: string;
  age: number;
  email: string;
  contact: string;
  criminalRecord: {
    crimeType: string; // e.g., "Robbery"
    location: string; // e.g., "Delhi"
    date: Date;
  }[];
  profileImage: string;
  lastKnownLocation: {
    coordinates: {
      lat: number;
      lng: number;
    };
    address: string;
  };
  knownAffiliations: string[];
  faceEmbedding: number[];
  description: string;
}
