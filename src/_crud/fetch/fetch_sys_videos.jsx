import { useState } from 'react';
import { fetch_Data } from './api-fetch';

export const useFetch_SysVideos =()=>{

    const [gotSysVideos, setgotSysVideos] = useState({
                                                                data: [],
                                                                setting: {},
                                                                load: true,
                                                                duration: 0,
                                                                tries: 0,
                                                                status: ''
                                                            });


    const getSysVideos = async (setting) => {

        setgotSysVideos(prev => ({ ...prev, load: true, status: 'LOADING' }));

        const newSetting = {
                                  ...setting,
                                  view:        'FREE',
                                  public:       true
                              };

        const results = await fetch_Data('sys_videos', newSetting);

        setgotSysVideos(prev => ({
                                ...prev,
                                ...(results || {}),
                                load: false,
                            }));
    };

    return { gotSysVideos, getSysVideos };
};