import { IconCheck } from "./Icons";

export default function Toast({ message }) {
  if (!message) return null;
  return (
    <div className="toast">
      <span className="toast-icon"><IconCheck size={14} /></span>
      {message}
    </div>
  );
}
