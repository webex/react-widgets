import { IMakeCallAdapter } from '@webex-int/adapter-interfaces';

export class MakeCallJSONAdapter implements IMakeCallAdapter {
  makeCall(address: string, isVideo: boolean): Promise<void> {
    console.log(
      `Calling ${address} with video ${isVideo ? 'enabled' : 'disabled'}`
    );
    return Promise.resolve();
  }
}
