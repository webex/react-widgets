// @ts-nocheck
import { useTranslation } from 'react-i18next';
import React, { useCallback, useRef } from 'react';
import {
  AvatarNext as Avatar,
  Flex,
  IconNext as Icon,
  ListHeader,
  MenuNext as Menu,
  Text,
} from '@momentum-ui/react-collaboration';
import { Item, Section } from '@react-stately/collections';
import { ContextMenu, ContextMenuTrigger } from 'react-contextmenu';
import { ISpeedDialRecord } from '@webex-int/adapter-interfaces';

import useWebexClasses from '../../hooks/useWebexClasses';

import './SpeedDialItem.styles.scss';
import { ISpeedDialItem } from './SpeedDials.types';
import { abbrDisplayName } from './SpeedDial.utils';

export interface ISpeedDialProps {
  id: string;
  /** The audio call for speed dial for the item */
  isAudio?: boolean;
  /** The avatar image for the item */
  item: ISpeedDialItem;
  /** The index for reference */
  itemIndex?: number;
  /** Triggered when speed dial item is pressed */
  onPress?: (item: ISpeedDialRecord) => void;
  /** Triggered when audio call action is pressed */
  onAudioCallPress?: (item: ISpeedDialRecord) => void;
  /** Triggered when video call action is pressed */
  onVideoCallPress?: (item: ISpeedDialRecord) => void;
  /** Triggered when remove action is pressed */
  onRemovePress?: (id: string) => void;
  /** Triggered when edit action is pressed */
  onEditPress?: (item: ISpeedDialRecord) => void;

  children?: React.ReactNode;
}

/**
 * Speed Dial Item component renders individual entries.
 *
 * @param {ISpeedDialProps} obj The props for the component
 * @param {number} obj.itemIndex The index of the speed dial
 * @param {Function} obj.onVideoCallPress Handle when item video call button is pressed
 * @param {Function} obj.onAudioCallPress Handle when item audio call button is pressed
 * @param {Function} obj.onRemovePress Triggered when remove action is pressed
 * @param {Function} obj.onEditPress Triggered when edit action is pressed
 * @param {React.ReactNode} obj.children Drag handle component
 * @returns {React.Component} A CallHistoryItem for rendering
 */
export const SpeedDialItem = ({
  id,
  item,
  isAudio = false,
  itemIndex = undefined,
  onPress = undefined,
  onAudioCallPress = undefined,
  onVideoCallPress = undefined,
  onEditPress = undefined,
  onRemovePress = undefined,
  children = undefined,
}: ISpeedDialProps) => {
  const [classes, sc] = useWebexClasses('speed-dial-item', undefined, {});
  const { t } = useTranslation('WebexSpeedDials');
  const actionBtnRef = useRef<HTMLButtonElement>();
  const contextMenuId = `${id}-context-menu`;
  const removeLabel = t('item.remove.label');
  const editLabel = t('item.edit.label');
  const audioCallLabel = t('item.audioCall.label');
  const videoCallLabel = t('item.videoCall.label');
  const contextTriggerRef = useRef<ContextMenu>(null);

  const handleClick = useCallback(() => {
    if (onPress) {
      onPress(item);
    }
  }, [item, onPress]);

  const handleAction = useCallback((key: React.Key) => {
    // close the menu when an action is pressed
    contextTriggerRef.current?.hideMenu({ keyCode: 27 });
    switch (key) {
      case '.$remove':
        if (onRemovePress) {
          onRemovePress(item.id);
        }
        break;
      case '.$edit':
        if (onEditPress) {
          onEditPress(item);
        }
        break;
      case '.$audioCall':
        if (onAudioCallPress) {
          onAudioCallPress(item);
        }
        break;
      case '.$videoCall':
        if (onVideoCallPress) {
          onVideoCallPress(item);
        }
        break;
      default:
        throw new Error('Cannot find action');
    }
  }, []);

  return (
    <>
      <ContextMenuTrigger id={contextMenuId} holdToDisplay={-1}>
        <div
          className={classes}
          key={itemIndex}
          onContextMenu={(e) => {
            e.preventDefault();
            actionBtnRef.current?.click();
          }}
        >
          <Flex
            alignItems="center"
            className={sc('content')}
            direction="column"
            role="button"
            tabIndex={0}
            onClick={handleClick}
          >
            {children && (
              <div className={sc('drag-handle')}>
                <span className={sc('drag-icon')}>{children}</span>
              </div>
            )}
            {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events */}
            <div className={sc('actions')}>
              <Flex className={sc('avatar')}>
                <Avatar size={48} title={item?.displayName} src={item?.photo} />
              </Flex>
              <Flex className={sc('action')}>
                {isAudio && <Icon scale={32} name="handset" weight="filled" />}
                {!isAudio && <Icon scale={32} name="video" />}
              </Flex>
            </div>
            <Flex direction="column" className={sc('meta')} alignItems="center">
              <Text type="body-primary" className={sc('name')}>
                {abbrDisplayName(item?.displayName)}
              </Text>
              <Text type="body-secondary" className={sc('status')}>
                {item?.status}
              </Text>
            </Flex>
          </Flex>
        </div>
      </ContextMenuTrigger>
      {/* Context Menu Actions */}
      <ContextMenu
        className={sc('context-menu')}
        id={contextMenuId}
        preventHideOnResize
        preventHideOnContextMenu
        ref={contextTriggerRef}
      >
        <Menu
          key={`${item?.id}-menu`}
          aria-label="Speed Dial Item Menu"
          disabledKeys={[item?.callType as React.Key]}
          defaultSelectedKeys={item?.callType}
          onAction={handleAction}
          className={sc('menu')}
        >
          <Section key={0}>
            <Item key="audioCall">{audioCallLabel}</Item>
            <Item key="videoCall">{videoCallLabel}</Item>
          </Section>
          <Section
            key={1}
            title={<ListHeader outline outlineColor="secondary" />}
          >
            <Item key="edit">{editLabel}</Item>
            <Item key="remove">{removeLabel}</Item>
          </Section>
        </Menu>
      </ContextMenu>
    </>
  );
};
