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
import {
  createProfile,
  getProfiles,
  getProfileIdByHandle,
  getProfileId,
  setFollowModule,
} from "../../../adapters/lens";
import { defaultAbiCoder } from "ethers/lib/utils";
import { contractAddresses } from "../../../constants";

import { ethers } from "ethers";

type Props = {
  setIsOpen: Function;
  isOpen: boolean;
  handleClose: Function;
};

const FollowerSettings = ({ setIsOpen, isOpen, handleClose }: Props) => {
  const { Moralis, user } = useMoralis();

  const [isLoading, setIsLoading] = useState(false);
  const [nftAddress, setNFTAddress] = useState([]);
  const [activeProfileId, setActiveProfileId] = useState(false);
  const [profiles, setProfiles] = useState([]);

  useEffect(() => {
    if (user?.get("followingIds"))
      getProfiles(user?.get("followingIds"), user?.get("ethAddress")).then(
        (res: any) => {
          console.log(res);
          setProfiles(res);
          setNFTAddress(res.map((a) => a.followNFT));
        }
      );
  }, []);

  return (
    <>
      <Modal open={isOpen} onClose={handleClose} closeAfterTransition>
        <Grow in={isOpen} timeout={500}>
          <ModalContainer>
            <Heading>
              <Typography sx={{ color: "#99ccff" }}>
                Follower Setting
              </Typography>
              <Box sx={{ flex: "1 1 auto" }} />
              <IconButton sx={{ m: 0, p: 0.5 }} onClick={handleClose}>
                <CloseIcon />
              </IconButton>
            </Heading>
            <Typography sx={{ color: "#99ccff", margin: "16px" }}>
              Only people containing the following NFTs can follow me
            </Typography>
            <FieldContainer>
              <TextField
                placeholder="NFT address"
                value={nftAddress[0]}
                onChange={(e) => {}}
                fullWidth
                size="small"
              />
            </FieldContainer>
            <ModalContent>
              <PrimaryButton
                variant="outlined"
                color="secondary"
                fullWidth
                sx={{ mt: 2, borderRadius: 1 }}
                loading={isLoading}
                onClick={() => {
                  const profileId = user?.get("lensProfileId");
                  const data = defaultAbiCoder.encode(
                    ["address[]"],
                    [nftAddress]
                  );

                  if (profileId) {
                    setFollowModule(
                      profileId,
                      contractAddresses.NftGatedFollowModule,
                      data
                    ).then((res: any) => {
                      console.log(res);
                    });
                  }
                }}
              >
                Update Follower Settings
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

export default FollowerSettings;
