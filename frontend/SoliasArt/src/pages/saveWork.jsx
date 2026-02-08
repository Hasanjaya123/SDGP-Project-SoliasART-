import SaveArtButton from '../comp/button.jsx'
import Profile from '../comp/userProfile.jsx'

function SaveArtPage(){
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