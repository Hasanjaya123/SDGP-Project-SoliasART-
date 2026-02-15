import React, {userState} from 'react';
import Header from '../comp/header.jsx';
import TabNavigation from '../comp/TabNavigation.jsx'
import ActionButtons from '../comp/ActionButtons.jsx'
import Footer from '../components/Footer.jsx'
import BoardList from '../comp/BoardList.jsx';
import LikedArtS from '../comp/LikedArts.jsx';
import Suggestions from '../comp/Suggestions.jsx';


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

    const [activeTab, serActiveTab] = useState("Saved arts");

    const handleTabChange= (tab) => {
        setActiveTab(tab);
    };

    const handleGroup= () => {
        console.log('Group clicked');
    };

    const handleCreate= () => {
        console.log('Create Clicked');
    };

    return (
        <div className="app-container">
      <Header
        name="Janindu"
        followingCount={0}
        searchPlaceholder="Search your saved arts"
      />
      <h1>Your saved ideas</h1>
      <TabNavigation
        tabs={['Saved Arts', 'Liked Arts']}
        activeTab={activeTab}
        onTabChange={handleTabChange}
      />
      <ActionButtons onGroup={handleGroup} onCreate={handleCreate} />
      {activeTab === 'Saved Arts' && (
        <BoardList boards={savedBoards} onCreate={handleCreate} />
      )}
      {activeTab === 'Liked Arts' && <LikedArts likedArts={likedArts} />}
      <Suggestions suggestions={boardSuggestions} />
      <Footer profileUrl="https://www.artwebsite.com/janindu" />
    </div>

    );

    
}

export default SaveArtPage