import { apolloClient } from '../apollo-client';
import { OwnedHandlesDocument } from '../graphql/generated';

const getOwnedHandles = async () => {
  const result = await apolloClient.query({
    query: OwnedHandlesDocument,
    variables: {
      request: {
        for: '0x088C3152A5Ad1892236b312f18405Df3586Aca87',
      },
    },
  });

  return result.data.ownedHandles;
};

const ownedHandles = async () => {
  const ownedHandles = await getOwnedHandles();

  console.log('owned handles: result', ownedHandles);

  return ownedHandles;
};

(async function () {
  await ownedHandles();
})();
