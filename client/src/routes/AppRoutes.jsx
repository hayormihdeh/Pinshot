import { Suspense, lazy } from 'react';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { Home, Explore } from '@pages';
import { Spinner } from '@utils'
//lazy loading in react / suspense in react
const Root = lazy(() => import('@layouts/Root'));

export default function AppRoutes() {
  const routes = [
    {
      path : "/",
      name:"Home",
      element:<Home />
    },
    
    {
      path : "explore",
      name:"Explore",
      element:<Explore />
    }
  ]

  const router = createBrowserRouter([
    {
      path: '/',
      element: (
        <Suspense fallback={<Spinner text = "PINSHOT" />}>
          <Root routes = { routes } />
        </Suspense>
      ),

      children : routes.map((route) => ({
        index : route.path === '/', 
        path: route.path === '/' ? undefined : route.path,
        element : route.element,
      }))
    },
  ]);
  return <RouterProvider router={router} />;
}
