import Title from "../../Title";
import Button from "../../UI/Button";
import { Logo } from "../Logo";
import Wallet from "../Wallet";
import styles from "./Info.module.css";
import Socials from "./Socials";
const Info = () => {
  const handleRedirect = () => {
    window.open("https://wc2022.defifa.net");
  };

  return (
    <div className={styles.container}>
      <Logo src="/assets/defifa-nfl-logo.png" />
      <Socials />

      <div className={styles.buttonContainer} style={{ marginLeft: "auto" }}>
        <Wallet />
        <Button onClick={handleRedirect}>Go to Defifa WC 2022</Button>
      </div>
    </div>
  );
};

export default Info;
