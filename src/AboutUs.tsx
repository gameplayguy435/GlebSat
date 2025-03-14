import { useEffect } from 'react';
import { 
  Box, Container, Typography, Grid2 as Grid, Card, CardContent, 
  CardMedia, CardActions, Paper, Button, useTheme 
} from '@mui/material';
import { Email, GitHub, LinkedIn } from '@mui/icons-material';
import { motion } from 'framer-motion';

const AboutUsPage = () => {
  const theme = useTheme();
  
  // Team members data with 4 members
  const teamMembers = [
    {
      name: "David Vieira",
      role: "Líder do Projeto e Especialista em Programação e Eletrónica",
      image: "/images/david.jpg",
      description: "Programação de microcontroladores e circuitos eletrónicos",
      links: { github: "#", linkedin: "#", email: "#" }
    },
    {
      name: "Ricardo Mouro",
      role: "Especialista em Design e Planificação Gráfica",
      image: "/images/ricardo.jpg",
      description: "Utilização de software de design e criação de protótipos",
      links: { github: "#", linkedin: "#", email: "#" }
    },
    {
      name: "Rafael Teixeira",
      role: "Especialista de Desenvolvimento de Software",
      image: "/images/rafael.jpg",
      description: "Desenvolvimento de aplicações web para manipulação de dados",
      links: { github: "#", linkedin: "#", email: "#" }
    },
    {
      name: "Guilherme Ferreira",
      role: "Especialista em Mecânica e Telecomunicações",
      image: "/images/guilherme.jpg", 
      description: "Cálculo de trajetórias, sistema de paraquedas e comunicação via satélite",
      links: { github: "#", linkedin: "#", email: "#" }
    }
  ];

  const timeline = [
    { date: 'Dezembro 2024', title: 'Início do Projeto', description: 'Formação da equipa e desenvolvimento do conceito inicial.' },
    { date: 'Janeiro 2025', title: 'Estruturação', description: 'Planificação e escolha das componentes necessárias.' },
    { date: 'Fevereiro - Abril 2025', title: 'Implementação', description: 'Desenvolvimento do software e construção do satélite.' },
    { date: 'Maio 2025', title: 'Lançamento', description: 'Lançamento e análise final dos dados.' }
  ]

  return (
    <Box sx={{ minHeight: '100vh' }} className="about-container">
      {/* Page Title - Outside Container for Full Width */}
      <Box 
        component={motion.div}
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        sx={{ 
          textAlign: 'center',
          py: 8
        }}
      >
        <Typography 
          variant="h2" 
          component="h1" 
          fontWeight="bold" 
          className="color-primary"
        >
          Sobre Nós
        </Typography>
      </Box>

      <Container maxWidth="xl" sx={{ mb: 8 }}>
        {/* Video Presentation Section */}
        <Box 
          component={motion.div}
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: false }}
          sx={{ mb: 12 }}
        >
          <Typography 
            variant="h3" 
            component="h2" 
            fontWeight="bold" 
            gutterBottom 
            align="center"
            className="color-primary"
            sx={{ mb: 4 }}
          >
            Vídeo de Apresentação
          </Typography>
          
          <Paper 
            elevation={4} 
            sx={{ 
              borderRadius: 4, 
              overflow: 'hidden',
              position: 'relative',
              paddingTop: '56.25%', // Maintain 16:9 aspect ratio
              width: '100%'
            }}
            className="bg-secondary"
          >
            <Box
              component="video"
              controls
              autoPlay={true}
              muted
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
              poster="/images/glebsat-front.png"
            >
              <source src="/videos/glebsatfinal.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </Box>
          </Paper>
        </Box>
      </Container>

      {/* Project Motivation Section - Full Width Hero-Style Layout */}
      <Box 
        component={motion.div}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: false }}
        transition={{ duration: 1.0 }}
        sx={{ 
          py: 12,
          position: 'relative',
          overflow: 'hidden',
          boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
          mb: 10
        }}
        className="bg-tertiary"
      >
        {/* Decorative elements */}
        <Box 
          component={motion.div}
          animate={{ 
            rotate: 360,
            scale: [1, 1.1, 1]
          }}
          transition={{ 
            duration: 20, 
            ease: "linear", 
            repeat: Infinity 
          }}
          sx={{ 
            position: 'absolute', 
            top: -100, 
            right: -100, 
            width: 300, 
            height: 300, 
            borderRadius: '50%', 
            background: 'radial-gradient(circle, rgba(33,150,243,0.2) 0%, rgba(33,150,243,0) 70%)',
          }}
          className=""
        />
        <Box 
          component={motion.div}
          animate={{ 
            rotate: -360,
            scale: [1, 1.2, 1]
          }}
          transition={{ 
            duration: 25, 
            ease: "linear", 
            repeat: Infinity 
          }}
          sx={{ 
            position: 'absolute', 
            bottom: -80, 
            left: -80, 
            width: 200, 
            height: 200, 
            borderRadius: '50%', 
            background: 'radial-gradient(circle, rgba(76,175,80,0.15) 0%, rgba(76,175,80,0) 70%)',
          }}
        />
      
        <Container maxWidth="xl">
          <Typography 
            component={motion.h2}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false }}
            transition={{ duration: 0.6 }}
            variant="h3" 
            fontWeight="bold" 
            align="center"
            className="color-primary"
            sx={{ mb: 6 }}
          >
            Quem Somos
          </Typography>
          
          <Grid container spacing={6} alignItems="center">
            <Grid size={{ xs: 12, md: 6 }}>
              <Box 
                component={motion.div}
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: false }}
                transition={{ duration: 0.8 }}
              >
                <Typography variant="h3" fontWeight="bold" className="color-primary" sx={{ mb: 2, fontWeight: 500 }}>
                  Equipa GlebSat
                </Typography>
                
                <Box 
                  sx={{ 
                    borderLeft: '4px solid',
                    borderColor: 'primary.main',
                    pl: 4,
                    py: 2,
                    mt: 4
                  }}
                >
                  <Typography variant="body1" paragraph className="color-secondary" sx={{ fontSize: '1.1rem', mb: 3 }}>
                    Somos uma equipa multidimensional de estudantes que ambicionam a resolução de novos problemas. O projeto GlebSat nasceu da necessidade de conhecer melhor o mundo que nos rodeia, através de soluções acessíveis e eficientes para a recolha de dados ambientais em tempo real.
                  </Typography>
                  
                  <Typography variant="body1" paragraph className="color-secondary" sx={{ fontSize: '1.1rem' }}>
                    A nossa missão é informatizar o acesso a dados de controlo ambiental, fornecendo informações precisas sobre qualidade do ar, temperatura, composição atmosférica e outras métricas fundamentais.
                  </Typography>
                </Box>
              </Box>
            </Grid>
            
            {/* Right side: Image */}
            <Grid size={{ xs: 12, md: 6 }}>
              <Box
                component={motion.div}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: false }}
                transition={{ duration: 0.8 }}
                sx={{
                  position: 'relative',
                  height: '400px',
                  width: '100%',
                  overflow: 'hidden',
                  borderRadius: 4,
                  boxShadow: 3
                }}
              >
                <Box
                  component="img"
                  src="/images/glebsat-equipa1.jpg"
                  alt="Satellite monitoring Earth"
                  sx={{ 
                    width: '100%', 
                    height: '100%', 
                    objectFit: 'cover'
                  }}
                  className="image-overlay"
                />
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>
      
      <Container maxWidth="xl">
        {/* Team Members Section */}
        <Box 
          component={motion.div}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: false }}
          transition={{ duration: 0.8 }}
          sx={{ mb: 12 }}
        >
          <Typography 
            component={motion.h2}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false }}
            transition={{ duration: 0.6 }}
            variant="h3" 
            fontWeight="bold" 
            gutterBottom 
            align="center"
            className="color-primary"
            sx={{ mb: 8 }}
          >
            A Nossa Equipa
          </Typography>
          
          <Grid container spacing={4}>
            {teamMembers.map((member, index) => (
              <Grid size={{ xs: 12, sm: 6, lg: 3 }} key={index}>
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
                    height="240"
                    image={member.image}
                    alt={member.name}
                    onError={(e) => {
                      e.currentTarget.src = `/images/placeholder.jpg`;
                    }}
                    sx={{ objectFit: 'cover' }}
                  />
                  
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography variant="h6" component="h3" fontWeight="bold" gutterBottom className="color-primary">
                      {member.name}
                    </Typography>
                    
                    <Typography 
                      variant="subtitle1" 
                      color="primary.main" 
                      gutterBottom 
                      sx={{ mb: 2, fontWeight: 500 }}
                    >
                      {member.role}
                    </Typography>
                    
                    <Typography variant="body2" className="color-secondary">
                      {member.description}
                    </Typography>
                  </CardContent>
                  
                  <CardActions 
                    sx={{
                      p: 2,
                      pt: 0,
                      display: 'flex',
                      justifyContent: 'space-around'
                    }}
                  >
                    {member.links.github && (
                      <Button 
                        size="small" 
                        href={member.links.github}
                        target="_blank" 
                        rel="noopener noreferrer"
                        startIcon={<GitHub />}
                      >
                      </Button>
                    )}
                    
                    {member.links.linkedin && (
                      <Button 
                        size="small" 
                        href={member.links.linkedin}
                        target="_blank" 
                        rel="noopener noreferrer"
                        startIcon={<LinkedIn />}
                      >
                      </Button>
                    )}
                    
                    {member.links.email && (
                      <Button 
                        size="small" 
                        href={`mailto:${member.links.email}`}
                        startIcon={<Email />}
                      >
                      </Button>
                    )}
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
        
        {/* Mission & Values Section */}
        <Box 
          component={motion.div}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: false }}
          transition={{ duration: 0.8 }}
          sx={{ mb: 10 }}
        >
          <Typography 
            component={motion.h2}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false }}
            transition={{ duration: 0.6 }}
            variant="h3" 
            fontWeight="bold" 
            gutterBottom 
            align="center"
            className="color-primary"
            sx={{ mb: 8 }}
          >
            A Nossa Missão
          </Typography>
          
          <Grid container spacing={4}>
            <Grid size={{ xs: 12, md: 4 }}>
              <Card 
                component={motion.div}
                whileHover={{ y: -8 }}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false }}
                transition={{ duration: 0.5 }}
                elevation={2}
                className="bg-secondary"
                sx={{ 
                  height: '100%',
                  borderRadius: 3,
                  p: 3,
                  textAlign: 'center'
                }}
              >
                <Typography variant="h5" component="h3" gutterBottom fontWeight="bold" color="primary.main">
                  Inovação
                </Typography>
                <Typography variant="body1" className="color-secondary">
                  Procuramos desenvolver novas soluções tecnológicas para melhorar a análise de dados atmosféricos e automatizar o processo.
                </Typography>
              </Card>
            </Grid>
            
            <Grid size={{ xs: 12, md: 4 }}>
              <Card 
                component={motion.div}
                whileHover={{ y: -8 }}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false }}
                transition={{ duration: 0.5, delay: 0.1 }}
                elevation={2}
                className="bg-secondary"
                sx={{ 
                  height: '100%',
                  borderRadius: 3,
                  p: 3,
                  textAlign: 'center'
                }}
              >
                <Typography variant="h5" component="h3" gutterBottom fontWeight="bold" color="primary.main">
                  Precisão
                </Typography>
                <Typography variant="body1" className="color-secondary">
                  Comprometemo-nos com a exatidão científica e a confiabilidade dos dados, fornecendo informações precisas para decisões informadas.
                </Typography>
              </Card>
            </Grid>
            
            <Grid size={{ xs: 12, md: 4 }}>
              <Card 
                component={motion.div}
                whileHover={{ y: -8 }}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false }}
                transition={{ duration: 0.5, delay: 0.2 }}
                elevation={2}
                className="bg-secondary"
                sx={{ 
                  height: '100%',
                  borderRadius: 3,
                  p: 3,
                  textAlign: 'center'
                }}
              >
                <Typography variant="h5" component="h3" gutterBottom fontWeight="bold" color="primary.main">
                  Sustentabilidade
                </Typography>
                <Typography variant="body1" className="color-secondary">
                  Trabalhamos com o objetivo final de contribuir para um futuro mais sustentável através da informação ambiental de qualidade.
                </Typography>
              </Card>
            </Grid>
          </Grid>
        </Box>
        
        {/* Project Timeline Section */}
        <Box 
          component={motion.div}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: false }}
          transition={{ duration: 0.8 }}
          overflow={'hidden'}
          sx={{ mb: 6 }}
        >
          <Typography 
            component={motion.h2}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false }}
            transition={{ duration: 0.6 }}
            variant="h3" 
            fontWeight="bold" 
            gutterBottom 
            align="center"
            className="color-primary"
            sx={{ mb: 8 }}
          >
            Trajetória do Projeto
          </Typography>
          
          <Box 
            sx={{ 
              position: 'relative',
              py: 4,
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                bottom: 0,
                left: { xs: '20px', md: '50%' },
                width: '4px',
                backgroundColor: 'primary.main',
                transform: { xs: 'none', md: 'translateX(-50%)' }
              }
            }}
          >
            {timeline.map((item, index) => (
              <Box
                component={motion.div}
                initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: false }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                key={index}
                sx={{
                  display: 'flex',
                  justifyContent: { 
                    xs: 'flex-start', // Always start from left on mobile
                    md: index % 2 === 0 ? 'flex-end' : 'flex-start' // Alternate on desktop
                  },
                  mb: 6,
                  position: 'relative',
                  ml: { xs: 4, md: 0 }, // Add margin-left on mobile to accommodate the timeline
                  pl: { xs: 2, md: 0 } // Add padding-left on mobile
                }}
              >
                {/* Timeline node/circle */}
                <Box
                  sx={{
                    display: { xs: 'block', md: 'none' },
                    position: 'absolute',
                    left: -40,
                    top: 27,
                    width: 20,
                    height: 20,
                    borderRadius: '15%',
                    backgroundColor: 'primary.main',
                    zIndex: 2,
                    boxShadow: '0 0 0 4px var(--background-primary)',
                    transform: 'rotate(45deg)'
                  }}
                />
                
                <Box
                  sx={{
                    width: { xs: 'calc(100% - 10px)', md: '45%' },
                    position: 'relative'
                  }}
                >
                  <Card
                    elevation={3}
                    className="bg-secondary"
                    sx={{ 
                      borderRadius: 3,
                      p: 3,
                      '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: '30px',
                        [index % 2 === 0 ? 'left' : 'right']: { xs: 'auto', md: '-15px' },
                        left: { xs: '-15px', md: index % 2 === 0 ? '-15px' : 'auto' },
                        width: { xs: '12px', md: '30px' },
                        height: { xs: '12px', md: '30px' },
                        backgroundColor: 'primary.main',
                        transform: 'rotate(45deg)',
                        zIndex: -1,
                        display: { xs: 'none', md: 'block' } // Hide on mobile
                      }
                    }}
                  >
                    <Typography variant="subtitle1" color="primary.main" fontWeight="bold">
                      {item.date}
                    </Typography>
                    <Typography variant="h6" className="color-primary" fontWeight="bold" gutterBottom>
                      {item.title}
                    </Typography>
                    <Typography variant="body1" className="color-secondary">
                      {item.description}
                    </Typography>
                  </Card>
                </Box>
              </Box>
            ))}
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default AboutUsPage;