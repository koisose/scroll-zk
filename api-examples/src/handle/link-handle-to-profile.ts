import { apolloClient } from '../apollo-client';
import { login } from '../authentication/login';
import { broadcastOnchainRequest } from '../broadcast/shared-broadcast';
import { USE_GASLESS } from '../config';
import { getAddressFromSigner, signedTypeData, splitSignature } from '../ethers.service';
import {
  CreateLinkHandleToProfileTypedDataDocument,
  LinkHandleToProfileRequest,
} from '../graphql/generated';
import { lensTokenHandleRegistry } from '../lens-token-handle-registry';
import { waitUntilBroadcastTransactionIsComplete } from '../transaction/wait-until-complete';

const createLinkHandleToProfileTypedData = async (request: LinkHandleToProfileRequest) => {
  const result = await apolloClient.mutate({
    mutation: CreateLinkHandleToProfileTypedDataDocument,
    variables: {
      request,
    },
  });

  return result.data!.createLinkHandleToProfileTypedData;
};

export const link = async () => {
  const address = getAddressFromSigner();
  console.log('link handle to profile:: address', address);

  await login(address);

  const { id, typedData } = await createLinkHandleToProfileTypedData({
    handle: 'test/wagmi',
  });
  console.log('link handle to profile:: result', { id, typedData });

  console.log('link handle to profile:: typedData', typedData);

  const signature = await signedTypeData(typedData.domain, typedData.types, typedData.value);
  console.log('link handle to profile:: signature', signature);

  if (USE_GASLESS) {
    const broadcastResult = await broadcastOnchainRequest({ id, signature });

    await waitUntilBroadcastTransactionIsComplete(broadcastResult, 'link handle to profile:');
  } else {
    const { v, r, s } = splitSignature(signature);

    const tx = await lensTokenHandleRegistry.linkWithSig(
      typedData.value.handleId,
      typedData.value.profileId,
      {
        signer: address,
        v,
        r,
        s,
        deadline: typedData.value.deadline,
      }
    );
    console.log('link handle to profile:: tx hash', tx.hash);
    return tx.hash;
  }
};

(async () => {
  await link();
})();
