import React from 'react';
import { ISpeedDialRecord } from '@webex-int/adapter-interfaces';

/**
 * https://docs.microsoft.com/en-us/graph/api/resources/contact?view=graph-rest-1.0#properties
 */
export type IFormData = ISpeedDialRecord;

export interface ISpeedDialFormProps {
  cancelText?: string;
  addText?: string;
  data?: IFormData;
  onSubmit?: (data: IFormData) => void;
  onCancel?: () => void;
  children?: React.ReactNode;
  isContact?: boolean;
  isEdit?: boolean;
}

export interface ISelectItems {
  id: string;
  value: string;
}
