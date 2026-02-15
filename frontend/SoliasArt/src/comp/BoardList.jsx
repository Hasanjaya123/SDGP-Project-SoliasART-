import BoardCard from'./BoardCard';
import CreateCard from'./CreateCard';

function BoardList({ boards, onCreate }) {
    return (
        <section className='saved-boards'>
            {boards.map((board) => (
                <BoardCard 
                key={board.id}
                title={board.title}
                pinCount={board.pinCount}
                lastUpdated={board.lastUpdated}
                image={board.image}
                
                
                />
            ))}
            <CreateCard onCreate={onCreate} />
            </section>

            
            
        
    );

}

export default BoardList;