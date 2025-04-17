import icon16 from "@assets/icon16.png";
import icon48 from "@assets/icon48.png";
import icon128 from "@assets/icon128.png";
import iconSvg from "@assets/icon.svg";

const AssetTest = () => {
  return (
    <div style={{ padding: "20px" }}>
      <h2>Asset Test</h2>
      <div style={{ display: "flex", gap: "20px", alignItems: "center" }}>
        <div>
          <p>icon16.png:</p>
          <img src={icon16} alt="16px icon" />
        </div>
        <div>
          <p>icon48.png:</p>
          <img src={icon48} alt="48px icon" />
        </div>
        <div>
          <p>icon128.png:</p>
          <img src={icon128} alt="128px icon" />
        </div>
        <div>
          <p>icon.svg:</p>
          <img src={iconSvg} alt="SVG icon" style={{ width: "48px" }} />
        </div>
      </div>
    </div>
  );
};

export default AssetTest;
