import { Container, Box } from '@mui/material';
import React, { useContext } from 'react';
import Footer from '../components/website/Footer';
import NavBar from '../components/website/NavBar';
import Roadmap from '../components/website/Roadmap';
import Team from '../components/website/Team';
import Mint from '../components/website/Mint';
import Faq from '../components/website/Faq';
import Info from '../components/website/Info';
import { UserContext } from '../UserContex';

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
        {project.team_section.display && <Team team={project.team_section} />}
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
