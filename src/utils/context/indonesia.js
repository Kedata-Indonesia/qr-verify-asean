// const IndonesiaContext = () => ({
//   "https://www.w3.org/2018/credentials/v1": credentialsv1,
//   "https://www.pedulilindungi.id/credentials/vaccination/v2":
//     vaccinationContextV2,
// });

// export default IndonesiaContext;

const IndonesiaContext = (credentials, vaccinationContext) => ({
  "https://www.w3.org/2018/credentials/v1": credentials,
  "https://www.pedulilindungi.id/credentials/vaccination/v2":
    vaccinationContext,
});

export default IndonesiaContext;
