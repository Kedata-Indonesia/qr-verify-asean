const IndiaContext = (credentials, vaccinationContext) => ({
  "https://www.w3.org/2018/credentials/v1": credentials,
  "https://cowin.gov.in/credentials/vaccination/v1": vaccinationContext,
});

export default IndiaContext;
