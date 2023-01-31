export interface IMakeCallAdapter {
  makeCall: (address: string, isVideo: boolean) => Promise<void>;
}
