import { useNavigate } from 'react-router-dom';
import React, { useState } from 'react';
import Select from 'react-select';
import "../App.css"
import { signOut } from 'firebase/auth';
import { auth } from "../firebase"

const Home = () => {
  const handleLogout = async () => {
    await signOut(auth);
    localStorage.removeItem('user')
    localStorage.removeItem('token')
    navigate("/login")
  }
  
  const [originalImageUrl, setOriginalImageUrl] = useState(null);
  const [editedImageUrl, setEditedImageUrl] = useState(null);

  const [prompt, setPrompt] = useState("");
  const [uploadedImage, setUploadedImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedStyle, setSelectedStyle] = useState(null);

  const [productImagesArray, setProductImagesArray] = useState([]);
  const [productWebsiteArray, setProductWebsiteArray] = useState([]);

  const user = JSON.parse(localStorage.getItem('user'));
  const navigate = useNavigate();

  const styleOptions = [
    { value: 'modern', label: 'Modern' },
    { value: 'minimalistic', label: 'Minimalist' },
    { value: 'abstract', label: 'Abstract' },
    { value: 'realistic', label: 'Realistic' },
  ];

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setUploadedImage(file);
      setOriginalImageUrl(URL.createObjectURL(file));
      setEditedImageUrl(null);
      setProductImagesArray([]);
      setProductWebsiteArray([]);
    }
  };

  const handleGenerateImage = async () => {
    if (!uploadedImage) {
      alert("Please upload an image first.");
      return;
    }

    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append('prompt', prompt + ". Style should look " + selectedStyle.value + ".");
      formData.append('image', uploadedImage);

      const response = await fetch('http://localhost:5000/generate-image', {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      setEditedImageUrl(data.imageUrl);
      setProductImagesArray(data.productArray)
      setProductWebsiteArray(data.productWebArray)
    } catch (error) {
      console.error('Error sending input to server:', error);
      alert('Failed to generate image. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="app-container">
      <h3>Welcome {user.displayName}</h3>
      <header className="app-header">
        <h1>Renovate.ai</h1>
      </header>
      <main className="app-main">
        <div className="input-section">
          <div className="file-input-container">
            <label htmlFor="file-upload" className="file-input-label">
              {uploadedImage ? "Change Image" : "Upload Image"}
            </label>
            <input
              id="file-upload"
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="file-input"
            />
          </div>
          <div className="style-select-container">
            <Select
              options={styleOptions}
              value={selectedStyle}
              onChange={setSelectedStyle}
              placeholder="Select a style..."
              className="style-select"
            />
          </div>
          <div className="prompt-input-container">
            <input
              className="prompt-input"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Enter your style prompt..."
            />
            <button
              onClick={handleGenerateImage}
              className="generate-button"
              disabled={isLoading || !uploadedImage}
            >
              {isLoading ? "Generating..." : "Generate Image"}
            </button>
          </div>
        </div>
        <div className="images-container">
          <div className="image-box original">
            <h2>Original Image</h2>
            <div className="image-container">
              {originalImageUrl ? (
                <img src={originalImageUrl} alt="Original" className="image" />
              ) : (
                <div className="placeholder">Upload an image</div>
              )}
            </div>
          </div>
          <div className="image-box edited">
            <h2>Edited Image</h2>
            <img src={productImagesArray[0]} />
            <a href={productWebsiteArray[0]}>Open Similar</a>
            <div className="image-container">
              {editedImageUrl ? (
                <img src={editedImageUrl} alt="Edited" className="image" />
              ) : isLoading ? (
                <div className="placeholder">Generating...</div>
              ) : (
                <div className="placeholder">Your edited image will appear here</div>
              )}
            </div>
          </div>
        </div>
      </main>
      <button onClick={handleLogout} className="logout-btn">Logout</button>
    </div>
  );
};
export default Home;