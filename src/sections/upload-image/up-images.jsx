import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Grid, TextField } from '@mui/material';
import { useProTheme } from '@theme/store-theme-pro';
import { 
    Box, 
    Typography, 
    Button, 
    Stack, 
    Card, 
    IconButton, 
    Divider, 
    LinearProgress, 
    SHAPES,
    CircularProgress
} from '@theme/provider-theme';
import { Iconic } from '@/_components/icons';

const APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzPdHkC6tvA5xj_RrV5vmcUsRvTbaZUjM2ZILPAI7PtBuz5b2oMZdbTvqtHWw6dfReL/exec";

export const Page_ImageUploading = ({ onUploadComplete }) => {
    const { colors, is_mobile } = useProTheme();
    const [files, setFiles] = useState([]);
    const [loading, setLoading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [message, setMessage] = useState("");
    const [itemStatus, setItemStatus] = useState({});
    const [uploaderName, setUploaderName] = useState("");
    const inputRef = useRef(null);

    const pinkAccent = "#F48FB1";
    const softPinkBg = "#FFF5F7";
    const deepPink = "#C2185B";

    useEffect(() => {
        return () => {
            files.forEach(f => {
                if (f.previewUrl) URL.revokeObjectURL(f.previewUrl);
            });
        };
    }, [files]);

    const compressImage = useCallback(async (file) => {
        return new Promise((resolve, reject) => {
            const img = new Image();
            const url = URL.createObjectURL(file);
            img.src = url;
            img.onload = () => {
                const canvas = document.createElement("canvas");
                canvas.width = img.width;
                canvas.height = img.height;
                const ctx = canvas.getContext("2d");
                ctx.drawImage(img, 0, 0);
                const dataUrl = canvas.toDataURL("image/jpeg", 0.75);
                URL.revokeObjectURL(url);
                img.src = ""; 
                resolve(dataUrl.split(",")[1]);
            };
            img.onerror = () => {
                URL.revokeObjectURL(url);
                reject(new Error("Image Load Failed"));
            };
        });
    }, []);

    const handleFileChange = (e) => {
        if (loading) return;
        const selected = Array.from(e.target.files || []);
        setFiles(prev => {
            const newEntries = [];
            selected.forEach(file => {
                const isDuplicate = prev.some(existing => 
                    existing.name === file.name && existing.size === file.size
                );
                if (!isDuplicate) {
                    newEntries.push({
                        file,
                        id: crypto.randomUUID(),
                        previewUrl: URL.createObjectURL(file),
                        name: file.name,
                        size: file.size
                    });
                }
            });
            return [...prev, ...newEntries];
        });
        if (e.target) e.target.value = "";
    };

    const removeFile = (id) => {
        setFiles(prev => {
            const target = prev.find(f => f.id === id);
            if (target?.previewUrl) URL.revokeObjectURL(target.previewUrl);
            return prev.filter(f => f.id !== id);
        });
    };

    const handleNameChange = (e) => {
        const val = e.target.value;
        const filtered = val.replace(/[^a-zA-Z\s.]/g, '');
        setUploaderName(filtered);
    };

    const handleUpload = async () => {
        if (!files.length || loading || !uploaderName.trim()) return;
        setLoading(true);
        setMessage("");
        const currentFiles = [...files];
        let completed = 0;

        const now = new Date();
        const dateStr = now.toISOString().split('T')[0];
        const timeStr = now.toLocaleTimeString('en-US', { hour12: true, hour: 'numeric', minute: '2-digit', second: '2-digit' }).replace(/\s/g, '');
        const formattedName = uploaderName.trim().toLowerCase().replace(/\s+/g, '_');

        for (let i = 0; i < currentFiles.length; i++) {
            const f = currentFiles[i];
            if (itemStatus[f.id] === 'success') {
                completed++;
                continue;
            }
            
            setItemStatus(prev => ({ ...prev, [f.id]: 'loading' }));
            
            const customFileName = `${formattedName}_${dateStr}-${timeStr}-${i + 1}`;

            try {
                const base64 = await compressImage(f.file);
                const response = await fetch(APPS_SCRIPT_URL, {
                    method: "POST",
                    headers: { "Content-Type": "text/plain;charset=utf-8" },
                    body: JSON.stringify({ filename: customFileName, mimetype: "image/jpeg", base64 }),
                });
                const result = await response.json();
                if (result.status === 'success' || result.success) {
                    setItemStatus(prev => ({ ...prev, [f.id]: 'success' }));
                } else {
                    setItemStatus(prev => ({ ...prev, [f.id]: 'error' }));
                }
            } catch (err) {
                setItemStatus(prev => ({ ...prev, [f.id]: 'error' }));
            }
            completed++;
            setProgress(Math.round((completed / currentFiles.length) * 100));
        }

        setLoading(false);
        setMessage("Success"); 
        
        if (onUploadComplete) onUploadComplete();

        setTimeout(() => {
            setFiles(prev => prev.filter(f => itemStatus[f.id] === 'error'));
            setItemStatus({});
            setProgress(0);
            setMessage(""); 
        }, 2500);
    };

    return (
        <Box sx={{ width: '100%', minHeight: '80vh', display: 'flex', justifyContent: 'center', alignItems: 'center', mt: is_mobile ? 10 : files.length > 0 ? 10 : 1 }}>
            <Card 
                shape="rounded" 
                sx={{ 
                    p: is_mobile ? 4 : 6, 
                    width: '100%',
                    textAlign: 'center',
                    border: 'none', 
                    background: '#FFFFFF',
                    boxShadow: `0 30px 60px ${pinkAccent}26`,
                    position: 'relative',
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center'
                }}
            >
                {message === "Success" && (
                    <Box sx={{ 
                        position: 'absolute', inset: 0, zIndex: 100, 
                        bgcolor: 'rgba(255,255,255,0.9)', display: 'flex', 
                        flexDirection: 'column', alignItems: 'center', 
                        justifyContent: 'center', backdropFilter: 'blur(4px)'
                    }}>
                        <Iconic icon='check' size={80} style={{ color: '#4caf50' }} />
                        <Typography sx={{ color: '#4caf50', fontWeight: 800, mt: 2, fontSize: '1.5rem' }}>
                            Upload Complete!
                        </Typography>
                    </Box>
                )}

                <Stack spacing={4} sx={{ width: '100%' }} alignItems="center">
                    <Box 
                        sx={{ 
                            width: '100%', 
                            display: 'flex', 
                            flexDirection: 'column', 
                            alignItems: 'center', 
                            justifyContent: 'center',
                            textAlign: 'center'
                        }}
                    >
                        <Stack 
                            spacing={1.5} 
                            alignItems="center" 
                            sx={{ 
                                width: '100%', 
                                maxWidth: '500px',
                                mx: 'auto'
                            }}
                        >

                            <Typography 
                                sx={{ 
                                    color: '#A07883', 
                                    fontWeight: 500, 
                                    fontSize: '1.6rem', 
                                    fontStyle: 'italic',
                                    width: '100%',
                                    display: 'block'
                                }}
                            >
                                Send us the beautiful moments you captured from our wedding celebration together.
                            </Typography>
                            <Box 
                                sx={{ 
                                    width: 60, 
                                    height: 2, 
                                    bgcolor: pinkAccent, 
                                    mt: 1,
                                    display: 'block'
                                }} 
                            />
                        </Stack>
                    </Box>



                    {files.length > 0 && (
                        <Box sx={{ width: '100%' }}>
                            <Grid container spacing={2} justifyContent="center" sx={{ width: '100%', m: 0 }}>
                                {files.map((f) => {
                                    const status = itemStatus[f.id];
                                    const isSuccess = status === 'success';
                                    const isIndividualLoading = status === 'loading';
                                    const shouldBeGray = loading && !isSuccess;

                                    return (
                                        <Grid size={{ xs: 4, sm: 3, md: 2.4 }} key={f.id} sx={{ display: 'flex', justifyContent: 'center' }}>
                                            <Box sx={{ 
                                                position: 'relative', 
                                                aspectRatio: '1/1',
                                                width: '100%',
                                                borderRadius: SHAPES.default,
                                                overflow: 'hidden',
                                                border: isSuccess ? `3px solid #4caf50` : `3px solid ${colors.white.main}`,
                                                boxShadow: `0 8px 15px ${colors.black.main}1A`
                                            }}>
                                                <Box sx={{
                                                    width: '100%',
                                                    height: '100%',
                                                    backgroundImage: `url(${f.previewUrl})`,
                                                    backgroundSize: 'cover',
                                                    backgroundPosition: 'center',
                                                    filter: shouldBeGray ? 'grayscale(100%)' : 'none',
                                                    opacity: shouldBeGray ? 0.6 : 1,
                                                    transition: 'all 0.3s ease'
                                                }} />
                                                
                                                <Box sx={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                    {isIndividualLoading && <CircularProgress size={24} sx={{ color: deepPink }} />}
                                                    {isSuccess && (
                                                        <Box sx={{ inset: 0, position: 'absolute', bgcolor: 'rgba(76, 175, 80, 0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                            <Iconic icon='check' size={30} style={{ color: 'white' }} />
                                                        </Box>
                                                    )}
                                                    {!loading && !status && (
                                                        <IconButton
                                                            size="tiny"
                                                            onClick={(e) => { e.stopPropagation(); removeFile(f.id); }}
                                                            sx={{ position: 'absolute', top: 4, right: 4, bgcolor: colors.white.main, p: 0.5 }}
                                                        >
                                                            <Iconic icon='close' size={14} />
                                                        </IconButton>
                                                    )}
                                                </Box>
                                            </Box>
                                        </Grid>
                                    );
                                })}
                            </Grid>
                        </Box>
                    )}

                    <Box 
                        onClick={() => !loading && inputRef.current?.click()}
                        sx={{
                            width: '100%',
                            border: `2px dashed ${pinkAccent}4D`,
                            borderRadius: SHAPES.rounded,
                            py: is_mobile ? 6 : files.length > 0 ? 2 : 8,
                            bgcolor: softPinkBg,
                            cursor: loading ? 'default' : 'pointer',
                            transition: 'all 0.4s ease',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            '&:hover': {
                                bgcolor: '#FFEBF0',
                                borderColor: pinkAccent,
                                transform: loading ? 'none' : 'translateY(-2px)'
                            }
                        }}
                    >
                        <input ref={inputRef} type="file" multiple hidden accept="image/*" onChange={handleFileChange} />
                        <Stack alignItems="center" spacing={2}>
                            <Box sx={{ fontSize: 40 }}>📸</Box>
                            <Typography sx={{ fontWeight: 800, color: deepPink, letterSpacing: 1, textAlign: 'center' }}>
                                {files.length > 0 ? 'ADD MORE PHOTOS' : 'UPLOAD PHOTOS'}
                            </Typography>
                        </Stack>
                    </Box>

                    {loading && (
                        <Stack spacing={1.5} sx={{ width: '100%', alignItems: 'center' }}>
                            <Stack direction="row" justifyContent="space-between" sx={{ width: '100%' }}>
                                <Typography sx={{ fontWeight: 900, color: deepPink, fontSize: '0.7rem' }}>SENDING MEMORIES...</Typography>
                                <Typography sx={{ fontWeight: 900, color: deepPink, fontSize: '0.7rem' }}>{progress}%</Typography>
                            </Stack>
                            <LinearProgress 
                                variant="determinate" 
                                value={progress} 
                                sx={{ 
                                    width: '100%', height: 8, borderRadius: 4, bgcolor: '#F0F0F0',
                                    '& .MuiLinearProgress-bar': { bgcolor: pinkAccent }
                                }}
                            />
                        </Stack>
                    )}

                    <Divider sx={{ width: '100%', borderColor: '#F5F5F5' }} />

                    <TextField
                        fullWidth
                        placeholder="Please input your name to submit"
                        variant="outlined"
                        value={uploaderName}
                        onChange={handleNameChange}
                        disabled={loading}
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                borderRadius: SHAPES.rounded,
                                bgcolor: '#FAFAFA',
                                '& fieldset': { borderColor: '#E0E0E0' },
                                '&:hover fieldset': { borderColor: pinkAccent },
                                '&.Mui-focused fieldset': { borderColor: deepPink }
                            },
                            '& .MuiInputBase-input': {
                                textAlign: 'center',
                                fontWeight: 600,
                                color: deepPink
                            }
                        }}
                    />

                    <Button
                        fullWidth
                        shape="rounded"
                        variant="contained"
                        disabled={files.length === 0 || loading || !uploaderName.trim()}
                        onClick={handleUpload}
                        sx={{ 
                            py: 2, fontWeight: 900, bgcolor: deepPink, color: colors.white.main,
                            fontSize: '1rem', letterSpacing: 2, textTransform: 'uppercase',
                            boxShadow: `0 12px 25px ${pinkAccent}4D`,
                            '&:hover': { bgcolor: '#AD1457', boxShadow: `0 15px 30px ${pinkAccent}66` },
                            '&.Mui-disabled': { bgcolor: '#FCE4EC', color: pinkAccent }
                        }}
                    >
                        {loading ? `UPLOADING ${progress}%` : `SEND ${files.length} PHOTOS`}
                    </Button>
                </Stack>
            </Card>
        </Box>
    );
};