import ArtCard from './ArtCard';

function LikedArts({LikedArts}) {
    return (
        <section className="mt-10">
            <h2 className="text-xl font-semibold mb-6">
                Your Liked Arts
            </h2>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {LikedArts.map(((art) => (
                     <div
                        key={art.id}
                        className="overflow-hidden rounded-xl hover:scale-105 transition cursor-pointer">
                    
                        <img
                            src={art.image}
                            alt={art.title}
                            className="w-full h-48 object-cover"
                        />
                    </div>
                )))}
            </div>
        </section>

        
    )
}

export default LikedArts;
