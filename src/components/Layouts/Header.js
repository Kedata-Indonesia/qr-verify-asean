import aseanLogo from "../../assets/img/asean.png";
import styles from "./Header.module.css";

const Header = () => {
  return (
    <div className="container-fluid p-0">
      <div className={styles.background}>
        <img
          src={aseanLogo}
          className="rounded mx-auto d-block img-fluid"
          alt="asean logo"
          width="132"
        />
        <h4 className={styles.title}>
          ASEAN Covid-19 Vaccine Certificate
          <br />
          Single Verification Portal
        </h4>
      </div>
    </div>
  );
};

export default Header;
