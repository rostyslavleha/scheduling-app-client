import React from "react";
import {
  Card,
  CardActionArea,
  CardContent,
  Avatar,
  Divider,
  Grid,
  Stack,
  Chip,
  Typography,
  Box,
} from "@mui/material";

const MAX_LENGTH = 350;

const cardStyle = {
  card: {
    maxWidth: 450,
    mx: 1,
    border: "1px solid #16609D",
    borderRadius: 1,
    "&:hover": {
      boxShadow: 20,
    },
  },
  cardContent: {
    backgroundColor: "#16609D",
  },
  cardContentTypography: {
    color: "#ffffff",
  },
  cardAvatar: {
    width: 110,
    height: 110,
    border: "2px solid #16609D",
  },
  cardContentChip: {
    m: 0.25,
  },
  bottomCardContent: {
    minHeight: 80,
  },
  clinicianDescription: {
    textAlign: "justify",
    border: "1px solid #16609D",
    p: 1,
    borderRadius: 1,
    boxShadow: 5,
  },
  cardLeftStack: {
    my: 1,
  },
  clinicianInfo: {
    fontWeight: "bold",
  },
  clinicianEmail: { fontWeight: "bold", fontSize: 10 },
  cardRightStack: { mr: 1.5, my: 1 },
};

const CardClinicianProfile = ({ clinician }) => {
  return (
    <Card key={clinician._id} sx={cardStyle.card}>
      <CardActionArea>
        <CardContent sx={cardStyle.cardContent} align="center">
          <Typography
            sx={cardStyle.cardContentTypography}
            variant="body2"
            color="text.primary"
          >
            {clinician.title}. {clinician.firstName.toUpperCase()}{" "}
            {clinician.lastName.toUpperCase()}({clinician.gender})
          </Typography>
        </CardContent>
        <Divider></Divider>
        <Grid container spacing={1}>
          <Grid item xs={5}>
            <Stack
              alignItems="center"
              direction="column"
              sx={cardStyle.cardLeftStack}
            >
              {clinician.profilePhoto && (
                <Avatar
                  src={clinician.profilePhoto}
                  alt="no-image"
                  sx={cardStyle.cardAvatar}
                />
              )}
              <Typography variant="overline" sx={cardStyle.clinicianInfo}>
                CLINIC: {clinician.clinicName}
              </Typography>
              <Typography variant="caption" sx={cardStyle.clinicianInfo}>
                Contact: {clinician.clinicContact}
              </Typography>

              <Typography variant="caption" sx={cardStyle.clinicianEmail}>
                {clinician.email}
              </Typography>
            </Stack>
          </Grid>

          <Grid item xs={7}>
            <Stack
              alignItems="center"
              direction="column"
              sx={cardStyle.cardRightStack}
            >
              <Box sx={cardStyle.clinicianDescription}>
                {`${clinician.aboutClinician.substring(0, MAX_LENGTH)}...`}
              </Box>
            </Stack>
          </Grid>
        </Grid>
        <Divider></Divider>
        <CardContent sx={cardStyle.bottomCardContent}>
          {clinician.clinicianSpecialization.length > 0 ? (
            clinician.clinicianSpecialization.map((specialization, key) => (
              <Chip
                sx={cardStyle.cardContentChip}
                key={specialization}
                label={specialization}
              ></Chip>
            ))
          ) : (
            <Typography variant="caption" display="block" gutterBottom>
              No specialization mentioned by clinician.
            </Typography>
          )}
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default CardClinicianProfile;
