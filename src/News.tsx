import { useState, useEffect } from 'react';
import { 
  Box, Container, Typography, Grid2 as Grid, Card, CardContent, 
  CardMedia, CardActions, Paper, Button, useTheme, Chip
} from '@mui/material';
import { motion } from 'framer-motion';
import { CalendarMonthRounded, ArrowForward } from '@mui/icons-material';

const NewsPage = () => {
  const theme = useTheme();
  
  // Featured/Pinned News
  const featuredNews = {
    title: "Grande Avanço na Recolha de Dados Atmosféricos",
    date: "2025-02-05",
    summary: "A nossa equipa alcançou um marco significativo na recolha de dados atmosféricos, permitindo medições mais precisas dos parâmetros de qualidade do ar em várias altitudes.",
    image: "/images/featured-news.jpg",
    category: "Avanço Técnico"
  };
  
  // Regular News Items
  const newsItems = [
    {
      title: "Lançamento Bem-Sucedido do GlebSat-1",
      date: "2025-02-01",
      summary: "O nosso primeiro microssatélite foi lançado com sucesso e colocado em órbita terrestre baixa.",
      image: "/images/news1.jpg",
      category: "Atualização de Missão"
    },
    {
      title: "Novas Funcionalidades de Monitorização da Qualidade do Ar",
      date: "2025-01-15",
      summary: "Capacidades de deteção melhoradas para monitorizar poluentes atmosféricos adicionais.",
      image: "/images/news2.jpg",
      category: "Atualização Técnica"
    },
    {
      title: "Anúncio de Parceria de Investigação",
      date: "2025-01-01",
      summary: "Nova colaboração com instituições de investigação ambiental líderes.",
      image: "/images/news3.jpg",
      category: "Parceria"
    }
  ];

  return (
    <Box sx={{ minHeight: '100vh', py: 8 }} className="news-container">
      {/* Page Title - With animation */}
      <Box 
        component={motion.div}
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        sx={{ 
          textAlign: 'center',
          mb: 8
        }}
      >
        <Typography 
          variant="h2" 
          component="h1" 
          fontWeight="bold" 
          className="color-primary"
        >
          Últimas Notícias
        </Typography>
        
        <Typography 
          variant="h6"
          component={motion.p}
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.8 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="color-secondary"
          sx={{ 
            maxWidth: '700px', 
            mx: 'auto', 
            mt: 2,
            px: 2
          }}
        >
          Acompanhe as atualizações mais recentes sobre o nosso projeto e avanços tecnológicos
        </Typography>
      </Box>
      
      <Container maxWidth="xl">
        {/* Featured/Pinned News */}
        <Box 
          component={motion.div}
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false }}
          transition={{ duration: 0.8 }}
          sx={{ mb: 8 }}
        >
          <Typography 
            component={motion.h2}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false }}
            transition={{ duration: 0.6 }}
            variant="h4" 
            fontWeight="bold" 
            className="color-primary"
            sx={{ mb: 3 }}
          >
            Notícia em Destaque
          </Typography>
          
          <Card 
            component={motion.div}
            whileHover={{ y: -5, boxShadow: '0 10px 20px rgba(0,0,0,0.2)' }}
            elevation={3}
            className="bg-secondary"
            sx={{ 
              borderRadius: 4, 
              overflow: 'hidden'
            }}
          >
            <Grid container>
              <Grid size={{ xs: 12, md: 6 }}>
                <CardMedia
                  component="img"
                  sx={{ 
                    height: { xs: '240px', md: '100%' },
                    objectFit: 'cover'
                  }}
                  image={featuredNews.image || "/images/glebsat-front.png"}
                  alt={featuredNews.title}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <CardContent sx={{ p: 4 }}>
                  <Chip 
                    label={featuredNews.category} 
                    color="primary" 
                    size="small"
                    sx={{ mb: 2 }}
                  />
                  <Typography 
                    variant="h4" 
                    component="h3" 
                    gutterBottom 
                    className="color-primary"
                    fontWeight="bold"
                  >
                    {featuredNews.title}
                  </Typography>
                  <Typography 
                    variant="body1" 
                    sx={{ mb: 3 }} 
                    className="color-secondary"
                  >
                    {featuredNews.summary}
                  </Typography>
                  <Box 
                    sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      mb: 3 
                    }}
                    className="color-secondary"
                  >
                    <CalendarMonthRounded sx={{ mr: 1, fontSize: 20 }} />
                    <Typography variant="body2">
                      {new Date(featuredNews.date).toLocaleDateString('pt-PT', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </Typography>
                  </Box>
                  <Button
                    component={motion.button}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    variant="contained"
                    color="primary"
                    endIcon={<ArrowForward />}
                    sx={{ 
                      mt: 2,
                      textTransform: 'none',
                      borderRadius: 2,
                      px: 3
                    }}
                  >
                    Ler Mais
                  </Button>
                </CardContent>
              </Grid>
            </Grid>
          </Card>
        </Box>
        
        {/* News Grid */}
        <Box sx={{ mb: 6 }}>
          <Typography 
            component={motion.h2}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false }}
            transition={{ duration: 0.6 }}
            variant="h4" 
            fontWeight="bold" 
            gutterBottom 
            className="color-primary"
            sx={{ mb: 3 }}
          >
            Todas as Notícias
          </Typography>
          
          <Grid container spacing={3}>
            {newsItems.map((item, index) => (
              <Grid size={{ xs: 12, sm: 6, md: 4 }} key={index}>
                <Card 
                  component={motion.div}
                  whileHover={{ y: -10, boxShadow: '0 10px 20px rgba(0,0,0,0.2)' }}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: false }}
                  transition={{ duration: 0.5, delay: 0.1 * index }}
                  elevation={3}
                  className="bg-secondary"
                  sx={{ 
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    borderRadius: 3,
                    overflow: 'hidden'
                  }}
                >
                  <CardMedia
                    component="img"
                    height="200"
                    image={item.image || "/images/placeholder.jpg"}
                    alt={item.title}
                    className="image-overlay"
                    sx={{ objectFit: 'cover' }}
                  />
                  
                  <CardContent sx={{ flexGrow: 1, p: 3 }}>
                    <Chip 
                      label={item.category} 
                      color="primary" 
                      size="small"
                      sx={{ mb: 2 }}
                    />
                    
                    <Typography 
                      variant="h6" 
                      component="h3" 
                      gutterBottom 
                      className="color-primary"
                      fontWeight="bold"
                      sx={{ mb: 2 }}
                    >
                      {item.title}
                    </Typography>
                    
                    <Typography 
                      variant="body2" 
                      sx={{ mb: 3 }} 
                      className="color-secondary"
                    >
                      {item.summary}
                    </Typography>
                    
                    <Box 
                      sx={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        mb: 1
                      }}
                      className="color-secondary"
                    >
                      <CalendarMonthRounded sx={{ mr: 1, fontSize: 16 }} />
                      <Typography variant="body2">
                        {new Date(item.date).toLocaleDateString('pt-PT', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </Typography>
                    </Box>
                  </CardContent>
                  
                  <CardActions sx={{ p: 3, pt: 0 }}>
                    <Button
                      component={motion.button}
                      whileHover={{ x: 5 }}
                      size="small"
                      color="primary"
                      endIcon={<ArrowForward />}
                      sx={{ textTransform: 'none' }}
                    >
                      Ler Mais
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
        
        {/* Newsletter Subscription */}
        {/* <Box 
          component={motion.div}
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false }}
          transition={{ duration: 0.8 }}
          className="bg-tertiary"
          sx={{ 
            p: { xs: 4, md: 6 }, 
            borderRadius: 4,
            textAlign: 'center',
            boxShadow: 4
          }}
        >
          <Typography 
            variant="h5" 
            gutterBottom 
            fontWeight="bold" 
            className="color-primary"
          >
            Subscreva a Nossa Newsletter
          </Typography>
          
          <Typography 
            variant="body1" 
            className="color-secondary" 
            sx={{ 
              maxWidth: '600px', 
              mx: 'auto',
              mb: 4
            }}
          >
            Mantenha-se atualizado com as nossas últimas descobertas, avanços tecnológicos e notícias do projeto GlebSat diretamente na sua caixa de entrada.
          </Typography>
          
          <Box
            component={motion.div}
            whileHover={{ scale: 1.02 }}
            sx={{
              maxWidth: '500px',
              mx: 'auto',
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              gap: 2
            }}
          >
            <Button
              variant="contained"
              color="primary"
              size="large"
              sx={{
                py: 1.5,
                px: 4,
                borderRadius: 2,
                textTransform: 'none',
                fontSize: '1rem',
                width: '100%'
              }}
            >
              Subscrever
            </Button>
          </Box>
        </Box> */}
      </Container>
    </Box>
  );
};

export default NewsPage;