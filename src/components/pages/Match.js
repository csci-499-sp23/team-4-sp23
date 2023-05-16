import { useCallback, useEffect, useMemo, useReducer, useState } from "react";
//import { getProfiles } from "../../firebase";

import { Button, Card, Col, Modal, Row, Spinner, Stack, ToggleButton, ToggleButtonGroup } from "react-bootstrap";
import Form from "react-bootstrap/Form";
import { ErrorBoundary } from "react-error-boundary";
import { useDispatch } from "react-redux";
import { functionsApi } from "../../firebase";
import { useHostProfileInitialize } from "../../services/accountService";
import { setMessageReceiver } from "../../services/appSlice";
import useAppSelector, { useMessageReceiver } from "../../services/selectors";
import { MatchFilter } from "../MatchFilter";
import Messages from "../Messages";
import RentalMap from "./RentalMap";

// const getProfiles = () => demo_profiles;
const matchReducer = (state, action) => {
  let result;
  console.log({ action, state });
  switch (action.type) {
    case "set_distance":
      result = { ...state, distanceInKm: action.payload };
      break;
    case "set_unit":
      result = { ...state, distanceUnit: action.payload };
      break;
    case "isLoading":
      result = {
        ...state,
        loading: true,
      };
      break;
    case "loadingComplete": {
      result = { ...state, loading: false };
      break;
    }
    default: {
    }
  }
  localStorage.setItem("match.store", JSON.stringify(result));
  return result;
};

const distanceInKm = parseInt(JSON.parse(localStorage.getItem("match.store") ?? "{}")?.distanceInKm ?? 5);

