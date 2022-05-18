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
import AlertMessage from "../components/Alert";
import WebsiteDataService from "../services/WebsiteDataService";
import AccountService from "../services/AccountService";
import ContractService from "../services/ContractService";

const contractService = new ContractService();

export default function Website() {
  const { project, setLoading } = useContext(UserContext);
  const [website, setWebsite] = useState(null);
  const [minted, setMinted] = useState(null);
  const [alert, setAlert] = useState("");
  const params = useParams();

  const initWebsite = async (link) => {
    let website = await WebsiteDataService.getData(link);
    setWebsite(website);
    contractService.setAddress(website?.contract?.contract_address);
    contractService.setContractType(website?.contract?.contract_type);

    const nowTokenId = await contractService.getNowTokenId((error) => {
      setAlert(error.message);
      return;
    });

    let minted = WebsiteDataService.getMented(nowTokenId, website);
    setMinted(minted, website);
  };

  const handleMint = async (mintQuantity = 1, price) => {
    setLoading(true);

    // get wallet address
    const address = await AccountService.getWalletAddress((error) => {
      setAlert(error.message);
      setLoading(false);
      return;
    });

    if (address) {
      const current_sale_phase = website?.contract.current_sale_phase;

      if (website?.contract.sale_phases[current_sale_phase].whitelist) {
        // get proofs
        const proofs = await WebsiteDataService.getProof(
          address,
          website?.contract.sale_phases[current_sale_phase].whitelist_url
        );
        // mint token has whitelist
        await contractService.mintToken(
          mintQuantity,
          proofs,
          price,
          (error) => {
            setAlert(error.message);
            return;
          }
        );
      } else {
        // mint token none whitelist
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    !params.appUrl ? setWebsite(project) : initWebsite(params.appUrl);
  }, []);

  if (!website || !website.website.live) {
    return <React.Fragment></React.Fragment>;
  }
  return (
    <React.Fragment>
      {<NavBar projectInfo={website.project_info} />}
      {
        <Mint
          mint={website.mint_section}
          handleMint={handleMint}
          contract={website.contract}
          minted={minted}
        />
      }
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
      {/* Alert */}
      <AlertMessage alertState={{ alert, setAlert }} />
    </React.Fragment>
  );
}
