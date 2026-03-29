import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { collectionService } from '../services/uploadApi';

const CollectionsPage = ({ setCurrentPage }) => {
    const navigate = useNavigate();
    const [collections, setCollections] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCollections = async () => {
            try {
                const data = await collectionService.getAllCollections();
                setCollections(data);
            } catch (error) {
                console.error("Failed to load collections:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchCollections();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-600"></div>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto px-4 md:px-6 py-12">
            <div className="text-center mb-16">
                <h1 className="text-4xl font-black tracking-tight text-gray-900 dark:text-white uppercase italic">
                    Art Collections
                </h1>
                <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-500 dark:text-gray-400">
                    Explore collections handpicked by gallery owners, designers, and our own curators to inspire your next acquisition.
                </p>
            </div>

            <div className="space-y-14">
                {collections.length === 0 ? (
                    <div className="text-center text-gray-500 py-10">
                        No collections available yet.
                    </div>
                ) : (
                    collections.map((collection) => (
                        <div
                            key={collection.id}
                            className="bg-white dark:bg-gray-900 rounded-lg shadow-lg dark:shadow-none dark:border dark:border-gray-800 overflow-hidden flex flex-col md:flex-row"
                        >
                            <div className="md:w-1/2">
                                <img
                                    src={collection.artworks?.[0]?.image_url?.[0] || "https://images.unsplash.com/photo-1541451373351-40344b4bde5a?auto=format&fit=crop&q=80&w=800"}
                                    alt={collection.name}
                                    className="h-64 w-full object-cover md:h-full"
                                />
                            </div>

                            <div className="p-8 md:w-1/2 flex flex-col justify-center">
                                <p className="text-sm font-semibold text-amber-600 dark:text-amber-400 uppercase">
                                    Curated by {collection.curator || "Solias ART"}
                                </p>

                                <h2 className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">
                                    {collection.name}
                                </h2>

                                <p className="mt-4 text-gray-600 dark:text-gray-300">
                                    {collection.description || "A beautifully curated collection of premium artworks."}
                                </p>

                                <div className="mt-6 flex -space-x-2 overflow-hidden">
                                    {collection.artworks?.slice(0, 5).map(artwork => (
                                        <img
                                            key={artwork.id}
                                            className="inline-block h-12 w-12 object-cover rounded-full ring-2 ring-white dark:ring-gray-900"
                                            src={Array.isArray(artwork.image_url) ? artwork.image_url[0] : artwork.image_url}
                                            alt={artwork.title}
                                        />
                                    ))}
                                    {collection.artworks?.length > 5 && (
                                        <div className="flex items-center justify-center h-12 w-12 rounded-full ring-2 ring-white dark:ring-gray-900 bg-gray-100 dark:bg-gray-800 text-xs font-medium text-gray-600 dark:text-gray-300">
                                            +{collection.artworks.length - 5}
                                        </div>
                                    )}
                                </div>

                                <button
                                    onClick={() => {
                                        if (setCurrentPage) {
                                            setCurrentPage('collectionDetail', collection.id)
                                        } else {
                                            navigate(`/collections/${collection.id}`);
                                        }
                                    }}
                                    className="mt-8 px-6 py-2 bg-[#b67e33] text-white font-semibold rounded-full hover:bg-amber-700 self-start transition-colors shadow-sm"
                                >
                                    View Collection
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default CollectionsPage;