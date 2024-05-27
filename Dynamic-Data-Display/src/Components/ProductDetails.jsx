import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import './ProductDetails.css'

function ProductDetails() {
    const { id } = useParams(); // Import useParams from 'react-router-dom'
  
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
  
    useEffect(() => {
      const fetchProduct = async () => {
        try {
          const res = await fetch(`https://fakestoreapi.com/products/${id}`);
          const data = await res.json();
          setProduct(data);
          setLoading(false);
        } catch (error) {
          console.error("Error fetching product:", error);
          setLoading(false);
        }
      };
      fetchProduct();
    }, [id]);
  
    if (loading) return "Loading...";
    if (!product) return "Product not found.";
  
    return (
      <div className="product-details-container">
        <h2 className="product-title">{product.title}</h2>
        <p className="product-category">Category: {product.category}</p>
        <p className="product-price">Price: ${product.price}</p>
        <p className="product-description">Description: {product.description}</p>
        <img className="product-image" src={product.image} alt={product.title} />
      </div>
    );
  }

  export {ProductDetails}