// Update filenames here exactly as uploaded (case-sensitive)
const SECTIONS = {
  proposal: {
    title: "Our Proposal 💍",
    meta: "6 March 2022 — 10:30 AM (Thursday)",
    // story is an array — each element will be shown as a paragraph; between paragraphs we'll show slideshow images (configurable)
    storyParts: [
      "On 6th March 2022 at 10:30 AM, while playing truth-or-dare with friends, Puchu (Aditya) was pushed to speak his heart. He leaned close and whispered, \"I love you.\"",
      "Her friends nudged her as well — and she whispered, \"I love you.\" From that moment they became a pair.",
      "They met in Class 8, became close friends in Class 9 and then became partners in Class 10. They studied together, laughed together, and supported each other.",
      "After Class 10, they continued together into Class 11–12 (science stream) at Bishalgarh English Medium HS School, completed Class 12 in March 2024, then moved forward with college and careers while staying by each other's side."
    ],
    photosForSlideshow: ["1.jpg","2.jpg","3.jpg"], // these live in images/proposal/
    photosInline: ["1.jpg"], // photos to show between paragraphs (by filename)
    videos: []
  },

  school: {
    title: "School Life 🎓",
    meta: "Class 9 → Class 12 — science stream",
    storyParts: [
      "We studied together from Class 9 through Class 12, sharing notes, late-night study sessions and small celebrations after exams.",
      "Classmates became family — we helped each other in projects, practicals and board preparation."
    ],
    photosForSlideshow: ["school1.jpg","school2.jpg"], // upload to images/school/
    photosInline: [],
    videos: []
  },

  memories: {
    title: "Memories ❤️",
    meta: "Random days, trips and smiles",
    storyParts: [
      "This section holds small moments: college hangouts, travel snaps, and simple afternoons together.",
      "Each photo reminds us of a story, and every video is a little piece of our life together."
    ],
    photosForSlideshow: ["7.jpg","8.jpg"], // upload to images/memories/
    photosInline: [],
    videos: ["memclip1.mp4"] // optional - upload to videos/memories/
  }
};
