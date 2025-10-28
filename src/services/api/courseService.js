import axiosInstance from "./axiosConfig";
import { fallbackService } from "./fallbackService";

const API_ENDPOINT = "/courses";
const USE_MOCKAPI = true;

const DEFAULT_IMAGES = {
  course: "/images/default-course.jpg",
  avatar: "/images/default-avatar.png",
};

export const courseService = {
  async getCourses() {
    if (!USE_MOCKAPI) {
      return await fallbackService.getCourses();
    }

    try {
      const response = await axiosInstance.get(API_ENDPOINT);
      let courses = response.data;

      if (!courses || courses.length === 0) {
        courses = await fallbackService.getCourses();
      }

      return courses;
    } catch (error) {
      console.error("Error fetching from mockapi:", error);
      return await fallbackService.getCourses();
    }
  },

  async createCourse(courseData) {
    try {
      const newId = Date.now().toString();

      const dataToSend = {
        id: newId,
        title: courseData.title?.trim() || "Untitled Course",
        description: courseData.description?.trim() || "No description",
        instructor: {
          name: courseData.instructor?.name?.trim() || "Unknown Instructor",
          position: courseData.instructor?.position?.trim() || "Instructor",
          avatar: courseData.instructor?.avatar || DEFAULT_IMAGES.avatar,
        },
        image: courseData.image || DEFAULT_IMAGES.course,
        price: Number(courseData.price) || 0,
        rating: Number(courseData.rating) || 0,
        reviewCount: Number(courseData.reviewCount) || 0,
        category: courseData.category || "Bisnis",
        createdAt: new Date().toISOString(),
      };

      let newCourse;

      if (USE_MOCKAPI) {
        try {
          const response = await axiosInstance.post(API_ENDPOINT, dataToSend);
          newCourse = response.data;
        } catch (mockapiError) {
          console.error(
            "Mockapi failed, using fallback:",
            mockapiError.message
          );
          newCourse = await fallbackService.createCourse(dataToSend);
        }
      } else {
        newCourse = await fallbackService.createCourse(dataToSend);
      }

      return newCourse;
    } catch (error) {
      console.error("Error creating course:", error);
      throw error;
    }
  },

  async updateCourse(id, courseData) {
    try {
      let updatedCourse;

      if (USE_MOCKAPI) {
        try {
          const response = await axiosInstance.put(
            `${API_ENDPOINT}/${id}`,
            courseData
          );
          updatedCourse = response.data;
        } catch (mockapiError) {
          console.error(
            "Mockapi update failed, using fallback:",
            mockapiError.message
          );
          updatedCourse = await fallbackService.updateCourse(id, courseData);
        }
      } else {
        updatedCourse = await fallbackService.updateCourse(id, courseData);
      }

      return updatedCourse;
    } catch (error) {
      console.error("Error updating course:", error);
      throw error;
    }
  },

  async deleteCourse(id) {
    try {
      if (USE_MOCKAPI) {
        try {
          await axiosInstance.delete(`${API_ENDPOINT}/${id}`);
        } catch (mockapiError) {
          console.error(
            "Mockapi delete failed, using fallback:",
            mockapiError.message
          );
          await fallbackService.deleteCourse(id);
        }
      } else {
        await fallbackService.deleteCourse(id);
      }

      return id;
    } catch (error) {
      console.error("Error deleting course:", error);
      throw error;
    }
  },
};
