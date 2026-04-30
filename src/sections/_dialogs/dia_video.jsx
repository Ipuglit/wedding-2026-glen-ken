import React, { useState, useRef, useEffect } from 'react';

import {
   Typography, Box, Stack,
  IconButton, Tooltip,
  Dialog, Slider,
  CircularProgress,
} from '@mui/material';

import { Icon } from '@iconify/react';

const BASE = 'https://www.all-in-statistics.pro';

// ── Video Viewer ──────────────────────────────────────────────────────────────
export function Dialog_Video({ open, onClose, src, title, description, status }) {

    const videoRef                          = useRef(null);
    const hideTimer                         = useRef(null);
    const [playing, setPlaying]             = useState(false);
    const [muted, setMuted]                 = useState(false);
    const [progress, setProgress]           = useState(0);
    const [duration, setDuration]           = useState(0);
    const [current, setCurrent]             = useState(0);
    const [showControls, setShowControls]   = useState(true);
    const [volume, setVolume]               = useState(1);
    const [videoLoading, setVideoLoading]   = useState(true);
    const [videoError, setVideoError]       = useState(false);

    const fmt = (s) => {
        if (!s || isNaN(s)) return '0:00';
        const m = Math.floor(s / 60);
        const sec = Math.floor(s % 60);
        return `${m}:${sec.toString().padStart(2, '0')}`;
    };

    const togglePlay = () => {
        if (!videoRef.current || videoLoading) return;
        if (playing) { videoRef.current.pause(); setPlaying(false); }
        else         { videoRef.current.play();  setPlaying(true);  }
    };

    const handleTimeUpdate = () => {
        if (!videoRef.current) return;
        const cur = videoRef.current.currentTime;
        const dur = videoRef.current.duration || 0;
        setCurrent(cur);
        setProgress(dur ? (cur / dur) * 100 : 0);
    };

    const handleSeek = (_, val) => {
        if (!videoRef.current) return;
        videoRef.current.currentTime = (val / 100) * (videoRef.current.duration || 0);
        setProgress(val);
    };

    const handleVolume = (_, val) => {
        if (!videoRef.current) return;
        videoRef.current.volume = val;
        setVolume(val);
        setMuted(val === 0);
    };

    const toggleMute = () => {
        if (!videoRef.current) return;
        const next = !muted;
        videoRef.current.muted = next;
        setMuted(next);
    };

    const handleMouseMove = () => {
        setShowControls(true);
        clearTimeout(hideTimer.current);
        if (playing) hideTimer.current = setTimeout(() => setShowControls(false), 2500);
    };

    const handleClose = () => {
        if (videoRef.current) { videoRef.current.pause(); videoRef.current.currentTime = 0; }
        setPlaying(false); setProgress(0); setCurrent(0);
        clearTimeout(hideTimer.current);
        onClose();
    };

    useEffect(() => {
        if (!open) {
            setPlaying(false); setProgress(0); setCurrent(0);
            setShowControls(true); setVideoLoading(true); setVideoError(false);
        } else {
            setVideoLoading(true); setVideoError(false);
        }
    }, [open]);

    const statusColor = status == 0 ? '#4caf50' : status == 1 ? '#ff9800' : '#888';

    return (
        <Dialog open={open} onClose={handleClose} maxWidth="xl" fullWidth
            PaperProps={{ sx: { background: '#0a0a0a', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 32px 100px rgba(0,0,0,0.9)', border: '1px solid rgba(255,255,255,0.06)' } }}>

            {/* Header */}
            <Box sx={{ px: 2.5, py: 1.5, display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(255,255,255,0.04)', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
                <Stack direction="row" alignItems="center" spacing={1.5}>
                    <Box sx={{ width: 30, height: 30, borderRadius: '8px', background: 'rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Icon icon="mdi:play" width={16} color="#fff" />
                    </Box>
                    <Box>
                        <Typography sx={{ color: '#fff', fontSize: 13, fontWeight: 700, lineHeight: 1.2 }}>{title || 'Video'}</Typography>
                        {description && <Typography sx={{ color: '#888', fontSize: 11, mt: 0.2 }} noWrap>{description}</Typography>}
                    </Box>

                </Stack>
                <Tooltip title="Close">
                    <IconButton size="small" onClick={handleClose} sx={{ color: '#888', '&:hover': { color: '#fff', background: 'rgba(255,255,255,0.08)' } }}>
                        <Icon icon="mdi:close" width={18} />
                    </IconButton>
                </Tooltip>
            </Box>

            {/* Video */}
            <Box sx={{ position: 'relative', background: '#000', cursor: videoLoading ? 'default' : 'pointer', minHeight: 200 }}
                onMouseMove={handleMouseMove}
                onMouseLeave={() => playing && setShowControls(false)}
                onClick={togglePlay}>
                <video ref={videoRef} src={`${BASE}${src}`} muted={muted}
                    onTimeUpdate={handleTimeUpdate}
                    onLoadedMetadata={() => setDuration(videoRef.current?.duration || 0)}
                    onCanPlay={() => setVideoLoading(false)}
                    onWaiting={() => setVideoLoading(true)}
                    onPlaying={() => setVideoLoading(false)}
                    onError={() => { setVideoLoading(false); setVideoError(true); }}
                    onEnded={() => { setPlaying(false); setShowControls(true); setProgress(100); }}
                    style={{ width: '100%', maxHeight: '62vh', display: 'block', objectFit: 'contain' }}
                />
                {/* Loading */}
                {videoLoading && !videoError && (
                    <Box sx={{ position: 'absolute', inset: 0, pointerEvents: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 1.5, background: 'rgba(0,0,0,0.75)' }}>
                        <Box sx={{ position: 'relative', width: 56, height: 56 }}>
                            <CircularProgress size={56} thickness={2} sx={{ color: 'rgba(255,255,255,0.15)', position: 'absolute' }} variant="determinate" value={100} />
                            <CircularProgress size={56} thickness={2} sx={{ color: '#fff', position: 'absolute', animationDuration: '900ms' }} />
                            <Box sx={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Icon icon="mdi:film" width={20} color="rgba(255,255,255,0.5)" />
                            </Box>
                        </Box>
                        <Typography sx={{ color: 'rgba(255,255,255,0.5)', fontSize: 11, letterSpacing: 0.5 }}>Loading video...</Typography>
                    </Box>
                )}
                {/* Error */}
                {videoError && (
                    <Box sx={{ position: 'absolute', inset: 0, pointerEvents: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 1, background: 'rgba(0,0,0,0.7)' }}>
                        <Icon icon="mdi:video-off-outline" width={36} color="rgba(255,255,255,0.3)" />
                        <Typography sx={{ color: 'rgba(255,255,255,0.35)', fontSize: 12 }}>Unable to load video</Typography>
                    </Box>
                )}
                {/* Paused play */}
                {!playing && !videoLoading && !videoError && (
                    <Box sx={{ position: 'absolute', inset: 0, pointerEvents: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.28)' }}>
                        <Box sx={{ width: 70, height: 70, borderRadius: '50%', background: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(10px)', border: '1.5px solid rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Icon icon="mdi:play" width={38} color="#fff" />
                        </Box>
                    </Box>
                )}
                {/* Controls */}
                {!videoLoading && !videoError && (
                    <Box sx={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.4) 60%, transparent 100%)', px: 2, pt: 4, pb: 1.5, opacity: showControls ? 1 : 0, transition: 'opacity 0.3s ease', pointerEvents: showControls ? 'auto' : 'none' }}
                        onClick={(e) => e.stopPropagation()}>
                        <Slider size="small" value={progress} onChange={handleSeek}
                            sx={{ color: '#fff', p: 0, mb: 1, height: 3, '& .MuiSlider-thumb': { width: 14, height: 14, boxShadow: '0 0 0 3px rgba(255,255,255,0.2)', '&:hover': { boxShadow: '0 0 0 6px rgba(255,255,255,0.2)' } }, '& .MuiSlider-rail': { opacity: 0.25, height: 3 }, '& .MuiSlider-track': { height: 3 } }} />
                        <Stack direction="row" alignItems="center" justifyContent="space-between">
                            <Stack direction="row" alignItems="center" spacing={0.3}>
                                <Tooltip title={playing ? 'Pause' : 'Play'}>
                                    <IconButton size="small" onClick={togglePlay} sx={{ color: '#fff', '&:hover': { background: 'rgba(255,255,255,0.1)' } }}>
                                        <Icon icon={playing ? 'mdi:pause' : 'mdi:play'} width={22} />
                                    </IconButton>
                                </Tooltip>
                                <Tooltip title={muted ? 'Unmute' : 'Mute'}>
                                    <IconButton size="small" onClick={toggleMute} sx={{ color: '#ccc', '&:hover': { color: '#fff', background: 'rgba(255,255,255,0.1)' } }}>
                                        <Icon icon={muted || volume === 0 ? 'mdi:volume-off' : volume < 0.5 ? 'mdi:volume-medium' : 'mdi:volume-high'} width={18} />
                                    </IconButton>
                                </Tooltip>
                                <Box sx={{ width: 70, mx: 1 }}>
                                    <Slider size="small" value={muted ? 0 : volume} min={0} max={1} step={0.05} onChange={handleVolume} onClick={(e) => e.stopPropagation()}
                                        sx={{ color: '#fff', p: 0, height: 3, '& .MuiSlider-thumb': { width: 11, height: 11 }, '& .MuiSlider-rail': { opacity: 0.25 } }} />
                                </Box>
                                <Typography sx={{ color: '#bbb', fontSize: 11, ml: 0.5, whiteSpace: 'nowrap' }}>
                                    {fmt(current)} <span style={{ color: '#555' }}>/</span> {fmt(duration)}
                                </Typography>
                            </Stack>
                            <Tooltip title="Replay">
                                <IconButton size="small"
                                    onClick={(e) => { e.stopPropagation(); if (videoRef.current) { videoRef.current.currentTime = 0; videoRef.current.play(); setPlaying(true); }}}
                                    sx={{ color: '#aaa', '&:hover': { color: '#fff', background: 'rgba(255,255,255,0.1)' } }}>
                                    <Icon icon="mdi:replay" width={18} />
                                </IconButton>
                            </Tooltip>
                        </Stack>
                    </Box>
                )}
            </Box>
        </Dialog>
    );
}
