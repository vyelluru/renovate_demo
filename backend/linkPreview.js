const linkPreview = async (similarUrl) => {
    const API_KEY = process.env.LINKPREVIEW_KEY; 
    const API_URL = 'https://api.linkpreview.net';
  
    const response = await fetch(`${API_URL}/?q=${encodeURIComponent(similarUrl)}`, {
    method: 'GET',
    headers: {
        'X-Linkpreview-Api-Key': API_KEY
    }
    });

    if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
};

module.exports = linkPreview;