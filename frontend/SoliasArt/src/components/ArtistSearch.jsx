import React, { useEffect, useState } from 'react';
import { ArtistCard } from './ArtistCard';
import { api } from '../services/uploadApi';

export const ArtistSearch = () => {
    const [artists, setArtists] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        fetchArtists();
    }, []);

    const fetchArtists = async () => {
        try {
            const response = await api.get("/artists");
            setArtists(response.data);
        } catch (error) {
            console.error("Error fetching artists:", error);
        }
    };

    const filteredArtists = artists.filter((artist) =>
        artist.display_name?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">

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
                    className="w-full px-4 py-2 rounded-lg border text-gray-900 dark:!text-white bg-gray-50 dark:bg-gray-800 border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-all"
                />
            </div>

            {/* Artists */}
            {filteredArtists.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {filteredArtists.map((artist) => (
                        <ArtistCard
                            key={artist.id}
                            artist={artist}
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