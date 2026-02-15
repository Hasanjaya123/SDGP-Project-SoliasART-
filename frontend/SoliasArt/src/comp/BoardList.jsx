import BoardCard from'./BoardCard';
import CreateCard from'./CreateCard';

function BoardList({ boards }) {
    return (
        <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-8">
            {boards.map(board => (
                <div
                    key={board.id}
                    className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition cursor-pointer"
                    >

                    {/* Image Grid Preview */}
                    <div className="grid grid-cols-2 grid-rows-2 h-44">
                        {board.images.map((img, index) => (
                        <img
                            key={index}
                            src={img}
                            alt={`${board.title} preview ${index}`}
                            className="w-full h-full object-cover"
                        />
                        ))}
                    </div>

                    {/* Text Section */}
                    <div className="p-4">
                        <h3 className="font-semibold text-lg text-gray-900">
                        {board.title}
                        </h3>
                        <p className="text-sm text-gray-500 mt-1">
                        {board.pinCount} Arts · {board.lastUpdated}
                        </p>
                    </div>

                </div>



            ))}
            {/* Create Card */}
            <div className="flex items-center justify-center bg-gray-100 rounded-2xl h-60 hover:bg-gray-200 transition cursor-pointer">
                <span className="text-gray-600 font-medium">+ Create</span>
            </div>



            </section>

            
            
        
    );

}

export default BoardList;