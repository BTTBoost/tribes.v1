import { NextPage } from "next";
import Head from "next/head";
import { useConnection, Provider, usePublicRecord } from "@self.id/framework";
import { PageContainer } from "../tribe/[id]/space/[bid]";
import { Box, createTheme, ThemeProvider } from "@mui/material";
import { getTheme } from "../../app/constants/muiTheme";
import ExploreSidebar from "../../app/components/modules/exploreSidebar";
import Navbar from "../../app/components/modules/navbar";
import { useEffect } from "react";

import ProfileNavbar from "../../app/components/modules/profileNavbar";
import ProfileTemplate from "../../app/components/templates/profile";

type Props = {};

const ProfilePage: NextPage<Props> = (props: Props) => {
  return (
    <>
      <Head>
        <title>Spect.Tribes</title>
        <meta name="description" content="Profile" />
        <link rel="icon" href="/logo2.svg" />
      </Head>
      <ThemeProvider theme={createTheme(getTheme(0))}>
        <PageContainer theme={createTheme(getTheme(0))}>
          <ProfileNavbar />
          <Box sx={{ display: "flex", flexDirection: "row" }}>
            <ExploreSidebar />
            <ProfileTemplate />
          </Box>
        </PageContainer>
      </ThemeProvider>
    </>
  );
};

export default ProfilePage;
