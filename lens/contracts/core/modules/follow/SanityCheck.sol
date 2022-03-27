pragma solidity 0.8.10;

import {IFollowModule} from '../../../interfaces/IFollowModule.sol';
import {ModuleBase} from '../ModuleBase.sol';
import {FollowValidatorFollowModuleBase} from './FollowValidatorFollowModuleBase.sol';

contract SecretCodeFollowModule is IFollowModule, FollowValidatorFollowModuleBase {
    error PasscodeInvalid();

    mapping(uint256 => address) internal _passcodeByProfile;

    constructor(address hub) ModuleBase(hub) {}

    function initializeFollowModule(uint256 profileId, bytes calldata data)
        external
        override
        onlyHub
        returns (bytes memory)
    {
        address passcode = abi.decode(data, (address));
        _passcodeByProfile[profileId] = passcode;
        return data;
    }

    function processFollow(
        address follower,
        uint256 profileId,
        bytes calldata data
    ) external view override {
        address passcode = abi.decode(data, (address));
        if (passcode != _passcodeByProfile[profileId]) revert PasscodeInvalid();
    }

    function followModuleTransferHook(
        uint256 profileId,
        address from,
        address to,
        uint256 followNFTTokenId
    ) external override {}
}
