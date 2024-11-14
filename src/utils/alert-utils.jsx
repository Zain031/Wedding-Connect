import Swal from 'sweetalert2'
export const SuccessLogin = () => {
  const Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 2000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.onmouseenter = Swal.stopTimer
      toast.onmouseleave = Swal.resumeTimer
    },
  })
  Toast.fire({
    icon: 'success',
    title: 'Signed in successfully',
  })
}

export const AlertHandleDelete = () => {
  Swal.fire({
    title: 'Are you sure?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes, delete it!',
  }).then((result) => {
    if (result.isConfirmed) {
      Swal.fire({
        title: 'Deleted!',
        text: 'Your file has been deleted.',
        icon: 'success',
      })
    }
  })
}

export const SuccessRegister = () => {
  Swal.fire({
    icon: 'succes',
    title: 'Registrasi sukses',
    text: 'Selamat anda telah menyelesaikan tahap registrasi, silahkan tunggu 1 x 24 jam untuk proses aktivasi akun',
  })
}

export const FailedAkunLogin = () => {
  Swal.fire({
    icon: 'info',
    title: 'Login gagal',
    text: 'Akun anda masih dalam tahap aktivasi,silahkan tunggu',
  })
}

export const FailedAktivasiAkun = () => {
  Swal.fire({
    icon: 'info',
    title: 'Akun anda masih dalam tahap aktivasi',
    text: 'Silahkan tunggu',
  })
}

export const FailedLogin = () => {
  Swal.fire({
    icon: 'error',
    title: 'Oops...',
    text: 'Incorrect login username or password',
  })
}

export const FailedRegister = () => {
  Swal.fire({
    icon: 'error',
    title: 'Oops...',
    text: 'Failed register account',
  })
}

export const Logout = (cb) => {
  Swal.fire({
    title: 'Are you sure?',
    icon: 'question',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes, i want logout!',
  }).then((result) => {
    if (result.isConfirmed) {
      cb()
    }
  })
}
