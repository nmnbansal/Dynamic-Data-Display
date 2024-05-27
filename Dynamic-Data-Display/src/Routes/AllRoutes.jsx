import { Route, Routes } from 'react-router-dom'
import { ProductList } from '../Components/ProductList'
import { ProductDetails } from '../Components/ProductDetails'

const AllRoutes = () => {
  return (
    <Routes>
        <Route path="/" element={<ProductList />} />
        <Route path="/product/:id" element={<ProductDetails />} />
    </Routes>
  )
}

export default AllRoutes