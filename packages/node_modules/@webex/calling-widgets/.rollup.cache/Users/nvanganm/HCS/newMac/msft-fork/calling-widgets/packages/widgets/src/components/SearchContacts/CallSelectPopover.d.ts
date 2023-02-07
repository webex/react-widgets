import React from 'react';
import './SearchContactsList.styles.scss';
import { IWebexIntCallableEntity } from '@webex-int/adapter-interfaces';
import './CallSelectPopover.scss';
interface ICallSelectPopoverProps {
    callables: IWebexIntCallableEntity[];
    isVideo?: boolean;
    children: React.ReactElement;
}
export interface ICallSelectPopoverHandle {
    hidePopover: () => void;
}
/**
 *
 * @param {ICallSelectPopoverProps} props
 * @param props.callables all callable addresses
 * @param props.isVideo whether a call initialized from this popover will be a audio or video call
 * @param props.children button that controls showing the popover
 */
export declare const CallSelectPopover: React.ForwardRefExoticComponent<ICallSelectPopoverProps & React.RefAttributes<ICallSelectPopoverHandle>>;
export {};
//# sourceMappingURL=CallSelectPopover.d.ts.map