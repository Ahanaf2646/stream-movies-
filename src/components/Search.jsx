import React from 'react';

const Search = ({searchTerm, setSearchTerm}) => { // Placeholder for search term, if needed later
    return (
        <div className="search">
            <div>
            <img src="./search.svg" alt="search" />

            <input 
               type="text"
                placeholder="Search for a movie, tv show, person..."
                value={searchTerm} // Controlled input
                onChange={(e) => setSearchTerm(e.target.value)} // Update search term on change
                />
            </div>
        </div>  
    )
}
export default Search;