import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const Products = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { productImagesArray, productWebsiteArray } = location.state || { productImagesArray: [], productWebsiteArray: [] };

  // Function to navigate back to the home page
  const productsBack = () => {
    navigate("/");
  };

  return (
    <div className="products-container">
      <h2 className="products-title">Explore Similar</h2>
      {productImagesArray.length > 0 ? (
        <div className="products-grid">
          {productImagesArray.map((imageUrl, index) => (
            <div key={index} className="product-card">
              <img src={imageUrl} alt={`Product ${index}`} className="product-image" />
              <a
                href={productWebsiteArray[index]}
                target="_blank"
                rel="noopener noreferrer"
                className="product-link"
              >
                Open Link
              </a>
            </div>
          ))}
        </div>
      ) : (
        <p className="no-products">No products available. Please generate an image first.</p>
      )}
      <button onClick={productsBack} className="back-button">Back</button>
    </div>
  );
};

export default Products;
