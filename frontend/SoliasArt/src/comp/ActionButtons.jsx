import Button from './Buttonz';

function ActionButtons({ onGroup, onCreate }) {
  return (
    <div className="actions">
      <Button onClick={onGroup}>Group</Button>
      <Button className="create-btn" onClick={onCreate}>Create</Button>
    </div>
  );
}

export default ActionButtons;