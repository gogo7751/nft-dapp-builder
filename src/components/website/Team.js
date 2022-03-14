import { Typography, useTheme } from '@mui/material';
import { blueGrey } from '@mui/material/colors';
import { Grid, Container, Card, CardContent, CardMedia } from '@mui/material';
import { styled } from '@mui/system';
import TwitterIcon from '@mui/icons-material/Twitter';
import LinkedInIcon from '@mui/icons-material/LinkedIn';

export default function Team(team) {
  const theme = useTheme();
  const Div = styled('div')({
    display: 'flex',
  });
  return (
    <div>
      <Typography
        variant="h3"
        sx={{
          textAlign: 'center',
          marginTop: theme.spacing(5),
        }}
      >
        {team.team.title}
      </Typography>
      <div>
        <Typography
          sx={{
            textAlign: 'center',
            marginTop: theme.spacing(2),
            color: blueGrey[600],
          }}
        >
          {team.team.subtitle}
        </Typography>
      </div>
      <Container>
        <Grid container alignItems="center" justify="center" spacing={3} mt={5}>
          {team.team.items?.map((item, index) => (
            <Grid item xs={6} md={4} lg={3} key={index}>
              <Card
                sx={{
                  marginTop: theme.spacing(20),
                  margin: 'auto',
                  flexDirection: 'column',
                  width: 200,
                }}
              >
                <CardMedia
                  component="img"
                  height="140"
                  image={item.image}
                  alt="green iguana"
                />
                <CardContent>
                  <Div>
                    <Typography
                      gutterBottom
                      variant="h5"
                      component="div"
                      sx={{ textAlign: 'left', flexGrow: 1 }}
                    >
                      {item.primary}
                    </Typography>
                    {item.twitter && (
                      <TwitterIcon
                        onClick={() => window.open(item.twitter, '_blank')}
                        sx={{ '&:hover': { cursor: 'pointer' } }}
                      />
                    )}
                    {item.linkedin && (
                      <LinkedInIcon
                        onClick={() => window.open(item.linkedin, '_blank')}
                        sx={{ '&:hover': { cursor: 'pointer' } }}
                      />
                    )}
                  </Div>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ textAlign: 'left' }}
                  >
                    {item.secondary}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </div>
  );
}
