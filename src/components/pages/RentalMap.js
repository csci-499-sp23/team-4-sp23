import React, { useState, useEffect } from 'react';
import { GoogleMap, InfoWindow, LoadScript, Marker, DirectionsRenderer } from "@react-google-maps/api";
import { db } from '../../firebase-config.js';
import { collection, getDocs } from 'firebase/firestore';
import { Button, Col, Row, Stack } from 'react-bootstrap';

const getAddress = ({ state = null, zip = null, street_add = null }) => {
  const values = [state, zip, street_add].filter(item => item)
  return !values.length ? null : values.join(' ')
}

const RentalMap = ({ guestStudent, hostStudent,initialRadius }) => {

  const [activeInfoWindow, setActiveInfoWindow] = useState(null);
  const [markers, setMarkers] = useState([]);
  const [allMarkers, setAllMarkers] = useState([]);
  const [location1, setLocation1] = useState(getAddress(hostStudent));
  const [location2, setLocation2] = useState(getAddress(guestStudent));
  const [radius, setRadius] = useState(initialRadius);
  const [center, setCenter] = useState({ lat: 40.7678, lng: -73.9645 });

  const [directionsRenderer, setDirectionsRenderer] = useState(null);

  const handleMarkerClick = (marker) => {
    const directionsService = new window.google.maps.DirectionsService();
    const origin = new window.google.maps.LatLng(marker.position.lat(), marker.position.lng());
    const destination = new window.google.maps.LatLng(40.7678, -73.9645); // replace with hardcoded coordinates

    directionsService.route(
      {
        origin: origin,
        destination: destination,
        travelMode: window.google.maps.TravelMode.DRIVING,
      },
      (result, status) => {
        if (status === window.google.maps.DirectionsStatus.OK) {
          setDirectionsRenderer(
            <DirectionsRenderer
              options={{ directions: result }}
            />
          );
        } else {
          console.error(`error fetching directions ${result}`);
        }
      }
    );
  };


  const containerStyle = { width: '100%', height: '900px' };

  const handleInfoWindowClose = () => setActiveInfoWindow(null);

  const handleLocation1Change = (event) => {
    setLocation1(event.target.value);
  }

  const handleLocation2Change = (event) => {
    setLocation2(event.target.value);
  }

  const handleRadiusChange = (event) => {
    setRadius(parseInt(event.target.value));
  }

  const handleClick = async () => {
    try {
      const geocoder = new window.google.maps.Geocoder();
      const location1Results = await geocoder.geocode({ address: location1 });
      const location2Results = await geocoder.geocode({ address: location2 });

      if (location1Results.length === 0 || location2Results.length === 0) {
        console.error("One or both locations could not be geocoded");
        return;
      }

      const location1LatLng = location1Results.results[0].geometry.location;
      const location2LatLng = location2Results.results[0].geometry.location;

      const midpointLatLng = new window.google.maps.LatLng(
        (location1LatLng.lat() + location2LatLng.lat()) / 2,
        (location1LatLng.lng() + location2LatLng.lng()) / 2
      );

      const filteredMarkers = allMarkers.filter((marker) => {
        const distance = window.google.maps.geometry.spherical.computeDistanceBetween(midpointLatLng, marker.position);
        return distance <= radius * 1000;
      });

      setMarkers(filteredMarkers);
      setCenter(midpointLatLng);

    } catch (error) {
      console.error(error);
    }
  };



  useEffect(() => {
    const fetchData = async () => {
      const querySnapshot = await getDocs(collection(db, 'rental_locations'));

      const newMarkers = await Promise.all(
        querySnapshot.docs.map(async (doc) => {
          const { name, address, lat, lng, links } = doc.data();
          const tLat = parseFloat(lat);
          const tLng = parseFloat(lng);

          const latLng = new window.google.maps.LatLng({ lat: tLat, lng: tLng })
          return {
            position: latLng,
            label: { color: 'black', text: ' ' },
            link: links,
            location: name,
            address
          };
        })
      );

      setAllMarkers(newMarkers);
    };

    fetchData();
  }, []);

  return (
    <div>
      <Row >
        <Col>
          <label className="w-25 text-dark" htmlFor="location1"> My Address:</label>
          <input type="text" className="w-70" id="location1" value={location1} onChange={handleLocation1Change} />
        </Col>
        <Col>
          <label className="w-25 text-dark" htmlFor="location2"> Your Match:</label>
          <input type="text" className="w-70" id="location2" value={location2} onChange={handleLocation2Change} />
        </Col>
        <Col>
          <label className="w-25 text-dark" htmlFor="radius">Rdius:</label>
          <input type="number" className="w-70" id="radius" value={radius} onChange={handleRadiusChange} />
        </Col>
        <Button onClick={handleClick}>Submit</Button>
      </Row>

        <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={15}>
          {markers.map((marker, index) => (
            <Marker
              key={index}
              position={marker.position}
              label={marker.label}
              icon={require('../img/marker.png')}
              draggable={false}
              onClick={() => {
                setActiveInfoWindow(marker);
                setCenter(marker.position);
                handleMarkerClick(marker);
              }}
            >
              {activeInfoWindow === marker && (
                <InfoWindow
                  position={marker.position}
                  onCloseClick={handleInfoWindowClose}
                >
                  <div>
                    <p class="marker-text"> {marker.location}</p>
                    <p class="marker-text">Address: {marker.address}</p>
                    <p class="marker-text">Link: <a href={marker.link}>{marker.link}</a></p>
                  </div>
                </InfoWindow>
              )}
            </Marker>
          ))}
          {directionsRenderer}
        </GoogleMap>
    
    </div>
  );
};

export default RentalMap;


