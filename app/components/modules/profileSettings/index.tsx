import styled from "@emotion/styled";
import {
  Avatar,
  Grow,
  IconButton,
  Modal,
  TextField,
  Typography,
  styled as MUIStyled,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { PrimaryButton, SidebarButton } from "../../elements/styledComponents";
import CloseIcon from "@mui/icons-material/Close";
import { Box } from "@mui/system";
import { useMoralis } from "react-moralis";
import EditIcon from "@mui/icons-material/Edit";
import { getMD5String } from "../../../utils/utils";
import SettingsIcon from "@mui/icons-material/Settings";
import { OptionsButton } from "../themePopover";
import { ButtonText } from "../exploreSidebar";
import {
  createProfile,
  getProfile,
  getProfileIdByHandle,
  getProfileId,
  setFollowModule,
  isFollowModuleWhitelisted,
} from "../../../adapters/lens";
import { defaultAbiCoder } from "ethers/lib/utils";

import { ethers } from "ethers";

type Props = {};

const ProfileSettings = (props: Props) => {
  const { Moralis, user } = useMoralis();

  const [userName, setuserName] = useState(user?.get("username"));
  const [userEmail, setuserEmail] = useState(user?.get("email"));
  const [profilePicture, setProfilePicture] = useState(
    user?.get("profilePicture")?._url
  );
  const [showButton, setShowButton] = useState(
    !user?.get("lensId") ? 0 : !user?.get("did") ? 1 : 2
  );

  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [activeProfileId, setActiveProfileId] = useState(false);

  const handleClose = () => setIsOpen(false);

  return (
    <>
      <OptionsButton color="inherit" onClick={() => setIsOpen(true)}>
        <SettingsIcon />
        <ButtonText>Profile Settings</ButtonText>
      </OptionsButton>
      <Modal open={isOpen} onClose={handleClose} closeAfterTransition>
        <Grow in={isOpen} timeout={500}>
          <ModalContainer>
            <Heading>
              <Typography sx={{ color: "#99ccff" }}>Profile</Typography>
              <Box sx={{ flex: "1 1 auto" }} />
              <IconButton sx={{ m: 0, p: 0.5 }} onClick={handleClose}>
                <CloseIcon />
              </IconButton>
            </Heading>
            <ModalContent>
              <FieldContainer>
                <Avatar
                  src={
                    user?.get("profilePicture")?._url ||
                    `https://www.gravatar.com/avatar/${getMD5String(
                      user?.id as string
                    )}?d=identicon&s=64`
                  }
                  sx={{ height: 60, width: 60 }}
                />
                <input
                  accept="image/*"
                  hidden
                  id="contained-button-file"
                  multiple
                  type="file"
                  onChange={(e) => {
                    const file = e.target.files && e.target.files[0];
                    if (file) {
                      setIsLoading(true);
                      const moralisFile = new Moralis.File(file.name, file);
                      user?.set("profilePicture", moralisFile);
                      user?.save().then((res: any) => {
                        setProfilePicture(res.get("profilePicture")?._url);
                        setIsLoading(false);
                      });
                    }
                  }}
                />
                <label htmlFor="contained-button-file">
                  {/*// @ts-ignore */}
                  <PrimaryButton component="span" sx={{ borderRadius: 1 }}>
                    Edit
                  </PrimaryButton>
                </label>
              </FieldContainer>
              <FieldContainer>
                <TextField
                  value={userName}
                  onChange={(e) => setuserName(e.target.value)}
                  fullWidth
                  placeholder="Username"
                  size="small"
                />
              </FieldContainer>
              {/*<FieldContainer>
                <TextField
                  placeholder="Email"
                  value={userEmail}
                  onChange={(e) => setuserEmail(e.target.value)}
                  fullWidth
                  size="small"
                />
                </FieldContainer>*/}

              <PrimaryButton
                variant="outlined"
                color="secondary"
                fullWidth
                sx={{ mt: 2, borderRadius: 1 }}
                loading={isLoading}
                onClick={() => {
                  setIsLoading(true);
                  console.log(userName);
                  const abiEncoder = new ethers.utils.AbiCoder();
                  createProfile({
                    to: user?.get("ethAddress"),
                    handle: userName,
                    imageURI:
                      "https://ipfs.fleek.co/ipfs/ghostplantghostplantghostplantghostplantghostplantghostplan",
                    followModule: "0x0000000000000000000000000000000000000000",
                    followModuleData: [],
                    followNFTURI:
                      "https://ipfs.fleek.co/ipfs/ghostplantghostplantghostplantghostplantghostplantghostplan",
                  })
                    .then((res: any) => {
                      getProfileId(userName)
                        .then((res: any) => {
                          console.log(res);
                          if (user) {
                            user.set("lensProfileId", res.toNumber());
                            user.save().then((res: any) => {
                              setIsLoading(false);
                              //handleClose();
                            });
                          }
                        })
                        .catch((err: any) => {
                          alert(err.message);
                          console.log(err);
                          setIsLoading(false);
                        });
                    })
                    .catch((err: any) => {
                      alert(err.message);
                      console.log(err);
                      setIsLoading(false);
                    });
                }}
              >
                Generate Profile NFT
              </PrimaryButton>
            </ModalContent>
          </ModalContainer>
        </Grow>
      </Modal>
    </>
  );
};
// @ts-ignore
const ModalContainer = MUIStyled(Box)(({ theme }) => ({
  position: "absolute" as "absolute",
  top: "10%",
  left: "35%",
  transform: "translate(-50%, -50%)",
  width: "30rem",
  border: "2px solid #000",
  backgroundColor: theme.palette.background.default,
  boxShadow: 24,
  overflow: "auto",
  maxHeight: "calc(100% - 128px)",
}));

const Heading = styled.div`
  font-weight: 500;
  font-size: 16px;
  color: #eaeaea;
  display: flex;
  flex-direction: row;
  align-items: center;
  border-bottom: 1px solid #5a6972;
  padding: 16px;
`;
const ModalContent = styled.div`
  display: flex;
  flex-direction: column;
  padding: 16px;
`;

const FieldContainer = styled.div`
  padding: 8px 0;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export default ProfileSettings;
