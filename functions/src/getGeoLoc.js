/* eslint-disable camelcase */
const fetch = require("node-fetch");

// replace with your own API key
const apiKey = process.env.GOOGLE_GEOCODE_API_KEY;
const endpoint = "https://maps.googleapis.com/maps/api/geocode/json";

if ([undefined, null, ""].includes(apiKey)) {
  throw new Error("Error: apiKey invalid in env_vars");
}

async function getGeoLoc({state, street_add, zip, city}) {
  // const geocoder = new google.maps.Geocoder();

  if ([state, street_add, zip, city].every((item) => !item)) {
    return null;
  }

  // console.log({state, street_add, zip, city});

  const address = [state, street_add, zip, city]
  // .filter((item) => !item)
      .join(" ");
  // const results = await geocoder.geocode({address});

  console.log({address, state, street_add, zip, city});

  const params = new URLSearchParams({
    address,
    key: apiKey,
  });
  const response = await fetch(`${endpoint}?${params}`);

  if (!response?.ok) {
    return null;
  }
  const data = await response.json();
  // functions.logger.info({address, data});
  const result = data.results[0];
  const {lat, lng: lon} = result.geometry.location;
  // const lon = result.geometry.location.lng;
  return {lat, lon};
}

function convertDistanceTCoordUnit(
    /** @type {number} km */ distance,
    /** @type {'lon'|'lat'}*/ type,
) {
  if (type === "lon") {
    // # convert distance in km to longitude in degrees
    return distance / 111.321;
  } else if (type === "lat") {
    // convert distance in km to latitude in degrees
    return distance / 110.574;
  } else {
    // handle invalid input for type
    return null;
  }
}

module.exports = {convertDistanceTCoordUnit, getGeoLoc};
