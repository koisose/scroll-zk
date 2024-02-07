import { apolloClient } from '../apollo-client';
import { login } from '../authentication/login';
import { explicitStart } from '../config';
import { getAddressFromSigner } from '../ethers.service';
import { EnabledCurrenciesDocument } from '../graphql/generated';

const enabledCurrenciesRequest = async () => {
  const result = await apolloClient.query({
    query: EnabledCurrenciesDocument,
  });

  return result.data.currencies;
};

export const enabledCurrencies = async () => {
  const address = getAddressFromSigner();
  console.log('enabled currencies: address', address);

  await login(address);

  const result = await enabledCurrenciesRequest();

  console.log('enabled currencies: result', result);

  return result;
};

(async () => {
  if (explicitStart(__filename)) {
    await enabledCurrencies();
  }
})();
