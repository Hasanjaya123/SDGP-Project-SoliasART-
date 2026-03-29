function BoardList({ boards }) {
  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-8">
      {boards.map(board => (
        <div
          key={board.id}
          // CHANGED: bg-white → bg-gray-900, shadow-sm → border border-gray-800
          className="bg-gray-900 rounded-2xl overflow-hidden border border-gray-800 hover:border-gray-600 transition cursor-pointer"
        >
          {/* Image Grid Preview - unchanged structure */}
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
            {/* CHANGED: text-gray-900 → text-white */}
            <h3 className="font-semibold text-lg text-white">
              {board.title}
            </h3>
            {/* CHANGED: text-gray-500 → text-gray-400, fixed encoding issue · */}
            <p className="text-sm text-gray-400 mt-1">
              {board.pinCount} Arts · {board.lastUpdated}
            </p>
          </div>
        </div>
      ))}

      {/* Create Card - CHANGED: bg-gray-100 → bg-gray-800, text-gray-600 → text-gray-400, hover dark */}
      <div className="flex items-center justify-center bg-gray-800 rounded-2xl h-60 hover:bg-gray-700 transition cursor-pointer border border-dashed border-gray-600">
        <span className="text-gray-400 font-medium text-lg">+ Create</span>
      </div>
    </section>
  );
}

export default BoardList;