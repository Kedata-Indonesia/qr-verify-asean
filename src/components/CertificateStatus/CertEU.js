import { Fragment, useEffect, useState } from "react";

import base45 from "base45";
import pako from "pako";
import cbor from "cbor";
import dayjs from "dayjs";

import { CustomButton } from "../CustomButton";
import { Loader } from "../Loader";
import CertificateValidImg from "../../assets/img/certificate-valid.svg";
import CertificateInValidImg from "../../assets/img/certificate-invalid.svg";
import * as bigintConversion from "bigint-conversion";

import axios from 'axios';
import {PublicKey, RSAPublicKey} from "@fidm/x509"

const cose = require('cose-js');

async function getPublicKey(kid) {
  let publicKey = null;
  try {
    let result = await axios.get(
      'https://raw.githubusercontent.com/lovasoa/sanipasse/master/src/assets/Digital_Green_Certificate_Signing_Keys.json'
    );
    if (result.status === 200) {
      if (result.data[kid] != null){
        publicKey = result.data[kid].publicKeyPem;
      }
     
      return {
        publicKey: publicKey,
        publicKeyAlgorithm: result.data[kid].publicKeyAlgorithm.name
      };
    }
  } catch (err) {
    console.log(err);
  }
}


const CertEU = ({ certificateData, goBack, country }) => {
  const [isLoading, setLoading] = useState(false);
  const [isValid, setIsValid] = useState(false);
  const [JSONCert, setJSONCert] = useState(null);

  useEffect(() => {
    setLoading(true);
    try {
      const greenpassBody = certificateData.substr(4);
      const decodedData = base45.decode(greenpassBody);
      const output = pako.inflate(decodedData);
      const results = cbor.decodeAllSync(output);

      const [header1, , cbor_data] = results[0].value;
      let greenpassData;
      let kid = null;
      // if (typeof cbor_data === "bigint") {
      if (country === "vietnam") {
        // special for vietnam
        const buffer = bigintConversion.bigintToBuf(cbor_data);
        const u8 = new Uint8Array(buffer);
        console.log(u8);
        greenpassData = cbor.decodeAllSync(u8);
      } else {
        greenpassData = cbor.decodeAllSync(cbor_data);
      }

      const greenpassJSON = greenpassData[0].get(-260).get(1);
      const decodedHeader = cbor.decodeAllSync(header1);

      kid = decodedHeader[0].get(4)
      kid = Buffer.from(kid,'base64').toString('base64')
      getPublicKey(kid).then(
        result => {
          if(result === null){
            setIsValid(false);
            setLoading(false);
          }else{
            try {
              if(result.publicKeyAlgorithm === 'ECDSA'){
                const key = PublicKey.fromPEM(
                  "-----BEGIN PUBLIC KEY-----\n"+
                  result.publicKey+
                  "\n-----END PUBLIC KEY-----\n"
                )
                const pk = key.keyRaw;
                
                const keyX = pk.slice(1, 1 + 32);
                const keyY = pk.slice(33, 33 + 32);
              
                const verifier = { key: { x: keyX, y: keyY } };	
                
                cose.sign.verifySync(output,verifier)
                setIsValid(true);
                setJSONCert(greenpassJSON);
                setLoading(false);
              }else{
                const key = RSAPublicKey.fromPEM(
                  "-----BEGIN PUBLIC KEY-----\n"+
                  result.publicKey+
                  "\n-----END PUBLIC KEY-----\n"
                )
                const pk = key.keyRaw;
                const keyMod = pk.slice(9, pk.length - 5);
                const keyExp = pk.slice(pk.length - 3,pk.length);
                
                
                cose.sign.verifySync(output,{'key':{n:keyMod, e:keyExp}})
                setIsValid(true);
                setJSONCert(greenpassJSON);
                setLoading(false);
              }
              

            } catch (error) {
              console.log(error);
              setIsValid(false);
              setLoading(false);
            }
            
          }
        }
      );   
    } catch (err) {
      console.error(err);
      setIsValid(false);
      setLoading(false);
    }
  }, [certificateData]);

  const renderMY = () => (
    <table className="mt-3" style={{ tableLayout: "fixed", width: "100%" }}>
      <tbody>
        <tr style={{ fontSize: "smaller", textAlign: "left" }}>
          <td className="pr-3">Beneficiary Details</td>
          <td className="font-weight-bolder value-col">{JSONCert?.nam.fn}</td>
        </tr>
        <tr style={{ fontSize: "smaller", textAlign: "left" }}>
          <td className="pr-3">Passport No</td>
          <td className="font-weight-bolder value-col">{JSONCert?.pn}</td>
        </tr>
        <tr style={{ fontSize: "smaller", textAlign: "left" }}>
          <td className="pr-3">Date Of Birth</td>
          <td className="font-weight-bolder value-col">
            {dayjs(JSONCert?.dob).format("DD-MMM-YYYY")}
          </td>
        </tr>
        <tr style={{ fontSize: "smaller", textAlign: "left" }}>
          <td className="pr-3">Certificate ID</td>
          <td className="font-weight-bolder value-col">{JSONCert?.v[0].ci}</td>
        </tr>
        <tr style={{ fontSize: "smaller", textAlign: "left" }}>
          <td className="pr-3">Date Of Issue</td>
          <td className="font-weight-bolder value-col">
            {dayjs(JSONCert?.v[0].dt).format("DD-MMM-YYYY")}
          </td>
        </tr>
        <tr style={{ fontSize: "smaller", textAlign: "left" }}>
          <td className="pr-3">Dose</td>
          <td className="font-weight-bolder value-col">{JSONCert?.v[0].dn}</td>
        </tr>
        <tr style={{ fontSize: "smaller", textAlign: "left" }}>
          <td className="pr-3">Total Doses</td>
          <td className="font-weight-bolder value-col">{JSONCert?.v[0].sd}</td>
        </tr>
      </tbody>
    </table>
  );

  const renderVN = () => (
    <table className="mt-3" style={{ tableLayout: "fixed", width: "100%" }}>
      <tbody>
        <tr style={{ fontSize: "smaller", textAlign: "left" }}>
          <td className="pr-3">Beneficiary Details</td>
          <td className="font-weight-bolder value-col">
            {`${JSONCert?.nam.fn} ${JSONCert?.nam.gn}`}
          </td>
        </tr>
        <tr style={{ fontSize: "smaller", textAlign: "left" }}>
          <td className="pr-3">Date Of Birth</td>
          <td className="font-weight-bolder value-col">
            {dayjs(JSONCert?.dob).format("DD-MMM-YYYY")}
          </td>
        </tr>
        {JSONCert?.v.map((data, index) => (
          <Fragment key={index}>
            <tr></tr>
            <tr></tr>
            <tr style={{ fontSize: "smaller", textAlign: "left" }}>
              <td className="pr-3">Doses Number</td>
              <td className="font-weight-bolder value-col">{data.dn}</td>
            </tr>
            <tr style={{ fontSize: "smaller", textAlign: "left" }}>
              <td className="pr-3">Certificate Issuer</td>
              <td className="font-weight-bolder value-col">{data.is}</td>
            </tr>
            <tr style={{ fontSize: "smaller", textAlign: "left" }}>
              <td className="pr-3">Date of Vaccination</td>
              <td className="font-weight-bolder value-col">
                {dayjs(data.dt).format("DD-MMM-YYYY")}
              </td>
            </tr>
          </Fragment>
        ))}
      </tbody>
    </table>
  );

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
      {isValid && country === "malaysia" && renderMY()}
      {isValid && country === "vietnam" && renderVN()}
      <br />
      <CustomButton className="blue-btn m-3" onClick={goBack}>
        Verify Another Certificate
      </CustomButton>
      <br />
      {!isValid && <h5> Please try again. </h5>}
    </div>
  );
};

export default CertEU;
