function BoardCard({ title, pinCount, lastUpdated, image }) {
  return (
    <div className="board-card">
      <img src={image} alt={title} />
      <h3>{title}</h3>
      <p>{pinCount} Arts · {lastUpdated}</p>
    </div>
  );
}

export default BoardCard;