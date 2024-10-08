import {
    AvatarNext as Avatar,
    Flex,
    SelectNext as Select,
    Text,
} from '@momentum-ui/react-collaboration';
import { Item } from '@react-stately/collections';
import { IWebexIntContact } from '@webex/component-adapter-interfaces/dist/esm/src';
import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { removeBracketsAndContent } from '../../src/utils/avatarInitials';
import { CallButtons } from "../CallButtons/CallButtons";
import { useLazyLoadAvatarUrl } from '../hooks/useLazyLoadAvatarUrl';
import useWebexClasses from '../hooks/useWebexClasses';
import './ContactCard.styles.scss';
  
  type Props = {
    style?: React.CSSProperties;
    user: IWebexIntContact;
    noCallableAddressMessage?: string;
    makeCall?: (address: string, isVideo?: boolean, label?: string) => void;
  };
  
  /**
   * Description for this component.
   *
   * @param {Props} props Props for this component
   * @param props.style optional styles to add
   * @param props.user user to display call options for
   * @param props.onSelect callback function to call when the selection is updated.  It is called once at component mount with the default value
   * @param props.noCallableAddressMessage message to display when there is no callable entry for a user
   * @returns Contact card react component
   */
  export const ContactCard = ({
    user,
    style = undefined,
    noCallableAddressMessage = 'No addresses found',
    makeCall
  }: Props) => {
    const [cssClasses, sc] = useWebexClasses('contact-card');
    const [imageUrl] = useLazyLoadAvatarUrl(user.id, user.fetchAvatarUrl);
    const { t } = useTranslation();
    const callables = useMemo(
      () => [...user.phoneNumbers, ...user.emailAddresses],
      [user]
    );
    const chatLabel = '1:1 chat'
    const [selectedAddress, setSelectedAddress] = useState(callables[0]?.address);
    const callSelectElement =
      callables.length > 1 ? (
        <Select
          className={sc('select')}
          onSelectionChange={(address) => setSelectedAddress(address.toString())}
          defaultSelectedKey={callables[0].address}
          aria-label="select address to call"
        >
          {callables.map((entity) => (
            <Item
              key={entity.address}
            >{`${t('label.address.'+ entity.type)}: ${entity.address}`}</Item>
          ))}
        </Select>
      ) : (
        callables[0]?.address ? (
          <Text type="body-secondary" className={sc('text-address')}>
          {t('label.address.'+ callables[0]?.type) }: {callables[0]?.address}
          </Text>
        ) : (
          <Text type="body-secondary" className={sc('text-address')}>
           {noCallableAddressMessage}
          </Text>
        )
      );
  
    return (
      <Flex
        className={cssClasses}
        style={style}
        direction="column"
        alignItems="center"
        ygap="15px"
      >
        <Avatar
          initials={removeBracketsAndContent(user.name)}
          title={user.name}
          size={88}
          src={imageUrl}
          className={sc('avatar')}
        />
        <Text type="banner-secondary" className={sc('name')}>
          {user.name}
        </Text>
        {callSelectElement}
        <CallButtons 
         address={selectedAddress} 
         className={sc('call-buttons')}
         useMakeAudioCall={() => makeCall && makeCall(selectedAddress, false, chatLabel)}
         useMakeVideoCall={() => makeCall && makeCall(selectedAddress, true, chatLabel)}
        />
      </Flex>
    );
  };
  