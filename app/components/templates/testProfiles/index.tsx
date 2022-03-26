import { Box, Grid, Typography, Button } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useExplore } from "../../../../pages";
import { getProfiles } from "../../../adapters/lens";
import { getUserNFTs } from "../../../adapters/moralis";

import { Team } from "../../../types";
import DAOCard from "../../elements/daoCard";
import { StyledTab, StyledTabs } from "../../elements/styledComponents";
import { useMoralis } from "react-moralis";

type Props = {};

const TestProfile = (props: Props) => {
  const { Moralis, user, isAuthenticated, isInitialized } = useMoralis();
  const { publicTribes, tab, setTab } = useExplore();
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTab(newValue);
  };
  const profileIds = [1];
  const [profiles, setProfiles] = useState([]);
  useEffect(() => {
    if (isInitialized) {
      getUserNFTs(Moralis).then((profileIds: any) => {
        console.log(profileIds);
        getProfiles(profileIds).then((res: any) => {
          console.log(res);
          setProfiles(res);
        });
      });
    }
  }, [isInitialized]);
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        width: "100%",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          alignItems: "start",
          mt: 4,
          width: "95%",
        }}
      >
        <Grid container spacing={8} columns={15}>
          {profiles.map((profile: object, index: number) => (
            <Grid item xs={3} key={index}>
              <Typography sx={{ color: "#ffffff" }}>
                {profile.handle}
              </Typography>

              <Button sx={{ color: "#ffffff" }} onClick={() => {}}>
                Follow
              </Button>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
};

export default TestProfile;
