import React, { useState, useEffect, useCallback } from "react";
import { artistProfileService } from "../services/uploadApi";
import ArtDisplayCard from "../components/Art-card";
import Sidebar from "../components/Nav-bar";
import Footer from "../components/Footer";

/* ---------------- PORTFOLIO TAB ---------------- */

const PortfolioTab = ({ artworks, onArtworkClick }) => (
  <div className="flex flex-wrap gap-6 items-start justify-start">

    {artworks.map((artwork, idx) => (
      <div
        key={artwork.id}
        className="opacity-0 animate-fade-in-up cursor-pointer"
        style={{ animationDelay: `${idx * 100}ms` }}
        onClick={() => onArtworkClick(artwork.id)}
      >
        <ArtDisplayCard
          image={artwork.image_url?.[0]}
          formData={{
            title: artwork.title,
            price: artwork.price,
            category: artwork.medium || "",
            height: artwork.height_in || "",
            width: artwork.width_in || "",
            images: artwork.image_url ? [artwork.image_url] : [],
          }}
        />
      </div>
    ))}

    {artworks.length === 0 && (
      <div className="w-full text-center py-20 text-slate-500">
        No artworks in portfolio yet.
      </div>
    )}

  </div>
);

/* ---------------- ABOUT TAB ---------------- */

const AboutTab = ({ artist }) => (
  <div className="max-w-2xl">

    <h3 className="text-xl font-bold mb-4">About the Artist</h3>

    <p className="leading-relaxed mb-8">
      {artist.artist_bio || "No bio available."}
    </p>

    <div className="grid grid-cols-2 gap-6">

      <div>
        <h4 className="font-bold mb-2">Specialty</h4>
        <p>{artist.primary_medium || "N/A"}</p>
      </div>

      <div>
        <h4 className="font-bold mb-2">Location</h4>
        <p>{artist.location || "Sri Lanka"}</p>
      </div>

    </div>

  </div>
);

/* ---------------- MAIN PAGE ---------------- */

export const ArtistProfilePage = ({
  artistId,
  setCurrentPage = () => { },
  currentUser = { followingIds: [] },
  onToggleFollow = () => { },
}) => {

  const [activeTab, setActiveTab] = useState("portfolio");

  const [artist, setArtist] = useState(null);
  const [artworks, setArtworks] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /* ---------------- DEBUG ---------------- */

  useEffect(() => {
    console.log("Artist ID in Profile Page:", artistId);
  }, [artistId]);

  /* ---------------- FETCH ARTIST PROFILE ---------------- */

  useEffect(() => {

    if (!artistId) {
      console.log("❌ No artistId received!");
      setError("Invalid artist ID");
      setLoading(false);
      return;
    }

    setLoading(true);

    artistProfileService
      .getProfile(artistId)
      .then((data) => {

        console.log("✅ API RESPONSE:", data);

        if (!data || !data.artist) {
          throw new Error("No artist data returned");
        }

        setArtist(data.artist);
        setArtworks(data.artworks || []);

      })
      .catch((err) => {

        console.error("❌ API ERROR:", err);
        setError("Failed to load artist profile");

      })
      .finally(() => {

        setLoading(false);

      });

  }, [artistId]);

  /* ---------------- FOLLOW LOGIC ---------------- */

  const isFollowing = currentUser?.followingIds?.includes(artistId);

  const handleFollowClick = useCallback(() => {
    onToggleFollow(artistId);
  }, [artistId, onToggleFollow]);

  const handleArtworkClick = useCallback(
    (id) => setCurrentPage("artworkDetail", id),
    [setCurrentPage]
  );

  /* ---------------- LOADING ---------------- */

  if (loading) {
    return (
      <div className="flex min-h-screen">
        <Sidebar />
        <div className="flex-1 flex items-center justify-center">
          Loading...
        </div>
      </div>
    );
  }

  /* ---------------- ERROR ---------------- */

  if (error || !artist) {
    return (
      <div className="flex min-h-screen">
        <Sidebar />
        <div className="flex-1 flex items-center justify-center text-red-500">
          {error || "Artist not found"}
        </div>
      </div>
    );
  }

  /* ---------------- MAIN UI ---------------- */

  return (
    <div className="flex min-h-screen">

      <Sidebar />

      <div className="flex-1 ml-64">

        {/* COVER IMAGE */}
        <div className="h-56 w-full bg-gray-200">
          <img
            src={
              artist.cover_image_url ||
              `https://picsum.photos/seed/${artistId}/1200/400`
            }
            alt="cover"
            className="w-full h-full object-cover"
          />
        </div>

        {/* PROFILE SECTION */}
        <div className="max-w-6xl mx-auto px-6 -mt-16">

          <div className="flex justify-between items-end">

            <div className="flex items-center gap-6">

              <img
                src={
                  artist.profile_image_url ||
                  "https://i.pravatar.cc/150"
                }
                alt="profile"
                className="w-32 h-32 rounded-full border-4 border-white object-cover"
              />

              <div>
                <h1 className="text-4xl font-bold">
                  {artist.display_name}
                </h1>

                <p className="text-amber-500 font-medium">
                  {artist.primary_medium}
                </p>

                <p className="text-gray-500 mt-2">
                  {artist.artist_bio}
                </p>
              </div>

            </div>

            {/* ACTION BUTTONS */}
            <div className="flex gap-3">

              <button
                onClick={handleFollowClick}
                className={`px-6 py-2 rounded-full font-bold ${isFollowing ? "bg-gray-200" : "bg-yellow-400"
                  }`}
              >
                {isFollowing ? "Following" : "Follow"}
              </button>

              <button className="border px-6 py-2 rounded-full font-bold">
                Request Commission
              </button>

            </div>

          </div>

          {/* STATS */}
          <div className="flex gap-6 mt-8 border-t pt-6">

            <div>
              <span className="font-bold text-xl">
                {artist.followers || 0}
              </span>{" "}
              Followers
            </div>

            <div>
              <span className="font-bold text-xl">
                {artworks.length}
              </span>{" "}
              Artworks
            </div>

          </div>

          {/* TABS */}
          <div className="flex gap-8 mt-8 border-b pb-3">

            <button
              onClick={() => setActiveTab("portfolio")}
              className={activeTab === "portfolio" ? "font-bold" : ""}
            >
              Portfolio
            </button>

            <button
              onClick={() => setActiveTab("about")}
              className={activeTab === "about" ? "font-bold" : ""}
            >
              About
            </button>

          </div>

          {/* TAB CONTENT */}
          <div className="mt-8">

            {activeTab === "portfolio" && (
              <PortfolioTab
                artworks={artworks}
                onArtworkClick={handleArtworkClick}
              />
            )}

            {activeTab === "about" && (
              <AboutTab artist={artist} />
            )}

          </div>

        </div>

        <Footer />

      </div>

    </div>
  );
};