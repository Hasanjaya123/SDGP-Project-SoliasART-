import React, { useEffect, useState } from 'react';
import { ArtistCard } from '../components/ArtistCard';
import { supabase } from '../services/supabase';

export const ArtistSearch = ({ setCurrentPage, artworks }) => {
    const [artists, setArtists] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        fetchArtists();
    }, []);

    const fetchArtists = async () => {
        const { data, error } = await supabase
            .from('artists')
            .select('*');

        if (error) {
            console.error(error);
        } else {
            setArtists(data);
        }
    };

    const filteredArtists = artists.filter((artist) =>
        artist.display_name?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div>

            {/* Header */}
            <div className="text-center mb-12">
                <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white">Meet Our Artists</h1>
                <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 dark:text-gray-300">
                    Discover the creative minds behind the masterpieces. Explore their stories, studios, and portfolios.
                </p>
            </div>

            {/* Search Bar */}
            <div className="max-w-md mx-auto mb-10">
                <input
                    type="text"
                    placeholder="Search artists..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>

            {/* Artists Grid */}
            {filteredArtists.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredArtists.map((artist, index) => (
                        <div
                            key={artist.id}
                            className="opacity-0 animate-fade-in-up"
                            style={{ animationDelay: `${index * 100}ms` }}
                        >
                            <ArtistCard
                                artist={artist}
                                setCurrentPage={setCurrentPage}
                            />
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-center text-gray-500 dark:text-gray-400 mt-8">
                    No artists found matching "{searchQuery}"
                </p>
            )}

        </div>
    );
};