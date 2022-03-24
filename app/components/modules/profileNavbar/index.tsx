import React from "react";
import DIDProfile from "../../elements/didProfile";
import SidebarProfile from "../../elements/sidebarProfile";
import {
  StyledNav,
  StyledTab,
  StyledTabs,
} from "../../elements/styledComponents";

type Props = {};

const ProfileNavbar = (props: Props) => {
  return (
    <StyledNav>
      <StyledTabs
        value={0}
        onChange={() => {}}
        centered
        sx={{ width: "100%", ml: "6rem" }}
      >
        <StyledTab label="Profile" />
      </StyledTabs>
      <SidebarProfile />
    </StyledNav>
  );
};

export default ProfileNavbar;
