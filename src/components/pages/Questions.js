import React, { useState } from 'react';

export default function Question(props) {
  const { question, options, maxOptions = 1 } = props;
  const [selectedOptions, setSelectedOptions] = useState([]);

  const handleOptionClick = (option) => {
    if (selectedOptions.includes(option)) {
      setSelectedOptions(selectedOptions.filter((selectedOption) => selectedOption !== option));
    } else if (selectedOptions.length < maxOptions) {
      setSelectedOptions([...selectedOptions, option]);
    }
  };

  return (
    <div className="question-container">
      <div>{question}</div>
      <div className="options-container">
        {options.map((option) => {
          const isSelected = selectedOptions.includes(option);
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