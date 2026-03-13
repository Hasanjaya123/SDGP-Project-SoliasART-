import React, { useEffect, useState } from "react";
import { ArtistCard } from "../components/ArtistCard";
import { supabase } from "../services/supabase";

const ArtistSearch = () => {

    const [artists, setArtists] = useState([]);
    const [search, setSearch] = useState("");

    useEffect(() => {
        fetchArtists();
    }, []);

    const fetchArtists = async () => {

        const { data, error } = await supabase
            .from("artists")
            .select("*");

        if (error) {
            console.log(error);
        } else {
            setArtists(data);
        }

    };

    const filteredArtists = artists.filter((artist) =>
        artist.display_name.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div>

            {/* Search Bar */}
            <div className="mb-8 flex justify-center">
                <input
                    type="text"
                    placeholder="Search artists..."
                    className="px-4 py-2 w-96 border rounded-lg"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>

            {/* Artists Grid */}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {filteredArtists.map((artist) => (
                    <ArtistCard key={artist.id} artist={artist} />
                ))}
            </div>

        </div>
    );
};

export default ArtistSearch;