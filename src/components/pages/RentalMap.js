import React, { useState, useEffect } from 'react';
import { GoogleMap, InfoWindow, LoadScript, Marker } from "@react-google-maps/api";
import { db } from '../../firebase-config.js';
import { collection, getDocs } from 'firebase/firestore';
import Geocode from 'react-geocode';
import { MarkerClusterer } from "@googlemaps/markerclusterer";

Geocode.setApiKey('AIzaSyDhz3m22jJJjC6BOX83Qbjdm2FaQiXVK4A');

const RentalMap = () => {
  const [activeInfoWindow, setActiveInfoWindow] = useState(null);
  const [markers, setMarkers] = useState([]);

  const containerStyle = { width: '100%', height: '900px' };
  const center = { lat: 40.7678, lng: -73.9645 };

  const handleInfoWindowClose = () => setActiveInfoWindow(null);

  useEffect(() => {
    const fetchData = async () => {
      const querySnapshot = await getDocs(collection(db, 'trucks'));

      const newMarkers = await Promise.all(
        querySnapshot.docs.map(async (doc) => {
          const { addresses, links, locations } = doc.data();
          const addressComponents = addresses.split(' ');
          const zip = addressComponents.pop();
          const state = addressComponents.pop();
          const city = addressComponents.pop();
          const street = addressComponents.join(' ');

          const location = `${street}, ${city}, ${state} ${zip}`;

          const geocodeResponse = await Geocode.fromAddress(location);
          const { lat, lng } = geocodeResponse.results[0].geometry.location;

          return {
            position: { lat, lng },
            label: { color: 'black', text: ' ' },
            link: links,
            location,
          };
        })
      );

      setMarkers(newMarkers);
    };

    fetchData();
  }, []);

  return (
    <LoadScript googleMapsApiKey='AIzaSyDhz3m22jJJjC6BOX83Qbjdm2FaQiXVK4A'>
      <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={15}>
        {markers.map((marker, index) => (
          <Marker
            key={index}
            position={marker.position}
            label={marker.label}
            icon={require('../img/marker.png')}
            draggable={false}
            onClick={() => setActiveInfoWindow(marker)}
          >
            {activeInfoWindow === marker && (
              <InfoWindow
                position={marker.position}
                onCloseClick={handleInfoWindowClose}
                style={{ color: 'black' }}
              >
                <div>
                  <p><strong>Location: </strong>{marker.location}</p>
                  <p><strong>Link: </strong><a href={marker.link}>{marker.link}</a></p>
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
