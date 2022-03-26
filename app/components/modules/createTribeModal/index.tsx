import {
  Box,
  Grow,
  IconButton,
  Modal,
  styled,
  TextField,
  Tooltip,
  Typography,
  useTheme,
} from "@mui/material";
import React, { useState } from "react";
import { useMoralis } from "react-moralis";
import CloseIcon from "@mui/icons-material/Close";
import { ModalHeading, PrimaryButton } from "../../elements/styledComponents";
import { createTribe } from "../../../adapters/moralis";
import { useRouter } from "next/router";
import { Toaster } from "react-hot-toast";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { SidebarButton } from "../exploreSidebar";
import { notify } from "../settingsTab";
import {
  createProfile,
  getProfileIdByHandle,
  getProfile,
} from "../../../adapters/lens";
import { CeramicClient } from "@ceramicnetwork/http-client";
import { ModelManager } from "@glazed/devtools";
import { tryAuthenticate } from "../auth";
import { TileDocument } from "@ceramicnetwork/stream-tile";
// import {
//   createNftDidUrl,
//   didToCaip,
// } from "../../../libraries/nft-did-resolver/src/index";
// import { getResolver } from "../../../libraries/nft-did-resolver/src/index";
import type { NftResolverConfig } from "nft-did-resolver";
import { Resolver } from "did-resolver";
import { ethers } from "ethers";

type Props = {};

const CreateTribeModal = (props: Props) => {
  const handleClose = () => setIsOpen(false);
  const handleOpen = () => setIsOpen(true);
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { palette } = useTheme();

  const { Moralis, isAuthenticated, authenticate } = useMoralis();

  const onSubmit = () => {
    setIsLoading(true);
    createTribe(Moralis, name)
      .then((res: any) => {
        setIsLoading(false);
        handleClose();
        router.push({
          pathname: `/tribe/${res.get("teamId")}`,
        });
      })
      .catch((err: any) => {
        setIsLoading(false);
        handleClose();
        notify(err.message, "error");
      });
  };

  useEffect(() => {
    // getProfile(4).then((res: any) => {
    //   console.log(`sfsd`);
    //   console.log(res);
    // });
    // const ceramic = new CeramicClient("https://ceramic-clay.3boxlabs.com/");
    // setClient(ceramic);
  }, []);

  return (
    <>
      <Toaster />
      <Tooltip title="Create Tribe" placement="right" arrow sx={{ m: 0, p: 0 }}>
        <SidebarButton
          palette={palette}
          selected={false}
          onClick={() => {
            if (!isAuthenticated) {
              authenticate();
            } else {
              handleOpen();
            }
          }}
        >
          <AddCircleOutlineIcon sx={{ fontSize: 30, color: palette.divider }} />
        </SidebarButton>
      </Tooltip>
      {/* <SidebarButton
        sx={{ mt: 2 }}
        color="inherit"
        onClick={() => {
          if (!isAuthenticated) {
            authenticate();
          } else {
            handleOpen();
          }
        }}
      >
        <AddIcon />
        <ButtonText>Create Tribe</ButtonText>
      </SidebarButton> */}
      <Modal open={isOpen} onClose={handleClose} closeAfterTransition>
        <Grow in={isOpen} timeout={500}>
          <ModalContainer>
            <ModalHeading>
              <Typography color="inherit">Create Tribe</Typography>
              <Box sx={{ flex: "1 1 auto" }} />
              <IconButton sx={{ m: 0, p: 0.5 }} onClick={handleClose}>
                <CloseIcon />
              </IconButton>
            </ModalHeading>
            <ModalContent>
              <TextField
                placeholder="Tribe Name"
                fullWidth
                value={name}
                onChange={(evt) => setName(evt.target.value)}
              />
              <TextField
                placeholder="Tribe Multi-sig"
                fullWidth
                value={multiSig}
                onChange={(evt) => setMultiSig(evt.target.value)}
              />
              {showButton === 0 && (
                <PrimaryButton
                  variant="outlined"
                  sx={{ width: "60%", mt: 2, borderRadius: 1 }}
                  onClick={() => {
                    setIsLoading(true);
                    console.log(name);
                    console.log(multiSig);

                    createProfile({
                      to: user?.get("ethAddress"),
                      handle: name,
                      imageURI:
                        "https://ipfs.fleek.co/ipfs/ghostplantghostplantghostplantghostplantghostplantghostplan",
                      followModule:
                        "0x7db9f2bd5288091bf1727484c56e520905f51838",
                      followModuleData:
                        "0x308d0a92352bcd1d68b4a8b788b2ebbd90582cc6",
                      followNFTURI:
                        "https://ipfs.fleek.co/ipfs/ghostplantghostplantghostplantghostplantghostplantghostplan",
                    })
                      .then((res: any) => {
                        getProfileIdByHandle(name).then((res: any) => {
                          setLensId(res.toNumber());
                          setShowButton(1);
                          setIsLoading(false);
                        });
                      })
                      .catch((err: any) => {
                        alert(err);
                        setIsLoading(false);
                      });
                  }}
                  loading={isLoading}
                  color="inherit"
                >
                  Generate profile NFT
                </PrimaryButton>
              )}
              {
                <PrimaryButton
                  variant="outlined"
                  color="secondary"
                  sx={{ width: "50%", mt: 2, borderRadius: 1 }}
                  loading={isLoading}
                  onClick={() => {
                    setIsLoading(true);
                    tryAuthenticate(client)
                      .then((res: any) => {
                        console.log(res);
                        setIsLoading(false);
                      })
                      .catch((err: any) => {
                        alert(err);
                        setIsLoading(false);
                      });
                  }}
                >
                  Connect Ceramic
                </PrimaryButton>
              }
              {showButton === 0 && (
                <PrimaryButton
                  variant="outlined"
                  sx={{ width: "60%", mt: 2, borderRadius: 1 }}
                  onClick={() => {
                    /*
                    const nftDID = createNftDidUrl({
                      chainId: "eip155:4",
                      namespace: "erc721",
                      contract: "0x308d0a92352Bcd1d68b4A8b788B2ebBD90582CC6",
                      tokenId: "2",
                    });*/
                    const nftDID =
                      "did:nft:eip155:4_erc721:0x308d0a92352bcd1d68b4a8b788b2ebbd90582cc6_1";

                    TileDocument.create(
                      client as any,
                      { name: name },
                      {
                        //controllers: [res.didDocument.controller],
                        controllers: [
                          "did:nft:eip155:4_erc721:0x308d0a92352bcd1d68b4a8b788b2ebbd90582cc6_1",
                        ],
                      }
                    ).then((res: any) => {
                      console.log(res);
                      createDecentralizedTribe(Moralis, name, lensId, res.id)
                        .then((res: any) => {
                          setIsLoading(false);
                          //handleClose();
                        })
                        .catch((err: any) => {
                          setIsLoading(false);
                          //handleClose();
                          notify(err.message, "error");
                        });
                    });
                  }}
                  loading={isLoading}
                  color="inherit"
                >
                  Create your tribe
                </PrimaryButton>
              )}
            </ModalContent>
          </ModalContainer>
        </Grow>
      </Modal>
    </>
  );
};

const ModalContent = styled("div")(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  padding: 32,
}));

// @ts-ignore
const ModalContainer = styled(Box)(({ theme }) => ({
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

export default CreateTribeModal;
