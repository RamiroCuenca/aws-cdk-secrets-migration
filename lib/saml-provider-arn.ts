import * as AWS from 'aws-sdk';

async function getSamlProviderArn(samlProviderName: string): Promise<string> {
  // Create an instance of the IAM client
  const iam = new AWS.IAM();

  // Call the listSAMLProviders method to get a list of all SAML providers
  const samlProviders = await iam.listSAMLProviders().promise();

  // Find the SAML provider with the name you specified
  const samlProvider = samlProviders.SAMLProviderList!.find(p => p.Name === samlProviderName);

  if (!samlProvider) {
    throw new Error(`SAML provider '${samlProviderName}' not found`);
  }

  // Return the ARN of the SAML provider
  return samlProvider.Arn!;
}

// Example usage:
/*
(async () => {
  try {
    const samlProviderArn = await getSamlProviderArn('MY_SAML_PROVIDER_NAME');
    console.log(samlProviderArn);
  } catch (error) {
    console.error(error);
  }
})();
*/