import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectCurrentToken } from '../store/selectors';
import { createBand } from '../api/bandService';

const CreateBandPage: React.FC = () => {
  const [bandName, setBandName] = useState('');
  const [description, setDescription] = useState('');
  const [logo, setLogo] = useState<File | null>(null);
  const [facebook, setFacebook] = useState('');
  const [instagram, setInstagram] = useState('');
  const [youtube, setYoutube] = useState('');
  const [twitter, setTwitter] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const token = useSelector(selectCurrentToken);

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setLogo(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bandName.trim()) {
      alert('Please enter a band name');
      return;
    }
    setIsLoading(true);
    try {
      if (!token) {
        throw new Error('No authentication token found');
      }
      const formData = new FormData();
      formData.append('title', bandName);
      if (description) formData.append('description', description);
      if (logo) formData.append('logo', logo);
      if (facebook) formData.append('facebook', facebook);
      if (instagram) formData.append('instagram', instagram);
      if (youtube) formData.append('youtube', youtube);
      if (twitter) formData.append('twitter', twitter);
      await createBand(formData, token);
      navigate('/dashboard');
    } catch (error: any) {
      console.error('Error creating band:', error);
      alert(`Failed to create band: ${error.message || 'Please try again.'}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '50px auto', padding: '20px' }}>
      <h2>Create Your Band</h2>
      <form onSubmit={handleSubmit} encType="multipart/form-data" style={{ marginTop: '20px' }}>
        <div style={{ marginBottom: '20px' }}>
          <label htmlFor="bandName" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
            Band Name:
          </label>
          <input
            type="text"
            id="bandName"
            value={bandName}
            onChange={(e) => setBandName(e.target.value)}
            placeholder="Enter your band name"
            style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '16px' }}
            required
          />
        </div>
        <div style={{ marginBottom: '20px' }}>
          <label htmlFor="description" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
            Description / Biography:
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Tell us about your band..."
            rows={4}
            style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '16px' }}
          />
        </div>
        <div style={{ marginBottom: '20px' }}>
          <label htmlFor="logo" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
            Band Logo:
          </label>
          <input
            type="file"
            id="logo"
            accept="image/*"
            onChange={handleLogoChange}
            style={{ fontSize: '16px' }}
          />
        </div>
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Social Media Links:</label>
          <input
            type="text"
            placeholder="Facebook URL"
            value={facebook}
            onChange={(e) => setFacebook(e.target.value)}
            style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '16px', marginBottom: '10px' }}
          />
          <input
            type="text"
            placeholder="Instagram URL"
            value={instagram}
            onChange={(e) => setInstagram(e.target.value)}
            style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '16px', marginBottom: '10px' }}
          />
          <input
            type="text"
            placeholder="YouTube URL"
            value={youtube}
            onChange={(e) => setYoutube(e.target.value)}
            style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '16px', marginBottom: '10px' }}
          />
          <input
            type="text"
            placeholder="Twitter URL"
            value={twitter}
            onChange={(e) => setTwitter(e.target.value)}
            style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '16px' }}
          />
        </div>
        <button
          type="submit"
          disabled={isLoading}
          style={{ backgroundColor: '#007bff', color: 'white', padding: '10px 20px', border: 'none', borderRadius: '4px', fontSize: '16px', cursor: isLoading ? 'not-allowed' : 'pointer', opacity: isLoading ? 0.6 : 1 }}
        >
          {isLoading ? 'Creating...' : 'Create Band'}
        </button>
      </form>
    </div>
  );
};

export default CreateBandPage; 