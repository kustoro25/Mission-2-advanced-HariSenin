import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchCourses,
  addCourse,
  updateCourse,
  deleteCourse,
  setActiveCategory,
  clearError,
} from "../store/slices/coursesSlice";

export const useCourses = () => {
  const dispatch = useDispatch();
  const coursesState = useSelector((state) => state.courses);

  useEffect(() => {
    if (!coursesState.initialized) {
      dispatch(fetchCourses());
    }
  }, [dispatch, coursesState.initialized]);

  const handleAddCourse = async (courseData) => {
    try {
      const result = await dispatch(addCourse(courseData)).unwrap();
      return true;
    } catch (error) {
      console.error("Failed to add course:", error);
      return false;
    }
  };

  const handleUpdateCourse = async (id, courseData) => {
    try {
      const result = await dispatch(updateCourse({ id, courseData })).unwrap();
      return true;
    } catch (error) {
      console.error("Failed to update course:", error);
      return false;
    }
  };

  const handleDeleteCourse = async (id) => {
    try {
      await dispatch(deleteCourse(id)).unwrap();
      return true;
    } catch (error) {
      console.error("Failed to delete course:", error);
      return false;
    }
  };

  const handleCategoryChange = (category) => {
    dispatch(setActiveCategory(category));
  };

  const handleClearError = () => {
    dispatch(clearError());
  };

  return {
    courses: coursesState.items,
    filteredCourses: coursesState.filteredItems,
    categories: coursesState.categories,
    activeCategory: coursesState.activeCategory,
    loading: coursesState.loading,
    error: coursesState.error,
    addCourse: handleAddCourse,
    updateCourse: handleUpdateCourse,
    deleteCourse: handleDeleteCourse,
    setActiveCategory: handleCategoryChange,
    clearError: handleClearError,
    refetchCourses: () => dispatch(fetchCourses()),
  };
};
