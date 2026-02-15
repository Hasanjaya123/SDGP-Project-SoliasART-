import ArtCard from './ArtCard';

function LikedArtS({LikedArtS}) {
    return (
        <section className='liked-arts'>
            <h2>Your Liked Arts</h2>
            <div className='arts-grind'>
                {LikedArtS.map(((art) => (
                    <ArtCard key={art.id} title={art.title} image={art.image} />

                )))}
            </div>
        </section>

        
    )
}

export default LikedArtS;
