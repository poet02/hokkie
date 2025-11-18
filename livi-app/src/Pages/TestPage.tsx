import { DraggableList, createDraggableItem, useDraggableList } from '../Components/DraggableList';
import { Image, FileText, Video } from 'lucide-react';

export const TestPage: React.FC = () => {
  const { items, reorderItems } = useDraggableList([
    createDraggableItem('1', <div>Item 1</div>),
    createDraggableItem('2', <div>Item 2</div>),
    createDraggableItem('3', <div>Item 3</div>),
  ]);

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Draggable List Test</h1>
      <DraggableList
        items={items}
        onReorder={reorderItems}
      />
    </div>
  );
};