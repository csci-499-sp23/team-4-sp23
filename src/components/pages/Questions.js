import React, { useState } from 'react';

export default function Question(props) {
  const { question, options, handleChange, maxOptions = 1 } = props;
  const [selectedOptions, setSelectedOptions] = useState([]);

  const handleOptionChange = (option) => {
    let newSelectedOptions;
    if (maxOptions && selectedOptions.length >= maxOptions && !selectedOptions.includes(option)) {
      return;
    }

    if (selectedOptions.includes(option)) {
      newSelectedOptions = selectedOptions.filter((o) => o !== option);
    } else {
      newSelectedOptions = [...selectedOptions, option];
    }

    setSelectedOptions(newSelectedOptions);
    handleChange(newSelectedOptions);
  };

  const handleOptionClick = (option) => {
    handleOptionChange(option);
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
