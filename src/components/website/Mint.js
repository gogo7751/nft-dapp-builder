import { React, useState } from 'react';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import SvgIcon from '@mui/material/SvgIcon';
import Stack from '@mui/material/Stack';

function EthIcon(props) {
  return (
    <SvgIcon {...props}>
      <path d="M8,12L3.1,9.1L8,16l4.9-6.9L8,12L8,12z M8,0L3.1,8.1L8,11.1l4.9-2.9L8,0z" />
    </SvgIcon>
  );
}

export default function Mint(data) {
  const [qty, setQty] = useState(1);
  const MAX_PER_WALLET = 10;

  const styles = {
    paperContainer: {
      backgroundImage: 'url("' + data.mint.image + '")',
      backgroundSize: 'cover',
    },
  };

  return (
    <div>
      <Box style={styles.paperContainer} sx={{ py: 4 }}>
        <Typography
          variant="h4"
          color="textSecondary"
          component="h4"
          align="center"
          gutterBottom
        >
          {data.mint.title}
        </Typography>
        {data.mint.subtitle && (
          <Typography
            color="textSecondary"
            mb={4}
            sx={{
              textAlign: 'center',
            }}
          >
            {data.mint.subtitle}
          </Typography>
        )}
        <Typography
          variant="h6"
          color="textSecondary"
          component="h6"
          align="center"
          gutterBottom
          m={1}
        >
          10 MAX PER WALLET
        </Typography>

        <Stack direction="row" alignItems="center" justifyContent="center">
          <EthIcon color="primary" />
          <Typography variant="body">0.2 ETH</Typography>
        </Stack>

        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            alignItems: 'center',
            justifyContent: 'center',
          }}
          m={1}
        >
          <Box
            component="span"
            sx={{
              border: 1,
              borderRadius: '30px',
              display: 'flex',
              width: '150px',
              justifyContent: 'center',
            }}
            m={1}
          >
            <IconButton
              sx={{ p: '10px' }}
              aria-label="remove"
              onClick={() => setQty((prev) => (prev > 1 ? prev - 1 : prev))}
            >
              <RemoveIcon />
            </IconButton>
            <Typography
              align="center"
              alignSelf={'center'}
              sx={{ width: '50%' }}
            >
              {qty}
            </Typography>
            <IconButton
              sx={{ p: '10px' }}
              aria-label="add"
              onClick={() =>
                setQty((prev) => (prev < MAX_PER_WALLET ? prev + 1 : prev))
              }
            >
              <AddIcon />
            </IconButton>
          </Box>
        </Box>
        <Typography
          variant="h6"
          color="textSecondary"
          component="h6"
          align="center"
          gutterBottom
          m={1}
        >
          15/10,000 MINTED
        </Typography>
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Button
            style={{ minHeight: '40px', width: '30%', maxWidth: '250px' }}
            variant="outlined"
            size="large"
          >
            Mint
          </Button>
        </Box>
      </Box>
    </div>
  );
}
