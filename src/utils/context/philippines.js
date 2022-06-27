const PhilippinesContext = (credentials, vaccinationContext) => ({
  "https://www.w3.org/2018/credentials/v1": credentials,
  "https://divoc.dev/credentials/vaccination/v1": vaccinationContext,
});

export default PhilippinesContext;
