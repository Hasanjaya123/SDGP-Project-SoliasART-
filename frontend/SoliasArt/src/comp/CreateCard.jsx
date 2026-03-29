import Button from './Buttonz';

function CreateCard({ onCreate }) {
  return (
    <div className="create-card">
      <Button onClick={onCreate}>Create</Button>
    </div>
  );
}

export default CreateCard;