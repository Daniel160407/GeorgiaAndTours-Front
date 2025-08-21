import React from 'react';
import '../../styles/uiComponents/SortBySelector.scss';
import type { SortBySelectorProps } from '../../types/interfaces';

const SortBySelector: React.FC<SortBySelectorProps> = ({ value, setValue }) => {
  return (
    <select 
      className={'sort-by-selector'}
      value={value} 
      onChange={(e) => setValue(e.target.value)}
    >
      <option value="name">Name</option>
      <option value="price">Price</option>
    </select>
  );
};

export default SortBySelector;