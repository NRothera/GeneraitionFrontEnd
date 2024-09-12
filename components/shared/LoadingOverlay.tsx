import React from 'react';
import ClipLoader from 'react-spinners/ClipLoader';

type LoadingOverlayProps = {
    loading: boolean;
};

const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ loading }) => {
    if (!loading) return null;

    return (
        <div className="loading-overlay">
            <ClipLoader size={50} color={"#123abc"} loading={loading} />
        </div>
    );
};

export default LoadingOverlay;