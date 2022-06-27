import styles from "./SearchBox.module.css";

const SearchBox = ({ onChange }) => {
  return (
    <div className={styles.box}>
      <input
        className={styles.input}
        type="search"
        placeholder="Search Country"
        onChange={onChange}
      />
    </div>
  );
};

export default SearchBox;
