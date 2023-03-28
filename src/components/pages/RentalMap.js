import React, { useState, useEffect } from 'react';
import { GoogleMap, InfoWindow, LoadScript, Marker } from "@react-google-maps/api";
import { db } from '../../firebase-config.js';
import { collection, query, where, getDocs, get } from 'firebase/firestore';
import Geocode from 'react-geocode';

Geocode.setApiKey('AIzaSyDhz3m22jJJjC6BOX83Qbjdm2FaQiXVK4A')
const RentalMap = () => {
  class Location {
    constructor(street, city, state, zip, link, location) {
      this.street = street;
      this.city = city;
      this.state = state;
      this.zip = zip;
      this.link = link;
      this.location = location;
    }
    
    getFullAddress() {
      return `${this.street}, ${this.city}, ${this.state} ${this.zip}`;
    }
  };
  const initialMarkers = [];

  const [activeInfoWindow, setActiveInfoWindow] = useState(null);
  const [markers, setMarkers] = useState(initialMarkers);

  const containerStyle = {
    width: '100%',
    height: '900px',
  };

  const center = {
    lat: 40.7678,
    lng: -73.9645,
  };

  const mapClicked = (event) => {
    console.log(event.latLng.lat(), event.latLng.lng())
  };

  const markerClicked = (marker) => {
    setActiveInfoWindow(marker);
  };

  const markerDragEnd = (event, index) => {
    console.log(event.latLng.lat())
    console.log(event.latLng.lng())
  };

  useEffect(() => {
    const fetchData = async () => {
      const dLocations = collection(db, "trucks");
      const querySnapshot = await getDocs(dLocations);
    
      querySnapshot.forEach((doc) => {
        const { addresses, links, locations } = doc.data();
        const addressComponents = addresses.split(" ");
        const zip = addressComponents.pop();
        const state = addressComponents.pop();
        const city = addressComponents.pop();
        const street = addressComponents.join(" ");
    
        const locationObject = new Location(street, city, state, zip, links, locations);
    
        Geocode.fromAddress(locationObject.getFullAddress()).then(
          (response) => {
            const { lat, lng } = response.results[0].geometry.location;
            const marker = {
              position: {
                lat,
                lng,
              },
              label: {
                color: "black",
                text: " ",
              },
              link: locationObject.link,
              location: locationObject.location,
            };
            setMarkers((prevMarkers) => [...prevMarkers, marker]);
          },
          (error) => {
            console.error(error);
          }
        );
      });
    };
    
    fetchData();
  }, []);
  
  const handleInfoWindowClose = () => {
    setActiveInfoWindow(null);
  };

  return (
    <LoadScript googleMapsApiKey='AIzaSyDhz3m22jJJjC6BOX83Qbjdm2FaQiXVK4A'>
      <GoogleMap 
        mapContainerStyle={containerStyle}
        center={center}
        zoom={15}
        onClick={mapClicked}
      >
        {markers.map((marker, index) => (
          <Marker
            key={index}
            position={marker.position}
            label={marker.label}
            draggable={false}
            onClick={() => markerClicked(marker)}
          >
            {activeInfoWindow === marker && (
              <InfoWindow
                position={marker.position}
                onCloseClick={handleInfoWindowClose}
                style={{ text: 'black' }}
              >
                <div>
                  <p>
                    <strong>Location: </strong>
                    {marker.location}
                  </p>
                  <p>
                  <strong>Link: </strong>
                  <a href={marker.link}>{marker.link}</a>
                  </p>
                </div>
              </InfoWindow>
            )}
          </Marker>
        ))}
      </GoogleMap>
    </LoadScript>
  );
};

export default RentalMap;
