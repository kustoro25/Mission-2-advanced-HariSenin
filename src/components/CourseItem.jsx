import { useState } from "react";
import { useDispatch } from "react-redux";
import { deleteCourse } from "../store/slices/coursesSlice";
import CourseForm from "./CourseForm";

const CourseItem = ({ course }) => {
  const dispatch = useDispatch();
  const [showEditForm, setShowEditForm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (
      !window.confirm(
        `Apakah Anda yakin ingin menghapus course "${course.title}"?`
      )
    ) {
      return;
    }

    setIsDeleting(true);
    try {
      await dispatch(deleteCourse(course.id)).unwrap();
      console.log("✅ Course deleted successfully");
    } catch (error) {
      console.error("❌ Failed to delete course:", error);
      alert("Gagal menghapus course. Silakan coba lagi.");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleEdit = () => {
    setShowEditForm(true);
  };

  // Format price to IDR
  const formatPrice = (price) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  // Render stars for rating
  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(
          <span key={i} className="text-yellow-400 text-lg">
            ★
          </span>
        );
      } else if (i === fullStars + 1 && hasHalfStar) {
        stars.push(
          <span key={i} className="text-yellow-400 text-lg">
            ★
          </span>
        );
      } else {
        stars.push(
          <span key={i} className="text-gray-300 text-lg">
            ★
          </span>
        );
      }
    }
    return stars;
  };

  // Safe image component dengan error handling
  const SafeImage = ({
    src,
    alt,
    className,
    fallback = "/images/default-course.jpg",
  }) => {
    const [imgSrc, setImgSrc] = useState(src || fallback);
    const [hasError, setHasError] = useState(false);

    const handleError = () => {
      if (!hasError) {
        setHasError(true);
        setImgSrc(fallback);
      }
    };

    return (
      <img
        src={imgSrc}
        alt={alt}
        className={className}
        onError={handleError}
        loading="lazy"
      />
    );
  };

  return (
    <>
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300 group">
        {/* Course Image */}
        <div className="relative overflow-hidden">
          <SafeImage
            src={course.image}
            alt={course.title}
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute top-3 right-3">
            <span className="bg-main-primary text-white px-2 py-1 rounded-full text-xs font-medium">
              {course.category}
            </span>
          </div>
        </div>

        {/* Course Content */}
        <div className="p-4">
          {/* Title */}
          <h3 className="font-poppins font-semibold text-lg text-text-dark-primary mb-2 line-clamp-2 leading-tight">
            {course.title}
          </h3>

          {/* Description */}
          <p className="font-DM-sans text-sm text-text-dark-secondary mb-4 line-clamp-2 leading-relaxed">
            {course.description}
          </p>

          {/* Instructor Info */}
          <div className="flex items-center mb-4">
            <div className="w-10 h-10 rounded-full overflow-hidden mr-3 border-2 border-white shadow-sm">
              <SafeImage
                src={course.instructor.avatar}
                alt={course.instructor.name}
                className="w-full h-full object-cover"
                fallback="/images/default-avatar.png"
              />
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-DM-sans font-medium text-sm text-text-dark-primary truncate">
                {course.instructor.name}
              </div>
              <div className="font-DM-sans text-xs text-text-dark-secondary truncate">
                {course.instructor.position}
              </div>
            </div>
          </div>

          {/* Rating and Price */}
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
              <div className="flex">{renderStars(course.rating)}</div>
              <span className="font-DM-sans text-sm text-text-dark-secondary">
                {course.rating.toFixed(1)} ({course.reviewCount})
              </span>
            </div>
            <div className="font-poppins font-bold text-lg text-main-primary">
              {formatPrice(course.price)}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 pt-3 border-t border-gray-100">
            <button
              onClick={handleEdit}
              disabled={isDeleting}
              className="flex-1 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white font-DM-sans font-medium py-2 px-3 rounded-lg transition-colors duration-200 text-sm flex items-center justify-center gap-1"
            >
              <span>✏️</span>
              <span>Edit</span>
            </button>
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className="flex-1 bg-red-500 hover:bg-red-600 disabled:bg-gray-400 text-white font-DM-sans font-medium py-2 px-3 rounded-lg transition-colors duration-200 text-sm flex items-center justify-center gap-1"
            >
              {isDeleting ? (
                <>
                  <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white"></div>
                  <span>...</span>
                </>
              ) : (
                <>
                  <span>🗑️</span>
                  <span>Hapus</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Edit Form Modal */}
      {showEditForm && (
        <CourseForm
          mode="edit"
          course={course}
          onClose={() => setShowEditForm(false)}
        />
      )}
    </>
  );
};

export default CourseItem;
