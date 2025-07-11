import { useEffect, useState } from 'react';
import Search from './components/Search.jsx'
import Spinner from './components/Spinner.jsx';
import MovieCard from './components/MovieCard.jsx';
import {useDebounce} from 'react-use'; // Assuming useDebounce is a custom hook for debouncing input changes

const API_BASE_URL = 'https://api.themoviedb.org/3';

const API_KEY = import.meta.env.VITE_TMDB_API_KEY; // Ensure this is set in your .env.local file

const API_OPTIONS = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: `Bearer ${API_KEY}`,
  },
};

const App = () => { 
  const [searchTerm, setSearchTerm] = useState(''); // Placeholder for state, if needed later
  const [errorMessage, setErrorMessage] = useState('');
  const [movieList, setMovieList] = useState([]); // State to hold movie list
  const [isLoading, setIsLoading] = useState(false); // State to manage loading state
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(''); // Debounce the search term

  
  // Debounce the search term to avoid too many API calls
  // Adjust the debounce time as needed
  useDebounce(() => setDebouncedSearchTerm(searchTerm), ms => 500, [searchTerm]); // Debounce the search term for 500ms

  const fetchMovies = async (query = '') => {

    setIsLoading(true);
    setErrorMessage(''); // Reset error message before fetching
    try {
      const endpoint  = query
        ? `${API_BASE_URL}/search/movie?query=${encodeURIComponent(query)}`
       :`${API_BASE_URL}/discover/movie?sort_by=popularity.desc&api_key=${API_KEY}`;

      const response = await fetch(endpoint, API_OPTIONS);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      if(data.Response === 'False') {
         setErrorMessage(data.Error || 'Failed to fetch movies');
         setMovieList([]);
          return;
      }

      setMovieList(data.results || []); // Set the movie list state

      // Process the movie data as needed

    } catch (error) {
      console.error('Error fetching movies:', error);
      setErrorMessage('Failed to fetch movies. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMovies(debouncedSearchTerm);
  }, [debouncedSearchTerm]); // Fetch movies when the component mounts or searchTerm changes


  return (
    <main>
      <div className='pattern'/>

      <div className='wrapper'>
      <header>
        <img src="./hero.png" alt="Hero banner"/>
        <h1>Find <span className="text-gradient">Movies</span> You'll enjoy with Stream</h1>
         <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      </header>

      
        <section className='all-movies'> 
          <h2 className='mt-[40px]'>All Movies</h2>

          {isLoading ? (
            
            <Spinner/>

          ) : errorMessage ? (
            <p className="text-red-500">{errorMessage}</p>
          ) : (
            <ul>
              {movieList.map((movie) => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </ul>
          )};

        </section>
      </div>
    </main>
  )
}
export default App;