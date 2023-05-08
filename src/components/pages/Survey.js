import React, { useState, useEffect } from 'react';
import Question from './Questions';
import { collection, onSnapshot, query, where, getDocs, addDoc, deleteDoc, doc } from "firebase/firestore";
import { db } from "../../firebase-config";
import { useUserSelector } from "../../services/selectors";

function Survey() {
  const user = useUserSelector();
  const [studentData, setStudentData] = useState(null);
  const [answersData, setAnswersData] = useState([]);
  const qaCollectionRef = collection(db, "question_answers");
  // eslint-disable-next-line
  const [surveyData, setSurveyData] = useState([]);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Define state for answers
  const [answers, setAnswers] = useState({
    hasLicense: null,
    vehicleType: null,
    universityYear: null,
    carSick: null,
    frequentStops: null,
    silentRide: null,
    roadsideClub: null,
    personalityTraits: [],
  });

  useEffect(() => {
    const fetchAnswers = async () => {
      const answersRef = collection(db, "surv_answers");
      try {
        const data = await getDocs(answersRef);
        const filteredData = data.docs.map((doc) => ({
          ...doc.data(), id: doc.id
        }));
        setAnswersData(filteredData);
      } catch(err) {
        console.error(err);
      }
    };
    
    fetchAnswers();
  }, []);

  useEffect(() => {
    setSurveyData([]);
    if (user?.email) {
      const studentRef = query(collection(db, "students"), where("email", "==", user.email));
      

      const unsubscribe = onSnapshot(studentRef, (snapshot) => {
        const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setStudentData(data);
      });

      return () => {
        unsubscribe();
      };
    }
  }, [user]);

  useEffect(() => {
    if (user?.email && studentData && surveyData.length === 0) {
      const surveyRef = query(collection(db, "question_answers"), where("user_id", "==", studentData[0].id));
    
      const unsubscribe = onSnapshot(surveyRef, (snapshot) => {
        const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        if(data.length > 0) {
          setIsSubmitted(true);
        } else {
          setIsSubmitted(false);
        }
        for(let j = 0; j < data.length; j++) {
          for(let i = 0; i < answersData.length; i++) {
            if(data[j].question_code === 309) {
              if(data[j].answer_code === answersData[i].answer_code) {
                surveyData.push(data[j]);
                answers.hasLicense = answersData[i].answer;
              }
            } 
            if(data[j].question_code === 301) {
              if(data[j].answer_code === answersData[i].answer_code) {
                surveyData.push(data[j]);
                answers.carSick = answersData[i].answer;
              }
            } 
            if(data[j].question_code === 302) {
              if(data[j].answer_code === answersData[i].answer_code) {
                surveyData.push(data[j]);
                answers.universityYear = answersData[i].answer;
              }
            }
            if(data[j].question_code === 304) {
              if(data[j].answer_code === answersData[i].answer_code) {
                surveyData.push(data[j]);
                answers.silentRide = answersData[i].answer;
              }
            }
            if(data[j].question_code === 305) {
              if(data[j].answer_code === answersData[i].answer_code) {
                surveyData.push(data[j]);
                answers.roadsideClub = answersData[i].answer;
              }
            }
            if(data[j].question_code === 306) {
              if(data[j].answer_code === answersData[i].answer_code) {
                surveyData.push(data[j]);
                answers.frequentStops = answersData[i].answer;
              }
            }
            if(data[j].question_code === 310) {
              if(data[j].answer_code === answersData[i].answer_code && answers.personalityTraits.length < 3) {
                surveyData.push(data[j]);
                answers.personalityTraits.push(answersData[i].answer);
              }
            } 
            if(data[j].question_code === 308) {
              if(data[j].answer_code === answersData[i].answer_code) {
                surveyData.push(data[j]);
                answers.vehicleType = answersData[i].answer;
              }
            }
          }
        }
        
      });
  
      return () => {
        unsubscribe();
      };
    }
  
  }, [user, studentData, answersData, answers, surveyData]);
  

  const displaySurvey = () => {  
    if (isSubmitted && (user?.email) &&
      (answers.hasLicense !== null ||
      answers.vehicleType !== null ||
      answers.universityYear !== null ||
      answers.carSick !== null ||
      answers.frequentStops !== null ||
      answers.silentRide !== null ||
      answers.roadsideClub !== null ||
      answers.personalityTraits.length !== 0)
     ) {
      return (
        <div>
          <div><p>Do you have a driver's license? {answers.hasLicense}</p></div>
          <div><p>What type of vehicle are you interested in renting? {answers.vehicleType}</p></div>
          <div><p>What year of university are you entering? {answers.universityYear}</p></div>
          <div><p>Do you get car sick? {answers.carSick}</p></div>
          <div><p>Are you someone who has to make frequent stops? (i.e. bathroom breaks, food stops, etc.) {answers.frequentStops}</p></div>
          <div><p>Do you prefer a silent car ride? {answers.silentRide}</p></div>
          <div><p>Are you a member of a Roadside Assistance Club? (e.g. AAA, AARP, etc.) {answers.roadsideClub}</p></div>
          <div>
            <p>Which of the following describe you best? (Select up to 3)
            </p>
              {answers.personalityTraits.map((trait) => (
                  <p>{trait}</p>
              ))}
          </div>
          <button class="btn btn-primary" onClick={clearSurvey}>
            Redo Survey
          </button>
          <br />
          <br />
          <a className="btn btn-primary btn-lg" href="match">Find Matches!</a>
        </div>
      );
    } else {
      return (
        <div>
          <form>
            <Question
              question="Do you have a driver's license?"
              options={['Yes', 'No']}
              handleChange={(answer) => handleChange('hasLicense', answer)}
            />
            <Question
              question="What type of vehicle are you interested in renting?"
              options={['Sedan', 'SUV', 'Minivan', 'Van', ]}
              handleChange={(answer) => handleChange('vehicleType', answer)}
            />
            <Question
              question="What year of university are you entering?"
              options={['Freshman', 'Sophomore', 'Junior', 'Senior']}
              handleChange={(answer) => handleChange('universityYear', answer)}
            />
            <Question
              question="Do you get car sick?"
              options={['Yes', 'No']}
              handleChange={(answer) => handleChange('carSick', answer)}
            />
            <Question
              question="Are you someone who has to make frequent stops? (i.e. bathroom breaks, food stops, etc.)"
              options={['Yes', 'No']}
              handleChange={(answer) => handleChange('frequentStops', answer)}
            />
            <Question
              question="Do you prefer a silent car ride?"
              options={['Yes', 'No']}
              handleChange={(answer) => handleChange('silentRide', answer)}
            />
            <Question
              question="Are you a member of a Roadside Assistance Club? (e.g. AAA, AARP, etc.)"
              options={['Yes', 'No']}
              handleChange={(answer) => handleChange('roadsideClub', answer)}
            />
            <Question
              question="Which of the following describe you best? (Select up to 3)"
              options={[  "Adventurous", "Artistic",  "Assertive",  "Charismatic",  "Confident",  "Creative",  "Curious",  "Dependable",  "Determined",  "Efficient",  "Empathetic",  "Energetic",  "Enthusiastic", "Generous", "Humorous", "Intelligent", "Motivated",  "Organized",  "Outgoing",  "Patient", "Proactive",  "Reliable", "Responsible", "Spontaneous", "Trustworthy"]}
              handleChange={(answer) => handleChange('personalityTraits', answer)}
              maxOptions={3}
            />
          </form>
          <button className="btn btn-primary" onClick={handleSubmit}>Submit</button>
        </div>
      );
    }
  };

  const clearSurvey = async () => {
    const q = query(
      qaCollectionRef,
      where('user_id', '==', studentData[0].id)
    );
  
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((docSnapshot) => {
      deleteDoc(doc(qaCollectionRef, docSnapshot.id));
    });

    answers.hasLicense = null;
    answers.vehicleType = null;
    answers.universityYear = null;
    answers.carSick = null;
    answers.frequentStops = null;
    answers.silentRide = null;
    answers.roadsideClub = null;
    answers.personalityTraits = [];
    setIsSubmitted(false);
  };
  
  // Define handleChange function to update answers state
  const handleChange = (question, answer) => {
    if (question === 'personalityTraits' && answer.length !== 3) {
      return;
    }
    
    setAnswers((prevAnswers) => ({
      ...prevAnswers,
      [question]: answer,
    }));
  };

  const handleSubmit = async (event) => {
    // Define a mapping of answer values to their respective answer codes
    const answerCodes = {
      'Yes': 44410,
      'No': 44402,
      'A Sedan': 44416,
      'A SUV': 44413,
      'A Minivan': 44415,
      'A Van': 44414,
      'Freshman': 44406,
      'Sophomore': 44405,
      'Junior': 44403,
      'Senior': 44404,
    };
  
    const personalityTraitsCodes = {
      'Adventurous': 44417,
      'Artistic': 44418,
      'Assertive': 44419,
      'Charismatic': 44420,
      'Confident': 44421,
      'Creative': 44422,
      'Curious': 44423,
      'Dependable': 44424,
      'Determined': 44425,
      'Efficient': 44426,
      'Empathetic': 44427,
      'Energetic': 44428,
      'Enthusiastic': 44429,
      'Generous': 44430,
      'Humorous': 44431,
      'Intelligent': 44432,
      'Motivated': 44433,
      'Organized': 44434,
      'Outgoing': 44435,
      'Patient': 44436,
      'Proactive': 44437,
      'Reliable': 44438,
      'Responsible': 44439,
      'Spontaneous': 44440,
      'Trustworthy': 44441
    } 

    // Loop through the answers object
    for (const [key, value] of Object.entries(answers)) {
      if (key === 'personalityTraits') {
        for (let i = 0; i < value.length; i++) {
          const answerCode = personalityTraitsCodes[value[i]];
          await addDoc(qaCollectionRef, { question_code: 310, answer_code: answerCode, user_id: studentData[0].id });
        }
      } else {
        const questionCodeMapping = {
          hasLicense: 309,
          vehicleType: 308,
          universityYear: 302,
          carSick: 301,
          frequentStops: 306,
          silentRide: 304,
          roadsideClub: 305,
        };
  
        const questionCode = questionCodeMapping[key];
        const answerCode = answerCodes[value];
  
        if (questionCode && answerCode) {
          await addDoc(qaCollectionRef, { question_code: questionCode, answer_code: answerCode, user_id: studentData[0].id });
        }
      }
    }
  
    setIsSubmitted(true);
  };

  return (
    <div className="survey-container">
      <h2>Survey</h2>
      {displaySurvey()}
    </div>
  );
}

export default Survey;