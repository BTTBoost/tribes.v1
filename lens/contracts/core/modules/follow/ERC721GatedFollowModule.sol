// SPDX-License-Identifier: AGPL-3.0-only

pragma solidity 0.8.10;

import {IFollowModule} from '../../../interfaces/IFollowModule.sol';
import {ILensHub} from '../../../interfaces/ILensHub.sol';
import {Errors} from '../../../libraries/Errors.sol';
import {FeeModuleBase} from '../FeeModuleBase.sol';
import {ModuleBase} from '../ModuleBase.sol';
import {FollowValidatorFollowModuleBase} from './FollowValidatorFollowModuleBase.sol';
import {IERC20} from '@openzeppelin/contracts/token/ERC20/IERC20.sol';
import {SafeERC20} from '@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol';
import {IERC721} from '@openzeppelin/contracts/token/ERC721/IERC721.sol';
import 'hardhat/console.sol';

contract ERC721GatedFollowModule is IFollowModule, FollowValidatorFollowModuleBase {
    using SafeERC20 for IERC20;

    mapping(uint256 => mapping(address => bool)) profileToActiveNftGate;
    mapping(uint256 => address[]) profileToNFTs;

    constructor(address hub) ModuleBase(hub) {}

    function initializeFollowModule(uint256 profileId, bytes calldata data)
        external
        override
        onlyHub
        returns (bytes memory)
    {
        if (data.length > 0) {
            address[] memory nfts = abi.decode(data, (address[]));
            profileToNFTs[profileId] = nfts;
            for (uint256 i = 0; i < nfts.length; i++) {
                profileToActiveNftGate[profileId][nfts[i]] = true;
            }
        }
        return data;
    }

    function processFollow(
        address follower,
        uint256 profileId,
        bytes calldata data
    ) external override onlyHub {
        address[] memory gateNfts = profileToNFTs[profileId];
        for (uint256 i = 0; i < gateNfts.length; i++) {
            if (profileToActiveNftGate[profileId][gateNfts[i]] == true) {
                if (IERC721(gateNfts[i]).balanceOf(follower) == 0) revert Errors.FollowInvalid();
            }
        }
    }

    function addToNftGate(uint256 profileId, address nft) external {
        if (IERC721(HUB).ownerOf(profileId) != msg.sender) revert Errors.NotProfileOwner();
        profileToNFTs[profileId].push(nft);
        profileToActiveNftGate[profileId][nft] = true;
    }

    function removeFromNftGate(uint256 profileId, address nft) external {
        if (IERC721(HUB).ownerOf(profileId) != msg.sender) revert Errors.NotProfileOwner();

        profileToActiveNftGate[profileId][nft] = false;
    }

    function getAllUsedNftGates(uint256 profileId) external view returns (address[] memory) {
        return profileToNFTs[profileId];
    }

    function getActiveNftGates(uint256 profileId) external view returns (address[] memory) {
        address[] memory ret = new address[](profileToNFTs[profileId].length);
        address[] memory allNfts = profileToNFTs[profileId];
        for (uint256 i = 0; i < allNfts.length; i++) {
            if (profileToActiveNftGate[profileId][allNfts[i]] == true) {
                ret[i] = allNfts[i];
            }
        }
        return ret;
    }

    function followModuleTransferHook(
        uint256 profileId,
        address from,
        address to,
        uint256 followNFTTokenId
    ) external override {}
}
