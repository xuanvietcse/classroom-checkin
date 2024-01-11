import React, { useEffect, useRef } from "react";

const PreviewImage = (props) => {

    const { url, handleVisiblePreview } = props;

    const previewRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (previewRef.current && !previewRef.current.contains(event.target)) {
                handleVisiblePreview(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    },[]);

    return (
        <div className="fixed w-screen h-screen top-0 left-0 bottom-0 right-0 bg-[rgb(89,89,89)] bg-opacity-90 flex justify-center items-center drop-shadow-2xl shadow-2xl z-[120]">
            <div ref={previewRef} className="w-2/5 h-fit bg-white relative rounded-lg">
                <img className="w-full rounded-md" src={url}/>
            </div>
        </div>
    );
};

export default PreviewImage;