import React, { useState } from 'react';
import Question from './Questions';

function Survey() {
  // Define state for answers
  const [answers, setAnswers] = useState({
    hasLicense: null,
    vehicleType: null,
    universityYear: null,
    carSick: null,
    frequentStops: null,
    silentRide: null,
    roadsideClub: null,
  });

  // Define handleChange function to update answers state
  const handleChange = (question, answer) => {
    setAnswers((prevAnswers) => ({
      ...prevAnswers,
      [question]: answer,
    }));
  };

  return (
    <div className="survey-container">
      <h1>Survey</h1>
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
          question="Are you someone who has to make frequent stops? (i.e. bathroom breaks, food stops)"
          options={['Yes, I need to make frequent stops', 'No, I dont need to make frequent stops']}
          handleChange={(answer) => handleChange('frequentStops', answer)}
        />
        <Question
          question="Do you prefer a silent car ride?"
          options={['Yes, I prefer a silent car ride', 'No, I dont prefer a silent car ride']}
          handleChange={(answer) => handleChange('silentRide', answer)}
        />
        <Question
          question="Are you a member of a Roadside Assistance Club? (e.g. AAA)"
          options={['Yes, I am a member of a Roadside Assistance Club', 'No, I am not a member of a Roadside Assistance Club']}
          handleChange={(answer) => handleChange('roadsideClub', answer)}
        />
      </form>
      <button onClick={() => console.log(answers)}>Submit</button>
    </div>
  );
}

export default Survey;