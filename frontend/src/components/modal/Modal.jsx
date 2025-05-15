import "./Modal.css"; 
import { createPortal } from "react-dom"; // Permet d'afficher le modal en dehors de la hiérarchie DOM normale
import PropTypes from "prop-types"; // Pour valider les types des props

// Composant Modal : boîte de dialogue g
const Modal = ({ isOpen, message, onConfirm, onCancel }) => {
  // Si le modal n’est pas ouvert, on ne retourne rien (aucun affichage)
  if (!isOpen) return null;

  // Affichage du modal via un portal (hors de la hiérarchie DOM du parent)
  return createPortal(
    <div className="modal-backdrop">
      {/* Boîte centrale du modal */}
      <div className="modal-box">
        {/* Message affiché dans le corps du modal */}
        <p>{message}</p>

        {/* Boutons d'action : Annuler / Confirmer */}
        <div className="modal-actions">
          <button className="btn-cancel" onClick={onCancel}>
            Annuler
          </button>
          <button className="btn-confirm" onClick={onConfirm}>
            Confirmer
          </button>
        </div>
      </div>
    </div>,
    document.body // Le modal est inséré directement dans le <body>
  );
};

export default Modal;


Modal.propTypes = {
  isOpen: PropTypes.bool.isRequired,       // Indique si le modal doit s'afficher
  message: PropTypes.string.isRequired,    // Message affiché dans le modal
  onConfirm: PropTypes.func.isRequired,    // Fonction déclenchée quand on clique sur "Confirmer"
  onCancel: PropTypes.func.isRequired,     // Fonction déclenchée quand on clique sur "Annuler"
};
