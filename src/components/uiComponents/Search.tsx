import React from "react";
import '../../styles/uiComponents/Search.scss';
import type { SearchProps } from "../../types/interfaces";

const Search: React.FC<SearchProps> = ({ value, setValue, onSubmit }) => {
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      onSubmit();
    } else {
      setValue(e.target.value);
    }
  };

  return (
    <div className="search">
      <input
        className="search-box"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyPress={handleKeyPress}
        placeholder="Search tour"
      />
    </div>
  );
};

export default Search;