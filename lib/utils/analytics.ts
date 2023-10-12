import { init as amplitudeInit, track as amplitudeTrack } from '@amplitude/analytics-browser';
import mixpanel from 'mixpanel-browser';

export const init = () => {
  if (process.env.NEXT_PUBLIC_AMPLITUDE_API_KEY) {
    amplitudeInit(process.env.NEXT_PUBLIC_AMPLITUDE_API_KEY, null, {
      trackingOptions: {
        ipAddress: false,
      },
    });
  }

  if (process.env.NEXT_PUBLIC_MIXPANEL_API_KEY) {
    mixpanel.init(process.env.NEXT_PUBLIC_MIXPANEL_API_KEY, {
      ip: false,
    });
  }
};

export const track = (eventName: string, eventProperties: any) => {
  if (process.env.NEXT_PUBLIC_AMPLITUDE_API_KEY) {
    amplitudeTrack(eventName, eventProperties);
  }
  if (process.env.NEXT_PUBLIC_MIXPANEL_API_KEY) {
    mixpanel.track(eventName, eventProperties);
  }
};
