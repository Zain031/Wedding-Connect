import { useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { useNavigate } from 'react-router-dom'
import { updateWeddingOrganizerImage } from '../api/wo-loaders'
import { EditSVG } from '../assets/svgs'

const ModalChangeImage = ({ id }) => {
  const [avatar, setAvatar] = useState(null)
  const navigate = useNavigate()

  const { getRootProps, getInputProps } = useDropzone({
    accept: 'image/*',
    multiple: false,
    onDrop: (acceptedFiles) => {
      const file = acceptedFiles[0]
      setAvatar({
        file: file,
        preview: URL.createObjectURL(file),
      })
    },
  })

  const submit = async (e) => {
    e.preventDefault()
    try {
      if (!avatar) {
        throw new Error('Please select an image')
      }

      const formData = new FormData()
      formData.append('avatar', avatar.file)

      const response = await updateWeddingOrganizerImage({ id: id, imageData: formData })

      if (!response.success) {
        throw new Error(response.message)
      } else {
        console.log('Image updated successfully', response)
      }
      document.getElementById('change_image_modal').close()
      navigate('.', { replace: true })
    } catch (error) {
      console.log('🚀 ~ submit ~ error:', error)
    } finally {
      setAvatar(null)
    }
  }

  const thumbnail = avatar ? (
    <div className="flex flex-col items-center justify-center gap-2">
      <div className="avatar">
        <div className="w-56 rounded-full">
          <img src={avatar.preview} alt="Avatar" />
        </div>
      </div>
      <button type="button" className="btn btn-warning btn-sm mt-2" onClick={() => setAvatar(null)}>
        <EditSVG className="size-6" /> Change Image
      </button>
    </div>
  ) : (
    <p className="text-center text-sm text-gray-500"> Drag and drop an image or click to upload </p>
  )

  return (
    <dialog id="change_image_modal" className="modal">
      <div className="modal-box">
        <h3 className="text-lg font-bold">Update Avatar</h3>
        <p className="text-sm">Press ESC key or click the button below to close</p>
        <div className="divider my-2" />
        <form onSubmit={submit} method="dialog">
          <div className="form-control">
            <label htmlFor="" className="label">
              <span className="label-text">Image</span>
            </label>
            <div
              {...getRootProps({ className: 'dropzone' })}
              className="input input-bordered flex h-80 max-h-80 items-center justify-center rounded-lg border-2 border-dashed p-3 hover:cursor-pointer hover:bg-base-200"
            >
              <input {...getInputProps()} />
              {thumbnail}
            </div>
          </div>
          <div className="modal-action">
            <button type="button" onClick={() => document.getElementById('change_image_modal').close()} className="btn">
              Close
            </button>
            <button type="submit" className="btn btn-success">
              Update
            </button>
          </div>
        </form>
      </div>
    </dialog>
  )
}

export default ModalChangeImage
