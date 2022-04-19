import {
  Box,
  Button,
  Typography,
  Grid,
  IconButton,
  Avatar,
} from '@mui/material';
import React, { useState } from 'react';
import { PrimaryButton } from '../../elements/styledComponents';
import Image from 'next/image';
import CloseIcon from '@mui/icons-material/Close';
import { approve } from '../../../adapters/contract';
import { useGlobal } from '../../../context/globalContext';

interface Props {
  handleNextStep: Function;
  handleClose: Function;
  setActiveStep: Function;
  chainId: string;
  approvalInfo: ApprovalInfo;
}

export type ApprovalInfo = {
  required: boolean;
  uniqueTokenAddresses: Array<string>;
  aggregatedTokenValues: Array<number>;
};

const Approve = ({
  handleNextStep,
  handleClose,
  setActiveStep,
  chainId,
  approvalInfo,
}: Props) => {
  const [isLoading, setIsLoading] = useState(
    Array(approvalInfo.uniqueTokenAddresses?.length).fill(false)
  );
  const [isApproved, setIsApproved] = useState(
    Array(approvalInfo.uniqueTokenAddresses?.length).fill(false)
  );

  const toggleIsLoading = (index: number) => {
    setIsLoading(isLoading.map((v, i) => (i === index ? !v : v)));
  };

  const handleApproval = (index: number) => {
    const temp = isApproved.filter(() => true);
    temp[index] = true;
    setIsApproved(temp);

    return hasApprvoedAll(temp);
  };

  const hasApprvoedAll = (approved: boolean[]) => {
    const pendingApprovals = approved.filter((a) => a === false);
    return pendingApprovals.length > 0 ? false : true;
  };

  const { state } = useGlobal();
  const registry = state.registry;

  console.log(approvalInfo);
  return (
    <React.Fragment>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          textAlign: 'center',
          marginTop: '16px',
        }}
      >
        <>
          <Box>
            {approvalInfo.uniqueTokenAddresses.map(
              (address: string, index: number) => (
                <Grid
                  container
                  spacing={1}
                  key={index}
                  sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}
                  margin="8px"
                >
                  <Grid item xs={6}>
                    <Box
                      sx={{
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                      }}
                    >
                      <Avatar
                        sx={{
                          width: '2rem',
                          height: '2rem',
                          objectFit: 'cover',
                          my: 1,
                        }}
                        src={registry[chainId].tokens[address]?.pictureUrl}
                      >
                        {registry[chainId].tokens[address].symbol[0]}
                      </Avatar>
                      <Typography color="text.primary" marginLeft="20px">
                        {registry[chainId].tokens[address].symbol}
                      </Typography>
                    </Box>
                  </Grid>

                  <Grid item xs={3}>
                    {isApproved[index] ? (
                      <PrimaryButton
                        sx={{ borderRadius: '3px' }}
                        disabled
                        variant="outlined"
                        id="bApprove"
                      >
                        Approved
                      </PrimaryButton>
                    ) : (
                      <PrimaryButton
                        loading={isLoading[index]}
                        sx={{ borderRadius: '3px' }}
                        color="secondary"
                        onClick={() => {
                          toggleIsLoading(index);
                          approve(
                            window.ethereum.networkVersion,
                            approvalInfo.uniqueTokenAddresses[index]
                          )
                            .then((res: any) => {
                              toggleIsLoading(index);
                              const hasApprvoedAll = handleApproval(index);
                              if (hasApprvoedAll) handleNextStep();
                            })
                            .catch((err: any) => {
                              toggleIsLoading(index);
                              alert(err.message);
                            });
                        }}
                        variant="outlined"
                        id="bApprove"
                      >
                        Approve
                      </PrimaryButton>
                    )}
                  </Grid>
                </Grid>
              )
            )}
          </Box>
        </>
        <Box
          sx={{ display: 'flex', flexDirection: 'row', pt: 2, marginTop: 8 }}
        >
          <Button
            color="inherit"
            variant="outlined"
            onClick={() => handleClose()}
            sx={{ mr: 1, color: '#f45151' }}
            id="bCancel"
          >
            Cancel
          </Button>
          <Box sx={{ flex: '1 1 auto' }} />
        </Box>
      </Box>
    </React.Fragment>
  );
};

export default Approve;
