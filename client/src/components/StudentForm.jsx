/**
 * StudentForm Component
 * ─────────────────────
 * A reusable, controlled form for both creating and editing students.
 *
 * Props:
 *   initialData — pre-fill values for edit mode (null = create mode)
 *   onSubmit    — callback(formData) when the form passes validation
 *   isLoading   — disables the submit button while saving
 *
 * REACT CONCEPTS:
 *   useState   — manages each input's value AND error messages.
 *   Closures   — handleChange captures the setFormData setter;
 *                handleSubmit captures validate + onSubmit.
 *
 *   Controlled component pattern:
 *      Every <input> has value={formData.field} and onChange={...}.
 *      React "owns" the input value — the DOM never diverges from state.
 *      This is critical for validation, formatting, and test-ability.
 */
import { useState, useRef } from "react";
import { validateStudentForm } from "../utils/helpers";
import { uploadImage } from "../services/studentService";
import Button from "./Button";

const StudentForm = ({ initialData = null, onSubmit, isLoading = false }) => {
  const isEditMode = !!initialData;

  // Form state — initialized with existing data or empty strings
  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    age: initialData?.age || "",
    course: initialData?.course || "",
    imageUrl: initialData?.imageUrl || "",
  });

  // Error state — field-level validation errors
  const [errors, setErrors] = useState({});

  // Image Upload State
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(initialData?.imageUrl || "");
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

  /**
   * handleChange
   * ────────────
   * A closure that reads the input's name attribute and updates
   * only that field in state, leaving others unchanged (spread).
   *
   * For age, it converts to a number (or empty string if cleared).
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "age" ? (value === "" ? "" : Number(value)) : value,
    }));

    // Clear the error for this field as the user types
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        setErrors((prev) => ({ ...prev, image: "Image must be under 5MB" }));
        return;
      }
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
      setErrors((prev) => ({ ...prev, image: null }));
    }
  };

  /**
   * handleSubmit
   * ────────────
   * 1. Prevents the default form submission (which would reload the page).
   * 2. Validates the form data with our utility function.
   * 3. If invalid, sets field-level errors — the render cycle will
   *    show error messages below each input.
   * 4. If valid, calls the parent's onSubmit callback.
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateStudentForm(formData);

    if (validationErrors) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    
    let finalImageUrl = formData.imageUrl;

    if (imageFile) {
      setIsUploading(true);
      try {
        const result = await uploadImage(imageFile);
        finalImageUrl = result.imageUrl;
      } catch (err) {
        setErrors({ image: "Failed to upload image. Please try again." });
        setIsUploading(false);
        return;
      }
      setIsUploading(false);
    }

    onSubmit({ ...formData, imageUrl: finalImageUrl });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6" noValidate>
      {/* ─── Name ─── */}
      <div>
        <label
          htmlFor="student-name"
          className="block text-sm font-medium text-text mb-2"
        >
          Full Name
        </label>
        <input
          id="student-name"
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="e.g. Chirag HM"
          className={`w-full px-4 py-3 rounded-lg bg-surface-light border text-text placeholder-text-muted text-sm focus:outline-none focus:ring-2 transition-all ${
            errors.name
              ? "border-danger focus:ring-danger/50"
              : "border-border focus:ring-primary/50 focus:border-primary"
          }`}
        />
        {errors.name && (
          <p className="mt-1.5 text-xs text-danger">{errors.name}</p>
        )}
      </div>

      {/* ─── Age ─── */}
      <div>
        <label
          htmlFor="student-age"
          className="block text-sm font-medium text-text mb-2"
        >
          Age
        </label>
        <input
          id="student-age"
          type="number"
          name="age"
          value={formData.age}
          onChange={handleChange}
          placeholder="e.g. 21"
          min="1"
          max="150"
          className={`w-full px-4 py-3 rounded-lg bg-surface-light border text-text placeholder-text-muted text-sm focus:outline-none focus:ring-2 transition-all ${
            errors.age
              ? "border-danger focus:ring-danger/50"
              : "border-border focus:ring-primary/50 focus:border-primary"
          }`}
        />
        {errors.age && (
          <p className="mt-1.5 text-xs text-danger">{errors.age}</p>
        )}
      </div>

      {/* ─── Course ─── */}
      <div>
        <label
          htmlFor="student-course"
          className="block text-sm font-medium text-text mb-2"
        >
          Course
        </label>
        <input
          id="student-course"
          type="text"
          name="course"
          value={formData.course}
          onChange={handleChange}
          placeholder="e.g. Database Management Systems"
          className={`w-full px-4 py-3 rounded-lg bg-surface-light border text-text placeholder-text-muted text-sm focus:outline-none focus:ring-2 transition-all ${
            errors.course
              ? "border-danger focus:ring-danger/50"
              : "border-border focus:ring-primary/50 focus:border-primary"
          }`}
        />
        {errors.course && (
          <p className="mt-1.5 text-xs text-danger">{errors.course}</p>
        )}
      </div>

      {/* ─── Profile Image ─── */}
      <div>
        <label className="block text-sm font-medium text-text mb-2">
          Profile Image
        </label>
        <div className="flex items-center gap-4">
          <div 
            className="w-16 h-16 rounded-full overflow-hidden bg-surface border border-border flex items-center justify-center cursor-pointer"
            onClick={() => fileInputRef.current?.click()}
          >
            {imagePreview ? (
              <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
            ) : (
              <span className="text-text-muted text-xs">Upload</span>
            )}
          </div>
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleImageChange}
            className="hidden"
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
          >
            Choose File
          </Button>
        </div>
        {errors.image && (
          <p className="mt-1.5 text-xs text-danger">{errors.image}</p>
        )}
      </div>

      {/* ─── Submit ─── */}
      <div className="flex items-center gap-3 pt-2">
        <Button
          type="submit"
          variant="primary"
          size="lg"
          disabled={isLoading || isUploading}
          className="flex-1 sm:flex-none"
        >
          {isLoading || isUploading
            ? "Saving..."
            : isEditMode
            ? "Update Student"
            : "Add Student"}
        </Button>
      </div>
    </form>
  );
};

export default StudentForm;
