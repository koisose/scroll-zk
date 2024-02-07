import { apolloClient } from '../apollo-client';
import { login } from '../authentication/login';
import { PROFILE_ID } from '../config';
import { getAddressFromSigner } from '../ethers.service';
import { AddProfileInterestsDocument, ProfileInterestTypes } from '../graphql/generated';

const addProfileInterestsRequest = async (interests: ProfileInterestTypes[]) => {
  await apolloClient.query({
    query: AddProfileInterestsDocument,
    variables: {
      request: {
        interests,
      },
    },
  });
};

// Currently errors due to graphql error
export const addProfileInterests = async () => {
  const profileId = PROFILE_ID;
  if (!profileId) {
    throw new Error('Must define PROFILE_ID in the .env to run this');
  }

  const address = getAddressFromSigner();
  await login(address);

  await addProfileInterestsRequest([ProfileInterestTypes.ArtEntertainment]);
};

(async () => {
  await addProfileInterests();
})();
