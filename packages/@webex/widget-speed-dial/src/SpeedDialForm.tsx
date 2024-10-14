import {
  ButtonPill,
  Flex,
  SelectNext as Select,
  TextInput
} from '@momentum-ui/react-collaboration';
import { Item } from '@react-stately/collections';
import React, { useEffect, useRef, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { v4 as uuid } from 'uuid';
import {
  fieldErrorToMessage,
  getPhoneOptions,
  setPhoneOptions
} from './SpeedDial.utils';
import './SpeedDialForm.styles.scss';
import {
  IFormData,
  ISelectItems,
  ISpeedDialFormProps,
  PhoneType
} from './SpeedDialForm.types';
import useWebexClasses from './hooks/useWebexClasses';

/**
 * The form for creating/editing a speed dial.
 *
 * @param {string} cancelText The text for the cancel button
 * @param {string} addText The the text for the add button
 * @param {object} data The form data to populate with
 * @param {Function} onSubmit Callback function when form submit
 * @param {Function} onCancel Callback function when form reset
 * @param {boolean} isEdit If the speed dial item is being edited
 * @param {boolean} isContact If the speed dial item is existing contact
 * @returns {React.Component} SpeedDialForm component
 */
export const SpeedDialForm = ({
  cancelText = 'Cancel',
  addText = 'Add',
  data = {
    id: 'l_'+ uuid(),
    givenName: '',
    surname: '',
    displayName: '',
    phone: '',
    callType: PhoneType.HANDSET,
    phoneType: 'work',
  },
  onSubmit = undefined,
  onCancel = undefined,
  isEdit = false,
  isContact = false,
  searchText,
  usedPhonesList = [],
  inUseText = 'in use',
  inUsePlaceHolder = 'All available numbers in use',
  handleEnterKeyPress = undefined,
  headerText
}: ISpeedDialFormProps) => {
  const [cssClasses, sc] = useWebexClasses('speed-dial-form', undefined, {
    isContact,
    isEdit,
  });
  const [formData, setFormData] = useState(data);
  const { t } = useTranslation('WebexSpeedDials');
  const phoneOptions = getPhoneOptions(formData);// TODO get all types of phone option
  const formInputRef = useRef<HTMLInputElement>(null); 
  const formSelectRef = useRef<HTMLInputElement>(null); 

  if (!formData.phoneType) {
    phoneOptions.find((element) => {
      if(!(usedPhonesList.includes(element.key))) {
        if (element.key === PhoneType.WORK) {
          formData.phoneType = PhoneType.WORK
        }  else if (formData.phoneType != PhoneType.WORK) {   
            formData.phoneType = element.key;
        } 
      } 
    })  
  }

  // adding searched text
  if(!formData.givenName) {
    formData.givenName = searchText;
  }

  //const phoneTypes: string[] = t('form.phoneTypes', {
  //  returnObjects: true,
  //  defaultValue: ['Work', 'Mobile', 'Email', 'Other', 'SIP'],
  //});
  //const phoneTypeOptions = getPhoneTypeOptions(phoneTypes);
  const phoneTypes: string[] = [ "work", "mobile", "mail", "other", "sip"];
  const phoneTypeOptions = [...phoneTypes].map((type: string) => ({
      id: type,
      value: t('form.phoneTypes.'+ type),
  }));

  const callTypeOptions: ISelectItems[] = t('form.callTypeOptions', {
    returnObjects: true,
    defaultValue: [
      {
        id: PhoneType.HANDSET,
        value: PhoneType.AUDIOCALL,
      },
      {
        id: PhoneType.VIDEO,
        value: PhoneType.VIDEOCALL,
      },
    ],
  });

  const processSubmit = (speedDialData: IFormData) => {
    if (!speedDialData?.givenName && speedDialData.name) {
      const names: string[] = speedDialData.name.split(/\s+/);
      speedDialData.givenName = names[0]
      //Added condition to avoid adding undefined if don't have last name
      if (names[1]) {
        // names[1] = `${names[1].substr(0, 1)}.`;
        speedDialData.surname = names[1]
      }
      else {
        speedDialData.surname = ''
      }
    }

    const displayName = `${speedDialData?.givenName} ${speedDialData?.surname ? ',' + speedDialData.surname : ''}`.trim();
    const currentCallAddress = speedDialData?.phone || speedDialData?.mail || speedDialData?.phoneNumbers && speedDialData?.phoneNumbers[0]?.address || speedDialData?.emailAddresses && speedDialData?.emailAddresses[0]?.address;

    //if (formData.phoneType === PhoneType.MAIL) {
    //  formData.phoneType = 'E' + formData.phoneType
    //}
    //else if (formData?.phoneType) {
    //  formData.phoneType = formData?.phoneType.charAt(0).toUpperCase() + formData.phoneType.slice(1);
    //}
    const phoneType = formData.phoneType;
    delete speedDialData.phoneNumbers;
    delete speedDialData.emailAddresses;

    const payload = setPhoneOptions({
      ...speedDialData,
      displayName,
      currentCallAddress,
      phoneType
    });

    setFormData(payload);
    if (onSubmit) {
      onSubmit(payload);
    }
  };
   {/*  Not in use */}
  // const getDisplayName = () => {
  //   const name = formData?.displayName
  //     ? formData.displayName
  //     : `${formData?.givenName} ${formData?.surname}`;
  //   return name.trim();
  // };

  const { control, handleSubmit, register, reset, formState, setFocus, setValue } =
    useForm<IFormData>({
      defaultValues: {
        ...data,
        phone: formData.phoneType !== PhoneType.MAIL && formData.phoneType !== PhoneType.SIP ? data.currentCallAddress : "",
        mail: formData.phoneType === PhoneType.MAIL ? data?.currentCallAddress : "",
        sip: formData.phoneType === PhoneType.SIP ? data?.currentCallAddress : "",
      },
      mode: 'onChange',
    });

    useEffect(() => {
      // Set the initial value of the phoneType select field in the isContact template
      if(isContact) {
      const initialValue = formData?.phoneType || formData?.mobilePhone;
      setValue('phone', initialValue);
      }
    }, [setValue, formData, isContact]);


    useEffect(() => {
     if (isEdit || ((!isContact && !isEdit))) {
        if (formInputRef.current) {
          formInputRef.current.focus();
        }
      } else if (isContact) {
        if (formSelectRef.current) {
          formSelectRef.current.querySelector("button")?.focus();
          formSelectRef.current.querySelector("button")?.classList.add('md-focus-ring-wrapper');
          formSelectRef.current.querySelector("button")?.classList.add('children');
        }
      }

    }, [isContact, isEdit])


  return (
    <form
      id="speedDialForm"
      onSubmit={handleSubmit(processSubmit)}
      className={cssClasses}
    >
      {/* Phone Select Input */}
      {isContact && (
        <div className={sc('input-container', [''])}>
          <Controller
            control={control}
            name="phone"
            rules={{ required: true }}
            render={({ field: { name, onChange } }) => (
              <Select
                id={name}
                key={name}
                style={{
                  width: '100%',
                }}
                autoFocus
                label={t('form.phone.label')}
                placeholder={formData.phoneType ? '' : inUsePlaceHolder}
                aria-label={formData.phoneType ? t('voiceover.addSpeedDial.numberTypeSelected', {numberType: formData.phoneType}) : inUsePlaceHolder}
                isDisabled={formData.phoneType ? false : true }
                disabledKeys={usedPhonesList}
                defaultSelectedKey={
                  formData?.phoneType || formData?.mobilePhone
                }
                onSelectionChange={(key) => {
                  setFormData({
                    ...formData,
                    phoneType: key.toString(),
                  });
                  // setValue('currentCallAddress', key.toString());
                  onChange(key.toString());
                }}
                ref={formSelectRef}
                >
                {phoneOptions.map((item) => (
                  <Item
                    key={item.key}
                  >
                    {usedPhonesList.includes(item.key)
                      ?
                      <div title={item.value} className="disablePhoneList">
                        <div className='phoneTypeText'>
                          <p className='phoneTypeTextValue'>
                            {item.value}
                          </p>
                        </div>
                        <p className='inUseText'>{inUseText}</p>
                      </div>
                      : <div className='notUsed' title={item.value}>{item.value}</div>
                    }

                  </Item> 
                ))}
              </Select>
            )}
          />
        </div>
      )}

      {isEdit && (
        <>
          {/* First Name */}
          <div className={sc('input-container', ['row', 'required'])}>
            <Controller
              control={control}
              name="givenName"
              rules={{
                required: t('form.firstName.required'),
              }}
              render={({
                field: { name, ref, onChange, onBlur, value },
                fieldState,
              }) => (
                <TextInput
                  id={name}
                  name={value}
                  defaultValue={formData?.givenName}
                  autoFocus
                  autoComplete="off"
                  label={t('form.firstName.label')}
                  aria-label={formData?.givenName}
                  placeholder={value ? '' : t('form.firstName.placeholder')}
                  clearAriaLabel={t("search.labels.clear")}
                  onBlur={onBlur}
                  onInput={(e) => {
                    // setAvatarName(e.currentTarget.value);
                    setFormData({
                      ...formData,
                      givenName: e.currentTarget.value,

                    });
                    onChange(e);
                  }}
                  ref={formInputRef}
                  messageArr={
                    fieldState.error
                      ? [fieldErrorToMessage(fieldState.error)]
                      : []
                  }
                />
              )}
            />
          </div>

          {/* Last Name */}
          <div className={sc('input-container', [''])}>
            <Controller
              control={control}
              name="surname"
              render={({ field: { name, ref, onChange, onBlur, value } }) => (
                <TextInput
                  id={name}
                  name={name}
                  defaultValue={value}
                  autoComplete="off"
                  label={t('form.lastName.label')}
                  aria-label={value}
                  placeholder={t('form.lastName.placeholder')}
                  onBlur={onBlur}
                  clearAriaLabel={t("search.labels.clear")}
                  onInput={(e) => {
                    setFormData({
                      ...formData,
                      surname: e.currentTarget.value,
                    });
                    onChange(e);
                  }}
                  ref={ref}
                />
              )}
            />
          </div>

          {/* Phone Input */}
          <div className={sc('input-container', ['row', 'required'])}>
            {/* Phone Type */}
            <Controller
              control={control}
              name="phoneType"
              rules={{ required: true }}
              render={({ field: { name, onChange } }) => (
                <Select
                  id={name}
                  style={{
                    width: '150px',
                  }}
                  label={t('form.phoneType.label')}
                  aria-label={t('voiceover.addSpeedDial.numberTypeSelected', {numberType: formData.phoneType})}
                  defaultSelectedKey={formData.phoneType}
                  onSelectionChange={(key) => {
                    setFormData({ ...formData, phoneType: key.toString(), currentCallAddress: ''});
                    onChange(key.toString());
                    setFocus('phone');
                  }}
                >
                  {phoneTypeOptions.map((item) => (
                    <Item key={item.id}>{item.value}</Item>
                  ))}
                </Select>
              )}
            />
            {/* Phone - Number */}
            {formData.phoneType !== PhoneType.MAIL && formData.phoneType !== PhoneType.SIP && (
              <Controller
                control={control}
                name="phone"
                rules={{
                  required: t('form.phone.required'),
                  pattern: {
                    value: /^[^A-Za-z\s]{1,}$/,
                    message: t('form.phone.invalid'),
                  },
                }}
                render={({
                  field: { name, ref, onChange, onBlur, value },
                  fieldState,
                }) => (
                  <TextInput
                    id={name}
                    name={name}
                    defaultValue={value}
                    autoComplete="off"
                    label={t('form.phone.label')}
                    placeholder={t('form.phone.placeholder')}
                    aria-label={value}
                    clearAriaLabel={t("search.labels.clear")}
                    onBlur={onBlur}
                    onInput={(e) => {
                      setFormData({
                        ...formData,
                        phone: e.currentTarget.value,
                        emailAddresses: "",
                        sip: ""
                      });
                      setValue("mail", "");
                      setValue("sip", "");
                      onChange(e);
                    }}
                    ref={ref}
                    messageArr={
                      fieldState.error
                        ? [fieldErrorToMessage(fieldState.error)]
                        : []
                    }
                  />
                )}
              />
            )}

            {/* Phone - Email */}
            {formData.phoneType === PhoneType.MAIL && (
              <Controller
                control={control}
                name="mail"
                rules={{
                  required: t('form.mail.required'),
                  pattern: {
                    value: /[a-z\d._%+-]+@[a-z\d.-]+\.[a-z]{2,4}$/,
                    message: t('form.mail.invalid'),
                  },
                }}
                render={({
                  field: { name, ref, onChange, onBlur, value },
                  fieldState,
                }) => (
                  <TextInput
                    id={name}
                    name={name}
                    defaultValue={value}
                    autoComplete="off"
                    label={t('form.mail.label')}
                    placeholder={t('form.mail.placeholder')}
                    aria-label={value}
                    clearAriaLabel={t("search.labels.clear")}
                    onBlur={onBlur}
                    onInput={(e) => {
                      setFormData({
                        ...formData,
                        emailAddresses: e.currentTarget.value,
                        phone:"",
                        sip:""
                      });
                      setValue("phone", "");
                      setValue("sip", "");
                      onChange(e);
                    }}
                    ref={ref}
                    messageArr={
                      fieldState.error
                        ? [fieldErrorToMessage(fieldState.error)]
                        : []
                    }
                  />
                )}
              />
            )}

            {/* Phone - SIP */}
            {formData.phoneType === PhoneType.SIP && (
              <Controller
                control={control}
                name="sip"
                rules={{
                  required: t('form.sip.required'),
                  pattern: {
                    value: /^(sips?):([^@\n]+)(?:@(.+))?$/,
                    message: t('form.sip.invalid'),
                  },
                }}
                render={({
                  field: { name, ref, onChange, onBlur, value },
                  fieldState,
                }) => (
                  <TextInput
                    id={name}
                    name={name}
                    defaultValue={value}
                    autoComplete="off"
                    label={t('form.sip.label')}
                    placeholder={t('form.sip.placeholder')}
                    aria-label={value}
                    clearAriaLabel={t("search.labels.clear")}
                    onBlur={onBlur}
                    onInput={(e) => {
                      setFormData({
                        ...formData,
                        phone: "",
                        emailAddresses: "",
                        sip: e.currentTarget.value,
                      });
                      setValue("mail", "");
                      setValue("phone", "");
                      onChange(e);
                    }}
                    ref={ref}
                    messageArr={
                      fieldState.error
                        ? [fieldErrorToMessage(fieldState.error)]
                        : []
                    }
                  />
                )}
              />
            )}
          </div>
        </>
      )}

      {!isEdit && !isContact && (
        <>
          {/* First Name */}
          <div className={sc('input-container', ['row', 'required'])}>
            <Controller
              control={control}
              rules={{
                required: t('form.firstName.required'),
              }}
              name="givenName"
              render={({
                field: { name, ref, onChange, onBlur, value },
                fieldState,
              }) => (
                <TextInput
                  id={name}
                  name={name}
                  defaultValue={formData?.givenName}
                  autoFocus
                  autoComplete="off"
                  label={t('form.firstName.label')}
                  aria-label={formData?.givenName}
                  placeholder={value ? '' : t('form.firstName.placeholder')}
                  clearAriaLabel={t("search.labels.clear")}
                  onBlur={onBlur}
                  onInput={(e) => {
                    // setAvatarName(e.currentTarget.value);
                    setFormData({
                      ...formData,
                      givenName: e.currentTarget.value,
                    });
                    onChange(e);
                  }}
                  ref={formInputRef}
                  messageArr={
                    fieldState.error
                      ? [fieldErrorToMessage(fieldState.error)]
                      : []
                  }
                />
              )}
            />
          </div>

          {/* Last Name */}
          <div className={sc('input-container', [''])}>
            <Controller
              control={control}
              name="surname"
              render={({ field: { name, ref, onChange, onBlur, value } }) => (
                <TextInput
                  id={name}
                  name={name}
                  defaultValue={value}
                  autoComplete="off"
                  label={t('form.lastName.label')}
                  aria-label={value}
                  placeholder={t('form.lastName.placeholder')}
                  clearAriaLabel={t("search.labels.clear")}
                  onBlur={onBlur}
                  onInput={(e) => {
                    setFormData({
                      ...formData,
                      surname: e.currentTarget.value,
                    });
                    onChange(e);
                  }}
                  ref={ref}
                />
              )}
            />
          </div>

          {/* Phone Input */}
          <div className={sc('input-container', ['row', 'required'])}>
            {/* Phone Type */}
            <Controller
              control={control}
              name="phoneType"
              rules={{ required: true }}
              render={({ field: { name, onChange } }) => (
                <Select
                  id={name}
                  style={{
                    width: '150px',
                  }}
                  label={t('form.phoneType.label')}
                  aria-label={t('voiceover.addSpeedDial.numberTypeSelected', {numberType: formData.phoneType})}
                  defaultSelectedKey={formData.phoneType}
                  onSelectionChange={(key) => {
                    setFormData({ ...formData, phoneType: key.toString() });
                    onChange(key.toString());
                    setFocus('phone');
                  }}
                >
                  {phoneTypeOptions.map((item) => (
                    <Item key={item.id}>{item.value}</Item>
                  ))}
                </Select>
              )}
            />
            {/* Phone - Number */}
            {formData.phoneType !== PhoneType.MAIL && formData.phoneType !== PhoneType.SIP && (
              <Controller
                control={control}
                name="phone"
                rules={{
                  required: t('form.phone.required'),
                  pattern: {
                    value: /^[^A-Za-z\s]{1,}$/,
                    message: t('form.phone.invalid'),
                  },
                }}
                render={({
                  field: { name, ref, onChange, onBlur, value },
                  fieldState,
                }) => (
                  <TextInput
                    id={name}
                    name={name}
                    defaultValue={value}
                    autoComplete="off"
                    label={t('form.phone.label')}
                    placeholder={t('form.phone.placeholder')}
                    aria-label={value}
                    clearAriaLabel={t("search.labels.clear")}
                    onBlur={onBlur}
                    onInput={(e) => {
                      setFormData({
                        ...formData,
                        phone: e.currentTarget.value,
                      });
                      onChange(e);
                    }}
                    ref={ref}
                    messageArr={
                      fieldState.error
                        ? [fieldErrorToMessage(fieldState.error)]
                        : []
                    }
                  />
                )}
              />
            )}

            {/* Phone - Email */}
            {formData.phoneType === PhoneType.MAIL && (
              <Controller
                control={control}
                name="mail"
                rules={{
                  required: t('form.mail.required'),
                  pattern: {
                    value: /[a-z\d._%+-]+@[a-z\d.-]+\.[a-z]{2,4}$/,
                    message: t('form.mail.invalid'),
                  },
                }}
                render={({
                  field: { name, ref, onChange, onBlur, value },
                  fieldState,
                }) => (
                  <TextInput
                    id={name}
                    name={name}
                    defaultValue={value}
                    autoComplete="off"
                    label={t('form.mail.label')}
                    placeholder={t('form.mail.placeholder')}
                    aria-label={value}
                    clearAriaLabel={t("search.labels.clear")}
                    onBlur={onBlur}
                    onInput={onChange}
                    ref={ref}
                    messageArr={
                      fieldState.error
                        ? [fieldErrorToMessage(fieldState.error)]
                        : []
                    }
                  />
                )}
              />
            )}

            {/* Phone - SIP */}
            {formData.phoneType === PhoneType.SIP && (
              <Controller
                control={control}
                name="sip"
                rules={{
                  required: t('form.sip.required'),
                  pattern: {
                    value: /^(sips?):([^@\n]+)(?:@(.+))?$/,
                    message: t('form.sip.invalid'),
                  },
                }}
                render={({
                  field: { name, ref, onChange, onBlur, value },
                  fieldState,
                }) => (
                  <TextInput
                    id={name}
                    name={name}
                    defaultValue={value}
                    autoComplete="off"
                    label={t('form.sip.label')}
                    placeholder={t('form.sip.placeholder')}
                    aria-label={value}
                    clearAriaLabel={t("search.labels.clear")}
                    onBlur={onBlur}
                    onInput={(e) => {
                      setFormData({
                        ...formData,
                        phone: e.currentTarget.value,
                      });
                      onChange(e);
                    }}
                    ref={ref}
                    messageArr={
                      fieldState.error
                        ? [fieldErrorToMessage(fieldState.error)]
                        : []
                    }
                  />
                )}
              />
            )}
          </div>
        </>
      )}

      {/* Call Type */}
      <div className={sc('input-container', [''])}>
        <Controller
          control={control}
          name="callType"
          render={({ field: { name, onChange } }) => (
            <Select
              id={name}
              key={name}
              style={{
                width: '100%',
              }}
              className='type_prefrence'
              label={t('form.callType.label')}
              aria-label={!formData.callType ? t('voiceover.addSpeedDial.callTypeSelected', { callType: t('item.audioCall.label') }) : (formData.callType === PhoneType.HANDSET ? t('voiceover.addSpeedDial.callTypeSelected', { callType: t('item.audioCall.label') }) : t('voiceover.addSpeedDial.callTypeSelected', { callType: t('item.videoCall.label')}))}
              isDisabled={formData.phoneType ? false : true }
              defaultSelectedKey={isEdit ? (formData.callType === PhoneType.HANDSET ? callTypeOptions[0].id : callTypeOptions[1].id) : callTypeOptions[0].id}
              onSelectionChange={(key) => {
                setFormData({ ...formData, callType: key.toString() });
                onChange(key.toString() === callTypeOptions[0].id ? PhoneType.HANDSET : PhoneType.VIDEO);
              }}
            >
              {callTypeOptions.map((item) => (
                <Item textValue={item.value} key={item.id}>
                  {/* <IconNext name={item.id} scale={22} /> */}
                  {item.id === callTypeOptions[0].id &&
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="16" viewBox="0 0 14 16" fill="none">
                    <path d="M13.4484 10.8768L11.9572 9.38357C11.7842 9.21078 11.5788 9.07379 11.3528 8.98041C11.1269 8.88704 10.8847 8.83912 10.6402 8.8394C10.3957 8.83967 10.1536 8.88813 9.92784 8.98201C9.70206 9.07589 9.49701 9.21335 9.32439 9.38652C9.32439 9.38652 8.68034 10.0422 8.40789 10.3174C7.42591 10.283 6.49359 9.87714 5.79926 9.18189C5.10492 8.48665 4.7003 7.5538 4.66714 6.57177C4.94109 6.29897 5.59634 5.65407 5.59929 5.65112C5.94824 5.30179 6.14424 4.82823 6.14424 4.33447C6.14424 3.84072 5.94824 3.36715 5.59929 3.01782L4.10809 1.52462C3.75283 1.18479 3.28015 0.995117 2.78852 0.995117C2.29689 0.995117 1.82421 1.18479 1.46894 1.52462L0.671541 2.32257C-0.404459 3.40012 -0.658509 7.17267 3.57439 11.4117C5.84879 13.6891 7.85514 14.5241 9.13834 14.8234C9.60308 14.9345 10.079 14.9922 10.5568 14.9955C11.3162 15.0488 12.0668 14.8059 12.651 14.3178L13.4484 13.5201C13.7982 13.1692 13.9946 12.6939 13.9946 12.1984C13.9946 11.703 13.7982 11.2277 13.4484 10.8768ZM12.7414 12.8118L11.944 13.6101C11.6169 13.9377 10.6706 14.1528 9.36494 13.8482C8.20914 13.5782 6.38884 12.8141 4.28144 10.7039C0.518742 6.93557 0.678391 3.73162 1.37859 3.03052L2.17594 2.23257C2.34089 2.07493 2.56027 1.98695 2.78844 1.98695C3.01661 1.98695 3.23599 2.07493 3.40094 2.23257L4.89214 3.72577C5.05298 3.88675 5.14358 4.10485 5.14413 4.33242C5.14468 4.55998 5.05515 4.77851 4.89509 4.94027C4.89509 4.94027 4.08009 5.74207 3.88384 5.93962C3.80279 6.03564 3.74184 6.14696 3.7046 6.26696C3.66736 6.38697 3.65459 6.51324 3.66704 6.63827C3.73085 7.85974 4.23777 9.01604 5.09284 9.89062C6.39654 11.1965 8.53719 11.6062 9.03864 11.1022C9.23544 10.9051 10.0336 10.0922 10.0342 10.0916C10.1956 9.93049 10.4142 9.84002 10.6422 9.84002C10.8701 9.84002 11.0888 9.93049 11.2501 10.0916L12.7413 11.5847C12.9036 11.7477 12.9947 11.9683 12.9948 12.1983C12.9948 12.4283 12.9037 12.6489 12.7414 12.8119V12.8118Z" fill="var(--mds-color-theme-text-primary-normal)" fillOpacity="0.95"/>
                  </svg>
                  }
                  {item.id === callTypeOptions[1].id &&
                  <svg xmlns="http://www.w3.org/2000/svg" width="15" height="12" viewBox="0 0 15 12" fill="none">
                    <path d="M13.5264 2.64685C13.3817 2.55641 13.216 2.50493 13.0455 2.49741C12.875 2.48988 12.7054 2.52657 12.5533 2.6039C12.538 2.6113 12.5232 2.61965 12.5091 2.6289L11 3.5882V3C10.9992 2.33719 10.7356 1.70176 10.2669 1.23308C9.79824 0.764406 9.16281 0.500768 8.5 0.5H2.5C1.8372 0.500781 1.20177 0.764424 0.733095 1.2331C0.264423 1.70177 0.000780725 2.3372 0 3V9C0.000780725 9.6628 0.264423 10.2982 0.733095 10.7669C1.20177 11.2356 1.8372 11.4992 2.5 11.5H8.5C9.1628 11.4992 9.79823 11.2356 10.2669 10.7669C10.7356 10.2982 10.9992 9.6628 11 9V8.40765L12.5091 9.3671C12.5237 9.37635 12.5386 9.38465 12.5541 9.39245C12.7065 9.46865 12.8759 9.50461 13.0462 9.49692C13.2164 9.48924 13.3819 9.43816 13.5269 9.34855C13.6719 9.25893 13.7915 9.13374 13.8745 8.98487C13.9575 8.836 14.0011 8.66839 14.0011 8.49795V3.49745C14.0016 3.32684 13.9583 3.15897 13.8751 3.00999C13.792 2.86102 13.6719 2.73596 13.5264 2.64685ZM10 9C9.99956 9.39769 9.84139 9.77897 9.56018 10.0602C9.27897 10.3414 8.89769 10.4996 8.5 10.5H2.5C2.10231 10.4996 1.72103 10.3414 1.43982 10.0602C1.15861 9.77897 1.00044 9.39769 1 9V3C1.00044 2.60231 1.15861 2.22103 1.43982 1.93982C1.72103 1.65861 2.10231 1.50044 2.5 1.5H8.5C8.89769 1.50044 9.27897 1.65861 9.56018 1.93982C9.84139 2.22103 9.99956 2.60231 10 3V9ZM13.0007 8.495L11 7.22275V4.7731L13.001 3.50085L13.0007 8.495Z" fill="var(--mds-color-theme-text-primary-normal)" fillOpacity="0.95"/>
                  </svg>
                  }
                  <span>{item.value}</span>
                </Item>
              ))}
            </Select>
          )}
        />
      </div>

      {/* Cancel Submit Actions */}
      {/* eslint-disable-next-line react/jsx-props-no-spreading */}
      <input type="hidden" {...register('id')} />
      {/* eslint-disable-next-line react/jsx-props-no-spreading */}
      <input type="hidden" {...register('currentCallAddress')} />

      <Flex className={sc('footer')} justifyContent="flex-end" xgap="1rem">
        <ButtonPill
          size={32}
          ghost
          type="reset"
          color={undefined}
          onPress={() => {
            if (onCancel) {
              onCancel();
            }
            reset();
          }}
          onKeyDown={handleEnterKeyPress}
        >
          {cancelText}
        </ButtonPill>
        <ButtonPill type="submit" size={32} disabled={isEdit ? !formState.isValid || !formState.isDirty  : !formState.isValid} className="btn-margin-left" onKeyDown={handleEnterKeyPress}>
          {addText}
        </ButtonPill>
      </Flex>
    </form>
  );
};

