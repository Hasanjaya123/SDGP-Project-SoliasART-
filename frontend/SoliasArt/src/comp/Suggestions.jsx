import ArtCard from "./ArtCard";

function Suggestions({Suggestions}) {
    return (
        <section className="mt-16">
            <h2 className="text-xl font-semibold mb-6">
                Board suggestions
            </h2>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {Suggestions.map((sug) => (
                    <div
                        key={sug.id}
                        className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition cursor-pointer"
                    >
                        <img
                        src={sug.image}
                        alt={sug.title}
                        className="w-full h-40 object-cover"
                        />
                        <p className="p-3 text-sm font-medium text-gray-800">
                        {sug.title}
                        </p>
                    </div>
                ))}
            </div>
        </section>
    );
}

export default Suggestions;