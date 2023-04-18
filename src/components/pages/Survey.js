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
    personalityTraits: [],
  });
  
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
  

  return (
    <div className="survey-container">
      <h2>Survey</h2>
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
      <button class="btn btn-primary" onClick={() => console.log(answers)}>Submit</button>
    </div>
  );
}

export default Survey;
