import React from 'react';
import renderer from 'react-test-renderer';

import ConfirmationModal from '.';

describe('ConfirmationModal component', () => {
  const messages = {
    title: 'Delete',
    body: 'Are you sure you want to delete this message?',
    actionButtonText: 'Delete',
    cancelButtonText: 'Cancel'
  };

  const onActionClick = jest.fn();
  const onCancelClick = jest.fn();

  const modal = (
    <ConfirmationModal
      messages={messages}
      onClickActionButton={onActionClick}
      onClickCancelButton={onCancelClick}
    />
  );

  const component = renderer.create(modal);

  it('renders properly', () => {
    expect(component).toMatchSnapshot();
    expect(component.toHaveFocus);
  });
});