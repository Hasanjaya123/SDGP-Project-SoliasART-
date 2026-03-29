import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { artworkService, collectionService, authService, artistProfileService } from '../services/uploadApi';
import ArtDisplayCard from '../components/Art-card';
import soliasartlogo from "../assets/soliasartlogo.png";

const EditCollection = () => {
    const { id: collectionId } = useParams();
    const navigate = useNavigate();
    const [artworks, setArtworks] = useState([]);
    const [selectedIds, setSelectedIds] = useState([]);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);
    const [totalPrice, setTotalPrice] = useState(0);

    useEffect(() => {
        const loadInitialData = async () => {
            try {
                // Verify user is an artist
                const roleData = await authService.verifyRole();
                if (roleData.role !== 'artist') {
                    navigate('/search');
                    return;
                }
                
                const profile = await artistProfileService.getProfile();
                const actualArtistId = profile.artist?.id || profile.id;

                // Fetch collection details
                const collection = await collectionService.getCollectionById(collectionId);
                
                // Security check: ensure this artist owns the collection
                if (collection.artist_id && collection.artist_id !== actualArtistId) {
                     navigate('/search');
                     return;
                }

                setName(collection.name);
                setDescription(collection.description || '');
                setSelectedIds(collection.artworks?.map(a => a.id) || []);

                // Fetch artist artworks
                let userArtworks = [];
                try {
                    userArtworks = await artworkService.getArtworksByArtist(actualArtistId);
                } catch (apiErr) {
                    console.warn("Retrying with profile artworks due to API failure:", apiErr);
                    userArtworks = profile.artworks || [];
                }

                // Filter out artworks that are assigned to other collections (not this one)
                try {
                    const allArtistCollections = await collectionService.getCollectionsByArtist(actualArtistId);
                    const takenByOthersIds = new Set();
                    allArtistCollections.forEach(col => {
                        if (col.id !== collectionId) {
                            col.artworks?.forEach(art => takenByOthersIds.add(art.id));
                        }
                    });
                    
                    const availableArtworks = userArtworks.filter(art => !takenByOthersIds.has(art.id));
                    setArtworks(availableArtworks);
                } catch (colErr) {
                    console.warn("Failed to fetch other collections for filtering, showing all artworks.", colErr);
                    setArtworks(userArtworks);
                }
            } catch (err) {
                console.error("Error loading data:", err);
                setError("Failed to load collection details. Please try again.");
            } finally {
                setLoading(false);
            }
        };

        if (collectionId) {
            loadInitialData();
        }
    }, [collectionId, navigate]);

    useEffect(() => {
        const selectedArtworks = artworks.filter(art => selectedIds.includes(art.id));
        const total = selectedArtworks.reduce((sum, art) => sum + (parseFloat(art.price) || 0), 0);
        setTotalPrice(total);
    }, [selectedIds, artworks]);


    const toggleSelection = (id) => {
        setSelectedIds(prev => 
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        );
    };

    const handleSelectAll = () => {
        if (selectedIds.length === artworks.length) {
            setSelectedIds([]);
        } else {
            setSelectedIds(artworks.map(art => art.id));
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        if (!name.trim()) {
            alert("Please enter a collection name.");
            return;
        }
        if (selectedIds.length === 0) {
            alert("Please select at least one artwork.");
            return;
        }

        setSaving(true);
        try {
            await collectionService.updateCollection(collectionId, {
                name,
                description,
                artwork_ids: selectedIds
            });
            alert("Collection updated successfully!");
            navigate('/artist/profile'); // Return to profile after editing
        } catch (err) {
            console.error("Update failed:", err);
            alert("Failed to update collection.");
        } finally {
            setSaving(false);
        }
    };

    if (loading) return (
        <div className="flex items-center justify-center min-h-screen bg-gray-950">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500"></div>
        </div>
    );

    if (error) return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-white dark:bg-gray-950 text-gray-500">
            <p className="text-xl mb-4">{error}</p>
            <button onClick={() => navigate('/artist/profile')} className="text-amber-500 font-bold">Back to Profile</button>
        </div>
    );

    return (
        <div className="min-h-screen bg-white dark:bg-gray-950 font-sans transition-colors duration-300">
            <header className="sticky top-0 z-40 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 shadow-sm transition-colors duration-300">
                <div className="px-6 py-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <img src={soliasartlogo} alt="SoliasART" className="h-8 w-auto cursor-pointer" onClick={() => navigate('/search')} />
                        <h1 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tight ml-4">
                            EDIT COLLECTIONS
                        </h1>
                    </div>
                    <div className="flex items-center gap-6">
                        <div className="text-right">
                            <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Total Value</div>
                            <div className="text-sm font-bold text-amber-600 dark:text-amber-500">LKR {totalPrice.toLocaleString()}</div>
                        </div>
                        <div className="h-8 w-px bg-gray-200 dark:border-gray-800"></div>
                        <div className="text-right">
                            <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Selected</div>
                            <div className="text-sm font-bold text-gray-900 dark:text-white uppercase">{selectedIds.length} ARTS</div>
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-6 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column: Form */}
                    <div className="lg:col-span-1">
                        <div className="bg-gray-50 dark:bg-gray-900 p-6 rounded-2xl border border-gray-100 dark:border-gray-800 sticky top-24">
                            <h2 className="text-lg font-bold mb-6 text-gray-800 dark:text-gray-100">Collection Details</h2>
                            <form onSubmit={handleUpdate} className="space-y-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Collection Name</label>
                                    <input 
                                        type="text" 
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        placeholder="e.g. Summer Dreams 2024"
                                        className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-amber-500 outline-none transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Description (Optional)</label>
                                    <textarea 
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        placeholder="Tell a story about this collection..."
                                        rows="4"
                                        className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-amber-500 outline-none transition-all resize-none"
                                    />
                                </div>
                                <div className="flex gap-3 mt-4">
                                    <button 
                                        type="button"
                                        onClick={() => navigate('/artist/profile')}
                                        className="flex-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 font-black py-3 rounded-xl transition-all uppercase tracking-widest text-xs"
                                    >
                                        Cancel
                                    </button>
                                    <button 
                                        type="submit"
                                        disabled={saving}
                                        className="flex-[2] bg-amber-500 hover:bg-amber-600 disabled:bg-gray-400 text-white font-black py-3 rounded-xl transition-all shadow-lg shadow-amber-500/20 uppercase tracking-widest text-xs"
                                    >
                                        {saving ? 'Saving...' : 'Save Changes'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>

                    {/* Right Column: Artworks Selection */}
                    <div className="lg:col-span-2">
                        <div className="mb-6 flex items-end justify-between">
                            <div>
                                <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100">Update Artworks</h2>
                                <p className="text-sm text-gray-400">Modify the pieces included in this collection.</p>
                            </div>
                            {artworks.length > 0 && (
                                <button 
                                    onClick={handleSelectAll}
                                    className="text-xs font-bold text-amber-500 hover:text-amber-600 uppercase tracking-widest px-3 py-1.5 border border-amber-500/20 rounded-lg hover:bg-amber-500/5 transition-all"
                                >
                                    {selectedIds.length === artworks.length ? 'Deselect All' : 'Select All'}
                                </button>
                            )}
                        </div>

                        {artworks.length === 0 ? (
                            <div className="text-center py-20 bg-gray-50 dark:bg-gray-900 rounded-3xl border-2 border-dashed border-gray-200 dark:border-gray-800">
                                <p className="text-gray-400">You haven't uploaded any artworks yet.</p>
                                <button onClick={() => navigate('/dashboard/upload')} className="text-amber-500 font-bold mt-2">Upload Now</button>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {artworks.map((art) => (
                                    <div 
                                        key={art.id} 
                                        className={`relative cursor-pointer transition-all duration-300 transform rounded-2xl overflow-hidden ${
                                            selectedIds.includes(art.id) 
                                                ? 'ring-4 ring-amber-500 scale-95 shadow-2xl' 
                                                : 'hover:scale-[1.02]'
                                        }`}
                                        onClick={() => toggleSelection(art.id)}
                                    >
                                        <ArtDisplayCard 
                                            image={Array.isArray(art.imageUrls || art.image_url) ? (art.imageUrls || art.image_url)[0] : (art.imageUrls || art.image_url)} 
                                            formData={{
                                                title: art.title,
                                                price: art.price,
                                                category: art.medium || '',
                                                height: art.height_in || '',
                                                width: art.width_in || '',
                                                images: Array.isArray(art.imageUrls || art.image_url) ? (art.imageUrls || art.image_url) : [(art.imageUrls || art.image_url)]
                                            }} 
                                        />
                                        {selectedIds.includes(art.id) && (
                                            <div className="absolute top-4 right-4 bg-amber-500 text-white rounded-full p-2 shadow-lg">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                                </svg>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default EditCollection;
