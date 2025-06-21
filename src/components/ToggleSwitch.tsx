import React from "react";
import "./ToggleSwitch.css";

interface ToggleSwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
}

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({ checked, onChange, disabled }) => (
  <label className={`toggle-switch${disabled ? " disabled" : ""}`}>
    <input
      type="checkbox"
      checked={checked}
      disabled={disabled}
      onChange={e => onChange(e.target.checked)}
    />
    <span className="slider" />
  </label>
);

export default ToggleSwitch;
