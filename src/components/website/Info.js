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
          <Grid
            item
            xs={12}
            sm={data.info.image ? 12 : 12}
            md={data.info.image ? 7 : 12}
          >
            <Typography sx={{pb:4}} variant="h3" color="text.primary">
              {data.info.title}
            </Typography>

            <Typography variant="h5" color="text.secondary">
              {data.info.desc}
            </Typography>
          </Grid>
          {data.info.image && (
            <Grid item xs={12} sm={12} md={5}>
              <Box>
                <img width="100%" src={data.info.image} />
              </Box>
            </Grid>
          )}
        </Grid>
      </Box>
      {data.info.youtube && (
        <Box>
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
              image={data.info.youtube ? `https://www.youtube.com/embed/${data.info.youtube}` : ''}
              sx={{ position: 'absolute', width: '100%', height: '100%' }}
            />
          </Grid>
        </Box>
      )}
    </div>
  );
}
