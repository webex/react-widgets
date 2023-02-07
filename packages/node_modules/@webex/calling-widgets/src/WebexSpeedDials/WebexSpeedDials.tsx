import React, { forwardRef, useImperativeHandle, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ISpeedDialRecord } from '@webex-int/adapter-interfaces';
import useWebexClasses from '../hooks/useWebexClasses';
import useSpeedDials, {
  addSpeedDial,
  clearSpeedDial,
  editSpeedDial,
  removeSpeedDial,
  reorderSpeedDial,
  selectSpeedDial,
  updateSpeedDial,
} from '../hooks/useSpeedDials';
import {
  SpeedDialForm,
  SpeedDials,
  SpeedDialSearch,
} from '../components/SpeedDials';

import './WebexSpeedDials.styles.scss';

import { ISpeedDialEvents } from '../components/SpeedDials/SpeedDials.types';
import { SpeedDialModal } from '../components/SpeedDials/SpeedDialModal';
import { IFormData } from '../components/SpeedDials/SpeedDialForm.types';

export interface IWebexSpeedDialsProps extends ISpeedDialEvents {
  userID: string;
  contacts?: ISpeedDialRecord[];
  onSortEnd?: (items?: ISpeedDialRecord[]) => void;
}

export interface IWebexSpeedDialsHandle {
  refreshSpeedDials?: () => void;
  showAddSpeedDial: () => void;
}

/**
 * @description The summary of this component.
 * @param {IWebexSpeedDialsProps} param An object of IWebexSpeedDialsProps
 * @param {string} param.userID The current user ID
 * @param {Function} param.onPress Handler to call speed dial item is pressed.
 * @param {Function} param.onSortEnd Handler to call when sorting ends
 * @param {Function} param.onEditPress Function to call when edit action is pressed.
 * @param {Function} param.onRemovePress Function to call when remove action is pressed.
 * @param {Function} param.onVideoCallPress Function to call when video call button pressed.
 * @param {Function} param.onAudioCallPress Function to call when audio call button pressed.
 * @returns {React.Component} WebexSpeedDials component
 */
export const WebexSpeedDials = forwardRef<
  IWebexSpeedDialsHandle,
  IWebexSpeedDialsProps
>(
  (
    {
      userID,
      contacts = undefined,
      onPress = undefined,
      onSortEnd = undefined,
      onRemovePress = undefined,
      onEditPress = undefined,
      onAudioCallPress = undefined,
      onVideoCallPress = undefined,
    },
    ref
  ) => {
    const { t } = useTranslation('WebexSpeedDials');
    const [cssClasses] = useWebexClasses('speed-dial-widget');

    const { speedDials, selectedItem, dispatch } = useSpeedDials(
      userID,
      contacts
    );
    const [currentView, setCurrentView] = useState('list');
    const addHeaderText = t('modal.add.header');
    const editHeaderText = t('modal.edit.header');

    useImperativeHandle(ref, () => ({
      showAddSpeedDial() {
        setCurrentView('addView');
      },
    }));

    const handleEditPress = (item: ISpeedDialRecord) => {
      editSpeedDial(dispatch, item);
      setCurrentView('editView');
      if (onEditPress) {
        onEditPress(item);
      }
    };

    const handlePress = (item: ISpeedDialRecord) => {
      selectSpeedDial(dispatch, item);
      if (onPress) {
        onPress(item);
      }
    };

    const handleCancel = () => {
      setCurrentView('list');
      clearSpeedDial(dispatch);
    };

    // TODO  - Need to fix this
    const handleSubmit = (data: IFormData) => {
      const index = speedDials.findIndex(
        (e: ISpeedDialRecord) => e.id === data.id
      );
      if (index > -1) {
        updateSpeedDial(dispatch, data);
      } else {
        addSpeedDial(dispatch, data);
      }

      setCurrentView('list');
    };

    const handleSortEnd = (data: ISpeedDialRecord[]) => {
      if (onSortEnd) {
        onSortEnd(data);
      }
      reorderSpeedDial(dispatch, data);
    };

    const handleAddExisting = (item: ISpeedDialRecord) => {
      selectSpeedDial(dispatch, item);
      setCurrentView('editView');
    };

    const handleAddNew = () => {
      clearSpeedDial(dispatch);
      setCurrentView('addView');
    };

    const handleRemovePress = (id: string) => {
      if (onRemovePress) {
        onRemovePress(id);
      }
      removeSpeedDial(dispatch, id);
    };

    const handleAudioCallPress = (item: ISpeedDialRecord) => {
      if (onAudioCallPress) {
        onAudioCallPress(item);
      }
    };
    const handleVideoCallPress = (item: ISpeedDialRecord) => {
      if (onVideoCallPress) {
        onVideoCallPress(item);
      }
    };

    return (
      <div className={cssClasses}>
        {/*  List View */}
        <SpeedDials
          items={speedDials}
          onSortEnd={handleSortEnd}
          onPress={handlePress}
          onRemovePress={handleRemovePress}
          onEditPress={handleEditPress}
          onAudioCallPress={handleAudioCallPress}
          onVideoCallPress={handleVideoCallPress}
        />

        {/*  Search View */}
        {currentView === 'searchView' && (
          <SpeedDialModal onCancel={handleCancel} headerText={addHeaderText}>
            <SpeedDialSearch
              items={contacts}
              onAdd={handleAddNew}
              onPress={handleAddExisting}
            />
          </SpeedDialModal>
        )}
        {/*  Add View */}
        {currentView === 'addView' && (
          <SpeedDialModal onCancel={handleCancel} headerText={addHeaderText}>
            <SpeedDialForm
              addText={t('modal.add.label')}
              data={selectedItem}
              onCancel={handleCancel}
              onSubmit={handleSubmit}
            />
          </SpeedDialModal>
        )}
        {/*  Edit View */}
        {currentView === 'editView' && (
          <SpeedDialModal onCancel={handleCancel} headerText={editHeaderText}>
            <SpeedDialForm
              addText={t('modal.edit.label')}
              isContact={selectedItem?.currentCallAddress !== null}
              onSubmit={handleSubmit}
              onCancel={handleCancel}
              data={selectedItem}
            />
          </SpeedDialModal>
        )}
      </div>
    );
  }
);

WebexSpeedDials.defaultProps = {
  contacts: undefined,
  onSortEnd: undefined,
};
