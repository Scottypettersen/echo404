// src/pages/Access3.jsx
import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { useEcho } from '../context/EchoContext';

const CORRECT_ORDER = ['E', 'C', 'H', 'O'];

function shuffle(array) {
  return array
    .map((value) => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value);
}

export default function Access3() {
  // initialize tiles only once
  const [tiles, setTiles] = useState(() => shuffle(CORRECT_ORDER));
  const [solved, setSolved] = useState(false);
  const timerRef = useRef(null);
  const navigate = useNavigate();
  const { setWhisper } = useEcho();

  // cleanup any pending timeout on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const reordered = Array.from(tiles);
    const [moved] = reordered.splice(result.source.index, 1);
    reordered.splice(result.destination.index, 0, moved);

    setTiles(reordered);

    if (reordered.join('') === CORRECT_ORDER.join('')) {
      setSolved(true);
      setWhisper('MEMORY ALIGNED');
      localStorage.setItem('echo-unlocked', 'true');

      timerRef.current = setTimeout(() => {
        navigate('/unlock');
      }, 1500);
    }
  };

  return (
    <main
      style={{
        backgroundColor: '#000',
        color: '#0f0',
        fontFamily: 'monospace',
        height: '100vh',
        padding: '2rem',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <h1 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>
        {'> Final Trace Lock'}
      </h1>
      <p style={{ fontSize: '0.9rem', marginBottom: '1.5rem' }}>
        Reorder memory tiles to restore access.
      </p>

      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="tiles" direction="horizontal">
          {(provided) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              aria-label="Reorder the tiles"
              role="list"
              style={{
                display: 'flex',
                gap: '1rem',
                marginBottom: '1rem',
              }}
            >
              {tiles.map((letter, index) => (
                <Draggable key={letter} draggableId={letter} index={index}>
                  {(prov) => (
                    <div
                      ref={prov.innerRef}
                      {...prov.draggableProps}
                      {...prov.dragHandleProps}
                      role="listitem"
                      style={{
                        backgroundColor: '#111',
                        color: '#0f0',
                        border: '1px solid #0f0',
                        fontSize: '1.25rem',
                        width: 50,
                        height: 50,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: solved ? 'default' : 'grab',
                        userSelect: 'none',
                        ...prov.draggableProps.style,
                      }}
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
    </main>
  );
}