const Match = () => {
  const dispatchGlobal = useDispatch();
  const { hostProfile } = useAppSelector();
  const { updateProfile } = useHostProfileInitialize();
  const messageReceiver = useMessageReceiver();
  const [profiles, setProfiles] = useState(/** @type {import('../../../index.d.ts').Student[]}*/ ([]));
  const [matchFilters, dispatchLocal] = useReducer(matchReducer, { distanceInKm, distanceUnit: "mi", loading: null });
  const [rentalMapGuestProfile, setRentalMapGuestProfile] = useState(null);
  const [filterPairs, setFilterPairs] = useState([]);

  const refreshMatchs = useCallback(
    (e = null) => {
      if (e) {
        e.preventDefault();
      }
      setProfiles([]);

      if (!hostProfile?.value?.can_match) {
        return;
      }

      dispatchLocal({ type: "isLoading" });
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
    [matchFilters, hostProfile]
  );

  const getSurvey = (profile) => /** @type {import('../../../index').ProfileSurvey} */ (profile?.survey);

  const startMessaging = (profile) => {
    dispatchGlobal(setMessageReceiver(profile));
  };

  const passesFilter = (/** @type {import("../../../index.d.ts").QuestionAnswer} */ response, presentable = false) => {
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

  const clearRentalMapGuestProfile = () => setRentalMapGuestProfile(null);

  const setCanMatch = (value) => updateProfile("can_match", value);

  useEffect(() => {
    if (matchFilters.loading === null) {
      refreshMatchs();
      // dispatchGlobal(setHostProfile({ street_add: "wall street", state: "ny", zip: 10467 }));
    }
    console.log("tintin");
  }, [matchFilters, refreshMatchs]);
  //do not remove the empty bracket, or you will cause an infinite loop

  return (
    <div className="row">
      <h2 className="text-center">Your Matches</h2>
      <div className="justify-content-center col-8 matches-containter gap-3">
        <form className="col-12 d-flex flex-column gap-3" onSubmit={refreshMatchs}>
          <div className="form-group d-flex gap-3 justify-content-start align-items-center">
            <label htmlFor="">
              Distance {matchFilters.distanceInKm}:
              <select name="distanceUnit" id="" onChange={(e) => dispatchLocal({ type: "set_unit", payload: e.target.value })}>
                <option value="km">Km</option>
                <option value="mi">Mi</option>
              </select>
              :
            </label>

            <input type="range" min="1" max="30" value={matchFilters.distanceInKm} onChange={(e) => dispatchLocal({ type: "set_distance", payload: Number(e.target.value) })} />

            <button type="submit" className="btn btn-primary flex-none text-nowrap" style={{ width: "140px" }} disabled={!hostProfile?.value?.can_match}>
              View Matches
            </button>
          </div>

          <div>
            {matchFilters.loading ? (
              <Spinner />
            ) : (
              <div className="d-flex gap-3 align-items-center pb-3">
                Matches {profiles?.length} <MatchFilter onChange={setFilterPairs} />
                <Form>
                  <Form.Switch checked={hostProfile?.value?.can_match} name="can_match" label={"Can Match"} onChange={(e) => setCanMatch(e.target.checked)}></Form.Switch>
                </Form>
              </div>
            )}
          </div>
        </form>

        <div className="profiles d-flex flex-column gap-5 col">
          {hostProfile?.value?.can_match &&
            profiles?.map((profile) => (
              <Card className="d-flex profile-item h-300 bg-white text-align-left p-3 rounded-3" key={profile.id} style={{ minHeight: "300px" }}>
                <Card.Body>
                  <Row className="p-0">
                    <Col xs={12} md={6} className="profile-img position-relative">
                      <div className="profile-header p-2">
                        <h2 className="p-l-0 fs-5 d-inline">{profile.first_name + " " + profile.last_name} </h2>
                        <button className="btn btn-fab  align-self-center ms-auto" onClick={() => startMessaging(profile)}>
                          <i className="fa-regular fa-envelope fs-3"></i>
                        </button>

                        <button className="btn btn-fab" onClick={() => setRentalMapGuestProfile(profile)}>
                          <i className="fa fa-truck fs-3" aria-hidden="true"></i>
                        </button>
                      </div>
                      <div className="profile-img-container" style={{ height: "calc( 100% - 45px )" }}>
                        <img
                          height="400px"
                          src={(profile.image?.length && profile.image) ?? "https://ionicframework.com/docs/img/demos/avatar.svg"}
                          alt="profilee"
                          className="flex-none rounded img-responsive w-100 h-100 object-fit-cover"
                        />
                      </div>
                    </Col>
                    <Col md={6} className="profile-content flex-grow text-black d-flex flex-column align-items-start">
                      <BioSurveyView
                        bio={
                          <div className="profile-bio">
                            <span>{profile.age}.</span>
                            <span>{profile.bio}.</span>
                            <span>{profile.school?.name}</span>
                          </div>
                        }
                        survey={
                          <Stack direction="vertical">
                            <div className="profile-survey-responses attributes d-flex gap-2 pt-3 flex-wrap">
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
                          </Stack>
                        }
                      />
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            ))}

          {hostProfile?.value?.can_match && rentalMapGuestProfile && (
            <Modal show={rentalMapGuestProfile !== null} onClose={clearRentalMapGuestProfile} size="xl">
              <Modal.Header>
                <Button onClick={clearRentalMapGuestProfile}>
                  <i className="fa fa-close"></i>
                </Button>
              </Modal.Header>
              <Modal.Body>
                <ErrorBoundary fallback={<p>RentalMap faialed to load</p>}>
                  <RentalMap initialRadius={distanceInKm} guestStudent={rentalMapGuestProfile} hostStudent={hostProfile?.value} />
                </ErrorBoundary>
              </Modal.Body>
            </Modal>
          )}

        </div>
      </div>

      {messageReceiver && (
        <div className="col-4 chats-container">
          Chat
          <ErrorBoundary fallback={<p>Error occured with child component</p>}>
            <Messages />
          </ErrorBoundary>
        </div>
      )}
    </div>
  );
};

export default Match;

function BioSurveyView({ bio, survey }) {
  const [selectedView, setSelectedView] = useState(bio);

  // const views = useMemo(() => ({ bio, survey }), [bio, survey]);
  // const viewTemplate = views[selectedView];

  const doChange = (val) => setSelectedView(val);
  const randomTag = useMemo(() => crypto.randomUUID(), []);

  return (
    <Stack direction="vertical">
      <div className="toggle-buttons rounded-5 d-flex justify-content-center bg-primary mb-3">
        <ToggleButtonGroup type="radio" name="selectView" value={selectedView} onChange={doChange}>
          <ToggleButton id={"bio-btn" + randomTag} value={bio} className={selectedView === bio ? "bg-success text-light" : ""}>
            Bio
          </ToggleButton>
          <ToggleButton id={"survey-btn" + randomTag} value={survey} className={selectedView === survey ? "bg-success text-light" : ""}>
            Survey
          </ToggleButton>
        </ToggleButtonGroup>
      </div>

      {selectedView}
    </Stack>
  );
}
