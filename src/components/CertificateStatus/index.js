import React, { useEffect, useState } from "react";
import "./index.css";
import CertificateValidImg from "../../assets/img/certificate-valid.svg";
import CertificateInValidImg from "../../assets/img/certificate-invalid.svg";
import config from "../../config";
import axios from "axios";
import { pathOr } from "ramda";
import { CustomButton } from "../CustomButton";
import { CertificateDetailsPathsIDN } from "../../constants";
import { CertificateDetailsPathsPHL } from "../../constants";
import { useDispatch } from "react-redux";
import { addEventAction, EVENT_TYPES } from "../../redux/reducers/events";
import { Loader } from "../Loader";

import { IndiaContext, IndonesiaContext } from "../../utils/context";
import { PhilippinesContext } from "../../utils/context";
import {
  vaccinationContext,
  vaccinationContextV2,
} from "../../utils/context/vaccination-context";

const jsigs = require("jsonld-signatures");
const { RSAKeyPair, Ed25519KeyPair } = require("crypto-ld");
const { documentLoaders } = require("jsonld");
const { node: documentLoader } = documentLoaders;
const { contexts } = require("security-context");
const credentialsv1 = require("../../utils/credentials.json");

export const CertificateStatus = ({ country, certificateData, goBack }) => {
  const [isLoading, setLoading] = useState(false);
  const [isValid, setValid] = useState(false);
  const [data, setData] = useState({});
  const dispatch = useDispatch();

  const customLoader = (url) => {
    // console.log("checking " + url);
    let c;
    if (country === "indonesia") {
      c = IndonesiaContext(credentialsv1, vaccinationContextV2);
    } else if (country === "philippines") {
      c = PhilippinesContext(credentialsv1, vaccinationContextV2);
    } else {
      c = IndiaContext(credentialsv1, vaccinationContext);
    }

    let context = c[url];
    if (context === undefined) {
      context = contexts[url];
    }
    if (context !== undefined) {
      return {
        contextUrl: null,
        documentUrl: url,
        document: context,
      };
    }
    if (url.startsWith("{")) {
      return JSON.parse(url);
    }
    console.log("Fallback url lookup for document :" + url);
    return documentLoader()(url);
  };

  useEffect(() => {
    setLoading(true);

    async function checkIfRevokedCertificate(data) {
      return axios
        .post("/cert/api/certificate/revoked", data)
        .then((res) => {
          dispatch(
            addEventAction({
              type: EVENT_TYPES.REVOKED_CERTIFICATE,
              extra: certificateData,
            })
          );
          return res;
        })
        .catch((e) => {
          console.log(e);
          return e;
        });
    }

    async function verifyData() {
      try {
        const signedJSON = JSON.parse(certificateData);
        const { AssertionProofPurpose } = jsigs.purposes;
        const publicKey = { id: `did:${country}` };
        const controller = { assertionMethod: [publicKey.id] };

        if (country === "indonesia") {
          publicKey["publicKeyBase58"] = config.idn.certificatePublicKey;
        } else if (country === "philippines") {
          publicKey["publicKeyPem"] = config.phl.certificatePublicKey;
        } else {
          publicKey["publicKeyPem"] = config.ind.certificatePublicKey;
        }

        let result;
        if (country === "indonesia") {
          const key = new Ed25519KeyPair({ ...publicKey });
          const { Ed25519Signature2018 } = jsigs.suites;

          result = await jsigs.verify(signedJSON, {
            suite: new Ed25519Signature2018({ key }),
            purpose: new AssertionProofPurpose({ controller }),
            documentLoader: customLoader,
            compactProof: false,
          });
        } else {
          const key = new RSAKeyPair({ ...publicKey });
          const { RsaSignature2018 } = jsigs.suites;

          result = await jsigs.verify(signedJSON, {
            suite: new RsaSignature2018({ key }),
            purpose: new AssertionProofPurpose({ controller }),
            documentLoader: customLoader,
            compactProof: false,
          });
        }

        if (result.verified) {
          const revokedResponse = await checkIfRevokedCertificate(signedJSON);
          if (revokedResponse.response.status !== 200) {
            console.log("Signature verified.");
            setValid(true);
            setData(signedJSON);
            dispatch(
              addEventAction({
                type: EVENT_TYPES.VALID_VERIFICATION,
                extra: signedJSON.credentialSubject,
              })
            );
            setTimeout(() => {
              setLoading(false);
            }, 2000);

            return;
          }
        }
        dispatch(
          addEventAction({
            type: EVENT_TYPES.INVALID_VERIFICATION,
            extra: signedJSON,
          })
        );
        setValid(false);
        setLoading(false);
      } catch (e) {
        console.log("Invalid data", e);
        setValid(false);
        dispatch(
          addEventAction({
            type: EVENT_TYPES.INVALID_VERIFICATION,
            extra: certificateData,
          })
        );
        setLoading(false);
      }
    }

    setTimeout(() => {
      verifyData();
    }, 500);
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
      {isValid && country === "indonesia" && (
        <table className="mt-3" style={{ tableLayout: "fixed", width: "100%" }}>
          <tbody>
            {Object.keys(CertificateDetailsPathsIDN).map((key, index) => {
              const context = CertificateDetailsPathsIDN[key];
              const value = context.format(pathOr("NA", context.path, data));
              const show =
                value !== "NA" || (value === "NA" && !context.optional);
              return (
                show && (
                  <tr
                    key={index}
                    style={{ fontSize: "smaller", textAlign: "left" }}
                  >
                    <td>{key}</td>
                    <td className="font-weight-bolder value-col">{value}</td>
                  </tr>
                )
              );
            })}
          </tbody>
        </table>
      )}
      {isValid && country === "philippines" && (
        <table className="mt-3" style={{ tableLayout: "fixed", width: "100%" }}>
          <tbody>
            {Object.keys(CertificateDetailsPathsPHL).map((key, index) => {
              const context = CertificateDetailsPathsPHL[key];
              const value = context.format(pathOr("NA", context.path, data));
              const show =
                value !== "NA" || (value === "NA" && !context.optional);
              return (
                show && (
                  <tr
                    key={index}
                    style={{ fontSize: "smaller", textAlign: "left" }}
                  >
                    <td>{key}</td>
                    <td className="font-weight-bolder value-col">{value}</td>
                  </tr>
                )
              );
            })}
          </tbody>
        </table>
      )}
      <br />
      <CustomButton className="blue-btn btn-block m-3" onClick={goBack}>
        Verify Another Certificate
      </CustomButton>
      <br />
      {!isValid && <h5> Please try again. </h5>}
    </div>
  );
};
