
export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="w-full bg-white dark:bg-[#1f2028] text-[13px] text-gray-500 dark:text-gray-400 py-4 px-6 border-t border-gray-200 dark:border-[#2e303a] transition-colors duration-200">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-2">
        <div className="text-center sm:text-left">
          2020 - {currentYear} &copy;{' '}
          <a
            href="https://www.ekamaju.co.id/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[var(--primary)] hover:underline font-semibold transition-colors duration-200"
          >
            PT. Eka Maju Mesinindo
          </a>
        </div>
        <div className="hidden sm:block text-xs text-gray-400 dark:text-gray-500 font-medium">
          EMMA &bull; EMM Application
        </div>
      </div>
    </footer>
  )
}
