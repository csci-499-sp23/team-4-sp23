import React, { useState } from 'react';

export default function Question(props) {
  const { question, options, handleChange } = props;
  const [selectedOption, setSelectedOption] = useState(null);

  const handleOptionClick = (option) => {
    setSelectedOption(option);
  };

  return (
    <div>
      <div>{question}</div>
      {options.map((option) => {
        const isSelected = selectedOption === option;
        return (
          <div
            key={option}
            style={{
              border: '1px solid lime',
              width: 'fit-content',
              backgroundColor: isSelected ? 'lime' : 'white',
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
  );
}
