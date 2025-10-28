import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { courseService } from "../../services/api/courseService";

// Async thunks untuk API operations
export const fetchCourses = createAsyncThunk(
  "courses/fetchCourses",
  async (_, { rejectWithValue }) => {
    try {
      const courses = await courseService.getCourses();
      return courses;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const addCourse = createAsyncThunk(
  "courses/addCourse",
  async (courseData, { rejectWithValue }) => {
    try {
      const newCourse = await courseService.createCourse(courseData);
      return newCourse;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateCourse = createAsyncThunk(
  "courses/updateCourse",
  async ({ id, courseData }, { rejectWithValue }) => {
    try {
      const updatedCourse = await courseService.updateCourse(id, courseData);
      return updatedCourse;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteCourse = createAsyncThunk(
  "courses/deleteCourse",
  async (id, { rejectWithValue }) => {
    try {
      await courseService.deleteCourse(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const coursesSlice = createSlice({
  name: "courses",
  initialState: {
    items: [],
    filteredItems: [],
    categories: [
      "Semua Kelas",
      "Bisnis",
      "Pemasaran",
      "Desain",
      "Pengembangan Diri",
      "Teknologi",
    ],
    activeCategory: "Semua Kelas",
    loading: false,
    error: null,
    initialized: false,
  },
  reducers: {
    setActiveCategory: (state, action) => {
      state.activeCategory = action.payload;
      if (action.payload === "Semua Kelas") {
        state.filteredItems = state.items;
      } else {
        state.filteredItems = state.items.filter(
          (course) => course.category === action.payload
        );
      }
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Courses
      .addCase(fetchCourses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCourses.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
        state.filteredItems = action.payload;
        state.initialized = true;
      })
      .addCase(fetchCourses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Add Course
      .addCase(addCourse.fulfilled, (state, action) => {
        state.items.unshift(action.payload);
        if (
          state.activeCategory === "Semua Kelas" ||
          action.payload.category === state.activeCategory
        ) {
          state.filteredItems.unshift(action.payload);
        }
      })
      // Update Course
      .addCase(updateCourse.fulfilled, (state, action) => {
        const index = state.items.findIndex(
          (course) => course.id === action.payload.id
        );
        if (index !== -1) {
          state.items[index] = action.payload;
          const filteredIndex = state.filteredItems.findIndex(
            (course) => course.id === action.payload.id
          );
          if (filteredIndex !== -1) {
            state.filteredItems[filteredIndex] = action.payload;
          }
        }
      })
      // Delete Course
      .addCase(deleteCourse.fulfilled, (state, action) => {
        state.items = state.items.filter(
          (course) => course.id !== action.payload
        );
        state.filteredItems = state.filteredItems.filter(
          (course) => course.id !== action.payload
        );
      });
  },
});

export const { setActiveCategory, clearError } = coursesSlice.actions;
export default coursesSlice.reducer;
