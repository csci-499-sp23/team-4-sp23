import React, { useState } from 'react';
import '../../App.css';

export default function Question(props) {
  const { question, options, handleChange } = props;
  const [selectedOption, setSelectedOption] = useState(null);

  const handleOptionClick = (option) => {
    setSelectedOption(option);
    handleChange(option);
  };

  return (
    <div className="question-container">
      <div>{question}</div>
      <div className="options-container">
        {options.map((option) => {
          const isSelected = selectedOption === option;
          return (
            <div
              key={option}
              className="option"
              style={{
                border: isSelected ? '1px solid #38B6FF' : '1px solid #ddd',
                backgroundColor: isSelected ? '#38B6FF' : 'white',
                color: isSelected ? 'white' : 'black',
                fontWeight: isSelected ? 'bold' : 'normal',
              }}
              onClick={() => handleOptionClick(option)}
            >
              {option}
            </div>
          );
        })}
      </div>
    </div>
  );
}
