import { apolloClient } from '../apollo-client';
import { SupportedReferenceModulesDocument } from '../graphql/generated';

const getSupportedReferenceModules = async () => {
  const result = await apolloClient.query({
    query: SupportedReferenceModulesDocument,
  });

  return result.data.supportedReferenceModules;
};

// This currently does not work due to postgres syntax error
const supportedReferenceModules = async () => {
  const result = await getSupportedReferenceModules();

  console.log('supported reference modules', result);

  return result;
};

(async function () {
  await supportedReferenceModules();
})();
