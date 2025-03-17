import React from 'react';


interface Dog {
  id: string;
  img: string;
  name: string;
  age: number;
  zip_code: string;
  breed: string;
}


interface DogCardProps {
  dog: Dog;
}

const DogCard: React.FC<DogCardProps> = ({ dog }) => {
  return (
    <div className="border rounded shadow p-4 flex flex-col items-center">
      {/* Dog Image */}
      <img src={dog.img} alt={dog.name} className="w-32 h-32 object-cover rounded mb-4" />
      {/* Dog Details */}
      <div className="text-center">
        <h2 className="font-bold text-lg">{dog.name}</h2>
        <p>Age: {dog.age}</p>
        <p>Breed: {dog.breed}</p>
        <p>ZIP: {dog.zip_code}</p>
      </div>
    </div>
  );
};

export default DogCard;
