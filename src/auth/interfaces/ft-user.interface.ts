interface Photo {
  value: string;
}

interface Name {
  familyName: string;
  givenName: string;
}

export interface FortyTwoUser {
  username: string;
  displayName: string;
  name: Name;
  profileUrl: string;
  emails: string;
  phoneNumbers: string;
  id: number;
  photos: Photo[];
}
