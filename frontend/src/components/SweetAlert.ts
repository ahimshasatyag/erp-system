import Swal from 'sweetalert2';

export const showAlert = {
  /**
   * Show a Success Alert
   */
  success: (title: string, text?: string) => {
    return Swal.fire({
      icon: 'success',
      title,
      text,
      background: document.documentElement.classList.contains('dark') ? '#1e202b' : '#ffffff',
      color: document.documentElement.classList.contains('dark') ? '#f3f4f6' : '#1f2937',
      confirmButtonColor: '#20c997',
      customClass: {
        popup: 'rounded-xl border border-gray-200 dark:border-gray-800 shadow-2xl transition-all duration-200',
        title: 'text-lg font-bold font-sans text-gray-900 dark:text-white',
        htmlContainer: 'text-sm font-sans text-gray-500 dark:text-gray-400',
        confirmButton: 'px-5 py-2 rounded-lg font-bold text-xs shadow-md transition-all duration-200 hover:opacity-90 cursor-pointer'
      }
    });
  },

  /**
   * Show an Error / Failure Alert
   */
  error: (title: string, text?: string) => {
    return Swal.fire({
      icon: 'error',
      title,
      text,
      background: document.documentElement.classList.contains('dark') ? '#1e202b' : '#ffffff',
      color: document.documentElement.classList.contains('dark') ? '#f3f4f6' : '#1f2937',
      confirmButtonColor: '#e11d48',
      customClass: {
        popup: 'rounded-xl border border-gray-200 dark:border-gray-800 shadow-2xl transition-all duration-200',
        title: 'text-lg font-bold font-sans text-gray-900 dark:text-white',
        htmlContainer: 'text-sm font-sans text-gray-500 dark:text-gray-400',
        confirmButton: 'px-5 py-2 rounded-lg font-bold text-xs shadow-md transition-all duration-200 hover:opacity-90 cursor-pointer'
      }
    });
  },

  /**
   * Show a Warning / Exclamation Alert
   */
  warning: (title: string, text?: string) => {
    return Swal.fire({
      icon: 'warning',
      title,
      text,
      background: document.documentElement.classList.contains('dark') ? '#1e202b' : '#ffffff',
      color: document.documentElement.classList.contains('dark') ? '#f3f4f6' : '#1f2937',
      confirmButtonColor: '#f59e0b',
      customClass: {
        popup: 'rounded-xl border border-gray-200 dark:border-gray-800 shadow-2xl transition-all duration-200',
        title: 'text-lg font-bold font-sans text-gray-900 dark:text-white',
        htmlContainer: 'text-sm font-sans text-gray-500 dark:text-gray-400',
        confirmButton: 'px-5 py-2 rounded-lg font-bold text-xs shadow-md transition-all duration-200 hover:opacity-90 cursor-pointer'
      }
    });
  },

  /**
   * Show a Confirmation Alert
   */
  confirm: (title: string, text: string, onConfirm: () => void, cancelText = 'Batal', confirmText = 'Ya', onCancel?: () => void) => {
    return Swal.fire({
      icon: 'question',
      title,
      text,
      showCancelButton: true,
      cancelButtonText: cancelText,
      confirmButtonText: confirmText,
      background: document.documentElement.classList.contains('dark') ? '#1e202b' : '#ffffff',
      color: document.documentElement.classList.contains('dark') ? '#f3f4f6' : '#1f2937',
      confirmButtonColor: '#20c997',
      cancelButtonColor: '#4b5563',
      customClass: {
        popup: 'rounded-xl border border-gray-200 dark:border-gray-800 shadow-2xl transition-all duration-200',
        title: 'text-lg font-bold font-sans text-gray-900 dark:text-white',
        htmlContainer: 'text-sm font-sans text-gray-500 dark:text-gray-400',
        confirmButton: 'px-5 py-2 rounded-lg font-bold text-xs shadow-md transition-all duration-200 hover:opacity-90 cursor-pointer mr-2',
        cancelButton: 'px-5 py-2 rounded-lg font-bold text-xs shadow-md transition-all duration-200 hover:opacity-90 cursor-pointer'
      }
    }).then((result) => {
      if (result.isConfirmed) {
        onConfirm();
      } else if (result.isDismissed && onCancel) {
        onCancel();
      }
    });
  }
};
