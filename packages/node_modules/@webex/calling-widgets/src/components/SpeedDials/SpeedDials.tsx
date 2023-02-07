import React, { useRef, useState } from 'react';
import {
  SortableContainer,
  SortableElement,
  SortableHandle,
  SortEnd,
} from 'react-sortable-hoc';
import { arrayMoveMutable } from 'array-move';
import { ISpeedDialRecord } from '@webex-int/adapter-interfaces';

import useWebexClasses from '../../hooks/useWebexClasses';
import { ISpeedDialProps, SpeedDialItem } from './SpeedDialItem';
import { ISpeedDialsListProps, ISpeedDialsProps } from './SpeedDials.types';

import './SpeedDials.styles.scss';

const DraggableIcon = () => (
  <div className="wxc-speed-dial-item__draggable">
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
      <path
        d="M8.5 17c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm7-10c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm-7 3c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm7 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 7c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm-7-14c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"
        fill="currentColor"
      />
    </svg>
  </div>
);

const DragHandle = SortableHandle(() => <DraggableIcon />);

const SortableItem = SortableElement<ISpeedDialProps>(
  ({
    item,
    isAudio,
    onPress,
    onAudioCallPress,
    onVideoCallPress,
    onRemovePress,
    onEditPress,
  }: ISpeedDialProps) => (
    <li>
      <SpeedDialItem
        id={item.id}
        key={item?.id}
        item={item}
        isAudio={isAudio}
        onPress={onPress}
        onAudioCallPress={onAudioCallPress}
        onVideoCallPress={onVideoCallPress}
        onEditPress={onEditPress}
        onRemovePress={onRemovePress}
      >
        <DragHandle />
      </SpeedDialItem>
    </li>
  )
);

const SortableList = SortableContainer<ISpeedDialsListProps>(
  ({
    items = [],
    onPress,
    onVideoCallPress,
    onAudioCallPress,
    onEditPress,
    onRemovePress,
    className,
  }: {
    items: ISpeedDialRecord[];
    onPress?: (item: ISpeedDialRecord) => void;
    onVideoCallPress?: (item: ISpeedDialRecord) => void;
    onAudioCallPress?: (item: ISpeedDialRecord) => void;
    onEditPress?: (item: ISpeedDialRecord) => void;
    onRemovePress?: (id: string) => void;
    className: string;
  }) => (
    <ul className={className}>
      {items &&
        items.map((item, index) => (
          <SortableItem
            id={item.id}
            key={`speed-dial-${item.id}`}
            index={index}
            item={item}
            isAudio={item?.callType !== 'video'}
            onPress={onPress}
            onAudioCallPress={onAudioCallPress}
            onVideoCallPress={onVideoCallPress}
            onEditPress={onEditPress}
            onRemovePress={onRemovePress}
          />
        ))}
    </ul>
  )
);

/**
 * @description This is the Speed Dials component
 * @param {ISpeedDialsProps} obj - An object of props.
 * @param {Array} obj.items An array of speed dial items
 * @param {Function} obj.onSortEnd Function to call when sorting ends.
 * @param {Function} obj.onEditPress Function to call when edit action is pressed.
 * @param {Function} obj.onRemovePress Function to call when remove action is pressed.
 * @param {Function} obj.onVideoCallPress Function to call when video call button pressed.
 * @param {Function} obj.onAudioCallPress Function to call when audio call button pressed.
 * @returns {React.Component} SpeedDials component
 */
export const SpeedDials = ({
  items = [],
  onPress = undefined,
  onAudioCallPress = undefined,
  onVideoCallPress = undefined,
  onEditPress = undefined,
  onRemovePress = undefined,
  onSortEnd: onSortEndCb = undefined,
}: ISpeedDialsProps) => {
  const [grabbing, setGrabbing] = useState<boolean>(false);
  const [classes, sc] = useWebexClasses('speed-dial', undefined, {
    grabbing,
  });
  const speedDialsRef = useRef<HTMLDivElement>(null);

  const handleSortEnd = (sort: SortEnd) => {
    setGrabbing(false);
    arrayMoveMutable(items, sort.oldIndex, sort.newIndex);
    if (onSortEndCb) {
      onSortEndCb(items);
    }
  };

  return (
    <div className={classes} ref={speedDialsRef}>
      <SortableList
        helperClass="wxc-sortable-item"
        helperContainer={speedDialsRef.current as HTMLElement}
        onSortEnd={handleSortEnd}
        onSortStart={() => setGrabbing(true)}
        onPress={onPress}
        onVideoCallPress={onVideoCallPress}
        onAudioCallPress={onAudioCallPress}
        onEditPress={onEditPress}
        onRemovePress={onRemovePress}
        useDragHandle
        items={items}
        axis="xy"
        className={sc('list')}
      />
    </div>
  );
};
