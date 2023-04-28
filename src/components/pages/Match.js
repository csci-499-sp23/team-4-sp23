import React, { useCallback, useEffect, useReducer, useState } from "react";
//import { getProfiles } from "../../firebase";

import { functionsApi } from "../../firebase";

// const getProfiles = () => demo_profiles;
const matchReducer = (state, action) => {
  console.log({ action, state });
  switch (action.type) {
    case "set_distance":
      return { ...state, distanceInKm: action.payload };
    case "set_unit":
      return { ...state, distanceUnit: action.payload };
    case "isLoading":
      return {
        ...state,
        loading: true,
      };
    case "loadingComplete": {
      return { ...state, loading: false };
    }
    default:
      return;
  }
};
const Match = () => {
  const [profiles, setProfiles] = useState([]);
  const [matchFilters, dispatch] = useReducer(matchReducer, { distanceInKm: 5, distanceUnit: "mi", loading: null });

  const refreshMatchs = useCallback(() => {
    dispatch({ type: "isLoading" });
    setProfiles([]);
    functionsApi
      .getMatches({ distanceInKm: matchFilters.distanceInKm * (/mi/i.test(matchFilters.distanceUnit) ? 1.6 : 1) })
      .then((response) => {
        const { data: matches } = response.data;
        setProfiles(matches);
      })
      .catch(console.error)
      .finally(() => dispatch({ type: "loadingComplete" }));
  }, [matchFilters]);



  useEffect(() => {
    if (matchFilters.loading === null) {
      refreshMatchs();
    }
    console.log("tintin");
  }, [matchFilters, refreshMatchs]);
  //do not remove the empty bracket, or you will cause an infinite loop

  return (
    <div className="content row justify-content-center">
      <div className="col-6">Matches {profiles?.length}</div>

      <div className="col-6 button-controls">

        <button className="btn btn-primary" onClick={refreshMatchs}>
          get matches
        </button>
      </div>

      <form className="col-12">
        <div className="form-group">
          <label htmlFor="">Unit</label>
          <select name="distanceUnit" id="" onChange={(e) => dispatch({ type: "set_unit", payload: e.target.value })}>
            <option value="km">Km</option>
            <option value="mi">Mi</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="">
            Distance ({matchFilters.distanceUnit}): {matchFilters.distanceInKm}
          </label>
          <input type="range" min="1" max="30" value={matchFilters.distanceInKm} onChange={(e) => dispatch({ type: "set_distance", payload: Number(e.target.value) })} />
        </div>
      </form>

      <div>{matchFilters.loading ? "Loading..." : "done"}</div>

      <div className="profiles d-flex flex-column gap-5 col-md-6 col-xs-12">
        {profiles?.map((profile) => (
          <div className="d-flex h-300 bg-white text-align-left p-3 rounded-3" key={profile.id}>
            <div className="profile-content flex-grow text-black w-100 d-flex flex-column align-items-start">
              <h2 className="p-l-0">{profile.first_name + " " + profile.last_name}</h2>
              <span>{profile.age}.</span>
              <span>{profile.bio}.</span>
              <span>{profile.school?.name}</span>
            </div>
            <img src={(profile.image?.length && profile.image) ?? "https://ionicframework.com/docs/img/demos/avatar.svg"} alt="profilee" className="flex-none rounded" width="150" height="150" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Match;
