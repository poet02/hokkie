import React from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragStartEvent,
  DragOverlay,
  defaultDropAnimationSideEffects,
  MouseSensor,
  TouchSensor,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  rectSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import styled from 'styled-components';
import { GripVertical, MoreVertical } from 'lucide-react';

// Styled Components
const Container = styled.div`
  width: 100%;
  color: #333;
`;

const Grid = styled.div<{ $gridTemplateColumns?: string; $gap?: string }>`
  display: grid;
  grid-template-columns: ${props => props.$gridTemplateColumns};
  gap: ${props => props.$gap};
  padding: 1rem;
`;

// Fixed: Use shouldForwardProp to prevent handlePosition from reaching DOM
const SortableItem = styled.div.withConfig({
  shouldForwardProp: (prop) => !['isDragging'].includes(prop),
})<{ isDragging: boolean }>`
  position: relative;
  background: white;
  border: 2px solid ${props => props.isDragging ? '#1976d2' : '#e0e0e0'};
  border-radius: 8px;
  cursor: grab;
  transition: all 0.2s ease;
  transform: ${props => props.isDragging ? 'scale(1.05)' : 'scale(1)'};
  opacity: ${props => props.isDragging ? 0.5 : 1};
  box-shadow: ${props => props.isDragging 
    ? '0 8px 25px rgba(0, 0, 0, 0.15)' 
    : '0 2px 8px rgba(0, 0, 0, 0.1)'
  };

  &:hover {
    border-color: #1976d2;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }

  &:active {
    cursor: grabbing;
  }
`;

// Fixed: Use shouldForwardProp for DragHandle
const DragHandle = styled.div.withConfig({
  shouldForwardProp: (prop) => !['handlePosition'].includes(prop),
})<{ $handlePosition: 'corner' | 'side' }>`
  position: absolute;
  ${props => props.$handlePosition === 'corner' 
    ? `
      top: 0.5rem;
      right: 0.5rem;
    ` 
    : `
      top: 50%;
      left: 0.5rem;
      transform: translateY(-50%);
    `
  }
  padding: 0.25rem;
  border-radius: 4px;
  cursor: grab;
  color: #666;
  transition: all 0.2s ease;
  opacity: 0.6;
  z-index: 10;

  &:hover {
    color: #1976d2;
    background: rgba(0, 0, 0, 0.05);
    opacity: 1;
  }

  &:active {
    cursor: grabbing;
  }

  svg {
    width: 16px;
    height: 16px;
  }
`;

const ItemContent = styled.div`
  padding: 1rem;
  height: 100%;
`;

const EmptyState = styled.div`
  grid-column: 1 / -1;
  text-align: center;
  padding: 3rem;
  color: #666;
  background: #fafafa;
  border: 2px dashed #e0e0e0;
  border-radius: 8px;
`;

const ItemIndex = styled.div`
  position: absolute;
  top: 0.5rem;
  left: 0.5rem;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  font-weight: 600;
  z-index: 5;
`;

// Types (keep the same)
interface DraggableItem {
  id: string;
  content: React.ReactElement;
}

interface DraggableListProps {
  items: DraggableItem[];
  onReorder: (items: DraggableItem[]) => void;
  gridTemplateColumns?: string;
  gap?: string;
  emptyMessage?: string;
  className?: string;
  showIndex?: boolean;
  dragHandleIcon?: 'grip' | 'dots';
  handlePosition?: 'corner' | 'side';
}

interface SortableItemProps {
  id: string;
  children: React.ReactElement;
  index?: number;
  showIndex?: boolean;
  dragHandleIcon: 'grip' | 'dots';
  handlePosition: 'corner' | 'side';
}

