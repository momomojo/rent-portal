import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

export default function Breadcrumbs() {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);

  return (
    <nav aria-label="Breadcrumb">
      <ol className="flex items-center space-x-2 text-sm text-gray-500">
        <li>
          <Link
            to="/"
            className="hover:text-indigo-600 flex items-center"
            aria-label="Home"
          >
            <Home className="h-4 w-4" />
          </Link>
        </li>
        {pathnames.map((name, index) => {
          const routeTo = `/${pathnames.slice(0, index + 1).join('/')}`;
          const isLast = index === pathnames.length - 1;

          return (
            <li key={name} className="flex items-center">
              <ChevronRight className="h-4 w-4 mx-1" aria-hidden="true" />
              {isLast ? (
                <span className="text-gray-900 font-medium" aria-current="page">
                  {name.charAt(0).toUpperCase() + name.slice(1)}
                </span>
              ) : (
                <Link
                  to={routeTo}
                  className="hover:text-indigo-600"
                >
                  {name.charAt(0).toUpperCase() + name.slice(1)}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}