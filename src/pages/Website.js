import { Container, Box } from "@mui/material";
import React, { useContext, useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Footer from "../components/website/Footer";
import NavBar from "../components/website/NavBar";
import Roadmap from "../components/website/Roadmap";
import Team from "../components/website/Team";
import Mint from "../components/website/Mint";
import Faq from "../components/website/Faq";
import Info from "../components/website/Info";
import { UserContext } from "../UserContext";
import WebsiteDataService from "../services/WebsiteDataService";

export default function Website() {
  const { project } = useContext(UserContext);
  const [website, setWebsite] = useState(null);
  const params = useParams();

  const initWebsite = async (link) => {
    let website = await WebsiteDataService.getData(link);
    setWebsite(website);
  };

  useEffect(() => {
    !params.appUrl ? setWebsite(project) : initWebsite(params.appUrl);
  }, []);

  if (!website) {
    return <React.Fragment></React.Fragment>;
  }
  return (
    <React.Fragment>
      {<NavBar projectInfo={website.project_info} />}
      {<Mint mint={website.mint_section} />}
      <Container>
        {<Info info={website.description_sction} />}
        {website.roadmap_section.display && (
          <Roadmap roadmap={website.roadmap_section} />
        )}
        {website.team_section.display && <Team team={website.team_section} />}
        {website.faq_section.display && <Faq faq={website.faq_section} />}
      </Container>
      <Box mt={5}>
        {
          <Footer
            link={website.description_sction.youtube}
            copyright={website.project_info.copyright}
          />
        }
      </Box>
    </React.Fragment>
  );
}
