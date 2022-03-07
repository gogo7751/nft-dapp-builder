import { AppBar, Typography, Toolbar, IconButton } from "@mui/material"
import { styled } from "@mui/system"
import { blueGrey } from '@mui/material/colors'
import TwitterIcon from '@mui/icons-material/Twitter'
import YouTubeIcon from '@mui/icons-material/YouTube'
import TelegramIcon from '@mui/icons-material/Telegram'


export default function Footer(data) {
    const FooterBarTitle = styled(Typography)({
        color: blueGrey[900],
        flexGrow: "1",
        fontWeight: 600,
    });
    const FooterBarLink = styled(IconButton)({
        color: blueGrey[500],
        "&:active": {
            color: blueGrey[900],
        },
        '&:hover': {
            backgroundColor: "transparent",
            color: blueGrey[900],
        },
        textTransform: 'none',
    });
    {/* 缺 twitter, telegram, discord link */ }
    const linkItems = [
        {
            icon: <TwitterIcon fontSize='large' />,
            path: "https://twitter.com/"
        },
        {
            icon: <YouTubeIcon fontSize='large' />,
            path: data.link
        },
        {
            icon: <TelegramIcon fontSize='large' />,
            path: "https://web.telegram.org/k/"
        },
        {
            icon: <i className="fab fa-discord" style={{ fontSize: '1.5rem', }}></i>,
            path: '/'
        }
    ];

    return (
        <AppBar
            position="relative"
            elevation={0}>
            <Toolbar sx={{ backgroundColor: blueGrey[100] }}>
                <FooterBarTitle variant="h7" >
                    {data.copyright}
                </FooterBarTitle>
                {linkItems.map((item, index) => (
                    <FooterBarLink onClick={(e) => {
                        e.preventDefault();
                        window.open(item.path, "_blank");
                    }} disableRipple
                        key={index}>
                        {item.icon}
                    </FooterBarLink>
                ))}
            </Toolbar>
        </AppBar>)

}