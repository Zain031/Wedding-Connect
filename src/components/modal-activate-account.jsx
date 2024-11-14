function ModalActivateAccount({ onClose, name, onActivate }) {
  return (
    <dialog id="activate_account_modal" className="modal">
      <div className="modal-box">
        <h3 className="text-lg font-bold">Activate Account</h3>
        <p className="py-4">Are you sure you want to activate {name}&#39;s account?</p>
        <div className="modal-action">
          <div className="flex items-center space-x-3">
            <button type="button" className="btn" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-success" onClick={onActivate}>
              Activate
            </button>
          </div>
        </div>
      </div>
    </dialog>
  )
}

export default ModalActivateAccount
