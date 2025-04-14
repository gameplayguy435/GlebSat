import { useState, useEffect, ChangeEvent } from 'react';
import {
    Box,
    Button,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
    FormLabel,
    Stack,
    TextField,
    Typography,
} from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AddchartRounded } from '@mui/icons-material';
import { SnackbarProvider, useSnackbar } from 'notistack';
import dayjs from 'dayjs';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { ptBR } from '@mui/x-data-grid/locales';
import { useNavigate } from 'react-router-dom';

const API_URL = import.meta.env.VITE_BACKEND_API_URL;

interface Mission {
    id: number;
    name: string;
    start_date: string;
    end_date: string;
    duration: string;
}

const MissionsContent = () => {
    const [loading, setLoading] = useState(true);
    const [dialogOpen, setDialogOpen] = useState(false);
    const { enqueueSnackbar } = useSnackbar();
    const navigate = useNavigate();

    const [missions, setMissions] = useState<Mission[]>([]);
    const [currentMission, setCurrentMission] = useState<Partial<Mission>>({
        name: '',
        duration: '',
    });

    useEffect(() => {
        fetchMissions();
    }, []);

    const fetchMissions = async () => {
        try {
            const response = await fetch(`${API_URL}/mission`);
            const data = await response.json();
    
            if (data.success) {
                const formattedMissions = data.missions.map(mission => ({
                    ...mission,
                    formatted_start_date: formatDate(mission.start_date),
                    formatted_end_date: formatDate(mission.end_date),
                    formatted_duration: formatDuration(mission.duration)
                }));
                
                console.log('Formatted missions:', formattedMissions);
                setMissions(formattedMissions);
            } else {
                console.error('Failed to fetch missions:', data.message);
                enqueueSnackbar('Erro ao carregar as missões', { variant: 'error' });
            }
        } catch (err) {
            console.error('Erro ao carregar as missões:', err);
            enqueueSnackbar('Erro: ' + err, { variant: 'error' });
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString: string) => {
        if (!dateString) return '';
        try {
            const date = new Date(dateString);
            if (isNaN(date.getTime())) return 'Data inválida';
            
            const time = date.toLocaleTimeString('pt-PT', { 
                hour: '2-digit', 
                minute: '2-digit', 
                second: '2-digit' 
            });
            
            const day = date.getDate().toString().padStart(2, '0');
            const month = (date.getMonth() + 1).toString().padStart(2, '0');
            const year = date.getFullYear();
            
            const formattedDate = `${day}-${month}-${year}`;

            return `${time} ${formattedDate}`;
        } catch (error) {
            console.error("Error formatting date:", error);
            return dateString;
        }
    };
    
    const formatDuration = (duration: string) => {
        if (!duration) return '';
        
        try {
            if (duration.match(/^\d{2}:\d{2}:\d{2}$/)) {
                const parts = duration.split(':');
                return `${parseInt(parts[1], 10)} min ${parseInt(parts[2], 10)} seg`;
            }
                        
            return duration;
        } catch (error) {
            console.error("Error formatting duration:", error);
            return String(duration);
        }
    };

    const handleDialogOpen = () => {
        setCurrentMission({ name: '', duration: '' });
        setDialogOpen(true);
    };

    const handleDialogClose = () => {
        setDialogOpen(false);
        setCurrentMission({ name: '', duration: '' });
    };

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setCurrentMission((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSave = async () => {
        if (!currentMission.name?.trim()) {
            enqueueSnackbar('O nome da missão é obrigatório', { variant: 'error' });
            return;
        }

        if (!currentMission.duration?.trim() || isNaN(Number(currentMission.duration))) {
            enqueueSnackbar('A duração da missão deve ser um número válido', { variant: 'error' });
            return;
        }

        const startDate = dayjs();
        const durationInSeconds = Number(currentMission.duration);
        const endDate = startDate.add(durationInSeconds, 'second');

        const newMission = {
            name: currentMission.name,
            start_date: startDate.toISOString(),
            end_date: endDate.toISOString(),
            duration: durationInSeconds,
        };

        try {
            const response = await fetch(`${API_URL}/mission/create`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newMission),
            });
            const data = await response.json();

            if (data.success) {
                enqueueSnackbar('Missão criada com sucesso!', { variant: 'success' });
                const insertedMission = data.missions[data.missions.length - 1];
                navigate(`/admin/missions/${insertedMission.id}`, { replace: true });
            } else {
                console.error('Erro ao criar a missão:', data.message);
                enqueueSnackbar('Erro ao criar a missão', { variant: 'error' });
            }
        } catch (err) {
            console.error('Erro ao criar a missão:', err);
            enqueueSnackbar('Erro de conexão ao criar a missão', { variant: 'error' });
        }
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                <CircularProgress />
            </Box>
        );
    }

    const columns: GridColDef[] = [
        { 
            field: 'id', 
            headerName: '#', 
            minWidth: 70,
            flex: 0.5
        },
        { 
            field: 'name', 
            headerName: 'Nome',
            minWidth: 120,
            flex: 1.2
        },
        { 
            field: 'formatted_start_date',
            headerName: 'Início da Missão', 
            minWidth: 160,
            flex: 1.5
        },
        { 
            field: 'formatted_end_date',
            headerName: 'Fim da Missão', 
            minWidth: 160,
            flex: 1.5
        },
        { 
            field: 'formatted_duration',
            headerName: 'Duração', 
            minWidth: 120,
            flex: 1.2
        },
        {
            field: 'options',
            headerName: 'Opções',
            minWidth: 120,
            flex: 2,
            sortable: false,
            filterable: false,
            renderCell: (params) => (
                <Button
                    variant="outlined"
                    size="small"
                    sx={{ textTransform: 'none' }}
                    onClick={() => {
                        console.log(`Options for mission ${params.row.id}`);
                    }}
                >
                    Opções
                </Button>
            ),
        },
    ];

    return (
        <Box sx={{ mb: 3, width: '100%' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                <Typography variant="h4" component="h1">
                    Histórico de Missões
                </Typography>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleDialogOpen}
                    startIcon={<AddchartRounded />}
                    sx={{
                        borderRadius: 1,
                        textTransform: 'none',
                        fontWeight: 'normal',
                    }}
                >
                    Iniciar Missão
                </Button>
            </Box>

            <DataGrid
                rows={missions}
                columns={columns}
                getRowId={(row) => row.id}
                autoHeight
                disableRowSelectionOnClick
                disableColumnMenu
                sx={{
                    backgroundColor: 'background.paper',
                    borderRadius: 1,
                    boxShadow: 1,
                    width: '100%',
                    '& .MuiDataGrid-main': { width: '100%' },
                    '& .MuiDataGrid-columnHeaders': { minHeight: '48px' },
                    '& .MuiDataGrid-cell': { minHeight: '48px' },
                }}
                initialState={{
                    pagination: {
                        paginationModel: {
                            pageSize: 10,
                        },
                    },
                }}
                pageSizeOptions={[5, 10, 25, 50]}
                localeText={ptBR.components.MuiDataGrid.defaultProps.localeText}
            />

            <Dialog
                open={dialogOpen}
                onClose={handleDialogClose}
                maxWidth="sm"
                fullWidth
                PaperProps={{
                    sx: {
                        borderRadius: 2,
                        backgroundImage: 'none',
                        overflow: 'hidden',
                        boxShadow: 'hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px',
                    },
                }}
            >
                <DialogTitle
                    sx={{
                        px: 4,
                        py: 3,
                        fontSize: '1.5rem',
                        fontWeight: 600,
                        borderBottom: '1px solid',
                        borderColor: 'divider',
                    }}
                >
                    Iniciar Missão
                </DialogTitle>
                <DialogContent sx={{ px: 4, py: 3 }}>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <Stack spacing={3} sx={{ mt: 2 }}>
                            <FormControl>
                                <FormLabel
                                    htmlFor="name"
                                    sx={{
                                        mb: 1,
                                        fontWeight: 500,
                                        fontSize: '0.875rem',
                                    }}
                                >
                                    Nome
                                </FormLabel>
                                <TextField
                                    id="name"
                                    type="text"
                                    name="name"
                                    required
                                    fullWidth
                                    placeholder="Nome da missão"
                                    variant="outlined"
                                    value={currentMission.name || ''}
                                    onChange={handleInputChange}
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            borderRadius: 1,
                                        },
                                    }}
                                />
                            </FormControl>

                            <FormControl>
                                <FormLabel
                                    htmlFor="duration"
                                    sx={{
                                        mb: 1,
                                        fontWeight: 500,
                                        fontSize: '0.875rem',
                                    }}
                                >
                                    Duração (segundos)
                                </FormLabel>
                                <TextField
                                    id="duration"
                                    type="number"
                                    name="duration"
                                    required
                                    fullWidth
                                    placeholder="60 segundos"
                                    variant="outlined"
                                    value={currentMission.duration || ''}
                                    onChange={handleInputChange}
                                    InputProps={{
                                        inputProps: { step: 15, min: 0, max: 300 },
                                    }}
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            borderRadius: 1,
                                        },
                                    }}
                                />
                            </FormControl>
                        </Stack>
                    </LocalizationProvider>
                </DialogContent>

                <DialogActions
                    sx={{
                        px: 4,
                        py: 3,
                        borderTop: '1px solid',
                        borderColor: 'divider',
                        gap: 1,
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
                            fontWeight: 'normal',
                        }}
                    >
                        Cancelar
                    </Button>
                    <Button
                        onClick={handleSave}
                        variant="contained"
                        color="primary"
                        sx={{
                            px: 3,
                            py: 1,
                            borderRadius: 1,
                            textTransform: 'none',
                            fontWeight: 'normal',
                        }}
                    >
                        Iniciar
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

const Missions = () => {
    return (
        <SnackbarProvider
            maxSnack={3}
            autoHideDuration={3000}
            anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
            }}
            preventDuplicate
        >
            <MissionsContent />
        </SnackbarProvider>
    );
};

export default Missions;