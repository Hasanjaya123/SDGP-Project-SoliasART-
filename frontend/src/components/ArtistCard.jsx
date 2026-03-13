import React from "react";
import { FaUsers } from "react-icons/fa";
import { MdImage } from "react-icons/md";

export const ArtistCard = ({ artist }) => {

    return (
        <div className="bg-white rounded-xl shadow-md overflow-hidden">

            {/* Artist Image */}
            <img
                src={artist.profile_image_url || "https://via.placeholder.com/400"}
                alt={artist.display_name}
                className="w-full h-56 object-cover"
            />

            {/* Card Content */}
            <div className="p-6 text-center">

                {/* Artist Name */}
                <h2 className="text-xl font-bold text-gray-800">
                    {artist.display_name}
                </h2>

                {/* Medium */}
                <p className="text-amber-600 font-medium">
                    {artist.primary_medium}
                </p>

                {/* Location */}
                <p className="text-gray-500 text-sm mt-1">
                    {artist.location || "Sri Lanka"}
                </p>

                {/* Stats */}
                <div className="flex justify-between mt-6 text-gray-600 text-sm">

                    <div className="flex items-center gap-2">
                        <MdImage />
                        <span>{artist.artworks_count || 0} Artworks</span>
                    </div>

                    <div className="flex items-center gap-2">
                        <FaUsers />
                        <span>{artist.followers || 0} Followers</span>
                    </div>

                </div>

                {/* Button */}
                <button className="mt-6 w-full bg-[#1e293b] text-white py-2 rounded-lg hover:bg-[#334155] transition">
                    View Studio
                </button>

            </div>
        </div>
    );
};