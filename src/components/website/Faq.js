import { React } from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Box } from '@mui/material';

export default function Faq(data) {
  return (
    <div>
      <Box sx={{ flexGrow: 1 }} m={4}>
        <Typography variant="h3" component="h3" align="center" gutterBottom>
          {data.faq.title}
        </Typography>
        {data.faq.subtitle && (
          <Typography
            color="textSecondary"
            mb={4}
            sx={{
              textAlign: 'center',
            }}
          >
            {data.faq.subtitle}
          </Typography>
        )}
        {data.faq.items?.map((item, index) => (
          <Accordion key={index}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls={`panel${index}-content`}
              id={`panel${index}-header`}
            >
              <Typography>{item.primary}</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>{item.secondary}</Typography>
            </AccordionDetails>
          </Accordion>
        ))}
      </Box>
    </div>
  );
}
