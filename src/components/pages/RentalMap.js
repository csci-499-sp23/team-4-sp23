import React, { useState, useEffect } from 'react';
import { GoogleMap, InfoWindow, LoadScript, Marker } from "@react-google-maps/api";
import { db } from '../../firebase-config.js';
import { collection, getDocs } from 'firebase/firestore';

const RentalMap = () => {
  const [activeInfoWindow, setActiveInfoWindow] = useState(null);
  const [markers, setMarkers] = useState([]);

  const containerStyle = { width: '100%', height: '900px' };
  const center = { lat: 40.7678, lng: -73.9645 };

  const handleInfoWindowClose = () => setActiveInfoWindow(null);

  useEffect(() => {
    const fetchData = async () => {
      const querySnapshot = await getDocs(collection(db, 'rental_locations'));

      const newMarkers = await Promise.all(
        querySnapshot.docs.map(async (doc) => {
          const { name, address, lat, lng, links  } = doc.data();
          const tLat = parseFloat(lat);
          const tLng = parseFloat(lng);
      
          const latLng = new window.google.maps.LatLng( {lat:tLat, lng:tLng} )
          return {
            position: latLng ,
            label: { color: 'black', text: ' ' },
            link: links,
            location: name,
            address
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
              >
                <div>
                  <p className="marker-text"> {marker.location}</p>
                  <p className="marker-text">Address: {marker.address}</p>
                  <p className="marker-text">Link: <a href={marker.link}>{marker.link}</a></p>
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
