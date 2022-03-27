import { AnyCnameRecord } from "dns";
import { ethers } from "ethers";
import lensABI from "../contracts/mumbai/lensHub.json";
import nftBase from "../contracts/mumbai/LensNFTBase.json";
import followModule from "../contracts/mumbai/ERC721GatedFollowModule.json";

export function getLensHubContract() {
  const provider = new ethers.providers.Web3Provider((window as any).ethereum);
  return new ethers.Contract(
    "0x6C2d83262fF84cBaDb3e416D527403135D757892", // Lens hub proxy
    lensABI,
    provider.getSigner()
  );
}

export function getFollowModule() {
  const provider = new ethers.providers.Web3Provider((window as any).ethereum);
  return new ethers.Contract(
    "0x870526b7973b56163a6997bB7C886F5E4EA53638", // erc721 gated follow module
    followModule.abi,
    provider.getSigner()
  );
}

export function getFollowNFTContract(address: string) {
  const provider = new ethers.providers.Web3Provider((window as any).ethereum);
  return new ethers.Contract(address, nftBase.abi, provider.getSigner());
}

export async function getActiveFollowGates(profileId: any) {
  const followModule = getFollowModule();
  console.log(followModule);
  const tx = await followModule.getActiveNftGates(profileId);
  console.log(tx);
  return tx;
}

export async function createProfile(profileInfo: any) {
  const lensContract = getLensHubContract();
  console.log(lensContract);

  let overrides: any = {
    gasLimit: 10000000,
  };
  const tx = await lensContract.createProfile(profileInfo, overrides);
  console.log(tx);

  return tx.wait();
}

export async function follow(profileIds: any, data: any) {
  const lensContract = getLensHubContract();
  console.log(lensContract);

  const tx = await lensContract.follow(profileIds, data);
  console.log(tx);

  return tx.wait();
}

/*
export async function isFollowModuleWhitelisted(module: any) {
  const lensContract = getLensHubContract();
  const isWhitelisted = await lensContract.isFollowModuleWhitelisted(
    "0xFD471836031dc5108809D173A067e8486B9047A3"
  );
  return isWhitelisted;
}*/

export async function setFollowModule(
  profileId: any,
  followModule: any,
  followModuleData: any
) {
  const lensContract = getLensHubContract();
  console.log(lensContract);
  console.log(followModule);
  console.log(followModuleData);

  const tx = await lensContract.setFollowModule(
    profileId,
    followModule,
    followModuleData
  );
  console.log(tx);

  return tx.wait();
}

export async function getProfile(profileId: number) {
  const lensContract = getLensHubContract();

  const profile = await lensContract.getProfile(profileId);
  return profile;
}

export async function getProfiles(profileIds: number[], callerAddress: string) {
  const lensContract = getLensHubContract();
  var profiles = [];
  for (var profileId of profileIds) {
    var profile = await lensContract.getProfile(profileId);
    console.log(profile.followNFT);
    if (profile.followNFT !== "0x0000000000000000000000000000000000000000") {
      var followNFTContract = getFollowNFTContract(profile.followNFT);
      const balance = await followNFTContract.balanceOf(callerAddress);
      var temp = Object.assign({}, profile);
      temp.following = balance.toNumber() > 0;
      profiles.push(temp);
    } else {
      var temp = Object.assign({}, profile);
      temp.following = false;
      profiles.push(temp);
    }
  }
  return profiles;
}

export async function getProfileIdByHandle(address: string) {
  const lensContract = getLensHubContract();
  console.log(lensContract);

  // const profile = await lensContract.getProfileIdByHandle(address);
  // return profile;
  const tx = await lensContract.follow([9], [[]]);
  return tx.wait();

  // const ownerOf = await followNFT.ownerOf(1);
  // return ownerOf;

  const followNFTAddr = await lensContract.getFollowNFT(9);
  return followNFTAddr;
  return;
}

export async function getProfileId(handle: string) {
  const lensContract = getLensHubContract();

  const profile = await lensContract.getProfileIdByHandle(handle);
  return profile;
}

/*
const httpLink = new HttpLink({ uri: 'https://api-mumbai.lens.dev/' });

// example how you can pass in the x-access-token into requests using `ApolloLink`
const authLink = new ApolloLink((operation, forward) => {
  // Retrieve the authorization token from local storage.
  // if your using node etc you have to handle your auth different
  const token = localStorage.getItem('auth_token');

  // Use the setContext method to set the HTTP headers.
  operation.setContext({
    headers: {
      'x-access-token': token ? `Bearer ${token}` : ''
    }
  });

  // Call the next link in the middleware chain.
  return forward(operation);
});

export const apolloClient = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
})*/
