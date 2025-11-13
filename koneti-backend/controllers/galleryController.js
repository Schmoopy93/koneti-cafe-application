import path from "path";
import Gallery from "../models/Gallery.js";
import cloudinary from "../middleware/cloudinary.js";
import translate from "@iamtraction/google-translate";

/* Get all gallery images */
export const getGalleryImages = async (req, res) => {
  try {
    const images = await Gallery.find().sort({ order: 1, createdAt: -1 });
    res.json(images);
  } catch (err) {
    console.error("Error fetching gallery images:", err);
    res.status(500).json({ message: err.message });
  }
};

/* Get gallery image by ID */
export const getGalleryImageById = async (req, res) => {
  try {
    const image = await Gallery.findById(req.params.id);
    if (!image) {
      return res.status(404).json({ message: "Gallery image not found." });
    }
    res.json(image);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* Create new gallery image */
export const createGalleryImage = async (req, res) => {
  try {
    const { title, description } = req.body;
    let imageUrl = "";
    let cloudinaryId = "";

    if (!req.file) {
      return res.status(400).json({ message: "Image is required." });
    }

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "gallery",
    });
    imageUrl = result.secure_url;
    cloudinaryId = result.public_id;

    // Clean up local file
    const fs = await import('fs');
    fs.unlink(req.file.path, (err) => {
      if (err) console.warn('Warning: failed to delete local file', err);
    });

    // Validation
    if (!title) {
      return res.status(400).json({ message: "Title is required." });
    }

    // Auto-translate title to English, excluding "Koneti"
    const titlePlaceholder = title.replace(/Koneti/gi, "__KONETI_PLACEHOLDER__");
    const titleTranslation = await translate(titlePlaceholder, { from: "sr", to: "en" });
    const titleEn = titleTranslation.text.replace(/__KONETI_PLACEHOLDER__/g, "Koneti");

    // Auto-translate description to English, excluding "Koneti"
    let descEn = "";
    if (description) {
      const descPlaceholder = description.replace(/Koneti/gi, "__KONETI_PLACEHOLDER__");
      const descTranslation = await translate(descPlaceholder, { from: "sr", to: "en" });
      descEn = descTranslation.text.replace(/__KONETI_PLACEHOLDER__/g, "Koneti");
    }

    // Get next order
    const lastImage = await Gallery.findOne().sort({ order: -1 });
    const nextOrder = lastImage ? lastImage.order + 1 : 1;

    const galleryImage = new Gallery({
      title: { sr: title, en: titleEn },
      description: { sr: description || "", en: descEn },
      image: imageUrl,
      cloudinary_id: cloudinaryId,
      order: nextOrder,
    });

    await galleryImage.save();
    res.status(201).json(galleryImage);
  } catch (err) {
    console.error("Error creating gallery image:", err);
    res.status(500).json({ message: err.message });
  }
};

/* Update gallery image */
export const updateGalleryImage = async (req, res) => {
  try {
    const image = await Gallery.findById(req.params.id);
    if (!image) {
      return res.status(404).json({ message: "Gallery image not found." });
    }

    const { title, description, order } = req.body;

    // Handle title translation, excluding "Koneti"
    if (title) {
      const titlePlaceholder = title.replace(/Koneti/gi, "__KONETI_PLACEHOLDER__");
      const titleTranslation = await translate(titlePlaceholder, { from: "sr", to: "en" });
      image.title = { sr: title, en: titleTranslation.text.replace(/__KONETI_PLACEHOLDER__/g, "Koneti") };
    }

    // Handle description translation, excluding "Koneti"
    if (description !== undefined) {
      if (description) {
        const descPlaceholder = description.replace(/Koneti/gi, "__KONETI_PLACEHOLDER__");
        const descTranslation = await translate(descPlaceholder, { from: "sr", to: "en" });
        image.description = { sr: description, en: descTranslation.text.replace(/__KONETI_PLACEHOLDER__/g, "Koneti") };
      } else {
        image.description = { sr: "", en: "" };
      }
    }

    if (order !== undefined) image.order = order;

    // Handle image update
    if (req.file) {
      // Delete old image from Cloudinary
      if (image.cloudinary_id) {
        try {
          await cloudinary.uploader.destroy(image.cloudinary_id);
        } catch (e) {
          console.warn("Warning: failed to delete old image from Cloudinary", e?.message || e);
        }
      }

      // Upload new image
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: 'gallery'
      });
      image.image = result.secure_url;
      image.cloudinary_id = result.public_id;

      // Clean up local file
      const fs = await import('fs');
      fs.unlink(req.file.path, (err) => {
        if (err) console.warn('Warning: failed to delete local file', err);
      });
    }

    await image.save();
    res.json(image);
  } catch (err) {
    console.error("Error updating gallery image:", err);
    res.status(500).json({ message: err.message });
  }
};

/* Delete gallery image */
export const deleteGalleryImage = async (req, res) => {
  try {
    const image = await Gallery.findById(req.params.id);
    if (!image) {
      return res.status(404).json({ message: "Gallery image not found." });
    }

    // Delete image from Cloudinary
    if (image.cloudinary_id) {
      try {
        await cloudinary.uploader.destroy(image.cloudinary_id);
      } catch (e) {
        console.warn("Warning: failed to delete image from Cloudinary", e?.message || e);
      }
    }

    await Gallery.deleteOne({ _id: image._id });
    res.json({ message: "Gallery image successfully deleted." });
  } catch (err) {
    console.error("Error deleting gallery image:", err);
    res.status(500).json({ message: err.message });
  }
};
