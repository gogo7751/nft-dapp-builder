import { Container, Box } from '@mui/material';
import React, { useContext } from 'react';
import Footer from '../components/website/Footer';
import NavBar from '../components/website/NavBar';
import Roadmap from '../components/website/Roadmap';
import Team from '../components/website/Team';
import Mint from '../components/website/Mint';
import Faq from '../components/website/Faq';
import Info from '../components/website/Info';
import { UserContext } from '../UserContext';

{
  /* team mock data */
}
const team = [
  {
    img: 'https://images.unsplash.com/photo-1551963831-b3b1ca40c98e',
    name: 'Breakfast',
    subTitle: 'bkristastucchio',
    twitter: 'https://google.com',
    linkened: '',
  },
  {
    img: 'https://images.unsplash.com/photo-1551782450-a2132b4ba21d',
    name: 'Burger',
    subTitle: 'rollelflex_graphy726',
    twitter: 'https://google.com',
    linkened: 'https://google.com',
  },
  {
    img: 'https://images.unsplash.com/photo-1522770179533-24471fcdba45',
    name: 'Camera',
    subTitle: 'helloimnik',
    twitter: '',
    linkened: 'https://google.com',
  },
  {
    img: 'https://images.unsplash.com/photo-1444418776041-9c7e33cc5a9c',
    name: 'Coffee',
    subTitle: 'nolanissac',
    twitter: '',
    linkened: '',
  },
  {
    img: 'https://images.unsplash.com/photo-1533827432537-70133748f5c8',
    name: 'Hats',
    subTitle: 'hjrc33',
    twitter: '',
    linkened: '',
  },
  {
    img: 'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62',
    name: 'Honey',
    subTitle: 'arwinneil',
    linkened: '',
  },
  {
    img: 'https://images.unsplash.com/photo-1516802273409-68526ee1bdd6',
    name: 'Basketball',
    subTitle: 'tjdragotta',
    twitter: '',
  },
  {
    img: 'https://images.unsplash.com/photo-1518756131217-31eb79b20e8f',
    name: 'Fern',
    subTitle: 'katie_wasserman',
  },
];

export default function Website() {
  const { project } = useContext(UserContext);
  if (!project) {
    return <React.Fragment></React.Fragment>;
  }
  return (
    <React.Fragment>
      {<NavBar projectInfo={project.project_info} />}
      {<Mint mint={project.mint_section} />}
      <Container>
        {<Info info={project.description_sction} />}
        {project.roadmap_section.display && (
          <Roadmap roadmap={project.roadmap_section} />
        )}
        {/* mock data 調整 */}
        {project.team_section.display && (
          <Team team={project.team_section} mockData={team} />
        )}
        {project.faq_section.display && <Faq faq={project.faq_section} />}
      </Container>
      <Box mt={5}>
        {
          <Footer
            link={project.description_sction.youtube}
            copyright={project.project_info.copyright}
          />
        }
      </Box>
    </React.Fragment>
  );
}
