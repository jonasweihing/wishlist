'use client';

interface HeaderProps {
  title: string;
  subtitle?: string;
  imageUrl?: string;
  actions?: React.ReactNode;
  maxWidth?: 'max-w-5xl' | 'max-w-7xl';
}

export default function Header({ title, subtitle, imageUrl, actions, maxWidth = 'max-w-7xl' }: HeaderProps) {
  return (
    <>
      {/* Hero Section */}
      <div
        className="shadow-sm transition-colors duration-300 bg-[var(--header-bg-light)] dark:bg-[var(--header-bg-dark)]"
      >
        <div className={`${maxWidth} mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8`}>
          <div className="flex flex-col md:flex-row items-center md:items-stretch gap-8">
            {imageUrl && (
              <div className="md:w-64 flex-shrink-0">
                <img
                  src={imageUrl}
                  alt={title}
                  className="w-64 h-64 object-cover rounded-lg shadow-lg"
                />
              </div>
            )}
            <div className={`flex-1 flex flex-col ${imageUrl ? 'text-left items-start' : 'text-center items-center'}`}>
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-gray-900 mb-4">
                {title}
              </h1>
              {subtitle && (
                <p className={`text-xl sm:text-2xl text-gray-600 mb-6 ${imageUrl ? '' : 'max-w-3xl'}`}>
                  {subtitle}
                </p>
              )}
              {actions && (
                <div className={`mt-auto flex flex-col sm:flex-row items-center gap-3 ${imageUrl ? 'justify-start' : 'justify-center'}`}>
                  {actions}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
