import {useState} from 'react';
import Header from '../comp/header.jsx';
import TabNavigation from '../comp/TabNavigation';
import ActionButtons from '../comp/ActionButtons';
import BoardList from '../comp/BoardList';
import LikedArts from '../comp/LikedArts';
import Suggestions from '../comp/Suggestions';


// Dummy data for now

const savedBoards = [
  { id: 1, title: 'Life', pinCount: 13, lastUpdated: '6 mo', image: 'https://via.placeholder.com/150?text=Life+Art' },
  { id: 2, title: 'Anime Art', pinCount: 7, lastUpdated: '7 mo', image: 'https://via.placeholder.com/150?text=Anime+Art' },
];

const likedArts = [
  { id: 1, title: 'Abstract Painting', image: 'https://via.placeholder.com/150?text=Abstract' },
  { id: 2, title: 'Landscape Drawing', image: 'https://via.placeholder.com/150?text=Landscape' },
];

const boardSuggestions = [
  { id: 1, title: 'Nature Inspirations', image: 'https://via.placeholder.com/150?text=Nature' },
  { id: 2, title: 'Fantasy Worlds', image: 'https://via.placeholder.com/150?text=Fantasy' },
];



    


function SaveArtPage(){

    const [activeTab, setActiveTab] = useState("Saved arts");

    
    return (
    <div className="min-h-screen bg-gray-50">
      
      <Header
        name="Janindu"
        followingCount={0}
        searchPlaceholder="Search your Pins"
      />

      <div className="max-w-6xl mx-auto px-6 mt-10">

        <h1 className="text-4xl font-bold mb-6 text-gray-900">
          Your saved ideas
        </h1>

        <TabNavigation
          tabs={['Saved Arts', 'Liked Arts']}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />

        <div className="flex justify-between items-center mt-6">
          <ActionButtons />
        </div>

        {activeTab === 'Saved Arts' && (
          <BoardList boards={savedBoards} />
        )}

        {activeTab === 'Liked Arts' && (
          <LikedArts likedArts={likedArts} />
        )}

        {/* <Suggestions suggestions={boardSuggestions} /> */}

      </div>
    </div>
  );
}

export default SaveArtPage