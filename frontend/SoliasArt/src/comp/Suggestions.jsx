import ArtCard from "./ArtCard";

function Suggestions({Suggestions}) {
    return (
        <section className="suggestions">
            <h2>Board suggestions</h2>
            <div className="suggestions-grid">
                {Suggestions.map((sug) => (
                    <ArtCard key={sug.id} title={sug.title} image={sug.image} />

                ))}
            </div>
        </section>
    );
}

export default Suggestions;