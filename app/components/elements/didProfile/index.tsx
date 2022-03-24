import styled from "@emotion/styled";
import React from "react";
import { useConnection } from "@self.id/framework";
import { SidebarButton } from "../styledComponents";
import LoginIcon from "@mui/icons-material/Login";
import { Avatar, Typography } from "@mui/material";

type Props = {};

const DIDProfile = (props: Props) => {
  const [connection, connect, disconnect] = useConnection();
  return (
    <Profile>
      {connection.status !== "connected" && (
        <SidebarButton
          sx={{ mt: 2 }}
          color="inherit"
          loading={connection.status === "connecting"}
          onClick={() =>
            connect()
              .then((res) => {
                console.log(res);
              })
              .catch((err) => console.log(err))
          }
        >
          <LoginIcon />
          <Typography sx={{ textTransform: "none", fontSize: 14, ml: 2 }}>
            Connect
          </Typography>
        </SidebarButton>
      )}
      {connection.status === "connected" && (
        <SidebarButton sx={{ mt: 2 }} color="inherit">
          {/* <Avatar
            variant="rounded"
            sx={{ p: 0, m: 0, width: 32, height: 32 }}
            src={
              user?.get("profilePicture")?._url ||
              `https://www.gravatar.com/avatar/${getMD5String(
                user?.id as string
              )}?d=identicon&s=64`
            }
          >
            {user?.get("username")[0]}
          </Avatar> */}
          {connection.selfID.id}
        </SidebarButton>
      )}
      {/* <ProfilePopover
        open={open}
        anchorEl={anchorEl}
        handleClose={handleClosePopover}
      /> */}
    </Profile>
  );
};

const Profile = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 0.7rem;
  margin-right: 1rem;
`;

export default DIDProfile;
