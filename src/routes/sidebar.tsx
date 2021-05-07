/**
 * These are used to render the Sidebar
 * You can include any link here, local or external.
 *
 * Actual Router routes, go to `routes/index.tsx`
 */
const routes = [
    {
      path: '/app/home', // the url
      icon: 'HiOutlineHome', // the component being exported from react-icons
      name: 'Home', // name displayed in Sidebar
    },
    {
      path: '/app/graphs',
      icon: 'HiOutlinePuzzle',
      name: 'My Graphs',
    },
    {
      path: '/app/templates',
      icon: 'HiOutlineDocumentText',
      name: 'Graph Templates',
    },
    {
      path: '/app/buy-glq',
      icon: 'HiOutlineShoppingCart',
      name: 'Buy GLQ',
    },
    {
      path: '/app/private-sale',
      icon: 'HiOutlineDatabase',
      name: 'Private Sale',
    },
  ]
  
  export default routes
  