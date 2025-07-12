import { useEffect, useState } from 'react'; // Import React hooks for managing state and side effects
import Search from './components/Search.jsx'  // Import the Search component for searching movies
import Spinner from './components/Spinner.jsx'; // Import the Spinner component for loading state
import MovieCard from './components/MovieCard.jsx'; // Import the MovieCard component
import {useDebounce} from 'react-use'; // Assuming useDebounce is a custom hook for debouncing input changes
import { UpdateSearchCount } from './appwrite.js'; // Import the function to update search count

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
  const [errorMessage, setErrorMessage] = useState(''); // State to hold error messages
  const [movieList, setMovieList] = useState([]); // State to hold movie list
  const [isLoading, setIsLoading] = useState(false); // State to manage loading state
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(''); // Debounce the search term
  const [trendingMovies, setTrendingMovies] = useState([]); // State to hold trending movies




  
  // Debounce the search term to avoid too many API calls
  // Adjust the debounce time as needed
  useDebounce(() => setDebouncedSearchTerm(searchTerm),500, [searchTerm]); // Debounce the search term for 500ms

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

      if (query && data.results.length > 0) { 
        await UpdateSearchCount(query, data.results[0]); // Update search count for the first movie in the results
       } 
    } catch (error) {
      console.error('Error fetching movies:', error);
      setErrorMessage('Failed to fetch movies. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const loadTrendingMovies = async () => {
    try {
      const movies = await getTrendingMovies(); // Fetch trending movies from Appwrite
      setTrendingMovies(movies);
    } catch (error) {
      console.error(`Error fetching trending movies: ${error}`);
    }
  };

  useEffect(() => {
    fetchMovies(debouncedSearchTerm);
  }, [debouncedSearchTerm]); // Fetch movies when the component mounts or searchTerm changes

  useEffect(() => {
    loadTrendingMovies(); // Load trending movies when the component mounts
  }, []); // Empty dependency array means this effect runs once when the component mounts


  return (
    <main>
      <div className='pattern'/>

      <div className='wrapper'>
      <header>
        <img src="./hero.png" alt="Hero banner"/>
        <h1>Find <span className="text-gradient">Movies</span> You'll enjoy with Stream</h1>
         <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      </header>

      {trendingMovies.length > 0 && (
        <section className='trending'>
          <h2>Trending Movies</h2>
          <ul>
            {trendingMovies.map((movie, index) => (
              <li key={movie.$id}>
                <p>{index + 1}</p>
                <img src={movie.poster_url} alt={movie.title} />
                </li>
            ))}
          </ul>
        </section>
      )}

      <section className="all-movies"> 
          <h2>All Movies</h2>

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
