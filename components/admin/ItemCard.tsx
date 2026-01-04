import { type Item } from '@/lib/api';

interface ItemCardProps {
  item: Item;
  onEdit: () => void;
  onDelete: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onUnclaim: () => void;
  isFirst: boolean;
  isLast: boolean;
}

export default function ItemCard({
  item,
  onEdit,
  onDelete,
  onMoveUp,
  onMoveDown,
  onUnclaim,
  isFirst,
  isLast,
}: ItemCardProps) {
  return (
    <div className={`bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700 overflow-hidden ${item.claimedAt ? 'bg-indigo-50 dark:bg-indigo-900/10 border-indigo-200 dark:border-indigo-800' : ''}`}>
      <div className="flex items-stretch">
        {/* Arrow buttons on the left */}
        <div className="flex flex-col w-12 border-r border-gray-200 dark:border-gray-700">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onMoveUp();
            }}
            disabled={isFirst}
            className="flex-1 flex items-center justify-center text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors border-b border-gray-200 dark:border-gray-700 cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
            title="Move up"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
            </svg>
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onMoveDown();
            }}
            disabled={isLast}
            className="flex-1 flex items-center justify-center text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
            title="Move down"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>
        <div className="flex-1 p-4 flex gap-3">
          {/* Image on Left */}
          {item.imageUrl && (
            <img
              src={item.imageUrl}
              alt={item.name}
              className="w-16 h-16 object-cover rounded border border-gray-200 dark:border-gray-600 flex-shrink-0"
            />
          )}
          <div className="flex-1">
            <h5 className="text-base font-semibold text-gray-900 dark:text-white">
              {item.name}
            </h5>
            {item.description && (
              <p className="text-base text-gray-600 dark:text-gray-400 mt-1">
                {item.description}
              </p>
            )}
            {item.price && (
              <p className="text-base text-gray-500 dark:text-gray-400 mt-1">
                ${item.price.toFixed(2)} {item.currency}
              </p>
            )}

            {/* Claim Info */}
            {item.claimedAt && (
              <div className="mt-3 p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded border border-indigo-200 dark:border-indigo-800 text-sm">
                <p className="text-indigo-900 dark:text-indigo-200 font-medium">
                  Claimed by: {item.claimedByName || 'Unknown'}
                </p>
                {item.claimedByNote && (
                  <p className="text-indigo-800 dark:text-indigo-300 italic mt-1">
                    &quot;{item.claimedByNote}&quot;
                  </p>
                )}
                <p className="text-indigo-700 dark:text-indigo-400 text-xs mt-1">
                  At: {new Date(item.claimedAt).toLocaleString()}
                </p>
                <button
                  onClick={onUnclaim}
                  className="mt-2 text-xs bg-white dark:bg-indigo-900 text-indigo-700 dark:text-indigo-200 border border-indigo-300 dark:border-indigo-700 px-2 py-1 rounded hover:bg-indigo-50 dark:hover:bg-indigo-800 transition-colors"
                >
                  Unclaim (Admin)
                </button>
              </div>
            )}
          </div>
        </div>
        <div className="flex flex-col w-16 border-l border-gray-200 dark:border-gray-700">
          <button
            onClick={onEdit}
            className="flex-1 flex items-center justify-center text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors border-b border-gray-200 dark:border-gray-700 cursor-pointer"
            title="Edit item"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
          <button
            onClick={onDelete}
            className="flex-1 flex items-center justify-center text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors cursor-pointer"
            title="Delete item"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
