import React, { useEffect, useState } from 'react';
import { ArtistCard } from './ArtistCard';

export const ArtistSearch = ({ setCurrentPage }) => {
    const [artists, setArtists] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        fetchArtists();
    }, []);

    const fetchArtists = async () => {
        try {
            const response = await fetch("http://127.0.0.1:8000/artists"); // 👈 backend endpoint

            if (!response.ok) {
                throw new Error("Failed to fetch artists");
            }

            const data = await response.json();
            setArtists(data);
        } catch (error) {
            console.error("Error fetching artists:", error);
        }
    };

    const filteredArtists = artists.filter((artist) =>
        artist.display_name?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div>

            {/* Header */}
            <div className="text-center mb-12">
                <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white">
                    Meet Our Artists
                </h1>
                <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 dark:text-gray-300">
                    Discover the creative minds behind the masterpieces.
                </p>
            </div>

            {/* Search */}
            <div className="max-w-md mx-auto mb-10">
                <input
                    type="text"
                    placeholder="Search artists..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-4 py-2 rounded-lg border"
                />
            </div>

            {/* Artists */}
            {filteredArtists.length > 0 ? (
                <div className="grid grid-cols-3 gap-8">
                    {filteredArtists.map((artist, index) => (
                        <ArtistCard
                            key={artist.id}
                            artist={artist}
                            setCurrentPage={setCurrentPage}
                        />
                    ))}
                </div>
            ) : (
                <p className="text-center mt-8">
                    No artists found
                </p>
            )}
        </div>
    );
};