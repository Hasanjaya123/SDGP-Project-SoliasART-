import SaveArtButton from '../comp/Buttonz.jsx'
import Profile from '../comp/userProfile.jsx'
import TabNavigation from '../comp/TabNavigation.jsx'
import ActionButtons from '../comp/ActionButtons.jsx'
import Footer from '../components/Footer.jsx'
import SearchBar from '../comp/SearchBar.jsx'
import { useState } from 'react'

function SaveArtPage(){

    const [activeTab, serActiveTab] = useState("Saved arts");

    
    return(
        
        <div>
            <Profile name="Your Name" followingCount={0} />
            <h1>hello bitches</h1>
            <SaveArtButton />
            <Profile />
        </div>



    )
}

export default SaveArtPage