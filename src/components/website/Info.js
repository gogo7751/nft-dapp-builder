import { React } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import CardMedia from '@mui/material/CardMedia';

export default function Info(data) {
  return (
    <div>
      <Box sx={{ flexGrow: 1 }} m={4}>
        <Grid container spacing={4}>
          <Grid item xs={12} sm={6} md={6}>
            <Typography sx={{ pb: 2 }} variant="h3" component="h3">
              {data.info.hasOwnProperty('title') ? data.info.title : ''}
            </Typography>
            <Typography variant="body1" color="textSecondary">
              {data.info.hasOwnProperty('desc') ? data.info.desc : ''}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={6}>
            <Paper variant="outlined">
              <img
                width="100%"
                src="https://d1qlj1o6gdgqqt.cloudfront.net/wp-content/uploads/2021/09/apes-collage-new-1-1110x1065.jpg"
              />
            </Paper>
          </Grid>
        </Grid>
      </Box>
      <Box
        sx={{
          display: {
            xs: data.info.youtube ? 'block' : 'none',
          },
        }}
      >
        <Grid
          item
          xs={12}
          sm={12}
          md={12}
          sx={{
            position: 'relative',
            paddingBottom: '56.25%',
          }}
        >
          <CardMedia
            component="iframe"
            allowFullScreen
            image={data.info.youtube ? data.info.youtube : ''}
            sx={{ position: 'absolute', width: '100%', height: '100%' }}
          />
        </Grid>
        ˝
      </Box>
    </div>
  );
}
