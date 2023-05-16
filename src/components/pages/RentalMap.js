import { DirectionsRenderer, GoogleMap, InfoWindow, Marker } from "@react-google-maps/api";
import { collection, getDocs } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { Button, Col, Row } from 'react-bootstrap';
import { db } from '../../firebase-config.js';

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
  const [location1Pos, setLocation1Pos] = useState("");
  const [location2Pos, setLocation2Pos] = useState("");
  const [midpoint, setMidpoint] = useState("");
  const truckImage = require('../img/trucks.png');
  const homeImage = require('../img/home.png');
  const userImage = require('../img/user.png');
  const midpointImage = require('../img/midpoint.png');
  const schoolImage = require('../img/midpoint.png');


  const test = new window.google.maps.LatLng(40.7678, -73.9645);

  const [directionsRenderer, setDirectionsRenderer] = useState(null);

  const handleMarkerClick = (marker) => {
    const directionsService = new window.google.maps.DirectionsService();
    const origin = new window.google.maps.LatLng(marker.position.lat(), marker.position.lng());
    const destination = new window.google.maps.LatLng(40.7678, -73.9645); 

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

  const handleClick = () =>{}
 /** const handleClick = async () => {
    try {
      

      
      let tempMarkers = filteredMarkers;
      tempMarkers.push(homeMarker);
      tempMarkers.push(userMarker);
      tempMarkers.push(midpointMarker);
      setMarkers(filteredMarkers);
    } catch (error) {
      console.error(error);
    }
  }; */



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
            icon: truckImage,
            link: links,
            location: name,
            address
          };
        })
      );


      const geocoder = new window.google.maps.Geocoder();
      const location1Results = await geocoder.geocode({ address: location1 });
      const location2Results = await geocoder.geocode({ address: location2 });

      if (location1Results.length === 0 || location2Results.length === 0) {
        console.error("One or both locations could not be geocoded");
        return;
      }

      console.log(location1, location2)
      const location1LatLng = location1Results.results[0].geometry.location;
      const location2LatLng = location2Results.results[0].geometry.location;

      const midpointLatLng = new window.google.maps.LatLng(
        (location1LatLng.lat() + location2LatLng.lat()) / 2,
        (location1LatLng.lng() + location2LatLng.lng()) / 2
      );

      const filteredMarkers = newMarkers.filter((marker) => {
        const distance = window.google.maps.geometry.spherical.computeDistanceBetween(midpointLatLng, marker.position);
        return distance <= radius * 1000;
      });

      const homeMarker = {
        position: location1LatLng,
        label: { color: 'black', text: ' ' },
        icon: homeImage
      }
      const userMarker = {
        position: location2LatLng,
        label: { color: 'black', text: ' ' },
        icon: userImage
      }
      const midpointMarker = {
        position: midpointLatLng,
        label: { color: 'black', text: ' ' },
        icon: midpointImage
      }
      const schoolMarker = {
        position: midpointLatLng,
        label: { color: 'black', text: ' ' },
        icon: schoolImage
      }


      filteredMarkers.push(homeMarker)
      filteredMarkers.push(userMarker)
      filteredMarkers.push(midpointMarker)

      setMarkers(filteredMarkers);
    };

    fetchData();
  }, []);

  return (
    <div>
      <Row >
        <Col>
          <label className="w-25 text-dark" htmlFor="location1"> Address:</label>
          <input type="text" className="w-70" id="location1" value={location1} onChange={handleLocation1Change} />
        </Col>
        <Col>
          <label className="w-25 text-dark" htmlFor="location2"> Match's address:</label>
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
              icon={marker.icon}
              draggable={false}
              onClick={() => {
                setActiveInfoWindow(marker);
                setCenter(marker.position);
                handleMarkerClick(marker);
              }}
            >
              {activeInfoWindow === marker && marker.icon === require('../img/trucks.png') &&(
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


