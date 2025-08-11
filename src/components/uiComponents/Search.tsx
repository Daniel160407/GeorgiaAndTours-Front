const Search = ({ value, setValue }) => {
    return (
        <div className="search">
            <input className="search-box" value={value} onChange={(e) => setValue(e.target.value)} placeholder="Search tour"></input>
        </div>
    );
}

export default Search;