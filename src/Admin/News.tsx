import { useState, useEffect, ChangeEvent } from 'react';
import {
    Box,
    Button,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Grid2 as Grid,
    Paper,
    TextField,
    Typography,
} from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { newsService, NewsArticle } from '../services/News';

export default function News() {
    const [news, setNews] = useState<NewsArticle[]>([]);
    const [loading, setLoading] = useState(true);
    const [openDialog, setOpenDialog] = useState(false);
    const [currentArticle, setCurrentArticle] = useState<NewsArticle>({
        title: '',
        content: '',
        image: null,
    });

    const fetchNews = async () => {
        try {
            setLoading(true);
            const response = await newsService.getAll();
            setNews(response.data);
        } catch (exception) {
            console.error('Erro ao procurar notícias:', exception);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNews();
    }, []);

    const handleOpenDialog = (article?: NewsArticle) => {
        if (article) {
            setCurrentArticle(article);
        } else {
            setCurrentArticle({
                title: '',
                content: '',
                image: null
            });
        }
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
    }

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setCurrentArticle({ ...currentArticle, [name]: value });
    };

    const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setCurrentArticle({ ...currentArticle, image: e.target.files[0] });
        }
    };

    const handleSubmit = async () => {
        try {
            if (currentArticle.id) {
                await newsService.update(currentArticle.id, currentArticle);
            } else {
                await newsService.create(currentArticle);
            }
            fetchNews();
            handleCloseDialog();
        } catch (exception) {
            console.error('Erro ao guardar a notícia:', exception);
        }
    };

    const handleDelete = async (id: number) => {
        if (window.confirm('Tem a certeza de que deseja excluir esta notícia?')) {
            try {
                await newsService.delete(id);
                fetchNews();
            } catch (exception) {
                console.error('Erro ao excluir a notícia:', exception);
            }
        }
    };

    const columns: GridColDef[] = [
        { field: 'id', headerName: 'ID', width: 70 },
        { field: 'title', headerName: 'Título', width: 200 },
        { field: 'published_date', headerName: 'Date', width:130,
            valueFormatter: (params) => new Date(params.value).toLocaleDateString()
        },
        {
            field: 'actions',
            headerName: 'Actions',
            width: 150,
            renderCell: (params) => (
                <Box>
                    <Button
                        size="small"
                        onClick={() => handleOpenDialog(params.row)}
                    >
                        Editar
                    </Button>
                    <Button
                        size="small"
                        color="error"
                        onClick={() => handleDelete(params.row.id)}
                    >
                        Apagar
                    </Button>
                </Box>
            )
        }
    ];

    return (
        <Box sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="h5">Gestão de Notícias</Typography>
                <Button variant="contained" onClick={() => handleOpenDialog()}>
                    Adicionar Notícia
                </Button>
            </Box>

            <Paper sx={{ height: 400, width: '100%' }}>
                {loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                        <CircularProgress />
                    </Box>
                ) : (
                    <DataGrid
                        rows={news}
                        columns={columns}
                        initialState={{
                            pagination: { paginationModel: { pageSize: 5 } }
                        }}
                        pageSizeOptions={[5, 10, 25]}
                    />
                )}
            </Paper>

            <Dialog open={openDialog} onClose={handleCloseDialog}>
                <DialogTitle>
                    {currentArticle.id ? 'Editar Notícia' : 'Adicionar Notícia'}
                </DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        name="title"
                        label="Título"
                        type="text"
                        fullWidth
                        variant="outlined"
                        value={currentArticle.title}
                        onChange={handleInputChange}
                    />
                    <TextField
                        margin="dense"
                        name="content"
                        label="Texto"
                        multiline
                        rows={4}
                        fullWidth
                        variant="outlined"
                        value={currentArticle.content}
                        onChange={handleInputChange}
                    />
                    <Box sx={{ mt: 2}}>
                        <Typography variant="subtitle2">Image</Typography>
                        <input
                            name="image"
                            title="image"
                            accept="image/*"
                            type="file"
                            onChange={handleImageChange}
                        />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog}>Cancelar</Button>
                    <Button onClick={handleSubmit}>Guardar</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}