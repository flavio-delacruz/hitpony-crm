// features/login/TapHint.jsx
import { brand } from "../../theme";

export default function TapHint() {
  return (
    <div className="tap-hint-inset" aria-hidden>
      <div className="pulse p1" />
      <div className="pulse p2" />
      <div className="hand">👆</div>
    </div>
  );
}
