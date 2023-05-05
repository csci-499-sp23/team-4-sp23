import React, { useCallback, useEffect, useReducer, useState } from "react";
//import { getProfiles } from "../../firebase";

import { functionsApi } from "../../firebase";
import { setMessageReceiver } from "../../services/appSlice";
import { useDispatch } from "react-redux";
import { useMessageReceiver } from "../../services/selectors";
import Chat from "./Chat";
import { ErrorBoundary } from "react-error-boundary";
import Messages from "../Messages";

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
  const dispatchGlobal = useDispatch();
  const messageReceiver = useMessageReceiver();
  const [profiles, setProfiles] = useState([]);
  const [matchFilters, dispatchLocal] = useReducer(matchReducer, { distanceInKm: 5, distanceUnit: "mi", loading: null });

  const refreshMatchs = useCallback(
    (e) => {
      if (e) {
        e.preventDefault();
      }

      dispatchLocal({ type: "isLoading" });
      setProfiles([]);
      functionsApi
        .getMatches({ distanceInKm: matchFilters.distanceInKm * (/mi/i.test(matchFilters.distanceUnit) ? 1.6 : 1) })
        .then((response) => {
          const { data: matches } = response.data;
          setProfiles(matches);
        })
        .catch(console.error)
        .finally(() => dispatchLocal({ type: "loadingComplete" }));
    },
    [matchFilters]
  );

  const startMessaging = (profile) => {
    dispatchGlobal(setMessageReceiver(profile));
  };

  useEffect(() => {
    if (matchFilters.loading === null) {
      refreshMatchs();
    }
    console.log("tintin");
  }, [matchFilters, refreshMatchs]);
  //do not remove the empty bracket, or you will cause an infinite loop

  return (
    <div className="row">
      <div className="justify-content-center col-8 matches-containter gap-3">
        <form className="col-12 d-flex flex-column gap-3" onSubmit={refreshMatchs}>
          <div className="form-group">
            <label htmlFor="">Unit</label>
            <select name="distanceUnit" id="" onChange={(e) => dispatchLocal({ type: "set_unit", payload: e.target.value })}>
              <option value="km">Km</option>
              <option value="mi">Mi</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="">
              Distance ({matchFilters.distanceUnit}): {matchFilters.distanceInKm}
            </label>
            <input type="range" min="1" max="30" value={matchFilters.distanceInKm} onChange={(e) => dispatchLocal({ type: "set_distance", payload: Number(e.target.value) })} />
          </div>

          <button type="submit" className="btn btn-primary flex-none text-nowrap">
            get matches
          </button>

          <div>{matchFilters.loading ? "Loading..." : <div>Matches {profiles?.length}</div>}</div>
        </form>

        <div className="profiles d-flex flex-column gap-5 col">
          {profiles?.map((profile) => (
            <div className="d-flex profile-item h-300 bg-white text-align-left p-3 rounded-3" key={profile.id} style={{ minHeight: "300px" }}>
              <div className="profile-content w-75 flex-grow text-black w-100 d-flex flex-column align-items-start">
                <div className="profile-header">
                  <h2 className="p-l-0 fs-5 d-inline">{profile.first_name + " " + profile.last_name} </h2>
                  <button className="btn btn-fab  align-self-center ms-auto" onClick={() => startMessaging(profile)}>
                    <i className="fa-regular fa-envelope fs-3"></i>
                  </button>

                  <button className="btn btn-fab">
                    <i className="fa fa-truck fs-3" aria-hidden="true"></i>
                  </button>
                </div>
                <span>{profile.age}.</span>
                <span>{profile.bio}.</span>
                <span>{profile.school?.name}</span>

                <div className="attributes d-flex gap-2 pt-3 flex-wrap">
                  <button className="btn btn-outline-primary rounded-5 fs-6 ">Lorem, ipsum dolor.</button>
                  <button className="btn btn-outline-primary rounded-5 fs-6 ">Lorem, ipsum dolor.</button>
                  <button className="btn btn-outline-primary rounded-5 fs-6 " disabled>
                    Lorem, ipsum dolor.
                  </button>
                  <button className="btn btn-outline-primary rounded-5 fs-6 " disabled>
                    Lorem, ipsum dolor.
                  </button>
                  <button className="btn btn-outline-primary rounded-5 fs-6 " disabled>
                    Lorem, ipsum dolor.
                  </button>
                  <button className="btn btn-outline-primary rounded-5 fs-6 " disabled>
                    Lorem, ipsum dolor.
                  </button>
                  <button className="btn btn-outline-primary rounded-5 fs-6 " disabled>
                    Lorem, ipsum dolor.
                  </button>
                  <button className="btn btn-outline-primary rounded-5 fs-6 ">Lorem, ipsum dolor.</button>
                  <button className="btn btn-outline-primary rounded-5 fs-6 ">Lorem, ipsum dolor.</button>
                </div>
              </div>

              <div className="profile-img w-25">
                <img
                  src={(profile.image?.length && profile.image) ?? "https://ionicframework.com/docs/img/demos/avatar.svg"}
                  alt="profilee"
                  className="flex-none rounded img-responsive w-100 h-100 object-fit-cover"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {messageReceiver && (
        <div className="col-4 chats-container">
          Chats
          <ErrorBoundary fallback={<p>Error occured with child component</p>}>
            <Messages />
          </ErrorBoundary>
        </div>
      )}
    </div>
  );
};

export default Match;
