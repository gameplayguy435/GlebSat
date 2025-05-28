import { useState, useEffect, useRef, ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box,
    Button,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
    FormControlLabel,
    FormLabel,
    Stack,
    TextField,
    Typography,
} from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { 
    AddchartRounded,
    Visibility,
    FileUpload,
    FileDownload,
    Assessment
} from '@mui/icons-material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { ptBR } from '@mui/x-data-grid/locales';
import AntSwitch from './components/AntSwitch';
import { SnackbarProvider, useSnackbar } from 'notistack';
import dayjs from 'dayjs';
import { read, utils, write } from 'xlsx';
import { generateMissionReport } from './services/ReportGenerator';

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
    const [awaitingConnectionOpen, setAwaitingConnectionOpen] = useState(false);
    const [awaitingMissionId, setAwaitingMissionId] = useState<number | null>(null);
    const { enqueueSnackbar } = useSnackbar();
    const navigate = useNavigate();

    const [missions, setMissions] = useState<Mission[]>([]);
    const [currentMission, setCurrentMission] = useState<Partial<Mission>>({
        name: '',
    });
    const [missionType, setMissionType] = useState('realtime');

    useEffect(() => {
        fetchMissions();
    }, []);

    const fileInputRef = useRef<HTMLInputElement | null>(null);

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
                
                console.log('Missões formatadas:', formattedMissions);
                setMissions(formattedMissions);
            } else {
                console.error('Erro ao carregar as missões:', data.message);
                enqueueSnackbar('Erro ao carregar as missões.', { variant: 'error' });
            }
        } catch (err) {
            console.error('Erro ao carregar as missões:', err);
            enqueueSnackbar('Erro ao carregar as missões.', { variant: 'error' });
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString: string) => {
        if (!dateString) return 'Dados Indisponíveis';
        try {
            const date = new Date(dateString);
            if (isNaN(date.getTime())) return 'Dados Indisponíveis';
            
            const formattedDate = date.toLocaleTimeString('pt-PT', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit', 
                minute: '2-digit', 
                second: '2-digit' 
            });

            return formattedDate;
        } catch (error) {
            console.error("Erro ao formatar a data:", error);
            return 'Dados Indisponíveis';
        }
    };
    
    const formatDuration = (duration: string) => {
        if (!duration) return 'Dados Indisponíveis';
        
        try {
            if (duration.match(/^\d{2}:\d{2}:\d{2}$/)) {
                const parts = duration.split(':');
                return `${parseInt(parts[1], 10)} min ${parseInt(parts[2], 10)} seg`;
            }
                        
            return duration;
        } catch (error) {
            console.error("Erro ao formatar a duração:", error);
            return 'Dados Indisponíveis';
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
    
    const handleOpenMission = (mission: Mission) => {
        if (mission.start_date === null) {
            enqueueSnackbar('Sem dados para visualizar.', { variant: 'warning' });
        } else {
            navigate(`/admin/missions/${mission.id}`);
        }
    }

    const checkMissionConnection = async (missionId: number) => {
        try {
            const response = await fetch(`${API_URL}/mission/${missionId}`);
            const data = await response.json();
            
            if (data.success) {
                const mission = data.mission;
                if (mission.start_date) {
                    const recordsResponse = await fetch(`${API_URL}/mission/${missionId}/records`);
                    const recordsData = await recordsResponse.json();
                    
                    if (recordsData.success && recordsData.records.length > 0) {
                        setAwaitingConnectionOpen(false);
                        setAwaitingMissionId(null);
                        navigate(`/admin/missions/${missionId}`, { replace: true });
                        return true;
                    }
                }
            }
            return false;
        } catch (error) {
            console.error('Error checking mission connection:', error);
            return false;
        }
    };

    useEffect(() => {
        let intervalId: NodeJS.Timeout;
        
        if (awaitingConnectionOpen && awaitingMissionId) {
            intervalId = setInterval(async () => {
                const connected = await checkMissionConnection(awaitingMissionId);
                if (connected) {
                    clearInterval(intervalId);
                }
            }, 1000);
        }
        
        return () => {
            if (intervalId) {
                clearInterval(intervalId);
            }
        };
    }, [awaitingConnectionOpen, awaitingMissionId]);

    const handleSave = async () => {
        if (!currentMission.name?.trim()) {
            enqueueSnackbar('O nome da missão é obrigatório.', { variant: 'error' });
            return;
        }

        const newMission = {
            name: currentMission.name,
            start_date: null,
            end_date: null,
            duration: null,
            is_realtime: missionType === 'realtime'
        };

        try {
            const response = await fetch(`${API_URL}/mission/create`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newMission),
            });
            const data = await response.json();

            if (data.success) {
                const insertedMission = data.missions[data.missions.length - 1];
                
                if (missionType === 'realtime') {
                    setDialogOpen(false);
                    setAwaitingMissionId(insertedMission.id);
                    setAwaitingConnectionOpen(true);
                    enqueueSnackbar('A missão iniciará em breve!', { variant: 'info' });
                } else {
                    setDialogOpen(false);
                    enqueueSnackbar('Missão criada com sucesso!', { variant: 'success' });
                    fetchMissions();
                }
            } else {
                console.error('Erro ao criar a missão:', data.message);
                enqueueSnackbar('Erro ao criar a missão.', { variant: 'error' });
            }
        } catch (err) {
            console.error('Erro ao criar a missão:', err);
            enqueueSnackbar('Erro de conexão ao criar a missão.', { variant: 'error' });
        }
    };

    const handleCancelAwaiting = () => {
        setAwaitingConnectionOpen(false);
        setAwaitingMissionId(null);
        fetchMissions();
    };

    const handleImportMission = (id: number) => {
        const mission = missions.find(m => m.id === id);
        if (mission && mission.end_date && mission.duration) {
            enqueueSnackbar('Não é possível importar dados em missões concluídas.', {
                variant: 'warning'
            });
            return;
        }
        
        fileInputRef.current.dataset.missionId = id.toString();
        fileInputRef.current.click();
    };
    
    const handleExportMission = async (id: number) => {
        try {
            setLoading(true);
            const response = await fetch(`${API_URL}/mission/${id}/records`);
            const result = await response.json();
            
            if (result.success && result.records && result.records.length > 0) {
                const recordsData = result.records.map(record => record.data);
                
                const worksheet = utils.json_to_sheet(recordsData);
                const workbook = utils.book_new();
                utils.book_append_sheet(workbook, worksheet, "Records");
                
                const mission = missions.find(m => m.id === id);
                const fileName = `missao_${mission?.name.replace(/\s+/g, '_').toLowerCase() || 'export'}_${new Date().toISOString().split('T')[0]}.xlsx`;
                
                const excelBuffer = write(workbook, { bookType: 'xlsx', type: 'array' });
                const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
                
                const url = URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = fileName;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                
                enqueueSnackbar(`${recordsData.length} registos exportados com sucesso!`, { 
                    variant: 'success' 
                });
            } else {
                enqueueSnackbar('Sem dados para exportar.', { variant: 'warning' });
            }
        } catch (error) {
            console.error('Erro ao exportar dados:', error);
            enqueueSnackbar('Erro ao exportar dados.', { variant: 'error' });
        } finally {
            setLoading(false);
        }
    };
    
    const handleCreateReport = async (id: number) => {
        try {
          setLoading(true);
          const response = await fetch(`${API_URL}/mission/${id}/records`);
          const result = await response.json();
          
          if (result.success && result.records && result.records.length > 0) {
            const missionResponse = await fetch(`${API_URL}/mission/${id}`);
            const missionData = await missionResponse.json();
            
            if (!missionData.success) {
                enqueueSnackbar('Erro ao obter dados da missão.', { variant: 'error' });
                throw new Error('Erro ao obter dados da missão.');
            }
            
            const mission = missionData.mission;
            const recordsData = result.records.map(record => record.data);
            
            const processedData = processDataForReport(recordsData, mission);
            
            const blob = generateMissionReport(processedData);
        
            const blobUrl = URL.createObjectURL(blob);
            const newTab = window.open(blobUrl, '_blank');
            
            if (newTab) {
                newTab.addEventListener('load', () => {
                    setTimeout(() => URL.revokeObjectURL(blobUrl), 1000);
                });
            }
            
            enqueueSnackbar('Relatório gerado com sucesso!', { variant: 'success' });
          } else {
            enqueueSnackbar('Sem dados para criar relatório.', { variant: 'warning' });
          }
        } catch (error) {
          console.error('Erro ao criar relatório:', error);
          enqueueSnackbar('Erro ao criar relatório.', { variant: 'error' });
        } finally {
          setLoading(false);
        }
    };

    const handleFileUpload = async (event: ChangeEvent<HTMLInputElement>) => {
        try {
            const file = event.target.files[0];
            if (!file) return;
            
            const missionId = fileInputRef.current.dataset.missionId;
            if (!missionId) {
                enqueueSnackbar('Missão não encontrada.', { variant: 'error' });
                return;
            }
            
            setLoading(true);
            const reader = new FileReader();
            
            reader.onload = async (e) => {
                try {
                    let data = [];
                    
                    if (file.name.endsWith('.csv') || file.name.endsWith('.CSV')) {
                        const text = e.target?.result as string;
                        const lines = text.split('\n');
                        const headers = lines[0].split(',').map(h => h.trim());
                        
                        for (let i = 1; i < lines.length; i++) {
                            if (!lines[i].trim()) continue;
                            
                            const values = lines[i].split(',').map(v => v.trim());
                            const record = {};
                            
                            headers.forEach((header, index) => {
                                if (header !== 'timestamp' && values[index]) {
                                    record[header] = parseFloat(values[index]);
                                } else {
                                    record[header] = values[index];
                                }
                            });
                            
                            data.push(record);
                        }
                    } else if (file.name.endsWith('.xlsx') || file.name.endsWith('.XLSX')) {
                        const buffer = e.target?.result;
                        const workbook = read(buffer, { type: 'array' });
                        const sheetName = workbook.SheetNames[0];
                        const worksheet = workbook.Sheets[sheetName];
                        data = utils.sheet_to_json(worksheet);
                    } else {
                        enqueueSnackbar('Apenas ficheiros CSV e XLSX são suportados.', { 
                            variant: 'error' 
                        });
                        throw new Error('Apenas ficheiros CSV e XLSX são suportados.');
                    }
                    
                    if (data.length > 0) {                        
                        const payload = data.map(record => ({
                            mission_id: missionId,
                            data: record
                        }));
                        
                        const response = await fetch(`${API_URL}/mission/${missionId}/records/import`, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({ records: payload }),
                        });
                        
                        const result = await response.json();
                        
                        if (result.success) {
                            enqueueSnackbar(`${data.length} registos importados com sucesso!`, { 
                                variant: 'success' 
                            });
                            
                            await fetchMissions();
                            
                            const mission = missions.find(m => m.id.toString() === missionId);
                            if (mission && mission.start_date === null) {
                                navigate(`/admin/missions/${missionId}`, { replace: true });
                            }
                        } else {
                            enqueueSnackbar('Erro ao importar o ficheiro.', { variant: 'error' });
                        }
                    } else {
                        enqueueSnackbar('Sem dados para importar.', { variant: 'warning' });
                    }
                } catch (error) {
                    console.error('Erro ao processar o ficheiro:', error);
                    enqueueSnackbar('Erro ao processar o ficheiro.', { 
                        variant: 'error' 
                    });
                } finally {
                    setLoading(false);
                    event.target.value = '';
                }
            };
            
            reader.onerror = () => {
                setLoading(false);
                enqueueSnackbar('Erro ao ler o ficheiro.', { variant: 'error' });
            };
            
            if (file.name.endsWith('.csv') || file.name.endsWith('.CSV')) {
                reader.readAsText(file);
            } else {
                reader.readAsArrayBuffer(file);
            }
        } catch (error) {
            console.error('Error handling file upload:', error);
            enqueueSnackbar('Erro ao carregar o ficheiro.', { variant: 'error' });
            setLoading(false);
        }
    };

    const processDataForReport = (records, mission) => {
        const stats = {
            temperature: calculateStats(records.map(r => r.temperature_c)),
            pressure: calculateStats(records.map(r => r.pressure_hpa)),
            humidity: calculateStats(records.map(r => r.humidity_percent)),
            altitude: calculateStats(records.map(r => r.altitude_m)),
            co2: calculateStats(records.map(r => r.co2_ppm)),
        };
        
        return {
            mission,
            stats,
            records
        };
    };

    const calculateStats = (values) => {
        if (!values || values.length === 0 || values.some(v => v === undefined)) {
            return { min: 'N/A', max: 'N/A', avg: 'N/A', start: 'N/A', end: 'N/A', change: 'N/A' };
        }
        
        const validValues = values.filter(v => v !== undefined);
        const min = Math.min(...validValues);
        const max = Math.max(...validValues);
        const sum = validValues.reduce((a, b) => a + b, 0);
        const avg = sum / validValues.length;
        const start = validValues[0];
        const end = validValues[validValues.length - 1];
        const change = ((end - start) / start * 100).toFixed(2);
        
        return { min, max, avg, start, end, change: `${change.replace('.', ',')}%` };
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
            minWidth: 200,
            flex: 1.2,
            sortable: false,
            filterable: false,
            renderCell: (params) => (
                <Stack 
                    direction="row" 
                    spacing={1}
                    sx={{ 
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'flex-start',
                        marginRight: 1,
                        height: '100%' 
                    }}
                >
                    <Button
                        variant="contained"
                        size="small"
                        onClick={() => handleOpenMission(params.row)}
                        sx={{
                            minWidth: '36px',
                            width: '36px',
                            height: '36px',
                            padding: 0,
                            boxShadow: 2,
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            '&:hover': {
                                bgcolor: '#64b5f6',
                                border: '1px solid #1565c0',
                            },
                        }}
                    >
                        <Visibility fontSize="small" fill="black" />
                    </Button>
                    
                    <Button
                        variant="contained"
                        size="small"
                        onClick={() => handleImportMission(params.row.id)}
                        sx={{
                            minWidth: '36px',
                            width: '36px',
                            height: '36px',
                            padding: 0,
                            boxShadow: 2,
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            '&:hover': {
                                bgcolor: '#81c784',
                                border: '1px solid #1b5e20',
                            }
                        }}
                    >
                        <FileUpload fontSize="small" />
                    </Button>
                    
                    <Button
                        variant="contained"
                        size="small"
                        onClick={() => handleExportMission(params.row.id)}
                        sx={{
                            minWidth: '36px',
                            width: '36px',
                            height: '36px',
                            padding: 0,
                            boxShadow: 2,
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            '&:hover': {
                                bgcolor: '#81c784',
                                border: '1px solid #1b5e20',
                            }
                        }}
                    >
                        <FileDownload fontSize="small" />
                    </Button>
                    
                    <Button
                        variant="contained"
                        size="small"
                        onClick={() => handleCreateReport(params.row.id)}
                        sx={{
                            minWidth: '36px',
                            width: '36px',
                            height: '36px',
                            padding: 0,
                            boxShadow: 2,
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            '&:hover': {
                                bgcolor: '#ef5350',
                                border: '1px solid #b71c1c',
                            }
                        }}
                    >
                        <Assessment fontSize="small" />
                    </Button>
                </Stack>
            ),
        }
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
                    mb: 4,
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
                    Nova Missão
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
                                    htmlFor="missionType"
                                    sx={{
                                        mb: 1,
                                        fontWeight: 500,
                                        fontSize: '0.875rem',
                                    }}
                                >
                                    Missão em Tempo Real
                                </FormLabel>
                                <FormControlLabel
                                    sx={{
                                        '& .MuiFormControlLabel-label': {
                                            fontSize: '0.875rem'
                                        }
                                    }}
                                    control={
                                        <AntSwitch 
                                            checked={missionType === 'realtime'} 
                                            onChange={(e) => setMissionType(e.target.checked ? 'realtime' : 'import')}
                                            sx={{ mr: 3.5, left: 15 }}
                                        />
                                    }
                                />
                                
                                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
                                    {missionType === 'realtime' 
                                        ? 'A missão será iniciada imediatamente e serão recebidos dados em tempo real.'
                                        : 'A missão ficará disponível para importação de dados. As datas e duração serão definidas a partir dos dados importados.'}
                                </Typography>
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
                        {missionType === 'realtime' ? 'Iniciar' : 'Criar'}
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog
                open={awaitingConnectionOpen}
                maxWidth="sm"
                fullWidth
                disableEscapeKeyDown
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
                        textAlign: 'center',
                    }}
                >
                    Missão em Tempo Real
                </DialogTitle>
                <DialogContent sx={{ px: 4, py: 0 }}>
                    <Box 
                        sx={{ 
                            display: 'flex', 
                            flexDirection: 'column', 
                            alignItems: 'center',
                            gap: 3,
                            my: 4
                        }}
                    >
                        <CircularProgress size={60} thickness={4} />
                        <Typography 
                            variant="h6" 
                            component="div" 
                            sx={{ textAlign: 'center', color: 'text.secondary' }}
                        >
                            A aguardar ligação...
                        </Typography>
                        <Typography 
                            variant="body2" 
                            component="div" 
                            sx={{ textAlign: 'center', color: 'text.disabled', maxWidth: '300px' }}
                        >
                            Assim que a ligação for estabelecida, a missão irá iniciar e será redirecionado para a respetiva página.
                        </Typography>
                    </Box>
                </DialogContent>
                <DialogActions
                    sx={{
                        px: 4,
                        py: 3,
                        borderTop: '1px solid',
                        borderColor: 'divider',
                        justifyContent: 'center',
                    }}
                >
                    <Button
                        onClick={handleCancelAwaiting}
                        variant="outlined"
                        color="error"
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
                </DialogActions>
            </Dialog>

            <input 
                type="file"
                accept=".csv,.xlsx"
                onChange={handleFileUpload}
                ref={fileInputRef}
                style={{ display: 'none' }}
            />
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