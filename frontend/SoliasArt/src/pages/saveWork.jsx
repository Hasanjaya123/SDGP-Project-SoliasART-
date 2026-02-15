import {useState} from 'react';
import Header from '../comp/header.jsx';
import TabNavigation from '../comp/TabNavigation';
import ActionButtons from '../comp/ActionButtons';
import BoardList from '../comp/BoardList';
import LikedArts from '../comp/LikedArts';
import Suggestions from '../comp/Suggestions';


// Dummy data with realistic art images
const savedBoards = [
  { 
    id: 1, 
    title: 'Life', 
    pinCount: 13, 
    lastUpdated: '7 mo',
    images: [
      'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=400',
      'https://images.unsplash.com/photo-1518640467707-6811f4a6ab73?w=400',
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=400',
      'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=400'
    ]
  },
  { 
    id: 2, 
    title: 'Anime wallpaper iphone', 
    pinCount: 7, 
    lastUpdated: '7 mo',
    images: [
      'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=400',
      'https://images.unsplash.com/photo-1613376023733-0a73315d9b06?w=400',
      'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400',
      'https://images.unsplash.com/photo-1635805737707-575885ab0820?w=400'
    ]
  },
  { 
    id: 3, 
    title: 'Nature Photography', 
    pinCount: 24, 
    lastUpdated: '3 mo',
    images: [
      'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400',
      'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400',
      'https://images.unsplash.com/photo-1426604966848-d7adac402bff?w=400',
      'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=400'
    ]
  }
];

const likedArts = [
  { id: 1, title: 'Mountain Landscape', image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600' },
  { id: 2, title: 'Abstract Art', image: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=600' },
  { id: 3, title: 'Ocean Waves', image: 'https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=600' },
  { id: 4, title: 'Forest Path', image: 'https://images.unsplash.com/photo-1511497584788-876760111969?w=600' },
  { id: 5, title: 'City Lights', image: 'https://images.unsplash.com/photo-1514565131-fce0801e5785?w=600' },
  { id: 6, title: 'Sunset Beach', image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600' },
  { id: 7, title: 'Desert Dunes', image: 'https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=600' },
  { id: 8, title: 'Waterfall', image: 'https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?w=600' }
];

const boardSuggestions = [
  { id: 1, title: 'Inspirational Quotes', image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=600' },
  { id: 2, title: 'Modern Architecture', image: 'https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=600' },
  { id: 3, title: 'Minimalist Design', image: 'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=600' },
  { id: 4, title: 'Vintage Aesthetic', image: 'https://images.unsplash.com/photo-1452457807411-4979b707c5be?w=600' }
];

function SaveWork() {
  const [activeTab, setActiveTab] = useState('Boards');

  return (
    <div className="min-h-screen bg-white">
      
      <Header
        name="Janindu"
        followingCount={0}
        searchPlaceholder="Search your Pins"
      />

      <div className="max-w-7xl mx-auto px-6 mt-10">

        <h1 className="text-5xl font-bold mb-8 text-gray-900 text-center">
          Your saved ideas
        </h1>

        <TabNavigation
          tabs={['Pins', 'Boards', 'Collages']}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />

        {activeTab === 'Boards' && (
          <>
            <div className="flex justify-between items-center mt-8 mb-6">
              <ActionButtons />
            </div>
            <BoardList boards={savedBoards} />
          </>
        )}

        {activeTab === 'Pins' && (
          <LikedArts likedArts={likedArts} />
        )}

        {activeTab === 'Collages' && (
          <div className="text-center py-20">
            <p className="text-gray-500 text-lg">No collages yet</p>
          </div>
        )}

        {/* <Suggestions suggestions={boardSuggestions} /> */}

      </div>
    </div>
  );
}

export default SaveWork;
