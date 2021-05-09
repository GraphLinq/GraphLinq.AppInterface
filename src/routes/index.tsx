import { lazy } from 'react'

const Home = lazy(() => import('../pages/Templates'))
const Graphs = lazy(() => import('../pages/Graphs'))
const PriceMonitoring = lazy(() => import('../pages/Home'))
const BuyGlq = lazy(() => import('../pages/BuyGlq'))
const Presale = lazy(() => import('../pages/Presale'))
const Page404 = lazy(() => import('../pages/404'))

/**
 * These are internal routes
 * They will be rendered using `containers/Layout`
 *
 * Links rendered in the SidebarContent go to `routes/sidebar.tsx`
 */
const routes = [
  {
    path: '/home', // the url
    component: Home, // view rendered
  },
  {
    path: '/graphs',
    component: Graphs,
  },
  {
    path: '/price-monitoring',
    component: PriceMonitoring,
  },
  {
    path: '/private-sale',
    component: Presale,
  },
  {
    path: '/buy-glq',
    component: BuyGlq,
  },
  {
    path: '/404',
    component: Page404,
  },
]

export default routes
