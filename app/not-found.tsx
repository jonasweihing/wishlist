import Link from 'next/link';

export default function RootNotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 font-sans">
      <div className="max-w-md w-full text-center p-8 bg-white dark:bg-gray-800 rounded-lg shadow-xl">
        <div className="text-6xl font-bold text-gray-900 dark:text-gray-100 mb-4">404</div>
        <h1 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
          Seite nicht gefunden
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Die gesuchte Seite existiert nicht.
        </p>
        <Link
          href="/"
          className="inline-block px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg transition-colors"
        >
          Zur Startseite
        </Link>
      </div>
    </div>
  );
}
