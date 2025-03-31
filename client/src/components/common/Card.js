// client/src/components/common/Card.js
const Card = ({ children, className = '', title, actions }) => {
    return (
      <div className={`bg-white rounded-lg shadow-md overflow-hidden ${className}`}>
        {(title || actions) && (
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <h3 className="text-lg font-medium text-gray-900">{title}</h3>
            {actions && <div className="flex space-x-2">{actions}</div>}
          </div>
        )}
        <div className="p-6">
          {children}
        </div>
      </div>
    );
  };
  
  export default Card;