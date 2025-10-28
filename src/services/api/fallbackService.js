const fallbackCourses = [
  {
    id: "1",
    title: "Big 4 Auditor Financial Analyst",
    description:
      "Mulai transformasi dengan instruktur profesional, harga yang terjangkau, dan materi yang komprehensif untuk menjadi financial analyst handal.",
    instructor: {
      name: "Jenna Ortega",
      position: "Senior Accountant",
      avatar: "/images/default-avatar.png",
    },
    image: "/images/default-course.jpg",
    price: 300000,
    rating: 3.5,
    reviewCount: 86,
    category: "Bisnis",
    createdAt: "2024-01-15T10:30:00Z",
  },
  {
    id: "2",
    title: "Digital Marketing Mastery",
    description:
      "Pelajari strategi digital marketing terbaru untuk meningkatkan bisnis Anda.",
    instructor: {
      name: "Alex Johnson",
      position: "Digital Marketing Expert",
      avatar: "/images/default-avatar.png",
    },
    image: "/images/default-course.jpg",
    price: 250000,
    rating: 4.2,
    reviewCount: 45,
    category: "Pemasaran",
    createdAt: "2024-02-01T14:20:00Z",
  },
];

let coursesData = [...fallbackCourses];

export const fallbackService = {
  async getCourses() {
    await new Promise((resolve) => setTimeout(resolve, 800));
    return coursesData;
  },

  async createCourse(courseData) {
    await new Promise((resolve) => setTimeout(resolve, 500));
    const newCourse = {
      ...courseData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    coursesData.push(newCourse);
    return newCourse;
  },

  async updateCourse(id, courseData) {
    await new Promise((resolve) => setTimeout(resolve, 500));
    const index = coursesData.findIndex((c) => c.id === id);
    if (index === -1) throw new Error("Course not found");

    coursesData[index] = {
      ...coursesData[index],
      ...courseData,
    };
    return coursesData[index];
  },

  async deleteCourse(id) {
    await new Promise((resolve) => setTimeout(resolve, 300));
    const index = coursesData.findIndex((c) => c.id === id);
    if (index === -1) throw new Error("Course not found");

    coursesData.splice(index, 1);
    return id;
  },
};
