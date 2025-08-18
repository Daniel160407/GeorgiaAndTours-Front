import React from "react";
import '../../styles/uiComponents/Search.scss';

interface SearchProps {
  value: string;
  setValue: (value: string) => void;
  onSubmit: () => void;
}

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