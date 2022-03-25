import { ethers } from "ethers";
import lensABI from "../contracts/mumbai/lensHub.json";

export function getLensHubContract() {
  const provider = new ethers.providers.Web3Provider((window as any).ethereum);
  return new ethers.Contract(
    //"0x6CC5F26402C4d6Ab0CB9d139242E2682aA80b751",
    "0x308d0a92352Bcd1d68b4A8b788B2ebBD90582CC6",
    lensABI,
    provider.getSigner()
  );
}

export async function createProfile(profileInfo: any) {
  const lensContract = getLensHubContract();
  console.log(lensContract);

  const tx = await lensContract.createProfile(profileInfo);
  console.log(tx);

  return tx.wait();
}

export async function getProfile(profileId: number) {
  const lensContract = getLensHubContract();
  const profile = await lensContract.getProfile(profileId);
  console.log(profile);
  return profile;
}

export async function getProfileIdByHandle(address: string) {
  const lensContract = getLensHubContract();
  const profile = await lensContract.getProfileIdByHandle(address);
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
