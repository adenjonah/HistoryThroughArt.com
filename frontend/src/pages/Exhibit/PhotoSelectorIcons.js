import React from "react";

const PhotoSelectorIcons = ({ artImages, slideIndex, setSlideIndex, pushSlides }) => {
    return (
        <>
            {artImages.length > 1 && (
                <div className={"selection-buttons-wrapper"}>
                    <div className={"selection-buttons"}>
                        <button
                            className="w3-button w3-light-grey w3-ripple"
                            onClick={pushSlides(-1)}
                        >
                            &#10094;
                        </button>
                        <button
                            className="w3-button w3-light-grey w3-ripple"
                            onClick={pushSlides(1)}
                        >
                            &#10095;
                        </button>
                    </div>
                </div>
            )}
            {artImages.length > 1 && (
                <div className="w3-center w3-padding-top">
                    {artImages.map((imageName, index) => (
                        <span
                            key={index}
                            className={`w3-badge ${
                                slideIndex === index + 1 ? "w3-blue" : "w3-light-gray"
                            }`}
                            style={{
                                cursor: "pointer",
                                margin: "10px 5px",
                                width: "15px",
                                height: "15px",
                                lineHeight: "15px",
                            }}
                            onClick={() => setSlideIndex(index + 1)}
                        />
                    ))}
                </div>
            )}
        </>
    );
};

export default PhotoSelectorIcons;