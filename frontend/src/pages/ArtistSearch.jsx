import React from "react";
import { ArtistCard } from "../components/ArtistCard";

const ArtistSearch = ({ setCurrentPage, artworks, artists }) => {

    const handleViewArtist = (id) => {
        setCurrentPage("artistDetail", id);
    };

    return (
        <div>
            <div className="text-center mb-12">
                <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white">
                    Meet Our Artists
                </h1>

                <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 dark:text-gray-300">
                    Discover the creative minds behind the masterpieces. Explore their
                    stories, studios, and portfolios.
                </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {artists.map((artist, index) => {
                    const artistArtworksCount = artworks.filter(
                        (a) => a.artistId === artist.id
                    ).length;

                    return (
                        <div
                            key={artist.id}
                            className="opacity-0 animate-fade-in-up"
                            style={{ animationDelay: `${index * 100}ms` }}
                        >
                            <ArtistCard
                                artist={artist}
                                artworksCount={artistArtworksCount}
                                onView={handleViewArtist}
                            />
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default ArtistSearch;