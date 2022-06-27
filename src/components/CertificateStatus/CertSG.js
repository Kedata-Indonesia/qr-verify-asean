import { useState, useEffect } from "react";

import { CustomButton } from "../CustomButton";
import { Loader } from "../Loader";
import CertificateValidImg from "../../assets/img/certificate-valid.svg";
import CertificateInValidImg from "../../assets/img/certificate-invalid.svg";

const CertSG = ({ certificateData, goBack }) => {
  const [isLoading, setLoading] = useState(false);
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    setLoading(true);
    const url = certificateData.substring(0, 35);

    if (url === "https://www.verify.gov.sg/verify?q=") {
      setIsValid(true);
      setLoading(false);
    } else {
      setIsValid(false);
      setLoading(false);
    }
  }, [certificateData]);

  return isLoading ? (
    <Loader />
  ) : (
    <div className="certificate-status-wrapper">
      <img
        src={isValid ? CertificateValidImg : CertificateInValidImg}
        alt="certificate status"
        className="certificate-status-image"
      />
      <h3 className="certificate-status">
        {isValid ? "Successfully" : "Invalid"}
      </h3>
      <br />

      {isValid && (
        <p>
          For more detailed information, please click this{" "}
          <a target="_blank" rel="noreferrer" href={certificateData}>
            link
          </a>
        </p>
      )}
      <CustomButton className="blue-btn m-3" onClick={goBack}>
        Verify Another Certificate
      </CustomButton>
      <br />
      {!isValid && <h5> Please try again. </h5>}
    </div>
  );
};

export default CertSG;
