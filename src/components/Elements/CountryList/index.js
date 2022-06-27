import styles from "./CountryList.module.css";

import brnFlag from "../../../assets/img/flags/brunei.png";
import khmFlag from "../../../assets/img/flags/kamboja.png";
import idnFlag from "../../../assets/img/flags/indo.png";
import laoFlag from "../../../assets/img/flags/laos.png";
import mysFlag from "../../../assets/img/flags/malay.png";
import mmrFlag from "../../../assets/img/flags/myanmar.png";
import phlFlag from "../../../assets/img/flags/pilipin.png";
import sgpFlag from "../../../assets/img/flags/sg.png";
import thaFlag from "../../../assets/img/flags/thai.png";
import vnmFlag from "../../../assets/img/flags/vietnam.png";

const country = [
  { id: "brn", image: brnFlag, label: "Brunei", disabled: false },
  { id: "khm", image: khmFlag, label: "Cambodia", disabled: true },
  { id: "idn", image: idnFlag, label: "Indonesia", disabled: false },
  { id: "lao", image: laoFlag, label: "Laos", disabled: true },
  { id: "mys", image: mysFlag, label: "Malaysia", disabled: false },
  { id: "mmr", image: mmrFlag, label: "Myanmar", disabled: false },
  { id: "phl", image: phlFlag, label: "Philippines", disabled: false },
  { id: "sgp", image: sgpFlag, label: "Singapore", disabled: false },
  { id: "tha", image: thaFlag, label: "Thailand", disabled: false },
  { id: "vnm", image: vnmFlag, label: "Vietnam", disabled: false },
];

const CountryList = ({ keyword, handleChange }) => {
  if (!keyword) {
    return country.map(({ id, image, label, disabled }) => (
      <div key={id} className={styles.box}>
        <label className={styles.label} htmlFor={id}>
          <img src={image} alt={label} className="mr-3" />
          {label}
        </label>
        <input
          className={styles.input}
          type="radio"
          name="country"
          value={label}
          id={id}
          disabled={disabled}
          onChange={(e) => handleChange(e)}
        />
      </div>
    ));
  } else {
    return country
      .filter((item) =>
        item.label.toLowerCase().includes(keyword.toLowerCase())
      )
      .map(({ id, image, label, disabled }) => (
        <div key={id} className={styles.box}>
          <label className={styles.label} htmlFor={id}>
            <img src={image} alt={label} className="mr-3" />
            {label}
          </label>
          <input
            className={styles.input}
            type="radio"
            name="country"
            value={label}
            id={id}
            disabled={disabled}
            onChange={(e) => handleChange(e)}
          />
        </div>
      ));
  }
};

export default CountryList;
