import styled from "@emotion/styled";
import {
  Avatar,
  Button,
  Palette,
  styled as MUIStyled,
  Typography,
  useTheme,
} from "@mui/material";
import Link from "next/link";
import React, { useState } from "react";
import { normalTrim } from "../../../utils/utils";
import { getProfiles, follow } from "../../../adapters/lens";
import { useMoralis } from "react-moralis";
import FollowerSettings from "../../modules/followerSettings";

type Props = {
  image: string;
  handle: string;
  followers: number;
  profileId: string;
  did: string;
  following: boolean;
};

const ProfileCard = ({
  image,
  handle,
  followers,
  profileId,
  did,
  following,
}: Props) => {
  const { palette } = useTheme();
  const { Moralis, user, isAuthenticated, isInitialized } = useMoralis();
  const [isFollowerSettingsModalOpen, setIsFollowerSettingsModalOpen] =
    useState(false);
  const handleClose = () => setIsFollowerSettingsModalOpen(false);

  return (
    <Card palette={palette}>
      <CardContent>
        <TribeAvatar alt="Remy Sharp" src={image} variant="rounded" />
        <Typography
          gutterBottom
          variant="h6"
          component="div"
          color={palette.text.primary}
          sx={{ textAlign: "center", maxHeight: "4rem", overflow: "hidden" }}
        >
          {normalTrim(handle, 17)}
        </Typography>
        <Typography
          gutterBottom
          component="div"
          sx={{ textAlign: "center", color: "#5a6972", fontSize: 13 }}
        >
          {followers} members
        </Typography>
        {user?.get("lensProfileId") !== profileId && !following && (
          <Button
            variant="outlined"
            color="secondary"
            disableElevation
            sx={{
              borderRadius: 2,
              width: 100,
              textTransform: "none",
              mt: 4,
            }}
            onClick={() => {
              follow([profileId], [[]])
                .then((res: any) => {
                  console.log(res);
                  user?.set("followingIds", [
                    ...user?.get("followingIds"),
                    profileId,
                  ]);
                  user.save().then((res: any) => {
                    //handleClose();
                  });
                })
                .catch((err: any) => alert(err));
            }}
          >
            Follow
          </Button>
        )}
        {user?.get("lensProfileId") === profileId && (
          <Button
            variant="outlined"
            color="secondary"
            disableElevation
            sx={{
              borderRadius: 2,
              width: 100,
              textTransform: "none",
              mt: 4,
            }}
            onClick={() => {
              setIsFollowerSettingsModalOpen(true);
            }}
          >
            Follower Settings
          </Button>
        )}

        {user?.get("lensProfileId") !== profileId && following && (
          <Button
            variant="outlined"
            color="secondary"
            disableElevation
            sx={{
              borderRadius: 2,
              width: 100,
              textTransform: "none",
              mt: 4,
            }}
            onClick={() => {}}
          >
            Unfollow
          </Button>
        )}
      </CardContent>
      <FollowerSettings
        isOpen={isFollowerSettingsModalOpen}
        setIsOpen={setIsFollowerSettingsModalOpen}
        handleClose={handleClose}
      />
    </Card>
  );
};

const TribeAvatar = MUIStyled(Avatar)(({ theme }) => ({
  height: 60,
  width: 60,
  objectFit: "cover",
}));

const Card = styled.div<{ palette: Palette }>`
  width: 100%;
  height: 14rem;
  border: 1px solid ${(props) => props.palette.divider};
  border-radius: 12px;
  &:hover {
    cursor: pointer;
    box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.2);
    border: 1px solid ${(props) => props.palette.text.primary};
  }
  transition: all 0.5s ease;
`;

const CardContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1.5rem;
`;

export default ProfileCard;
