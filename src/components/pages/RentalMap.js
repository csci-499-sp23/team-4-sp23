import React, { useState } from 'react';
import { GoogleMap, InfoWindow, LoadScript, Marker } from "@react-google-maps/api";

const RentalMap = () => {
  let latitude = 40.7678;
  let longitude = -73.9645;

  const initialMarkers = [
    {
      position: {
        lat: latitude,
        lng: longitude
      },
      label: { color: "white", text: "P1"},
      draggable: true
    },

  ];

  const [activeInfoWindow, setActiveInfoWindow] = useState("");
  const [markers] = useState(initialMarkers);

  const containerStyle = {
    width: '100%',
    height: '500px',
  }

  const center = {
    lat: latitude,
    lng: longitude,
  }

  const mapClicked = (event) => {
    console.log(event.latLng.lat(), event.latLng.lng())
  }

  const markerClicked = (marker, index) => {
    setActiveInfoWindow(index)
    console.log(marker, index)
  }

  const markerDragEnd = (event, index) => {
    console.log(event.latLng.lat())
    console.log(event.latLng.lng())
  }

  return (
    <LoadScript googleMapsApiKey='AIzaSyAJEDpGht_MfORJGqHehYKpH2K-5sGlB5U'>
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
            draggable={marker.draggable}
            onDragEnd={event => markerDragEnd(event, index)}
            onClick={event => markerClicked(marker, index)}
            >
              {
                (activeInfoWindow === index)
                &&
                <InfoWindow posiiton={marker.position}>
                  <b>{marker.position.lat}, {marker.position.lng}</b>
                </InfoWindow>
              }
            </Marker>
        ))}
      </GoogleMap>
    </LoadScript>
  );
};

export default RentalMap;
