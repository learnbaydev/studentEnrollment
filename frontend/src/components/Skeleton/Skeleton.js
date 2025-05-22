import { useEffect, useState } from 'react';

export default function Skeleton() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return null;

  return (
    <div className="skeleton-container">
      {/* Header */}
      <div className="skeleton-item" style={{ height: '60px', marginBottom: '20px' }}></div>
      
      {/* Main Content */}
      <div style={{ display: 'flex', gap: '20px' }}>
        {/* Sidebar */}
        <div className="skeleton-item" style={{ width: '250px', height: '80vh' }}></div>
        
        {/* Content Area */}
        <div style={{ flex: 1 }}>
          {[...Array(5)].map((_, i) => (
            <div 
              key={i}
              className="skeleton-item"
              style={{ 
                height: '100px', 
                marginBottom: '15px',
                borderRadius: '4px'
              }}
            ></div>
          ))}
        </div>
      </div>
    </div>
  );
}