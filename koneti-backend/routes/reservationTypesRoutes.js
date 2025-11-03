import express from "express";

const router = express.Router();

// Get available reservation types and subtypes
router.get("/types", (req, res) => {
  res.json({
    success: true,
    data: {
      biznis: {
        name: "Biznis događaj",
        subtypes: [
          { value: "basic", name: "Basic - Osnovno poslovno okupljanje" },
          { value: "vip", name: "VIP - Premium poslovno okupljanje" }
        ]
      },
      koneti: {
        name: "Koneti događaj", 
        subtypes: [
          { value: "basic", name: "Basic - Osnovno okupljanje" },
          { value: "premium", name: "Premium - Prošireno okupljanje" },
          { value: "vip", name: "VIP - Ekskluzivno okupljanje" }
        ]
      }
    }
  });
});

export default router;