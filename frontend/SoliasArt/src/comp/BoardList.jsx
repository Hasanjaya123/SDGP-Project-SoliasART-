import BoardCard from'./BoardCard';
import CreateCard from'./CreateCard';

function BoardList({ boards }) {
    return (
        <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-8">
            {boards.map(board => (
                <div
                    key={board.id}
                    className="bg-[#FEFDFB] rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer border border-[#E5DDD0] hover:border-[#C58940]"
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
                    <div className="p-4 bg-[#FAF8F4]">
                        <h3 className="font-semibold text-lg text-[#2C2416]">
                        {board.title}
                        </h3>
                        <p className="text-sm text-[#9B8B7A] mt-1">
                        {board.pinCount} Arts · {board.lastUpdated}
                        </p>
                    </div>

                </div>



            ))}
            {/* Create Card */}
            <div className="flex items-center justify-center bg-[#F5E6D3] rounded-2xl h-60 hover:bg-[#F0EBE3] transition-all duration-300 cursor-pointer border-2 border-dashed border-[#C58940] group">
                <div className="text-center">
                <span className="text-[#8B6F47] font-semibold text-lg group-hover:text-[#C58940] transition">
                    + Create Board
                </span>
                </div>
            </div>



            </section>

            
            
        
    );

}

export default BoardList;