import { Box, Typography, Paper, Button, CircularProgress } from '@mui/material';
import { Construction, ArrowBack } from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

interface WorkInProgressProps {
  title?: string;
  message?: string;
  showBackButton?: boolean;
}

const WorkInProgress = ({
  title = "Em Construção",
  message = "Esta página está em desenvolvimento. Volte mais tarde para ver as novidades!",
  showBackButton = true
}: WorkInProgressProps) => {
  const navigate = useNavigate();
  
  return (
    <Box sx={{ 
      width: '100%', 
      maxWidth: { sm: '100%', md: '1200px' },
      textAlign: 'center',
      py: 4 
    }}>
      <Paper
        component={motion.div}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        elevation={3}
        sx={{ 
          p: 4, 
          borderRadius: 3,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 3,
          maxWidth: 600,
          mx: 'auto'
        }}
      >
        <Box
          component={motion.div}
          animate={{
            rotateZ: [0, 10, -10, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            repeatType: 'loop',
            ease: 'easeInOut',
          }}
          sx={{
            bgcolor: 'primary.main',
            color: 'white',
            width: 80,
            height: 80,
            borderRadius: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Construction sx={{ fontSize: 40 }} />
        </Box>
        
        <Typography variant="h4" fontWeight="bold">
          {title}
        </Typography>
        
        <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 400 }}>
          {message}
        </Typography>
        
        {/* <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, my: 2 }}>
          <CircularProgress
            variant="determinate"
            value={35}
            size={32}
            thickness={4}
            sx={{ color: 'primary.main' }}
          />
          <Typography variant="subtitle1" color="text.secondary">
            Progresso: 35%
          </Typography>
        </Box> */}
        
        {showBackButton && (
          <Button 
            variant="outlined" 
            startIcon={<ArrowBack />}
            onClick={() => navigate('/admin/content')}
            sx={{ mt: 2 }}
          >
            Voltar à Gestão de Conteúdo
          </Button>
        )}
      </Paper>
    </Box>
  );
};

export default WorkInProgress;