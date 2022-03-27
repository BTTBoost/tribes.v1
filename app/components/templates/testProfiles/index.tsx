import { Box, Grid, Typography, Button } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useExplore } from "../../../../pages";
import {
  getProfiles,
  follow,
  getActiveFollowGates,
} from "../../../adapters/lens";
import { getUserNFTs } from "../../../adapters/moralis";

import { useMoralis } from "react-moralis";
import ProfileCard from "./ProfileCard";

type Props = {};

const TestProfile = (props: Props) => {
  const { Moralis, user, isAuthenticated, isInitialized } = useMoralis();
  const { publicTribes, tab, setTab } = useExplore();
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTab(newValue);
  };
  const [profiles, setProfiles] = useState([]);
  const [profileIds, setProfileIds] = useState([]);

  useEffect(() => {
    if (isInitialized) {
      getUserNFTs(Moralis).then((profileIds: any) => {
        setProfileIds(profileIds);
        getProfiles(profileIds, user?.get("ethAddress")).then((res: any) => {
          console.log(res);
          setProfiles(res);
        });

        getActiveFollowGates(profileIds[2]).then((res: any) => {
          console.log(`dgfg`);
          console.log(res);
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
              <ProfileCard
                image={profile.imageURI}
                handle={profile.handle}
                followers={1}
                profileId={profileIds[index]}
                did={"ssa"}
                following={profile.following}
              />
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
};

export default TestProfile;
