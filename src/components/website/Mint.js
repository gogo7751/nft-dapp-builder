import { React, useState, useEffect } from "react";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import SvgIcon from "@mui/material/SvgIcon";
import Stack from "@mui/material/Stack";
import Counter from "./Counter";

function EthIcon(props) {
  return (
    <SvgIcon {...props}>
      <path d="M8,12L3.1,9.1L8,16l4.9-6.9L8,12L8,12z M8,0L3.1,8.1L8,11.1l4.9-2.9L8,0z" />
    </SvgIcon>
  );
}

export default function Mint(data) {
  const [mintQuantity, setMintQuantity] = useState(1);
  const [mintSoon, setMintSoon] = useState(false);
  const [counterVisible, setCounterVisible] = useState(true);
  const current_sale_phase = data.contract?.current_sale_phase;
  const current_sale_phase_data =
    current_sale_phase !== undefined
      ? data.contract.sale_phases[current_sale_phase]
      : undefined;
  const max_quantity = data.contract?.max_quantity
    ? data.contract.max_quantity
    : 10;
  const mint_price = current_sale_phase_data
    ? current_sale_phase_data.mint_price
    : 0.2;
  const amount = current_sale_phase_data
    ? current_sale_phase_data.total_amount
    : "1000";
  const minted = data.minted ? data.minted : 0;
  const begin_date = current_sale_phase_data.begin_date;
  const end_date = current_sale_phase_data.end_date;
  let counter_date = end_date;

  const styles = {
    paperContainer: {
      backgroundImage: 'url("' + data.mint.image + '")',
      backgroundSize: "cover",
    },
  };

  useEffect(() => {
    // mint soon
    if (current_sale_phase === 0 && begin_date * 1000 > +new Date()) {
      counter_date = begin_date;
      setMintSoon(true);
    }
    // last mint phase
    else if (
      current_sale_phase === data.contract.sale_phases.length - 1 &&
      end_date === 0
    ) {
      setCounterVisible(false);
    }
  }, []);

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
              textAlign: "center",
            }}
          >
            {data.mint.subtitle}
          </Typography>
        )}

        {mintSoon && (
          <Typography
            variant="h6"
            color="textSecondary"
            component="h6"
            align="center"
            gutterBottom
            m={2}
          >
            {`${current_sale_phase_data.name} begins in`}
          </Typography>
        )}

        {counterVisible && <Counter endDate={counter_date} />}

        {!mintSoon && (
          <div>
            <Typography
              variant="h5"
              color="textSecondary"
              component="h5"
              align="center"
              gutterBottom
              m={2}
            >
              {minted}/{amount} MINTED
            </Typography>

            <Stack
              direction="row"
              alignItems="center"
              justifyContent="center"
              mt={2}
            >
              <EthIcon color="primary" />
              <Typography variant="body">{mint_price} ETH</Typography>
            </Stack>

            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "column", md: "row" },
                alignItems: "center",
                justifyContent: "center",
              }}
              mb={1}
            >
              <Box
                component="span"
                sx={{
                  border: 1,
                  borderRadius: "30px",
                  display: "flex",
                  width: "150px",
                  justifyContent: "center",
                }}
                m={1}
              >
                <IconButton
                  sx={{ p: "10px" }}
                  aria-label="remove"
                  onClick={() =>
                    setMintQuantity((prev) => (prev > 1 ? prev - 1 : prev))
                  }
                >
                  <RemoveIcon />
                </IconButton>
                <Typography
                  align="center"
                  alignSelf={"center"}
                  sx={{ width: "50%" }}
                >
                  {mintQuantity}
                </Typography>
                <IconButton
                  sx={{ p: "10px" }}
                  aria-label="add"
                  onClick={() =>
                    setMintQuantity((prev) =>
                      prev < max_quantity ? prev + 1 : prev
                    )
                  }
                >
                  <AddIcon />
                </IconButton>
              </Box>
            </Box>
          </div>
        )}

        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Button
            style={{ minHeight: "40px", width: "30%", maxWidth: "250px" }}
            variant="outlined"
            size="large"
            disabled={mintSoon}
            onClick={() => data.handleMint(mintQuantity, mint_price)}
          >
            {mintSoon ? "MINT SOON" : "MINT"}
          </Button>
        </Box>

        <Typography color="textSecondary" align="center" m={1}>
          {mintSoon
            ? `${mint_price} ETH / ${max_quantity} MAX PER WALLET`
            : `${max_quantity} MAX PER WALLE`}
        </Typography>
      </Box>
    </div>
  );
}
