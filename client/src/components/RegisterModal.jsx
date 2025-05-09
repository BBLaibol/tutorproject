import RegisterForm from "./RegisterForm";
import "./RegisterModal.css";

export default function RegisterModal({ isOpen, onClose, setIsAuthenticated }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <RegisterForm
          setIsAuthenticated={setIsAuthenticated}
          onClose={onClose}
        />
      </div>
    </div>
  );
}
