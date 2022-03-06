import { Typography, Avatar, Grid, Button } from "@mui/material";
import { Box } from "@mui/system";
import React, { useState, useEffect } from "react";
import { PrimaryButton } from "../../elements/styledComponents";
import {
  completeEpochPayment,
  completePayment,
} from "../../../adapters/moralis";
import { registryTemp } from "../../../constants";
import Image from "next/image";
import { batchPayTokens } from "../../../adapters/contract";
import { BatchPayInfo } from ".";
import { useBoard } from "../taskBoard";
import { capitalizeFirstLetter } from "../../../utils/utils";
import { Member } from "../../../types";
import { useMoralis } from "react-moralis";
import { notify } from "../settingsTab";
import { Toaster } from "react-hot-toast";

type Props = {
  handleClose: Function;
  chainId: string;
  batchPayInfo: BatchPayInfo;
};

type MemberDetails = {
  [key: string]: Member;
};

function getEthAddresses(contributors: any, memberDetails: MemberDetails) {
  return contributors.map((a: string) => memberDetails[a].ethAddress);
}

const BatchPay = ({ handleClose, chainId, batchPayInfo }: Props) => {
  const [isLoading, setIsLoading] = useState(false);
  const { data, setData } = useBoard();
  const { Moralis, isInitialized } = useMoralis();

  return (
    <React.Fragment>
      <Toaster />
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          textAlign: "center",
        }}
      >
        <>
          <Box>
            <Grid
              container
              spacing={0}
              direction="column"
              alignItems="center"
              justifyContent="center"
              style={{ minHeight: "10vh" }}
            >
              <Grid item xs={3}>
                <Box style={{ display: "flex" }}>
                  <Image
                    src={registryTemp[chainId].pictureUrl}
                    alt="eth"
                    height="26%"
                    width="35%"
                  />

                  <Typography
                    color="text.primary"
                    variant="h5"
                    marginBottom="10px"
                    marginLeft="10px"
                  >
                    {capitalizeFirstLetter(registryTemp[chainId].name)} Network
                  </Typography>
                </Box>
              </Grid>
            </Grid>
            {batchPayInfo.tokenAddresses.map(
              (address: string, index: number) => (
                <Grid
                  container
                  spacing={1}
                  key={index}
                  sx={{ display: "flex" }}
                  margin="8px"
                >
                  <Grid item xs={8}>
                    <Box sx={{ display: "flex" }}>
                      <Avatar
                        alt=""
                        src={
                          data.memberDetails[batchPayInfo.contributors[index]]
                            ?.profilePicture
                            ? data.memberDetails[
                                batchPayInfo.contributors[index]
                              ].profilePicture._url
                            : `https://www.gravatar.com/avatar/${
                                data.memberDetails[
                                  batchPayInfo.contributors[index]
                                ]?.username
                              }?d=identicon&s=32`
                        }
                        sx={{ height: 30, width: 30 }}
                      />
                      <Typography color="text.primary" marginLeft="20px">
                        {
                          data.memberDetails[batchPayInfo.contributors[index]]
                            ?.username
                        }
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={4}>
                    <Typography color="text.primary" marginLeft="20px">
                      {batchPayInfo.tokenValues[index]?.toFixed(2)}{" "}
                      {registryTemp[chainId].tokens[address].symbol}
                    </Typography>
                  </Grid>
                </Grid>
              )
            )}
          </Box>

          <Box sx={{ display: "flex", justifyContent: "flex-end" }}></Box>
        </>
        {
          <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
            <Button
              color="inherit"
              variant="outlined"
              onClick={() => handleClose()}
              sx={{ mr: 1, color: "#f45151" }}
              id="bCancel"
            >
              Cancel
            </Button>
            <Box sx={{ flex: "1 1 auto" }} />
            <PrimaryButton
              loading={isLoading}
              sx={{ borderRadius: "3px" }}
              onClick={() => {
                setIsLoading(true);
                batchPayTokens(
                  batchPayInfo.tokenAddresses,
                  getEthAddresses(
                    batchPayInfo.contributors,
                    data.memberDetails
                  ),
                  batchPayInfo.tokenValues,
                  "123"
                )
                  .then((res: any) => {
                    console.log(res);
                    if (batchPayInfo.type === "task") {
                      completePayment(Moralis, batchPayInfo.taskIds)
                        .then((res: any) => {
                          console.log(res);
                          setData(res);
                        })
                        .catch((err: any) => {
                          alert(err.message);
                          setIsLoading(false);
                        });
                    } else if (batchPayInfo.type === "epoch") {
                      completeEpochPayment(Moralis, batchPayInfo.epochId)
                        .then((res: any) => {
                          console.log(res);
                          const temp = Object.assign(data, res);
                          setData(temp);
                          notify("Payment completed!");
                        })
                        .catch((err: any) => {
                          alert(err.message);
                          setIsLoading(false);
                        });
                    }
                    setIsLoading(false);
                    handleClose();
                  })
                  .catch((err: any) => {
                    alert(err.message);
                    setIsLoading(false);
                  });
              }}
              variant="outlined"
              id="bApprove"
            >
              Batch Pay
            </PrimaryButton>
          </Box>
        }
      </Box>
    </React.Fragment>
  );
};

export default BatchPay;
