export interface IWebexIntContact {
  id: string;
  name: string;
  phoneNumbers: IWebexIntCallableEntity[];
  emailAddresses: IWebexIntCallableEntity[];
  fetchAvatarUrl?: () => Promise<string | undefined>;
}

export interface IWebexIntCallableEntity {
  type: string;
  address: string;
}

export interface IUserAvatar {
  fetchAvatar: () => string;
}
