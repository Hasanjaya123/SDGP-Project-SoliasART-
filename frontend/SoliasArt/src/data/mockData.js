export const artworks = [
    {
        id: '1',
        title: 'Serene Sunset',
        artist: 'Aria Chen',
        price: 45000,
        views: 1250,
        likes: 340,
        isNewRelease: true,
        imageUrls: ['https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'],
        description: 'A captivating depiction of a tranquil sunset over the ocean, blending warm hues of orange and gold.'
    },
    {
        id: '2',
        title: 'Urban Echoes',
        artist: 'Marcus Thorne',
        price: 32000,
        views: 890,
        likes: 120,
        isNewRelease: false,
        imageUrls: ['https://images.unsplash.com/photo-1541701494587-cb58502866ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'],
        description: 'An abstract exploration of city life, capturing the rhythmic energy and architectural complexity of the modern metropolis.'
    },
    {
        id: '3',
        title: 'Emerald Whisper',
        artist: 'Elena Rossi',
        price: 28000,
        views: 1100,
        likes: 215,
        isNewRelease: true,
        imageUrls: ['https://images.unsplash.com/photo-1549490349-8643362247b5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'],
        description: 'A delicate floral composition that evokes the ephemeral beauty of spring with soft greens and ethereal textures.'
    },
    {
        id: '4',
        title: 'Midnight Reverie',
        artist: 'Julian Vane',
        price: 55000,
        views: 2400,
        likes: 560,
        isNewRelease: false,
        imageUrls: ['https://images.unsplash.com/photo-1501472312651-726afe119ff1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'],
        description: 'A deep, contemplative journey into the subconscious, using dark blues and dramatic highlights to create a sense of mystery.'
    },
    {
        id: '5',
        title: 'Golden Horizon',
        artist: 'Sana Khan',
        price: 38000,
        views: 950,
        likes: 180,
        isNewRelease: true,
        imageUrls: ['https://images.unsplash.com/photo-1536924940846-227afb31e2a5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'],
        description: 'A vibrant landscape that celebrates the warmth and light of the morning sun as it rises above a vast, golden field.'
    },
    {
        id: '6',
        title: 'Coastal Rhythms',
        artist: 'Oliver Grant',
        price: 42000,
        views: 1300,
        likes: 290,
        isNewRelease: false,
        imageUrls: ['https://images.unsplash.com/photo-1515405290399-ed31c51950d2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'],
        description: 'Capturing the dynamic movement of the waves crashing against the rocky shore, filled with texture and raw emotion.'
    }
];

export const collections = [
    {
        id: 'island-hues',
        name: 'Island Hues',
        curator: 'Nadisha Silva',
        description: 'A collection of vibrant artworks inspired by the tropical beauty and cultural richness of island life.',
        coverImageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
        artworkIds: ['1', '3', '5'],
        artworks: [artworks[0], artworks[2], artworks[4]]
    },
    {
        id: 'urban-visions',
        name: 'Urban Visions',
        curator: 'Hasanjaya',
        description: 'Exploring the intersecting lines, vibrant colors, and dynamic energy of modern urban landscapes.',
        coverImageUrl: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
        artworkIds: ['2', '4', '6'],
        artworks: [artworks[1], artworks[3], artworks[5]]
    }
];
