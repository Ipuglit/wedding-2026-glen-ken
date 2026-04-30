import axios from 'axios';
import * as Fnc from '@hooks/functions';
import { Auth_Fetch, Key_Alpha, Key_Setting } from '../keys';
import { api_get, api_keys } from '../api';

export const remove_by_keys = (obj, keysToRemove = []) => {

  if (
      typeof obj !== 'object' ||
      obj === null ||
      Array.isArray(obj) ||
      !Array.isArray(keysToRemove)
  ) return obj;

  return Object.fromEntries(
                              Object.entries(obj).filter(([key]) =>
                                !keysToRemove.includes(key)
                              )
                            );

}

export const fetch_Data = async (api, setting = {}, tryLimit = 3) => {

    if (typeof navigator !== 'undefined' && !navigator.onLine) {
      return {
                duration:   0,
                tries:      0,
                pages:      { },
                setting:    setting,
                status:     'OFFLINE',
                message:    'You are offline. Connection failed',
              };
    }

    const startTime = performance.now();

    const new_key = api_keys?.[api] || '';
    if (!new_key) {
      return {
                duration:   0,
                tries:      0,
                pages:      { },
                setting:    setting,
                status:     'INVALID_API',
                message:    'Invalid API. Not Found.',
              };
    }

    const is_public     = setting?.public == true;

    const new_setting   = is_public ? Key_Alpha(setting,true) : (Auth_Fetch(setting) || {});

    let attempt = 1;
    let result  = null;

    while (attempt <= tryLimit) {

      try {

        const response = await axios.post(
                                            api_get + new_key,
                                            new_setting,
                                            {
                                              timeout: 25000
                                            }
                                          );

        const feed            = response?.data ?? {};

        const duration        = Fnc.NumForce((performance.now() - startTime) / 1000)

        const setting_raw     = feed?.setting || {};
        const setting_clean   = remove_by_keys(setting_raw, ['A', 'B', 'C']);
        const setting_final   = Key_Setting(setting_clean, true);

        result = {
                    ...feed,
                    duration:   duration,
                    tries:      attempt,
                    pages:      feed?.pages?.[0] || { },
                    setting:    setting_final,
                  };

        break;

      } catch (err) {

        const duration = (performance.now() - startTime) / 1000;

        if (attempt >= tryLimit) {

          result = {
                      duration:   duration,
                      tries:      attempt,
                      pages:      { },
                      setting:    setting,
                      status:     'ERROR',
                      message:    err?.message || 'Error attempts'
                    };

          break;

        }

        await new Promise(res =>
          setTimeout(res, attempt * 1000)
        );

        attempt++;

      }

    }

    return result;

};