import { useSelector } from "react-redux";
import CourseItem from "./CourseItem";

function CourseListView() {
  const {
    filteredItems: courses,
    loading,
    error,
    initialized,
    lastUpdated,
    activeCategory,
  } = useSelector((state) => state.courses);

  // Format last updated timestamp
  const formatLastUpdated = (timestamp) => {
    if (!timestamp) return "Belum pernah diperbarui";
    return new Date(timestamp).toLocaleString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Loading state
  if (loading && !initialized) {
    return (
      <div className="mx-6 md:mx-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-4">
          {[...Array(8)].map((_, index) => (
            <div key={index} className="animate-pulse">
              <div className="bg-gray-200 rounded-lg h-40 mb-4"></div>
              <div className="space-y-2">
                <div className="bg-gray-200 rounded h-4 w-3/4"></div>
                <div className="bg-gray-200 rounded h-3 w-1/2"></div>
                <div className="bg-gray-200 rounded h-3 w-full"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Error state
  if (error && initialized) {
    return (
      <div className="mx-6 md:mx-12">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <div className="text-red-500 text-4xl mb-3">⚠️</div>
          <h3 className="text-lg font-semibold text-red-800 mb-2">
            Gagal Memuat Courses
          </h3>
          <p className="text-red-600 mb-4">{error}</p>
        </div>
      </div>
    );
  }

  // Empty state
  if (courses.length === 0 && initialized) {
    return (
      <div className="mx-6 md:mx-12">
        <div className="text-center py-12 bg-white rounded-lg border-2 border-dashed border-gray-300">
          <div className="text-gray-400 text-6xl mb-4">📚</div>
          <h3 className="text-xl font-semibold text-text-dark-primary mb-2">
            Tidak Ada Course yang Tersedia
          </h3>
          <p className="text-text-dark-secondary mb-6">
            {activeCategory === "Semua Kelas"
              ? "Belum ada course yang ditambahkan. Mulai dengan menambahkan course pertama Anda!"
              : `Tidak ada course dalam kategori "${activeCategory}". Coba kategori lain atau tambahkan course baru.`}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-6 md:mx-12">
      {/* Statistics Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 p-4 bg-white rounded-lg shadow-sm">
        <div>
          <h2 className="font-poppins font-semibold text-xl text-text-dark-primary">
            {activeCategory === "Semua Kelas"
              ? "Semua Course"
              : `Kategori: ${activeCategory}`}
          </h2>
          <p className="font-DM-sans text-sm text-text-dark-secondary">
            Menampilkan {courses.length} course
            {lastUpdated &&
              ` • Terakhir diperbarui: ${formatLastUpdated(lastUpdated)}`}
          </p>
        </div>

        <div className="flex gap-4 mt-2 md:mt-0">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
            📊 {courses.length} Course
          </span>
        </div>
      </div>

      {/* Courses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {courses.map((course) => (
          <CourseItem key={course.id} course={course} />
        ))}
      </div>

      {/* Load More (for future pagination) */}
      {courses.length > 0 && (
        <div className="text-center mt-8">
          <p className="text-text-dark-secondary text-sm">
            Menampilkan semua {courses.length} course
          </p>
        </div>
      )}
    </div>
  );
}

export default CourseListView;
