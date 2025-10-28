import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addCourse, updateCourse } from "../store/slices/coursesSlice";
import { useImageUpload } from "../hooks/useImageUpload";

const CourseForm = ({ mode, course, onClose }) => {
  const dispatch = useDispatch();
  const { operationStatus } = useSelector((state) => state.courses);

  const categories = [
    "Bisnis",
    "Pemasaran",
    "Desain",
    "Pengembangan Diri",
    "Teknologi",
    "Keuangan",
  ];

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    instructor: {
      name: "",
      position: "",
      avatar: "/images/default-avatar.png",
    },
    image: "/images/default-course.jpg",
    price: 0,
    rating: 0,
    reviewCount: 0,
    category: "Bisnis",
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Image upload hooks
  const courseImage = useImageUpload("/images/default-course.jpg");
  const avatarImage = useImageUpload("/images/default-avatar.png");

  // Initialize form data for edit mode
  useEffect(() => {
    if (mode === "edit" && course) {
      setFormData({
        title: course.title || "",
        description: course.description || "",
        instructor: {
          name: course.instructor?.name || "",
          position: course.instructor?.position || "",
          avatar: course.instructor?.avatar || "/images/default-avatar.png",
        },
        image: course.image || "/images/default-course.jpg",
        price: course.price || 0,
        rating: course.rating || 0,
        reviewCount: course.reviewCount || 0,
        category: course.category || "Bisnis",
      });

      courseImage.setImage(course.image || "/images/default-course.jpg");
      avatarImage.setImage(
        course.instructor?.avatar || "/images/default-avatar.png"
      );
    }
  }, [mode, course]);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name.startsWith("instructor.")) {
      const instructorField = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        instructor: {
          ...prev.instructor,
          [instructorField]: value,
        },
      }));

      // Clear error when user types
      if (errors[`instructor.${instructorField}`]) {
        setErrors((prev) => ({
          ...prev,
          [`instructor.${instructorField}`]: "",
        }));
      }
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]:
          name === "price" || name === "rating" || name === "reviewCount"
            ? Number(value)
            : value,
      }));

      // Clear error when user types
      if (errors[name]) {
        setErrors((prev) => ({ ...prev, [name]: "" }));
      }
    }
  };

  // Handle image URL changes
  const handleCourseImageChange = (url) => {
    courseImage.handleImageUrlChange(url);
    setFormData((prev) => ({ ...prev, image: url }));
    if (errors.image) setErrors((prev) => ({ ...prev, image: "" }));
  };

  const handleAvatarImageChange = (url) => {
    avatarImage.handleImageUrlChange(url);
    setFormData((prev) => ({
      ...prev,
      instructor: { ...prev.instructor, avatar: url },
    }));
    if (errors["instructor.avatar"]) {
      setErrors((prev) => ({ ...prev, ["instructor.avatar"]: "" }));
    }
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = "Judul course harus diisi";
    } else if (formData.title.trim().length < 5) {
      newErrors.title = "Judul course minimal 5 karakter";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Deskripsi course harus diisi";
    } else if (formData.description.trim().length < 10) {
      newErrors.description = "Deskripsi course minimal 10 karakter";
    }

    if (!formData.instructor.name.trim()) {
      newErrors["instructor.name"] = "Nama instruktur harus diisi";
    }

    if (!formData.instructor.position.trim()) {
      newErrors["instructor.position"] = "Posisi instruktur harus diisi";
    }

    if (formData.price < 0) {
      newErrors.price = "Harga tidak boleh negatif";
    }

    if (formData.rating < 0 || formData.rating > 5) {
      newErrors.rating = "Rating harus antara 0-5";
    }

    if (formData.reviewCount < 0) {
      newErrors.reviewCount = "Jumlah review tidak boleh negatif";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const finalData = {
        ...formData,
        image: courseImage.image,
        instructor: {
          ...formData.instructor,
          avatar: avatarImage.image,
        },
      };

      if (mode === "add") {
        await dispatch(addCourse(finalData)).unwrap();
        console.log("✅ Course added successfully");
      } else {
        await dispatch(
          updateCourse({ id: course.id, courseData: finalData })
        ).unwrap();
        console.log("✅ Course updated successfully");
      }

      onClose();
    } catch (error) {
      console.error(`❌ Failed to ${mode} course:`, error);
      alert(
        `Gagal ${
          mode === "add" ? "menambah" : "mengupdate"
        } course. Silakan coba lagi.`
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const isProcessing =
    isSubmitting ||
    (mode === "add" ? operationStatus.isAdding : operationStatus.isUpdating);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200 bg-white sticky top-0 z-10">
          <h2 className="font-poppins font-semibold text-2xl text-text-dark-primary">
            {mode === "add"
              ? "Tambah Course Baru"
              : `Edit Course: ${course?.title}`}
          </h2>
          <button
            onClick={onClose}
            disabled={isProcessing}
            className="text-gray-400 hover:text-gray-600 text-2xl font-bold disabled:opacity-50"
          >
            ×
          </button>
        </div>

        {/* Form Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left Column - Basic Info */}
              <div className="space-y-6">
                {/* Course Title */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 font-DM-sans">
                    Judul Course *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    disabled={isProcessing}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 font-DM-sans ${
                      errors.title
                        ? "border-red-500 focus:ring-red-500"
                        : "border-gray-300 focus:ring-main-primary"
                    } ${isProcessing ? "bg-gray-100" : ""}`}
                    placeholder="Masukkan judul course yang menarik"
                  />
                  {errors.title && (
                    <p className="mt-1 text-sm text-red-600 font-DM-sans">
                      {errors.title}
                    </p>
                  )}
                </div>

                {/* Course Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 font-DM-sans">
                    Deskripsi Course *
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    disabled={isProcessing}
                    rows="4"
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 font-DM-sans ${
                      errors.description
                        ? "border-red-500 focus:ring-red-500"
                        : "border-gray-300 focus:ring-main-primary"
                    } ${isProcessing ? "bg-gray-100" : ""}`}
                    placeholder="Jelaskan tentang course ini secara detail..."
                  />
                  {errors.description && (
                    <p className="mt-1 text-sm text-red-600 font-DM-sans">
                      {errors.description}
                    </p>
                  )}
                </div>

                {/* Course Image */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 font-DM-sans">
                    URL Gambar Course
                  </label>
                  <input
                    type="url"
                    value={courseImage.image}
                    onChange={(e) => handleCourseImageChange(e.target.value)}
                    disabled={isProcessing}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 font-DM-sans ${
                      courseImage.error
                        ? "border-red-500 focus:ring-red-500"
                        : "border-gray-300 focus:ring-main-primary"
                    } ${isProcessing ? "bg-gray-100" : ""}`}
                    placeholder="https://example.com/image.jpg"
                  />
                  {courseImage.error && (
                    <p className="mt-1 text-sm text-red-600 font-DM-sans">
                      {courseImage.error}
                    </p>
                  )}
                  {courseImage.uploading && (
                    <p className="mt-1 text-sm text-blue-600 font-DM-sans">
                      Memuat gambar...
                    </p>
                  )}
                  {/* Image Preview */}
                  <div className="mt-2">
                    <p className="text-sm text-gray-600 mb-2 font-DM-sans">
                      Preview:
                    </p>
                    <div className="w-32 h-32 rounded-lg overflow-hidden border">
                      <img
                        src={courseImage.image}
                        alt="Course preview"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.src = "/images/default-course.jpg";
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column - Details */}
              <div className="space-y-6">
                {/* Instructor Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 font-DM-sans">
                      Nama Instruktur *
                    </label>
                    <input
                      type="text"
                      name="instructor.name"
                      value={formData.instructor.name}
                      onChange={handleInputChange}
                      disabled={isProcessing}
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 font-DM-sans ${
                        errors["instructor.name"]
                          ? "border-red-500 focus:ring-red-500"
                          : "border-gray-300 focus:ring-main-primary"
                      } ${isProcessing ? "bg-gray-100" : ""}`}
                      placeholder="Nama lengkap instruktur"
                    />
                    {errors["instructor.name"] && (
                      <p className="mt-1 text-sm text-red-600 font-DM-sans">
                        {errors["instructor.name"]}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 font-DM-sans">
                      Posisi Instruktur *
                    </label>
                    <input
                      type="text"
                      name="instructor.position"
                      value={formData.instructor.position}
                      onChange={handleInputChange}
                      disabled={isProcessing}
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 font-DM-sans ${
                        errors["instructor.position"]
                          ? "border-red-500 focus:ring-red-500"
                          : "border-gray-300 focus:ring-main-primary"
                      } ${isProcessing ? "bg-gray-100" : ""}`}
                      placeholder="Posisi/jabatan instruktur"
                    />
                    {errors["instructor.position"] && (
                      <p className="mt-1 text-sm text-red-600 font-DM-sans">
                        {errors["instructor.position"]}
                      </p>
                    )}
                  </div>
                </div>

                {/* Instructor Avatar */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 font-DM-sans">
                    URL Foto Instruktur
                  </label>
                  <input
                    type="url"
                    value={avatarImage.image}
                    onChange={(e) => handleAvatarImageChange(e.target.value)}
                    disabled={isProcessing}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 font-DM-sans ${
                      avatarImage.error
                        ? "border-red-500 focus:ring-red-500"
                        : "border-gray-300 focus:ring-main-primary"
                    } ${isProcessing ? "bg-gray-100" : ""}`}
                    placeholder="https://example.com/avatar.jpg"
                  />
                  {avatarImage.error && (
                    <p className="mt-1 text-sm text-red-600 font-DM-sans">
                      {avatarImage.error}
                    </p>
                  )}
                  {avatarImage.uploading && (
                    <p className="mt-1 text-sm text-blue-600 font-DM-sans">
                      Memuat avatar...
                    </p>
                  )}
                  {/* Avatar Preview */}
                  <div className="mt-2">
                    <p className="text-sm text-gray-600 mb-2 font-DM-sans">
                      Preview:
                    </p>
                    <div className="w-16 h-16 rounded-full overflow-hidden border">
                      <img
                        src={avatarImage.image}
                        alt="Instructor avatar"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.src = "/images/default-avatar.png";
                        }}
                      />
                    </div>
                  </div>
                </div>

                {/* Price, Rating, Review Count */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 font-DM-sans">
                      Harga (IDR) *
                    </label>
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleInputChange}
                      disabled={isProcessing}
                      min="0"
                      step="1000"
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 font-DM-sans ${
                        errors.price
                          ? "border-red-500 focus:ring-red-500"
                          : "border-gray-300 focus:ring-main-primary"
                      } ${isProcessing ? "bg-gray-100" : ""}`}
                    />
                    {errors.price && (
                      <p className="mt-1 text-sm text-red-600 font-DM-sans">
                        {errors.price}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 font-DM-sans">
                      Rating (0-5) *
                    </label>
                    <input
                      type="number"
                      name="rating"
                      value={formData.rating}
                      onChange={handleInputChange}
                      disabled={isProcessing}
                      min="0"
                      max="5"
                      step="0.1"
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 font-DM-sans ${
                        errors.rating
                          ? "border-red-500 focus:ring-red-500"
                          : "border-gray-300 focus:ring-main-primary"
                      } ${isProcessing ? "bg-gray-100" : ""}`}
                    />
                    {errors.rating && (
                      <p className="mt-1 text-sm text-red-600 font-DM-sans">
                        {errors.rating}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 font-DM-sans">
                      Jumlah Review *
                    </label>
                    <input
                      type="number"
                      name="reviewCount"
                      value={formData.reviewCount}
                      onChange={handleInputChange}
                      disabled={isProcessing}
                      min="0"
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 font-DM-sans ${
                        errors.reviewCount
                          ? "border-red-500 focus:ring-red-500"
                          : "border-gray-300 focus:ring-main-primary"
                      } ${isProcessing ? "bg-gray-100" : ""}`}
                    />
                    {errors.reviewCount && (
                      <p className="mt-1 text-sm text-red-600 font-DM-sans">
                        {errors.reviewCount}
                      </p>
                    )}
                  </div>
                </div>

                {/* Category */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 font-DM-sans">
                    Kategori *
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    disabled={isProcessing}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-main-primary font-DM-sans"
                  >
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 pt-6 border-t border-gray-200">
              <button
                type="submit"
                disabled={isProcessing}
                className="flex-1 bg-main-primary hover:bg-green-600 disabled:bg-gray-400 text-white font-DM-sans font-medium py-3 px-6 rounded-lg transition-all duration-200 flex items-center justify-center gap-2"
              >
                {isProcessing ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>
                      {mode === "add" ? "Menambahkan..." : "Mengupdate..."}
                    </span>
                  </>
                ) : (
                  <>
                    <span>✅</span>
                    <span>
                      {mode === "add" ? "Simpan Course" : "Update Course"}
                    </span>
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={onClose}
                disabled={isProcessing}
                className="flex-1 bg-gray-500 hover:bg-gray-600 disabled:bg-gray-400 text-white font-DM-sans font-medium py-3 px-6 rounded-lg transition-colors duration-200"
              >
                ❌ Batal
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CourseForm;
