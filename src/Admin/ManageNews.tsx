import { useState, useEffect, MouseEvent } from 'react';
import { 
    Alert,
    Box,
    Button,
    Card,
    CardActions,
    CardContent,
    CardMedia,
    CircularProgress,
    Dialog, 
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
    FormControlLabel,
    FormLabel,
    Grid2 as Grid,
    IconButton,
    Menu,
    MenuItem,
    Snackbar,
    Stack,
    TextField,
    Typography,
    useTheme,
} from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { 
    AddCircleOutlineRounded,
    CalendarMonthRounded,
    Delete,
    Edit,
    MoreVert,
    NewspaperRounded,
    PushPin,
    RemoveCircleOutlineRounded,
} from '@mui/icons-material';
import CustomDatePicker from './components/CustomDatePicker';
import placeholderImage from '../assets/images/placeholder.jpg';
import AntSwitch from './components/AntSwitch';

const URL = import.meta.env.VITE_BACKEND_API_URL;

interface NewsArticle {
    id?: number;
    title: string;
    summary: string;
    content: string;
    publishedDate: string;
    author: string;
}

const ManageNews = () => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [currentMenuIndex, setCurrentMenuIndex] = useState<number | null>(null);
    
    const [newsArticles, setNewsArticles] = useState<NewsArticle[]>([]);

    useEffect(() => {
        const fetchNewsArticles = async () => {
            try {
                const response = await fetch(URL + '/newsarticle');
                const data = await response.json();
                
                if (data.success) {
                    setNewsArticles(data.news_articles);
                    console.log('News Articles loaded:', data.news_articles);
                } else {
                    console.error('Failed to load News Articles:', data.message);
                    setError('Failed to load News Articles: ' + data.message);
                }
            } catch (err) {
                console.error('Error fetching News Articles:', err);
                setError('Error connecting to the server. Please try again later.');
            }
        };
        
        fetchNewsArticles();
        setLoading(false);
    }, []);
      

    const handleDialogOpen = () => {
        // SE FOR EDIT PEGA NOS DADOS E METE NO INPUT
        setDialogOpen(true);
        handleMenuClose();
    };
    const handleDialogClose = () => {
        setDialogOpen(false);
        setNewsArticles([]);
    };

    const handleMenuOpen = (e: MouseEvent<HTMLElement>, index: number) => {
        setAnchorEl(e.currentTarget);
        setCurrentMenuIndex(index);
    };
    const handleMenuClose = () => {
        setAnchorEl(null);
        setCurrentMenuIndex(null);
    };
      
    // Render loading state
    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                <CircularProgress />
            </Box>
        );
    }
      
    // Render error state
    if (error) {
        return (
            <Box sx={{ p: 3 }}>
                <Alert severity="error">{error}</Alert>
            </Box>
        );
    }

    return (
        <Box sx={{ mb: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                <Typography variant="h4" component="h1">
                    Gestão de Notícias
                </Typography>
                <Button 
                    variant="contained" 
                    color="primary" 
                    onClick={() => handleDialogOpen()}
                >
                    Adicionar Notícia
                </Button>
            </Box>
            
            {newsArticles.length === 0 ? (
                <Grid container spacing={3}>
                    <Grid size={{ xs: 12 }}>
                        <Box sx={{ 
                            textAlign: 'center', 
                            py: 8, 
                            bgcolor: 'background.paper',
                            borderRadius: 2,
                            border: '1px dashed',
                            borderColor: 'divider'
                        }}>
                            <NewspaperRounded sx={{ fontSize: 60, color: 'text.secondary', opacity: 0.3 }} />
                            <Typography variant="h6" color="text.secondary" sx={{ mt: 2 }}>
                                Nenhuma imagem disponível
                            </Typography>
                        </Box>
                    </Grid>
                </Grid>
            ) : (
            <>
                <Grid container spacing={3}>
                    <Grid size={{ xs: 12, sm: 6, md: 6, lg: 4, xl: 3 }}>
                        <Card 
                            sx={{ 
                                display: 'flex', 
                                flexDirection: 'column',
                            }}
                            variant="outlined"
                        >
                            <CardMedia
                                component="img"
                                height="200"
                                image={placeholderImage}
                            />
                            <Box>
                                <CardContent sx={{ flexGrow: 1 }}>
                                    <Typography gutterBottom variant="h5" component="div" sx={{ mb: 2 }}>
                                        Lorem Ipsum dolor sit amet
                                    </Typography>
                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                        <CalendarMonthRounded sx={{ mr: 0.5, color: 'text.secondary' }} />
                                        <Typography variant="body2" color="text.secondary">
                                            12-01-2025
                                        </Typography>
                                    </Box>
                                    <Typography variant="body2" color="text.secondary">
                                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                                    </Typography>
                                </CardContent>
                                <CardActions sx={{ justifyContent: 'flex-end', alignItems: 'start', mr: 0 }}>
                                    <IconButton 
                                        aria-label="more" 
                                        onClick={(e) => handleMenuOpen(e, 0)}
                                    >
                                        <MoreVert />
                                    </IconButton>
                                </CardActions>
                            </Box>
                        </Card>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6, md: 6, lg: 4, xl: 3 }}>
                        <Card 
                            sx={{ 
                                display: 'flex', 
                                flexDirection: 'column',
                            }}
                            variant="outlined"
                        >
                            <CardMedia
                                component="img"
                                height="200"
                                image={placeholderImage}
                            />
                            <Box>
                                <CardContent sx={{ flexGrow: 1 }}>
                                    <Typography gutterBottom variant="h5" component="div" sx={{ mb: 2 }}>
                                        Lorem Ipsum dolor sit amet
                                    </Typography>
                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                        <CalendarMonthRounded sx={{ mr: 0.5, color: 'text.secondary' }} />
                                        <Typography variant="body2" color="text.secondary">
                                            12-01-2025
                                        </Typography>
                                    </Box>
                                    <Typography variant="body2" color="text.secondary">
                                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                                    </Typography>
                                </CardContent>
                                <CardActions sx={{ justifyContent: 'flex-end', alignItems: 'start', mr: 0 }}>
                                    <IconButton 
                                        aria-label="more" 
                                        onClick={(e) => handleMenuOpen(e, 0)}
                                    >
                                        <MoreVert />
                                    </IconButton>
                                </CardActions>
                            </Box>
                        </Card>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6, md: 6, lg: 4, xl: 3 }}>
                        <Card 
                            sx={{ 
                                display: 'flex', 
                                flexDirection: 'column',
                            }}
                            variant="outlined"
                        >
                            <CardMedia
                                component="img"
                                height="200"
                                image={placeholderImage}
                            />
                            <Box>
                                <CardContent sx={{ flexGrow: 1 }}>
                                    <Typography gutterBottom variant="h5" component="div" sx={{ mb: 2 }}>
                                        Lorem Ipsum dolor sit amet
                                    </Typography>
                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                        <CalendarMonthRounded sx={{ mr: 0.5, color: 'text.secondary' }} />
                                        <Typography variant="body2" color="text.secondary">
                                            12-01-2025
                                        </Typography>
                                    </Box>
                                    <Typography variant="body2" color="text.secondary">
                                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                                    </Typography>
                                </CardContent>
                                <CardActions sx={{ justifyContent: 'flex-end', alignItems: 'start', mr: 0 }}>
                                    <IconButton 
                                        aria-label="more" 
                                        onClick={(e) => handleMenuOpen(e, 0)}
                                    >
                                        <MoreVert />
                                    </IconButton>
                                </CardActions>
                            </Box>
                        </Card>
                    </Grid>
                </Grid>
                <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleMenuClose}
                >
                    <MenuItem onClick={() => handleDialogOpen()}>
                        <Edit fontSize="small" sx={{ mr: 1 }} />
                        Editar
                    </MenuItem>
                    <MenuItem>
                        <PushPin fontSize="small" sx={{ mr: 1 }} />
                        Afixar
                    </MenuItem>
                    <MenuItem>
                        <AddCircleOutlineRounded fontSize="small" sx={{ mr: 1 }} />
                        Ativar
                    </MenuItem>
                    <MenuItem 
                        onClick={() => handleDialogOpen()}
                        sx={{ color: 'error.main' }}
                    >
                        <Delete fontSize="small" sx={{ mr: 1 }} />
                        Apagar
                    </MenuItem>
                </Menu>
            </>
            )}
            
            {/* Edit/Create Dialog */}
            <Dialog 
                open={dialogOpen} 
                onClose={handleDialogClose} 
                maxWidth="md" 
                fullWidth
                PaperProps={{
                    sx: {
                        borderRadius: 2,
                        backgroundImage: 'none',
                        overflow: 'hidden',
                        boxShadow: (theme) => 
                            'hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px',
                    }
                }}
            >
                <DialogTitle sx={{ 
                    px: 4, 
                    py: 3,
                    fontSize: '1.5rem', 
                    fontWeight: 600,
                    borderBottom: '1px solid',
                    borderColor: 'divider'
                }}>
                    Nova Notícia
                </DialogTitle>
                <DialogContent sx={{ px: 4, py: 3 }}>                
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <Stack spacing={3} sx={{ mt: 2 }}>
                            <FormControl>
                                <FormLabel 
                                    htmlFor="title"
                                    sx={{ 
                                        mb: 1, 
                                        fontWeight: 500,
                                        fontSize: '0.875rem'
                                    }}
                                >
                                    Título
                                </FormLabel>
                                <TextField
                                    id="title"
                                    type="text"
                                    name="title"
                                    required
                                    fullWidth
                                    placeholder="Título da notícia"
                                    variant="outlined"
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            borderRadius: 1,
                                        }
                                    }}
                                />
                            </FormControl>
                            
                            <FormControl>
                                <FormLabel htmlFor="title">Data de Publicação</FormLabel>
                                <CustomDatePicker/>
                            </FormControl>
                            
                            <FormControl>
                                <FormLabel 
                                    htmlFor="summary"
                                    sx={{ 
                                        mb: 1, 
                                        fontWeight: 500,
                                        fontSize: '0.875rem'
                                    }}
                                >
                                    Resumo
                                </FormLabel>
                                <TextField
                                    id="summary"
                                    type="text"
                                    name="summary"
                                    placeholder="Breve descrição da notícia"
                                    fullWidth
                                    multiline
                                    minRows={2}
                                    maxRows={4}
                                    variant="outlined"
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            borderRadius: 1,
                                        }
                                    }}
                                />
                            </FormControl>
                            
                            <FormControl>
                                <FormLabel 
                                    htmlFor="content"
                                    sx={{ 
                                        mb: 1, 
                                        fontWeight: 500,
                                        fontSize: '0.875rem'
                                    }}
                                >
                                    Conteúdo da Notícia
                                </FormLabel>
                                <TextField
                                    id="content"
                                    type="text"
                                    name="content"
                                    required
                                    fullWidth
                                    multiline
                                    minRows={4}
                                    maxRows={10}
                                    placeholder="Conteúdo completo da notícia"
                                    variant="outlined"
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            borderRadius: 1,
                                        }
                                    }}
                                />
                            </FormControl>
                            
                            <Box 
                                sx={{ 
                                    display: 'flex', 
                                    gap: 4,
                                    mt: 2,
                                    pt: 2,
                                    borderTop: '1px solid',
                                    borderColor: 'divider'
                                }}
                            >
                                <FormControlLabel
                                    sx={{
                                        '& .MuiFormControlLabel-label': {
                                            fontSize: '0.875rem'
                                        }
                                    }}
                                    control={
                                        <AntSwitch defaultChecked sx={{ mr: 3.5, left: 15 }}/>
                                    }
                                    label="Ativar"
                                />
                                <FormControlLabel
                                    sx={{
                                        '& .MuiFormControlLabel-label': {
                                            fontSize: '0.875rem'
                                        }
                                    }}
                                    control={
                                        <AntSwitch defaultChecked sx={{ mr: 3.5, left: 15 }}/>
                                    }
                                    label="Afixar notícia"
                                />
                            </Box>
                        </Stack>
                    </LocalizationProvider>
                </DialogContent>
                
                <DialogActions 
                    sx={{ 
                        px: 4, 
                        py: 3,
                        borderTop: '1px solid',
                        borderColor: 'divider',
                        gap: 1
                    }}
                >
                    <Button 
                        onClick={handleDialogClose}
                        variant="outlined"
                        sx={{
                            px: 3,
                            py: 1,
                            borderRadius: 1,
                            textTransform: 'none',
                            fontWeight: 'normal'
                        }}
                    >
                        Cancelar
                    </Button>
                    <Button 
                        // onClick={handleSave} 
                        variant="contained" 
                        color="primary"
                        // disabled={loading}
                        sx={{
                            px: 3,
                            py: 1,
                            borderRadius: 1,
                            textTransform: 'none',
                            fontWeight: 'normal'
                        }}
                    >
                        {/* {loading ? <CircularProgress size={24} /> : 'Guardar'} */}
                        Guardar
                    </Button>
                </DialogActions>
            </Dialog>
            
            {/* Snackbar for feedback */}
            <Snackbar 
                open={false}
                autoHideDuration={6000} 
                onClose={() => setSnackbar(prev => ({...prev, open: false}))}
            >
                <Alert 
                    severity="error"
                    variant="filled" 
                    onClose={() => setSnackbar(prev => ({...prev, open: false}))}
                >
                    Parabens ganhou
                </Alert>
            </Snackbar>
        </Box>
    );
}

export default ManageNews;