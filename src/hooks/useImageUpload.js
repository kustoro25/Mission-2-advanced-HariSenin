import { useState } from "react";

export const useImageUpload = (defaultImage = "/images/default-course.jpg") => {
  const [image, setImage] = useState(defaultImage);

  const resetImage = () => {
    setImage(defaultImage);
  };

  const setImageDirectly = (newImage) => {
    if (newImage) {
      setImage(newImage);
    } else {
      setImage(defaultImage);
    }
  };

  return {
    image,
    resetImage,
    setImage: setImageDirectly,
  };
};
