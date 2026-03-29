import React from 'react';
import { collections } from '../data/mockData';

const CollectionsPage = ({ setCurrentPage, artworks }) => {
    return (
        <div>
            <div className="text-center mb-12">
                <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white">
                    Collections
                </h1>
                <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 dark:text-gray-300">
                    Explore collections handpicked by gallery owners, designers, and our own curators to inspire your next acquisition.
                </p>
            </div>

            <div className="space-y-12">
                {collections.map((collection, index) => (
                    <div
                        key={collection.id}
                        className="bg-white dark:bg-gray-900 rounded-lg shadow-lg dark:shadow-none dark:border dark:border-gray-800 overflow-hidden flex flex-col md:flex-row"
                    >
                        <div className="md:w-1/2">
                            <img
                                src={collection.coverImageUrl}
                                alt={collection.name}
                                className="h-64 w-full object-cover md:h-full"
                            />
                        </div>

                        <div className="p-8 md:w-1/2 flex flex-col justify-center">
                            <p className="text-sm font-semibold text-amber-600 dark:text-amber-400 uppercase">
                                Curated by {collection.curator}
                            </p>

                            <h2 className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">
                                {collection.name}
                            </h2>

                            <p className="mt-4 text-gray-600 dark:text-gray-300">
                                {collection.description}
                            </p>

                            <div className="mt-6 flex -space-x-2 overflow-hidden">
                                {collection.artworkIds.map(id => {
                                    const artwork = artworks.find(a => a.id === id);
                                    return artwork ? (
                                        <img
                                            key={id}
                                            className="inline-block h-12 w-12 rounded-full ring-2 ring-white dark:ring-gray-900"
                                            src={artwork.imageUrls[0]}
                                            alt={artwork.title}
                                        />
                                    ) : null;
                                })}
                            </div>

                            <button
                                onClick={() =>
                                    setCurrentPage('collectionDetail', collection.id)
                                }
                                className="mt-8 px-6 py-2 bg-[#b67e33] text-white font-semibold rounded-full hover:bg-amber-700 self-start transition-colors shadow-sm"
                            >
                                View Collection
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CollectionsPage;