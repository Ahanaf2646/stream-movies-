import React from "react";

const MovieCard = ({ movie : {  title, vote_average, poster_path, release_date, original_language } }) => {
    return (
        <div className="movie-card">
            <img 
            src={[poster_path ? 
            `https://image.tmdb.org/t/p/w500/${poster_path}` : 'https://via.placeholder.com/500x750?text=No+Image+Available']} alt={title} />

            <div className="mt-4">
                <h3>{title}</h3>

                <div className="content">
                    <div className="rating"> 
                        <img src="star.svg" alt="Star Icon" />
                        <p>{vote_average ? vote_average.toFixed(1) : 'No Rating'}</p>

                </div>
                <span>•</span>
                <p className='original language'> </p>

                 <span>•</span>
                 <p className='year'> 
                   {release_date ? release_date.split('-')[0] : 'Unknown Year'}
                 </p>

             </div>
            </div>
         </div>
    );
}
export default MovieCard;