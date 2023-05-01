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
  }, [answersData]);

  useEffect(() => {
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
    if (user?.email && studentData) {
      
      const surveyRef = query(collection(db, "question_answers"), where("user_id", "==", studentData[0].id));
    
      const unsubscribe = onSnapshot(surveyRef, (snapshot) => {
        const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        if(data.length > 0) {
          setIsSubmitted(true);
        }
        for(let j = 0; j < answersData.length; j++) {
          for(let i = 0; i < data.length; i++) {
            if(data[i].question_code === 309) {
              surveyData.push(data[i]);
              if(data[i].answer_code === answersData[j].answer_code) {
                answers.hasLicense = answersData[j].answer;
              }
            } 
            if(data[i].question_code === 301) {
              surveyData.push(data[i]);
              if(data[i].answer_code === answersData[j].answer_code) {
                answers.carSick = answersData[j].answer;
              }
            } 
            if(data[i].question_code === 302) {
              surveyData.push(data[i]);
              if(data[i].answer_code === answersData[j].answer_code) {
                answers.universityYear = answersData[j].answer;
              }
            }
            if(data[i].question_code === 304) {
              surveyData.push(data[i]);
              if(data[i].answer_code === answersData[j].answer_code) {
                answers.silentRide = answersData[j].answer;
              }
            }
            if(data[i].question_code === 305) {
              surveyData.push(data[i]);
              if(data[i].answer_code === answersData[j].answer_code) {
                answers.roadsideClub = answersData[j].answer;
              }
            }
            if(data[i].question_code === 306) {
              surveyData.push(data[i]);
              if(data[i].answer_code === answersData[j].answer_code) {
                answers.frequentStops = answersData[j].answer;
              }
            }
            if(data[i].question_code === 310) {
              surveyData.push(data[i]);
              if(data[i].answer_code === answersData[j].answer_code && answers.personalityTraits.length < 3) {
                answers.personalityTraits.push(answersData[j].answer);
              }
            } 
            if(data[i].question_code === 308) {
              if(data[i].answer_code === answersData[j].answer_code) {
                answers.vehicleType = answersData[j].answer;
              }
            }
          }
        }
      });
  
      return () => {
        unsubscribe();
      };
    }
  
  }, [user, studentData, answers, answersData, surveyData]);
  

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
        </div>
      );
    } else {
      return (
        <div>
          <form>
            <Question
              question="Do you have a driver's license?"
              options={['Yes, I have my license', 'No, I dont have my license']}
              handleChange={(answer) => handleChange('hasLicense', answer)}
            />
            <Question
              question="What type of vehicle are you interested in renting?"
              options={['A Sedan', 'A SUV', 'A Minivan', 'A Van', ]}
              handleChange={(answer) => handleChange('vehicleType', answer)}
            />
            <Question
              question="What year of university are you entering?"
              options={['Freshman', 'Sophomore', 'Junior', 'Senior']}
              handleChange={(answer) => handleChange('universityYear', answer)}
            />
            <Question
              question="Do you get car sick?"
              options={['Yes, I get car sick', 'No, I dont get car sick']}
              handleChange={(answer) => handleChange('carSick', answer)}
            />
            <Question
              question="Are you someone who has to make frequent stops? (i.e. bathroom breaks, food stops, etc.)"
              options={['Yes, I need to make frequent stops', 'No, I dont need to make frequent stops']}
              handleChange={(answer) => handleChange('frequentStops', answer)}
            />
            <Question
              question="Do you prefer a silent car ride?"
              options={['Yes, I prefer a silent car ride', 'No, I dont prefer a silent car ride']}
              handleChange={(answer) => handleChange('silentRide', answer)}
            />
            <Question
              question="Are you a member of a Roadside Assistance Club? (e.g. AAA, AARP, etc.)"
              options={['Yes, I am a member of a Roadside Assistance Club', 'No, I am not a member of a Roadside Assistance Club']}
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
    setIsSubmitted(false);
    for(let i = 0; i < surveyData.length; i++) {
      const qaDoc = doc(db, "question_answers", surveyData[i].id)
      await deleteDoc(qaDoc);
    }
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
    setIsSubmitted(true);

    // eslint-disable-next-line
    if(answers.hasLicense == "Yes, I have my license") {
      await addDoc(qaCollectionRef, { question_code: 309, answer_code: 44410, user_id: studentData[0].id });
      // eslint-disable-next-line
    } else if(answers.hasLicense == "No, I dont have my license") {
      await addDoc(qaCollectionRef, { question_code: 309, answer_code: 44402, user_id: studentData[0].id });
    }

    // eslint-disable-next-line
    if(answers.vehicleType == 'A Sedan') {
      await addDoc(qaCollectionRef, { question_code: 308, answer_code: 44416, user_id: studentData[0].id });
      // eslint-disable-next-line
    } else if(answers.hasLicense == 'A SUV') {
      await addDoc(qaCollectionRef, { question_code: 308, answer_code: 44413, user_id: studentData[0].id });
      // eslint-disable-next-line
    } else if(answers.hasLicense == 'A Minivan') {
      await addDoc(qaCollectionRef, { question_code: 308, answer_code: 44415, user_id: studentData[0].id });
      // eslint-disable-next-line
    } else if(answers.hasLicense == 'A Van') {
      await addDoc(qaCollectionRef, { question_code: 308, answer_code: 44414, user_id: studentData[0].id });
    }

    // eslint-disable-next-line
    if(answers.universityYear == 'Freshman') {
      await addDoc(qaCollectionRef, { question_code: 308, answer_code: 44406, user_id: studentData[0].id });
      // eslint-disable-next-line
    } else if(answers.hasLicense == 'Sophomore') {
      await addDoc(qaCollectionRef, { question_code: 308, answer_code: 44405, user_id: studentData[0].id });
      // eslint-disable-next-line
    } else if(answers.hasLicense == 'Junior') {
      await addDoc(qaCollectionRef, { question_code: 308, answer_code: 44403, user_id: studentData[0].id });
      // eslint-disable-next-line
    } else if(answers.hasLicense == 'Senior') {
      await addDoc(qaCollectionRef, { question_code: 308, answer_code: 44404, user_id: studentData[0].id });
    }

    // eslint-disable-next-line
    if(answers.carSick == 'Yes, I get car sick') {
      await addDoc(qaCollectionRef, { question_code: 301, answer_code: 44410, user_id: studentData[0].id });
      // eslint-disable-next-line
    } else if (answers.carSick == "No, I dont get car sick") {
      await addDoc(qaCollectionRef, { question_code: 301, answer_code: 44402, user_id: studentData[0].id });
    }

    // eslint-disable-next-line
    if(answers.frequentStops == 'Yes, I need to make frequent stops') {
      await addDoc(qaCollectionRef, { question_code: 306, answer_code: 44410, user_id: studentData[0].id });
      // eslint-disable-next-line
    } else if(answers.frequentStops == "No, I dont need to make frequent stops") {
      await addDoc(qaCollectionRef, { question_code: 306, answer_code: 44402, user_id: studentData[0].id });
    }

    // eslint-disable-next-line
    if(answers.silentRide == 'Yes, I prefer a silent car ride') {
      await addDoc(qaCollectionRef, { question_code: 304, answer_code: 44410, user_id: studentData[0].id });
      // eslint-disable-next-line
    } else if(answers.silentRide == "No, I dont prefer a silent car ride"){
      await addDoc(qaCollectionRef, { question_code: 304, answer_code: 44402, user_id: studentData[0].id });
    }

    // eslint-disable-next-line
    if(answers.roadsideClub == 'Yes, I am a member of a Roadside Assistance Club') {
      await addDoc(qaCollectionRef, { question_code: 305, answer_code: 44410, user_id: studentData[0].id });
      // eslint-disable-next-line
    } else if(answers.roadsideClub == "No, I am not a member of a Roadside Assistance Club") {
      await addDoc(qaCollectionRef, { question_code: 305, answer_code: 44402, user_id: studentData[0].id });
    }

    for(let i = 0; i < answers.personalityTraits.length; i++) {
      // eslint-disable-next-line
      if(answers.personalityTraits[i] == 'Adventurous') {
        await addDoc(qaCollectionRef, { question_code: 310, answer_code: 44417, user_id: studentData[0].id });
        // eslint-disable-next-line
      } else if (answers.personalityTraits[i] == 'Artistic') {
        await addDoc(qaCollectionRef, { question_code: 310, answer_code: 44418, user_id: studentData[0].id });
        // eslint-disable-next-line
      } else if (answers.personalityTraits[i] == 'Assertive') {
        await addDoc(qaCollectionRef, { question_code: 310, answer_code: 44419, user_id: studentData[0].id });
        // eslint-disable-next-line
      } else if (answers.personalityTraits[i] == 'Charismatic') {
        await addDoc(qaCollectionRef, { question_code: 310, answer_code: 44420, user_id: studentData[0].id });
        // eslint-disable-next-line
      } else if (answers.personalityTraits[i] == 'Confident') {
        await addDoc(qaCollectionRef, { question_code: 310, answer_code: 44421, user_id: studentData[0].id });
        // eslint-disable-next-line
      } else if (answers.personalityTraits[i] == 'Creative') {
        await addDoc(qaCollectionRef, { question_code: 310, answer_code: 44422, user_id: studentData[0].id });
        // eslint-disable-next-line
      } else if (answers.personalityTraits[i] == 'Curious') {
        await addDoc(qaCollectionRef, { question_code: 310, answer_code: 44423, user_id: studentData[0].id });
        // eslint-disable-next-line
      } else if (answers.personalityTraits[i] == 'Dependable') {
        await addDoc(qaCollectionRef, { question_code: 310, answer_code: 44424, user_id: studentData[0].id });
        // eslint-disable-next-line
      } else if (answers.personalityTraits[i] == 'Determined') {
        await addDoc(qaCollectionRef, { question_code: 310, answer_code: 44425, user_id: studentData[0].id });
        // eslint-disable-next-line
      } else if (answers.personalityTraits[i] == 'Efficient') {
        await addDoc(qaCollectionRef, { question_code: 310, answer_code: 44426, user_id: studentData[0].id });
        // eslint-disable-next-line
      } else if (answers.personalityTraits[i] == 'Empathetic') {
        await addDoc(qaCollectionRef, { question_code: 310, answer_code: 44427, user_id: studentData[0].id });
        // eslint-disable-next-line
      } else if (answers.personalityTraits[i] == 'Energetic') {
        await addDoc(qaCollectionRef, { question_code: 310, answer_code: 44428, user_id: studentData[0].id });
        // eslint-disable-next-line
      } else if (answers.personalityTraits[i] == 'Enthusiastic') {
        await addDoc(qaCollectionRef, { question_code: 310, answer_code: 44429, user_id: studentData[0].id });
        // eslint-disable-next-line
      } else if (answers.personalityTraits[i] == 'Generous') {
        await addDoc(qaCollectionRef, { question_code: 310, answer_code: 44430, user_id: studentData[0].id });
        // eslint-disable-next-line
      } else if (answers.personalityTraits[i] == 'Humorous') {
        await addDoc(qaCollectionRef, { question_code: 310, answer_code: 44431, user_id: studentData[0].id });
        // eslint-disable-next-line
      } else if (answers.personalityTraits[i] == 'Intelligent') {
        await addDoc(qaCollectionRef, { question_code: 310, answer_code: 44432, user_id: studentData[0].id });
        // eslint-disable-next-line
      } else if (answers.personalityTraits[i] == 'Motivated') {
        await addDoc(qaCollectionRef, { question_code: 310, answer_code: 44433, user_id: studentData[0].id });
        // eslint-disable-next-line
      } else if (answers.personalityTraits[i] == 'Organized') {
        await addDoc(qaCollectionRef, { question_code: 310, answer_code: 44434, user_id: studentData[0].id });
        // eslint-disable-next-line
      } else if (answers.personalityTraits[i] == 'Outgoing') {
        await addDoc(qaCollectionRef, { question_code: 310, answer_code: 44435, user_id: studentData[0].id });
        // eslint-disable-next-line
      } else if (answers.personalityTraits[i] == 'Patient') {
        await addDoc(qaCollectionRef, { question_code: 310, answer_code: 44436, user_id: studentData[0].id });
        // eslint-disable-next-line
      } else if (answers.personalityTraits[i] == 'Proactive') {
        await addDoc(qaCollectionRef, { question_code: 310, answer_code: 44437, user_id: studentData[0].id });
        // eslint-disable-next-line
      } else if (answers.personalityTraits[i] == 'Reliable') {
        await addDoc(qaCollectionRef, { question_code: 310, answer_code: 44438, user_id: studentData[0].id });
        // eslint-disable-next-line
      } else if (answers.personalityTraits[i] == 'Responsible') {
        await addDoc(qaCollectionRef, { question_code: 310, answer_code: 44439, user_id: studentData[0].id });
        // eslint-disable-next-line
      } else if (answers.personalityTraits[i] == 'Spontaneous') {
        await addDoc(qaCollectionRef, { question_code: 310, answer_code: 44440, user_id: studentData[0].id });
        // eslint-disable-next-line
      } else if (answers.personalityTraits[i] == 'Trustworthy') {
        await addDoc(qaCollectionRef, { question_code: 310, answer_code: 44441, user_id: studentData[0].id });
      }
    }
  }

  return (
    <div className="survey-container">
      <h2>Survey</h2>
      {displaySurvey()}
    </div>
  );
}

export default Survey;