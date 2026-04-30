import React, { useState, useRef, useEffect } from 'react';
import { Box, Grid, Typography, CircularProgress } from '@mui/material';
import { Icon } from '@iconify/react';

import * as Fnc from '@hooks/functions'
import { Dialog_Video } from './_dialogs/dia_video';

const BASE = 'https://www.all-in-statistics.pro';

function VideoCard({ video, index, onPlay, isSingle }) {
    const videoRef = useRef(null);
    const [loaded, setLoaded] = useState(false);
    const [hovered, setHovered] = useState(false);

    useEffect(() => {
        if (!videoRef.current) return;
        if (hovered) videoRef.current.play().catch(() => { });
        else { videoRef.current.pause(); videoRef.current.currentTime = 0; }
    }, [hovered]);

    return (
        <Box
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            onClick={() => onPlay(video)}
            sx={{
                borderRadius: '14px',
                overflow: 'hidden',
                position: 'relative',
                cursor: 'pointer',
                background: '#0d0d0d',
                aspectRatio: isSingle ? { xs: '16/9', md: '21/9' } : '16/9',
                boxShadow: hovered
                    ? '0 20px 56px rgba(103,2,170,0.55), 0 0 0 1.5px rgba(167,0,255,0.5)'
                    : '0 4px 20px rgba(0,0,0,0.45)',
                transform: hovered ? 'translateY(-6px) scale(1.01)' : 'translateY(0) scale(1)',
                transition: 'all 0.35s cubic-bezier(0.34,1.56,0.64,1)',
                animation: 'fadeSlideUp 0.5s ease both',
                animationDelay: `${index * 80}ms`,
                '@keyframes fadeSlideUp': {
                    from: { opacity: 0, transform: 'translateY(20px)' },
                    to: { opacity: 1, transform: 'translateY(0)' },
                },
            }}
        >
            {video?.pathFull && (
                <video
                    ref={videoRef}
                    src={`${BASE}${video?.pathFull}`}
                    muted
                    loop
                    playsInline
                    preload="metadata"
                    onCanPlay={() => setLoaded(true)}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                />
            )}

            {!loaded && (
                <Box sx={{
                    position: 'absolute', inset: 0,
                    background: 'linear-gradient(90deg, #181818 25%, #252525 50%, #181818 75%)',
                    backgroundSize: '200% 100%',
                    animation: 'shimmer 1.5s infinite',
                    '@keyframes shimmer': { '0%': { backgroundPosition: '200% 0' }, '100%': { backgroundPosition: '-200% 0' } },
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                    <CircularProgress size={22} thickness={2} sx={{ color: '#6702aa44' }} />
                </Box>
            )}

            <Box sx={{
                position: 'absolute', inset: 0,
                background: hovered
                    ? 'linear-gradient(to top, rgba(90,0,160,0.75) 0%, rgba(0,0,0,0.15) 60%)'
                    : 'linear-gradient(to top, rgba(0,0,0,0.82) 0%, transparent 55%)',
                transition: 'background 0.35s ease',
            }} />

            <Box sx={{
                position: 'absolute', inset: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                opacity: hovered ? 1 : 0,
                transform: hovered ? 'scale(1)' : 'scale(0.7)',
                transition: 'opacity 0.25s ease, transform 0.3s cubic-bezier(0.34,1.56,0.64,1)',
            }}>
                <Box sx={{ width: 54, height: 54, borderRadius: '50%', background: 'rgba(255,255,255,0.13)', backdropFilter: 'blur(8px)', border: '1.5px solid rgba(255,255,255,0.28)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 24px rgba(167,0,255,0.5)' }}>
                    <Icon icon="mdi:play" width={28} color="#fff" />
                </Box>
            </Box>

            {video?.active == 1 && (
                <Box sx={{ position: 'absolute', top: 12, left: 12, background: 'linear-gradient(135deg,#f59e0b,#d97706)', borderRadius: '6px', px: 1, py: 0.4, display: 'flex', alignItems: 'center', gap: 0.5, boxShadow: '0 2px 8px rgba(245,158,11,0.4)' }}>
                    <Icon icon="mdi:star" width={11} color="#fff" />
                    <Typography sx={{ color: '#fff', fontSize: 10, fontWeight: 800, letterSpacing: 0.5 }}>FEATURED</Typography>
                </Box>
            )}

            <Box sx={{ position: 'absolute', bottom: 0, left: 0, right: 0, px: 2, py: 2, transform: hovered ? 'translateY(0)' : 'translateY(4px)', transition: 'transform 0.3s ease' }}>
                <Typography noWrap sx={{ color: '#fff', fontSize: isSingle ? 18 : 12, fontWeight: 700, textShadow: '0 1px 6px rgba(0,0,0,0.9)' }}>
                    {video?.name}
                </Typography>
                {video?.description && (
                    <Typography noWrap sx={{ color: 'rgba(255,255,255,0.6)', fontSize: isSingle ? 14 : 10, mt: 0.2, opacity: hovered ? 1 : 0, transition: 'opacity 0.25s ease 0.05s' }}>
                        {video?.description}
                    </Typography>
                )}
            </Box>
        </Box>
    );
}

export default function Sys_Videos({ DATA }) {

    const [activeVideo, setActiveVideo] = useState(null);

    const videos = (DATA || []).filter(v => v?.status == 0);

    if (videos.length === 0) return (
        <Box sx={{ py: 5, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1, opacity: 0.35 }}>
            <Icon icon="mdi:video-off-outline" width={36} />
            <Typography variant="body2" color="text.secondary">No videos available</Typography>
        </Box>
    );

    const isSingle = videos.length === 1;

    return (<>
        <Grid container spacing={2.5}>
            {videos.map((v, idx) => (
                <Grid key={v?.id} size={isSingle ? 12 : { xs: 12, sm: 6, md: 4 }}>
                    <VideoCard video={v} index={idx} onPlay={setActiveVideo} isSingle={isSingle} />
                </Grid>
            ))}
        </Grid>

        <Dialog_Video
            open={!Fnc.isNull(activeVideo?.id, 0)}
            src={activeVideo?.pathFull}
            title={activeVideo?.title}
            description={activeVideo?.description}
            status={activeVideo?.status}
            onClose={() => setActiveVideo(null)}
        />
    </>);
}