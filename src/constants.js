const monthNames = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

export function formatDate(givenDate) {
  const dob = new Date(givenDate);
  let day = dob
    .getDate()
    .toLocaleString("en-US", { minimumIntegerDigits: 2, useGrouping: false });
  let monthName = monthNames[dob.getMonth()];
  let year = dob.getFullYear();

  return `${day}-${monthName}-${year}`;
}

const CertificateDetailsPathsIDN = {
  "Beneficiary Details": {
    path: ["credentialSubject", "name"],
    format: (data) => data,
  },
  Age: {
    path: ["credentialSubject", "age"],
    format: (data) => data,
  },
  "Date Of Birth": {
    path: ["credentialSubject", "dob"],
    format: (data) => formatDate(data),
    optional: true,
  },
  Gender: {
    path: ["credentialSubject", "gender"],
    format: (data) => data,
  },
  "Certificate ID": {
    path: ["evidence", "0", "certificateId"],
    format: (data) => data,
  },
  "Date Of Issue": {
    path: ["evidence", "0", "date"],
    format: (data) => formatDate(data),
  },
  Dose: {
    path: ["evidence", "0", "dose"],
    format: (data) => data,
  },
  "Total Doses": {
    path: ["evidence", "0", "totalDoses"],
    format: (data) => data,
  },
  "Vaccination Facility": {
    path: ["evidence", "0", "facility", "name"],
    format: (data) => data,
  },
};

const CertificateDetailsPathsPHL = {
  "Beneficiary Details": {
    path: ["credentialSubject", "name"],
    format: (data) => data,
  },
  "Date Of Birth": {
    path: ["credentialSubject", "dob"],
    format: (data) => formatDate(data),
    optional: true,
  },
  Sex: {
    path: ["credentialSubject", "sex"],
    format: (data) => data,
  },
  "Certificate ID": {
    path: ["evidence", "0", "certificateId"],
    format: (data) => data,
  },
  "Date Of Issue": {
    path: ["evidence", "0", "date"],
    format: (data) => formatDate(data),
  },
  Dose: {
    path: ["evidence", "0", "dose"],
    format: (data) => data,
  },
  "Total Doses": {
    path: ["evidence", "0", "totalDoses"],
    format: (data) => data,
  },
  "Vaccination Facility": {
    path: ["evidence", "0", "facility", "name"],
    format: (data) => data,
  },
};

export { CertificateDetailsPathsIDN, CertificateDetailsPathsPHL };
