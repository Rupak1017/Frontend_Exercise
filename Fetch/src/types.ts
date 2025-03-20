// This interface describes a dog's details, including id, image, name, and other attributes.
export interface Dog {
    id: string;
    img: string;
    name: string;
    age: number;
    zip_code: string;
    breed: string;
}
  
// This interface holds the location details like zip code, latitude, longitude, city, state, and county.
export interface Location {
    zip_code: string;
    latitude: number;
    longitude: number;
    city: string;
    state: string;
    county: string;
}
  
// This interface is used to store match results, for example, matching between dogs.
export interface Match {
    match: string;
}
