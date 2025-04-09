import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';

const correctOrder = ['E', 'C', 'H', 'O'];

function Access3() {
  const [tiles, setTiles] = useState(shuffle([...correctOrder]));
  const [solved, setSolved] = useState(false);
  const navigate = useNavigate();

  function shuffle(array) {
    return array
      .map(value => ({ value, sort: Math.random() }))
      .sort((a, b) => a.sort - b.sort)
      .map(({ value }) => value);
  }

  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const reordered = [...tiles];
    const [removed] = reordered.splice(result.source.index, 1);
    reordered.splice(result.destination.index, 0, removed);

    setTiles(reordered);

    if (JSON.stringify(reordered) === JSON.stringify(correctOrder)) {
      setSolved(true);
      localStorage.setItem('echo-unlocked', 'true');
      setTimeout(() => navigate('/unlock'), 1500);
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>{'> Final Trace Lock'}</h1>
      <p style={styles.subtitle}>Reorder memory tiles to restore access.</p>

      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="tiles" direction="horizontal">
          {(provided) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              style={styles.tileRow}
            >
              {tiles.map((letter, index) => (
                <Draggable key={letter} draggableId={letter} index={index}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      style={{ ...styles.tile, ...provided.draggableProps.style }}
                    >
                      {letter}
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      {solved && (
        <p style={{ color: '#0f0', marginTop: '1rem' }}>
          ✓ Memory alignment complete.
        </p>
      )}
    </div>
  );
}

const styles = {
  container: {
    backgroundColor: '#000',
    color: '#0f0',
    fontFamily: 'monospace',
    height: '100vh',
    padding: '2rem',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center'
  },
  title: {
    fontSize: '1.5rem',
    marginBottom: '0.5rem'
  },
  subtitle: {
    fontSize: '0.9rem',
    marginBottom: '1.5rem'
  },
  tileRow: {
    display: 'flex',
    gap: '1rem',
    marginBottom: '1rem'
  },
  tile: {
    backgroundColor: '#111',
    color: '#0f0',
    border: '1px solid #0f0',
    fontFamily: 'monospace',
    fontSize: '1.25rem',
    width: '50px',
    height: '50px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'grab',
    userSelect: 'none'
  }
};

export default Access3;
