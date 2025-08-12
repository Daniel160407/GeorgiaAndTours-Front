import React from 'react';

interface SortBySelectorProps {
  value: string;
  setValue: (value: string) => void;
}

const SortBySelector: React.FC<SortBySelectorProps> = ({ value, setValue }) => {
  return (
    <select className="sort-by-selector" value={value} onChange={(e) => setValue(e.target.value)}>
      <option value="name">Name</option>
      <option value="price">Price</option>
    </select>
  );
};

export default SortBySelector;