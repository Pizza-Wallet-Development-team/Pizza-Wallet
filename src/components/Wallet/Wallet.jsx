import Transfer from "./components/Transfer";
import NativeBalance from "../NativeBalance";
import Address from "../Address/Address";
import Blockie from "../Blockie";
import { Card } from "antd";

// TODO: We can use this component for our new wallet implementation or delete it and start over.
const styles = {
  header: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "0.3125rem",
  },
  card: {
    border: "none",
    borderRadius: "1rem",
    width: "28.125rem",
    fontSize: "1rem",
    fontWeight: "500",
    marginTop: "-3em",
    marginRight: "auto",
    marginLeft: "auto",
  },
};

function Wallet() {
  return (
    <Card
      className="floater"
      style={styles.card}
      title={
        <div style={styles.header}>
          <Blockie scale={5} avatar currentWallet style />
          <Address size="6" copyable />
          <NativeBalance />
        </div>
      }
    >
      <Transfer />
    </Card>
  );
}

export default Wallet;
