import axios from 'axios';
import * as Fnc from '@hooks/functions';
import { Auth_Post } from '../keys';
import { api_post, api_keys } from '../api';

export const remove_by_keys = (obj, keysToRemove = []) => {
  if (
    typeof obj !== 'object' || 
    obj === null || 
    Array.isArray(obj) || 
    !Array.isArray(keysToRemove)
  ) {
    return obj;
  }

  return Object.fromEntries(
    Object.entries(obj).filter(([key]) => !keysToRemove.includes(key))
  );
}


export const post_Data = async (api, data = [], tryLimit = 3) => {

    const startTime = performance.now();

    if (typeof navigator !== 'undefined' && !navigator.onLine) {
                                                                return {
                                                                            data:       [],
                                                                            status:     'OFFLINE',
                                                                            duration:   0,
                                                                            tries:      0,
                                                                            loading:    false,
                                                                        };
                                                              }

    let attempt     = 0;

    const new_key   = api_keys?.[api] || '';
    const new_api   = api_post + new_key

    if (!new_key) {
                    return {
                                data:       [],
                                status:     'INVALID_API',
                                duration:   0,
                                tries:      0,
                                loading:    false,
                            };
                    }

    if (!Array.isArray(data) || data?.length == 0) {
                    return {
                                data:       [],
                                status:     'EMPTY',
                                duration:   (performance.now() - startTime) / 1000,
                                tries:      0,
                                loading:    false
                            };
                    }

    const new_set   = Auth_Post({ JSONData: data }) || {};

    while (attempt < tryLimit) {

        try {

        const response  = await axios.post(
            new_api,
            new_set,
            { timeout: 25000 }
        );

        const feed      = response?.data ?? {};

        const duration  = Fnc.NumForce((performance.now() - startTime) / 1000);

        return {
                    ...feed,
                    duration:       duration,
                    tries:          attempt + 1,
                    status:         feed?.status || 'SUCCESS',
                    loading:        false
                };

        } catch (err) {

        attempt++;

        const duration  = (performance.now() - startTime) / 1000;

        if (axios.isCancel(err) || err?.name === 'AbortError') {
                                                                    return {
                                                                                data:           [],
                                                                                status:         'CANCELLED',
                                                                                duration:       duration,
                                                                                tries:          attempt,
                                                                                loading:        false,
                                                                                message:        err?.message
                                                                            };
                                                                    }

        if (attempt >= tryLimit) {
                                    return {
                                                data:       [],
                                                status:     'ERROR',
                                                duration:   duration,
                                                tries:      attempt,
                                                loading:    false,
                                                message:    err?.message
                                            };
                                    }

        await new Promise((res) => setTimeout(res, attempt * 1000));

        }
    }

    return {
                data:       [],
                status:     'UNKNOWN',
                duration:   (performance.now() - startTime) / 1000,
                tries:      attempt,
                loading:    false,
            };
};