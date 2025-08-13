# Story Publisher Website

A simple, static website for publishing your short stories with chapters and illustrations.

## Features

- **Home Page**: Grid layout showing all published stories with cover images and descriptions
- **Chapter Navigation**: Easy navigation between chapters with previous/next buttons
- **Inline Illustrations**: Beautiful placement of images within your story text
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile devices
- **Simple Publishing**: Just create HTML files to publish new stories

## File Structure

```
book-publisher/
├── index.html              # Home page with story grid
├── styles.css              # All styling and responsive design
├── story-template.html     # Template for creating new stories
├── stories/                # Directory containing all story files
│   ├── story1.html         # Example story chapter 1
│   └── story1-chapter2.html # Example story chapter 2
├── images/                 # Directory for story covers and illustrations
└── README.md               # This file
```

## How to Publish a New Story

### 1. Create Story Files

Copy the `story-template.html` file and rename it for your story. For example:
- `stories/my-story-chapter1.html`
- `stories/my-story-chapter2.html`
- etc.

### 2. Edit the Template

Replace the placeholder text in your story file:
- `STORY_TITLE` → Your story's title
- `CHAPTER_NUMBER` → Current chapter number
- `CHAPTER_TITLE` → Chapter title
- `GENRE` → Story genre (Fantasy, Mystery, Sci-Fi, etc.)
- `TOTAL_CHAPTERS` → Total number of chapters in your story

### 3. Add Your Story Content

Write your story in the `<div class="chapter-content">` section. Use `<p>` tags for paragraphs.

### 4. Add Illustrations (Optional)

To add an illustration, use this structure:

```html
<div class="chapter-illustration">
    <img src="../images/your-image.jpg" alt="Description of the image">
    <div class="caption">Caption for your illustration</div>
</div>
```

**Important**: 
- Place your images in the `images/` folder
- Use `../images/` path since story files are in the `stories/` subfolder
- The `onerror="this.style.display='none'"` attribute will hide broken images gracefully

### 5. Set Up Chapter Navigation

Update the navigation buttons at the top and bottom of each chapter:
- **First chapter**: Previous button should have `class="disabled"`
- **Last chapter**: Next button should have `class="disabled"`
- **Middle chapters**: Both buttons should link to the correct chapters

### 6. Add to Home Page

Edit `index.html` to add your new story to the home page grid. Copy an existing story card and update:
- Story title and link
- Description
- Number of chapters
- Genre
- Cover image path

## Image Guidelines

### Cover Images
- **Size**: Recommended 400x600 pixels (3:2 ratio works well)
- **Format**: JPG or PNG
- **Placement**: `images/your-story-cover.jpg`

### Chapter Illustrations
- **Size**: Recommended max width 800px, height auto
- **Format**: JPG or PNG
- **Placement**: `images/your-illustration.jpg`

## Styling Features

The CSS automatically provides:
- Beautiful typography optimized for reading
- Responsive grid layout
- Hover effects on story cards
- Clean chapter navigation
- Proper spacing for illustrations
- Mobile-friendly design

## Customization

### Colors
Edit `styles.css` to change the color scheme:
- Header gradient: Lines 25-26
- Primary buttons: Line 150
- Text colors: Various color values throughout

### Typography
Change fonts by editing the `font-family` property in the `body` selector.

### Layout
Adjust the grid layout by modifying the `grid-template-columns` property in `.stories-grid`.

## Browser Compatibility

Works on all modern browsers:
- Chrome/Edge
- Firefox
- Safari
- Mobile browsers

## Publishing Workflow

1. Write your story content
2. Create HTML files using the template
3. Add any illustrations to the `images/` folder
4. Update the home page to include your new story
5. Test by opening `index.html` in a web browser
6. Upload all files to your web hosting service

## Tips for Great Story Presentation

- **Chapter Length**: Keep chapters reasonably sized for comfortable reading
- **Illustrations**: Use high-quality images that enhance the story
- **Navigation**: Always test chapter navigation to ensure it works correctly
- **Descriptions**: Write compelling descriptions for the home page
- **Consistency**: Use consistent naming conventions for your files

## Support

This is a simple HTML/CSS system, so if you need help:
1. Check that all file paths are correct
2. Ensure HTML syntax is valid
3. Verify image files exist and are properly named
4. Test in different browsers

Happy storytelling! 📚✨ 