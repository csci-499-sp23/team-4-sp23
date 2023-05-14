import { useCallback, useEffect, useReducer, useState } from "react";
//import { getProfiles } from "../../firebase";

import { ErrorBoundary } from "react-error-boundary";
import { useDispatch } from "react-redux";
import { functionsApi } from "../../firebase";
import { setMessageReceiver } from "../../services/appSlice";
import { useMessageReceiver } from "../../services/selectors";
import Messages from "../Messages";
import { MatchFilter } from "../MatchFilter";

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
  const [profiles, setProfiles] = useState(/** @type {import('../../../index.d.ts').Student[]}*/ ([]));
  const [matchFilters, dispatchLocal] = useReducer(matchReducer, { distanceInKm: 5, distanceUnit: "mi", loading: null });
  const [filterPairs, setFilterPairs] = useState([]);

  const refreshMatchs = useCallback(
    (e) => {
      if (e) {
        e.preventDefault();
      }

      dispatchLocal({ type: "isLoading" });
      setProfiles([]);
      functionsApi
        .getMatches({ distanceInKm: matchFilters.distanceInKm * (/mi/i.test(matchFilters.distanceUnit) ? 1.6 : 1) })
        .then(async (response) => {
          let { data: matches } = response.data;
          //fetch surveyResponses for this match
          // matches = matches.map(async (match) => ({ ...match, survey_responses: await functionsApi.getStudentSurveyResponses(match.id) }));
          const surveyResponses = await Promise.all(matches.map(async (match) => ({ ...match, survey: await functionsApi.getStudentSurveyResponses(match.id) })));
          console.log({ sureveyResponses: surveyResponses });
          setProfiles(surveyResponses);
        })
        .catch(console.error)
        .finally(() => dispatchLocal({ type: "loadingComplete" }));
    },
    [matchFilters]
  );

  const getSurvey = (profile) => /** @type {import('../../../index').ProfileSurvey} */ (profile?.survey);

  const startMessaging = (profile) => {
    dispatchGlobal(setMessageReceiver(profile));
  };

  const passesFilter = (/** @type {import("../../../index.d.ts").QuestionAnswer} */ response, presentable) => {
    const result = {};
    //add disabled tot he result object if question_code:answer_code not in filter pairs
    const testKey = `${response.question_code}:${response.answer_code}`;
    const foundPair = filterPairs.find((fp) => fp === testKey);
    if (!presentable && !foundPair) {
      result["disabled"] = true;
    } else {
      result["classes"] = "bg-primary text-white";
    }
    return result;
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
          <MatchFilter onChange={setFilterPairs} />
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
                  {getSurvey(profile)?.responses?.map((res) => (
                    <button
                      className={
                        passesFilter(res)?.classes +
                        " btn btn-outline-primary rounded-5 fs-6 btn-xs text-align-left text-left" +
                        (getSurvey(profile).questions[res.question_code].presentable ? "show bg-primary text-white" : "d-nones")
                      }
                      title={getSurvey(profile).questions[res.question_code].question}
                      {...passesFilter(res, getSurvey(profile).questions[res.question_code].presentable)}
                    >
                      <span>
                        {getSurvey(profile).options[res.answer_code].answer}: {getSurvey(profile).questions[res.question_code].question}
                      </span>
                    </button>
                  ))}
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
