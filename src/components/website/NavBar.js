import {
  AppBar,
  Typography,
  Toolbar,
  Box,
  Button,
  Chip,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { styled } from '@mui/system';
import { blueGrey } from '@mui/material/colors';
import DrawerComponent from './Drawer';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';

export default function NavBar(data) {
  const theme = useTheme();
  const NavBarTitle = styled(Typography)({
    color: blueGrey[900],
    flexGrow: '1',
    marginLeft: theme.spacing(2),
    fontWeight: 600,
  });
  const NavBarLink = styled(Button)({
    color: blueGrey[500],
    '&:active': {
      color: '#fff',
    },
    '&:hover': {
      backgroundColor: 'transparent',
      color: '#fff',
    },
    disableRipple: true,
    textTransform: 'none',
    fontSize: 'large',
  });
  const NavDiv = styled('div')({
    flexGrow: '1',
    display: 'flex',
  });
  const Icon = styled('img')({
    maxHeight: 50,
    maxWidth: 50,
    borderRadius: '50%',
  });
  const isMobile = useMediaQuery(theme.breakpoints.down('lg'));

  const linkItems = [
    {
      text: 'Home',
      path: '/',
    },
    {
      text: 'Collection',
      path: '/',
    },
    {
      text: 'OpenSea',
      path: data.projectInfo.marketplace_link || '/',
    },
    {
      text: 'Whitelist',
      path: '/',
    },
    {
      text: 'Whitepaper',
      path: data.projectInfo.whitepaper_link || '/',
    },
  ];

  return (
    <AppBar position="sticky" elevation={0}>
      <Toolbar
        sx={{ backgroundColor: "#111", zIndex: theme.zIndex.drawer + 2 }}
      >
        <Icon src={data.projectInfo.image || ''} />
        <NavBarTitle 
          variant="h5"
          sx={{color:"#fff"}}
        >
          {data.projectInfo.name}
        </NavBarTitle>

        {isMobile ? (
          <DrawerComponent data={data} />
        ) : (
          <NavDiv>
            <Box sx={{ flexGrow: '1' }}>
              {linkItems?.map((item, index) => (
                <NavBarLink
                  sx={{color:blueGrey[300]}}
                  key={index}
                  onClick={() => window.open(item.path, '_blank')}
                  disableRipple
                  variant="subtitle2"
                >
                  {item.text}
                </NavBarLink>
              ))}
            </Box>
            <Chip
              icon={<AccountBalanceWalletIcon />} 
              label="Connent Wallet"
              color="info"
              variant="outlined"              
              sx={{ fontSize: "large", paddingLeft: 2, paddingRight: 1, height: 40, borderRadius:"20px", marginTop: 0.2}}
              onClick={() => '/'}
            />
          </NavDiv>
        )}
      </Toolbar>
    </AppBar>
  );
}