// Sortable Item Component (updated to use $ prefix)
const SortableItemComponent: React.FC<SortableItemProps> = ({
  id,
  children,
  index,
  showIndex,
  dragHandleIcon,
  handlePosition,
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const getDragHandleIcon = () => {
    switch (dragHandleIcon) {
      case 'dots':
        return <MoreVertical size={16} />;
      case 'grip':
      default:
        return <GripVertical size={16} />;
    }
  };

  return (
    <SortableItem
      ref={setNodeRef}
      style={style}
      isDragging={isDragging}
      {...attributes}
    >
      <DragHandle 
        {...listeners}
        $handlePosition={handlePosition} // Changed to $handlePosition
      >
        {getDragHandleIcon()}
      </DragHandle>
      
      {showIndex && index !== undefined && (
        <ItemIndex>
          {index + 1}
        </ItemIndex>
      )}
      
      <ItemContent>
        {children}
      </ItemContent>
    </SortableItem>
  );
};

// Main DraggableList Component (updated Grid props)
export const DraggableList: React.FC<DraggableListProps> = ({
  items,
  onReorder,
  gridTemplateColumns = 'repeat(auto-fill, minmax(200px, 1fr))',
  gap = '1rem',
  emptyMessage = 'No items to display',
  className,
  showIndex = false,
  dragHandleIcon = 'grip',
  handlePosition = 'corner',
}) => {
  const [activeId, setActiveId] = React.useState<string | null>(null);

  const sensors = useSensors(
  useSensor(MouseSensor, {
    activationConstraint: {
      distance: 5,
    },
  }),
  useSensor(TouchSensor, {
    activationConstraint: {
      delay: 250,
      tolerance: 5,
    },
  })
);

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);

    if (over && active.id !== over.id) {
      const oldIndex = items.findIndex((item) => item.id === active.id);
      const newIndex = items.findIndex((item) => item.id === over.id);
      
      onReorder(arrayMove(items, oldIndex, newIndex));
    }
  };

  const handleDragCancel = () => {
    setActiveId(null);
  };

  const getActiveItem = () => {
    if (!activeId) return null;
    return items.find((item) => item.id === activeId)?.content || null;
  };

  if (items.length === 0) {
    return (
      <Container className={className}>
        <Grid $gridTemplateColumns={gridTemplateColumns} $gap={gap}>
          <EmptyState>{emptyMessage}</EmptyState>
        </Grid>
      </Container>
    );
  }

  return (
    <Container className={className}>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDragCancel={handleDragCancel}
      >
        <SortableContext items={items} strategy={rectSortingStrategy}>
          <Grid $gridTemplateColumns={gridTemplateColumns} $gap={gap}>
            {items.map((item, index) => (
              <SortableItemComponent
                key={item.id}
                id={item.id}
                index={index}
                showIndex={showIndex}
                dragHandleIcon={dragHandleIcon}
                handlePosition={handlePosition}
              >
                {item.content}
              </SortableItemComponent>
            ))}
          </Grid>
        </SortableContext>

        <DragOverlay
          dropAnimation={{
            sideEffects: defaultDropAnimationSideEffects({
              styles: {
                active: {
                  opacity: '0.5',
                },
              },
            }),
          }}
        >
          {activeId ? (
            <SortableItem isDragging={true}>
              <ItemContent>
                {getActiveItem()}
              </ItemContent>
            </SortableItem>
          ) : null}
        </DragOverlay>
      </DndContext>
    </Container>
  );
};

// Utility function to create draggable items
export const createDraggableItem = (
  id: string,
  content: React.ReactElement
): DraggableItem => ({
  id,
  content,
});

// Hook for using draggable list state
export const useDraggableList = (initialItems: DraggableItem[] = []) => {
  const [items, setItems] = React.useState<DraggableItem[]>(initialItems);

  const addItem = (id: string, content: React.ReactElement) => {
    setItems(prev => [...prev, createDraggableItem(id, content)]);
  };

  const removeItem = (id: string) => {
    setItems(prev => prev.filter(item => item.id !== id));
  };

  const updateItem = (id: string, content: React.ReactElement) => {
    setItems(prev => prev.map(item => 
      item.id === id ? { ...item, content } : item
    ));
  };

  const reorderItems = (newItems: DraggableItem[]) => {
    setItems(newItems);
  };

  return {
    items,
    setItems,
    addItem,
    removeItem,
    updateItem,
    reorderItems,
  };
};