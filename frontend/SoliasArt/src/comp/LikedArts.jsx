import ArtCard from './ArtCard'

function LikedArtS({ LikedArtS }) {
  return (
    <section className="mt-10">
      {/* CHANGED: text-gray-900 → text-white */}
      <h2 className="text-xl font-semibold mb-6 text-white">
        Your Liked Arts
      </h2>

      {/* CHANGED: gap-4 kept, but now renders full ArtCard instead of plain image divs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {LikedArtS.map((art) => (
          <ArtCard
            key={art.id}
            title={art.title}
            image={art.image}
            artist={art.artist}
            tag={art.tag}
            views={art.views}
            likes={art.likes}
            price={art.price}
            saved={art.saved}
          />
        ))}
      </div>
    </section>
  );
}

export default LikedArtS;
