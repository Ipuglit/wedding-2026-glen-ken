import { useState } from 'react';
import { fetch_Data } from './api-fetch';

export const useFetch_SysWelcome =()=>{

    const [gotSysWelcome, setgotSysWelcome] = useState({
                                                                data: [],
                                                                setting: {},
                                                                load: true,
                                                                duration: 0,
                                                                tries: 0,
                                                                status: ''
                                                            });


    const getSysWelcome = async (setting) => {

        setgotSysWelcome(prev => ({ ...prev, load: true, status: 'LOADING' }));

        const newSetting = {
                                  ...setting,
                                  coding_a:     'TATANG',
                                  coding_z:     'NANANG',
                                  public:       true
                              };

        const results = await fetch_Data('sys_welcome', newSetting);

        setgotSysWelcome(prev => ({
                                ...prev,
                                ...(results || {}),
                                load: false,
                            }));
    };

    return { gotSysWelcome, getSysWelcome };
};