/* eslint-disable @next/next/no-html-link-for-pages */
import { Avatar, Box, ButtonProps, styled, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useMoralis } from "react-moralis";
import { getOrCreateUser } from "../../../adapters/moralis";
import { NavbarButton } from "../../elements/styledComponents";
import ProfileMenu from "../profileMenu";
import Link from "next/link";
import { useGlobal } from "../../../context/globalContext";
type Props = {};

const StyledNav = styled("nav")(({ theme }) => ({
  display: "flex",
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  height: "4rem",
  width: "100%",
  paddingTop: "0.4rem",
}));

const Navbar = (props: Props) => {
  const {
    isAuthenticated,
    isAuthenticating,
    authenticate,
    logout,
    user,
    Moralis,
    setUserData,
  } = useMoralis();
  const { state } = useGlobal();
  const [isLoading, setIsLoading] = useState(false);
  return (
    <StyledNav>
      <Box
        sx={{
          pt: 0,
          mx: 8,
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <Link href="/" passHref>
          <Avatar src={state.logo} sx={{ objectFit: "cover", width: 45 }}>
            {state.title?.charAt(0)}
          </Avatar>
        </Link>
        <Typography sx={{ mx: 2 }} variant="h6">
          {state.title}
        </Typography>
      </Box>
      <Box sx={{ flex: "1 1 auto" }} />
      <Box sx={{ mr: 8, ml: 4 }}>
        {!isAuthenticated ? (
          <NavbarButton
            variant="outlined"
            loading={isAuthenticating}
            onClick={() => {
              setIsLoading(true);
              authenticate({
                // provider: "web3Auth",
                // // @ts-ignore
                // clientId:
                //   "BADQJ8pY7u0cgWmzwXyNeOwi-gl6b4EgLk0076mEnIIwg39vAOCqrFiaL8n7khrPFLwikwyH15RT_KZyjlGkkZg",
                // appLogo:
                //   "https://ipfs.moralis.io:2053/ipfs/QmXwQkaegqMCH3J3HYvHVkSjRJP83dLpzQxAuu9UGYQKEM",
                // // @ts-ignore
                // chainId: Moralis.Chains.POLYGON_MAINNET,
              })
                .then((res) => {
                  console.log(res);
                  getOrCreateUser(Moralis).then((res: any) => {
                    setIsLoading(false);
                  });
                })
                .catch((err) => {
                  console.log(err);
                  setIsLoading(false);
                });
            }}
          >
            <Typography sx={{ mx: 2, fontSize: 15 }}>Connect Wallet</Typography>
          </NavbarButton>
        ) : (
          <>{!isLoading && <ProfileMenu />}</>
        )}
      </Box>
    </StyledNav>
  );
};

export default Navbar;
