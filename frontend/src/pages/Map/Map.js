import React from 'react';
import MapBox from './MapBox';

const overlayData = [
    {
      id: 1,
      name: 'Apollo 11 Stones',
      foundLocation: 'Namibia',
      currentLocation: 'State museum of Namibia',
      city: 'Keetmanshoop',
      stateCountry: 'Namibia',
      coordinates: [16.37131399098195, -22.9400140739789], // Correct order: [longitude, latitude]
      description: 'Apollo 11 Stones in Namibia'
    },
    {
      id: 2,
      name: 'Great Hall of the Bulls',
      foundLocation: 'Paleolithic Europe',
      currentLocation: 'Caves of Lascaux',
      city: 'Montignac',
      stateCountry: 'France',
      coordinates: [1.1758047492812347, 45.053734687725566],
      description: 'Great Hall of the Bulls in Montignac, France'
    },
    {
      id: 3,
      name: 'Camelid Sacrum in the Shape of a Canine',
      foundLocation: 'Tequixqixquiac',
      currentLocation: 'National Museum of Anthropology',
      city: 'Mexico City',
      stateCountry: 'Mexico City',
      coordinates: [-99.13554086198975, 19.904816455606017],
      description: 'Camelid Sacrum in the Shape of a Canine in Mexico City'
    },
    {
      id: 4,
      name: 'Running Horned Woman',
      foundLocation: 'Algerian section of the Sahara Desert',
      currentLocation: '',
      city: '',
      stateCountry: 'Algeria',
      coordinates: [8.133555341649393, 25.811700902299727],
      description: 'Running Horned Woman in Algeria'
    },
    {
      id: 5,
      name: 'The Beaker with Ibex Motif',
      foundLocation: 'Susa, Iran',
      currentLocation: 'MET',
      city: 'NYC',
      stateCountry: 'New York',
      coordinates: [48.271307909987215, 32.19656717029109],
      description: 'The Beaker with Ibex Motif in New York'
    },
    {
      id: 6,
      name: 'Anthropomorphic Stele',
      foundLocation: '',
      currentLocation: 'National Museum',
      city: 'Riyad',
      stateCountry: 'Saudi Arabia',
      coordinates: [43.5354752727906, 25.198502043321053],
      description: 'Anthropomorphic Stele in Riyad, Saudi Arabia'
    },
    {
      id: 7,
      name: 'Jade Cong',
      foundLocation: '',
      currentLocation: 'MET',
      city: 'New York City',
      stateCountry: 'New York',
      coordinates: [120.05239643272778, 28.937271482557986],
      description: 'Jade Cong in New York City'
    },
    {
      id: 8,
      name: 'Stonehenge',
      foundLocation: '',
      currentLocation: '',
      city: '',
      stateCountry: 'England',
      coordinates: [-1.826129206486122, 51.17869322668439],
      description: 'Stonehenge in England'
    },
    {
      id: 9,
      name: 'Ambum Stone',
      foundLocation: 'Papua New Guinea',
      currentLocation: 'National Gallery of Australia',
      city: 'Canberra',
      stateCountry: 'Australia',
      coordinates: [144.18377071495553, -5.300008853092048],
      description: 'Ambum Stone in Canberra, Australia'
    },
    {
      id: 10,
      name: 'Tlatilco Female Figure',
      foundLocation: 'Central Mexico',
      currentLocation: 'Princeton University of Art Museum',
      city: 'Princeton',
      stateCountry: 'New Jersey',
      coordinates: [-100.4897578791562, 21.62662761224965],
      description: 'Tlatilco Female Figure in Princeton, New Jersey'
    },
    {
      id: 11,
      name: 'Terra Cotta Fragment',
      foundLocation: 'Lapita',
      currentLocation: 'Dept. of Anthropology Univ. of Auckland',
      city: 'Auckland',
      stateCountry: 'New Zealand',
      coordinates: [178.82328943831106, -16.752665023093286],
      description: 'Terra Cotta Fragment in Auckland, New Zealand'
    },
    {
      id: 12,
      name: 'White Temple and its ziggurat',
      foundLocation: 'Sumerian',
      currentLocation: '',
      city: 'Warka',
      stateCountry: 'Iraq',
      coordinates: [45.63884596686337, 31.324093270902946],
      description: 'White Temple and its ziggurat in Warka, Iraq'
    },
    {
      id: 13,
      name: 'Palette of King Narmer',
      foundLocation: 'Predynastic Egypt',
      currentLocation: 'Egyptian Museum',
      city: 'Cairo',
      stateCountry: 'Egypt',
      coordinates: [32.77936210308033, 25.097033800112108],
      description: 'Palette of King Narmer in Cairo, Egypt'
    },
    {
      id: 14,
      name: 'Statues of Votive Figures from the Square Temple at Eshnuna',
      foundLocation: 'Sumerian',
      currentLocation: 'MET',
      city: 'NYC',
      stateCountry: 'New York',
      coordinates: [44.24408849045286, 33.214970203655426],
      description: 'Statues of Votive Figures from the Square Temple at Eshnuna in New York'
    },
    {
      id: 15,
      name: 'Seated Scribe',
      foundLocation: 'Old Kingdom',
      currentLocation: 'Louvre',
      city: 'Paris',
      stateCountry: 'France',
      coordinates: [31.21008198953811, 29.87569788016246],
      description: 'Seated Scribe in Paris, France'
    },
    {
      id: 16,
      name: 'Standard of Ur',
      foundLocation: 'Sumerian',
      currentLocation: 'British Museum',
      city: 'London',
      stateCountry: 'England',
      coordinates: [46.097117418254925, 30.96091092605121],
      description: 'Standard of Ur in London, England'
    }
  ];

function Map() {
  return (
    <div className='map pagecontainer'>
      <h1 className="title">Map</h1>
      <p className='blurb'>Where the 250 art pieces are from</p>
      <MapBox overlays={overlayData} />
    </div>
  );
}

export default Map;