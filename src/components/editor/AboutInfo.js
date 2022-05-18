import React from "react";
import { Container, Grid } from "@mui/material";
import { Label } from "../Label";
import Panel from "../Panel";
import TextInput from "../TextInput";
import ImagePicker from "../ImagePicker";

export default function AboutInfo() {
  return (
    <Container maxWidth="md">
      <Panel>
        <Label gutterBottom>About Section</Label>

        <Grid container spacing={3}>
          <Grid item md={8} xs={8} sm={8}>
            <TextInput
              label="About section title"
              placeholder="Enter title"
              field="description_sction"
              subField="title"
              gutterBottom
            />

            <TextInput
              label="Description"
              placeholder="Enter description"
              field="description_sction"
              subField="desc"
              gutterBottom
              multiline
            />
          </Grid>

          <Grid item md={4} xs={4} sm={4}>
            <ImagePicker
              label="About Image"
              maximumSize={1}
              field="description_sction"
              subField="image"
              height="86%"
            />
          </Grid>
        </Grid>

        {/* Youtube */}
        <TextInput
          label="Youtube link"
          placeholder="Enter youtube link"
          field="description_sction"
          subField="youtube"
        />
      </Panel>
    </Container>
  );
}
