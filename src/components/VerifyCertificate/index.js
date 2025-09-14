import { useState } from "react";
import QRScanner from "../QRScanner";
import JSZip from "jszip";
import Swal from "sweetalert2";

import Header from "../Layouts/Header";
import SearchBox from "../Elements/SearchBox";
import CountryList from "../Elements/CountryList";
import { CertificateStatus } from "../CertificateStatus";
import { CustomButton } from "../CustomButton";
import CertEU from "../CertificateStatus/CertEU";
import CertTH from "../CertificateStatus/CertTH";
import CertSG from "../CertificateStatus/CertSG";
import CertBR from "../CertificateStatus/CertBR";
import CertMYM from "../CertificateStatus/CertMYM";
import "./index.css";
import scanImg from "../../assets/img/scan.png";


export const CERTIFICATE_FILE = "certificate.json";

export const VerifyCertificate = () => {
  const [result, setResult] = useState(null);
  const [country, setCountry] = useState(null);
  const [showScanner, setShowScanner] = useState(false);
  const [keyword, setKeyword] = useState(null);

  const goBack = () => {
    setShowScanner(false);
    setResult(null);
    setCountry(null);
    setKeyword(null);
  };
  const handleChange = (e) => setCountry(e.target.value.toLowerCase());
  const handleScanBtn = () => {
    const countryNotExist = ["cambodia", "laos"];
    if (country) {
      if (countryNotExist.includes(country)) {
        Swal.fire({
          icon: "warning",
          title: "Something wrong!",
          text: "Selected country under development.",
          confirmButtonColor: "#06919D",
          confirmButtonText: "Try again",
        });
      } else {
        setShowScanner(true);
      }
    } else {
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: "Please select country first.",
        confirmButtonColor: "#06919D",
        confirmButtonText: "Try again",
      });
    }
  };
  const handleScan = (data) => {
    console.log('QR Scan Result:', data);
    console.log('QR Data Type:', typeof data);
    console.log('QR Data Length:', data ? data.length : 'null');
    console.log('Country Selected:', country);

    if (data) {
      if (
        country === "vietnam" ||
        country === "malaysia" ||
        country === "thailand" ||
        country === "brunei" ||
        country === "myanmar" ||
        country === "singapore"
      ) {
        setResult(data);
      } else {
        // Indonesia & India
        console.log('Processing Indonesia/India ZIP format...');
        const zip = new JSZip();
        zip
          .loadAsync(data)
          .then((res) => {
            console.log('ZIP loaded successfully, files:', Object.keys(res.files));
            return res.files[CERTIFICATE_FILE].async("text");
          })
          .then((res) => {
            console.log('Certificate JSON extracted:', res.substring(0, 200) + '...');
            setResult(res);
          })
          .catch((err) => {
            console.error('ZIP processing error:', err);
            console.log('Falling back to raw data');
            setResult(data);
          });
      }
    }
  };
  const handleSearch = (e) => setKeyword(e.target.value);
  const handleError = (err) => console.error(err);
  const renderCertificateStatus = () => {
    if (country === "malaysia" || country === "vietnam" || country === "thailand") {
      return (
        <CertEU certificateData={result} goBack={goBack} country={country} />
      );
    // } else if (country === "thailand") {
    //   return <CertTH certificateData={result} goBack={goBack} />;
    } else if (country === "singapore") {
      return <CertSG certificateData={result} goBack={goBack} />;
    } else if (country === "brunei") {
      return <CertBR certificateData={result} goBack={goBack} />;
    }else if (country === "myanmar") {
      return <CertMYM certificateData={result} goBack={goBack} />;
    }else {
      return (
        <CertificateStatus
          country={country}
          certificateData={result}
          goBack={goBack}
        />
      );
    }
  };

  return (
    <>
      <Header />
      <div className="container py-5 py-md-4 px-md-5">
        {!result && (
          <>
            {!showScanner && (
              <>
                <div className="row">
                  <div className="col-12 mb-4">
                    <p className="text-center">Choose the origin country</p>
                    <SearchBox onChange={(e) => handleSearch(e)} />
                  </div>
                  <div className="col-12 px-3">
                    <CountryList
                      keyword={keyword}
                      handleChange={handleChange}
                    />
                  </div>
                  <div className="col-12">
                    <CustomButton
                      className="orange-btn btn-block"
                      onClick={handleScanBtn}
                    >
                      <img src={scanImg} alt="scan logo" className="mr-3" />
                      <span>SCAN QR CODE</span>
                    </CustomButton>
                  </div>
                </div>
              </>
            )}
            {showScanner && (
              <>
                <QRScanner onError={handleError} onScan={handleScan} />
                <CustomButton className="green-btn btn-block" onClick={goBack}>
                  BACK
                </CustomButton>
              </>
            )}
          </>
        )}

        {result && renderCertificateStatus()}
      </div>
    </>
  );
};
