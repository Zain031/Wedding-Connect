const ModalPreviewImage = ({ image }) => {
  return (
    <dialog id="preview_image_modal" className="modal">
      <div className="modal-box">
        <h3 className="text-lg font-bold">Preview Image</h3>
        <img src={image} alt="" className="h-[49rem] w-full object-fill" />
      </div>
      <form method="dialog" className="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
  )
}

export default ModalPreviewImage
