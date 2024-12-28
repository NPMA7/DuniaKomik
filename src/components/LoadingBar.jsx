import { useEffect, useState } from 'react';

const LoadingBar = ({ loading }) => {
  return (
    <div className="loading-bar" style={{ width: loading ? '100%' : '0%' }}></div>
  );
};

export default LoadingBar; 