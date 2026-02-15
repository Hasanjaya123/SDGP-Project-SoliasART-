function ArtCard({ title, image }) {
    return (
        <div className="art-card">
            <img src={image} alt={title} />
            <p>{title}</p>
        </div>
    );
}

export default ArtCard;