import ArtDisplayCard from "../components/Art-card";
import Sidebar from "../components/Nav-bar";
import Footer from '../components/Footer';

const Test = () => {
    // Sample data for testing
    const sampleFormData = {
        title: "Sunset Over Mountains",
        category: "Landscape",
        price: 25000,
        height: 400,
        width: 300,
        images: ["https://picsum.photos/400/500"] // sample image
    };

    const sampleImage = "https://picsum.photos/400/500";

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex flex-col">
            <div className="flex flex-1">
                <Sidebar />
                <div className="flex-1 p-8 flex flex-wrap gap-4 items-start justify-center">
                    <ArtDisplayCard image={sampleImage} formData={sampleFormData} />
                    <ArtDisplayCard image={sampleImage} formData={sampleFormData} />
                    <ArtDisplayCard image={sampleImage} formData={sampleFormData} />
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default Test;