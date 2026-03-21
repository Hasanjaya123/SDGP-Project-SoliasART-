export const artEvents = [
    {
        id: 1,
        name: "Colombo Art Biennale",
        type: "Festival",
        location: "Viharamahadevi Park, Colombo",
        date: "2024-05-15",
        description: "A major contemporary art festival featuring local and international artists.",
        artist: "Various Artists"
    },
    {
        id: 2,
        name: "Kala Pola 2024",
        type: "Art Walk",
        location: "Ananda Coomaraswamy Mawatha, Colombo 7",
        date: "2024-02-18",
        description: "Sri Lanka's premier open-air art fair, showcasing a vast array of paintings and sculptures.",
        artist: "Local Street Artists"
    },
    {
        id: 3,
        name: "Modern Sri Lankan Masters",
        type: "Exhibition",
        location: "Saskia Fernando Gallery, Colombo",
        date: "2024-06-10",
        description: "An exclusive exhibition highlighting the works of 20th-century Sri Lankan art icons.",
        artist: "George Keyt, Lionel Wendt"
    },
    {
        id: 4,
        name: "Galle Fort Art Trail",
        type: "Festival",
        location: "Galle Fort, Galle",
        date: "2024-08-22",
        description: "A series of pop-up galleries and installations throughout the historic Galle Fort.",
        artist: "Coastal Artisans"
    },
    {
        id: 5,
        name: "Visionary Landscapes Opening",
        type: "Opening",
        location: "Barefoot Gallery, Colombo 3",
        date: "2024-04-05",
        description: "The opening night for a new series of landscape paintings exploring the island's interior.",
        artist: "Pradeep Thalawatta"
    }
];

export const artworks = [
    {
        id: "art-1",
        title: "Sunset over Sigiriya",
        artist: "Amara Silva",
        price: 24500,
        imageUrls: ["https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?auto=format&fit=crop&w=400&q=80"],
        category: "Impressionism",
        views: 1240,
        likes: 156,
        isNewRelease: true
    },
    {
        id: "art-2",
        title: "The Golden Temple",
        artist: "Ravi Kumara",
        price: 32000,
        imageUrls: ["https://images.unsplash.com/photo-1541963463532-d68292c34b19?auto=format&fit=crop&w=400&q=80"],
        category: "Abstract",
        views: 890,
        likes: 42
    },
    {
        id: "art-3",
        title: "Monsoon Melodies",
        artist: "Nalini Perera",
        price: 18000,
        imageUrls: ["https://images.unsplash.com/photo-1549490349-8643362247b5?auto=format&fit=crop&w=400&q=80"],
        category: "Contemporary",
        views: 2100,
        likes: 310
    }
];

export const collections = [
    {
        id: "coll-1",
        name: "The Essence of Serendib",
        curator: "Saskia Fernando",
        description: "A breathtaking collection exploring the vibrant landscapes and rich cultural heritage of Sri Lanka through contemporary lenses.",
        coverImageUrl: "https://images.unsplash.com/photo-1501854140801-50d01698950b?auto=format&fit=crop&w=800&q=80",
        artworkIds: ["art-1", "art-2", "art-3"],
        artworks: [
            {
                id: "art-1",
                title: "Sunset over Sigiriya",
                artist: "Amara Silva",
                price: 24500,
                imageUrls: ["https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?auto=format&fit=crop&w=400&q=80"]
            },
            {
                id: "art-2",
                title: "The Golden Temple",
                artist: "Ravi Kumara",
                price: 32000,
                imageUrls: ["https://images.unsplash.com/photo-1541963463532-d68292c34b19?auto=format&fit=crop&w=400&q=80"]
            }
        ]
    },
    {
        id: "coll-2",
        name: "Abstract Oscillations",
        curator: "Barefoot Curators",
        description: "Diving deep into the non-representational world, this collection showcases the best of abstract expressionism from the island's emerging talents.",
        coverImageUrl: "https://images.unsplash.com/photo-1541963463532-d68292c34b19?auto=format&fit=crop&w=800&q=80",
        artworkIds: ["art-2", "art-3"],
        artworks: [
            {
                id: "art-2",
                title: "The Golden Temple",
                artist: "Ravi Kumara",
                price: 32000,
                imageUrls: ["https://images.unsplash.com/photo-1541963463532-d68292c34b19?auto=format&fit=crop&w=400&q=80"]
            }
        ]
    }
];

export const artGalleries = [
    { id: 101, name: "Saskia Fernando Gallery", location: "Horton Place, Colombo 7" },
    { id: 102, name: "Barefoot Gallery", location: "Galle Road, Colombo 3" },
    { id: 103, name: "Lionel Wendt Art Centre", location: "Guildford Crescent, Colombo 7" },
    { id: 104, name: "Paradise Road The Gallery Café", location: "Alfred House Road, Colombo 3" }
];
