const fs = require("fs");
const path = require("path");

// --- Configuration ---
const INPUT_FILE = "my-clippings.txt";
const OUTPUT_DIR = "markdown_notes";
const DELIMITER = "==========";

// Make these checks resilient to page/position variations
const HIGHLIGHT_KEYWORD_REGEX = new RegExp("Markierung|Highlight");
const NOTE_KEYWORD = "Notiz";

const MAX_HEADING_LEVEL = 6;
const DEFAULT_HEADING_LEVEL = 0;

// Characters to sanitize in filenames: includes standard illegal chars + user specified (/\:|#^[]), replaced by '_'
const ILLEGAL_FILENAME_CHARS = /[\/\\:\*\?\"<>\|#^\[\]]/g;

/**
 * Main function to coordinate the two-pass parsing and generation process.
 */
function parseClippings() {
  console.log(`Starting clipping parsing for: ${INPUT_FILE}`);

  // 1. Read the input file
  let clippingsContent;
  try {
    clippingsContent = fs.readFileSync(INPUT_FILE, "utf8");
  } catch (error) {
    console.error(
      `ERROR: Could not read file ${INPUT_FILE}. Make sure it exists in the current directory.`,
    );
    console.error(error.message);
    return;
  }

  // Prepare the output directory
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR);
    console.log(`Created output directory: ${OUTPUT_DIR}`);
  } else {
    console.log(`Using existing output directory: ${OUTPUT_DIR}`);
  }

  // Split the content into individual clipping blocks
  const clippingBlocks = clippingsContent
    .split(DELIMITER)
    .map((block) => block.trim())
    .filter((block) => block.length > 0);

  console.log(`Found ${clippingBlocks.length} clipping blocks to process.`);

  // Map to hold all structured data: Map<fileName, { title, author, lastTimestamp, blocks: [] }>
  const bookData = new Map();

  // --- Pass 1: Parse and Structure Data ---
  clippingBlocks.forEach((block, index) => {
    const parsedBlock = parseBlockData(block, index);
    if (!parsedBlock) return;

    const { fileName, bookTitle, authorFullName, timestamp, isNote, content } =
      parsedBlock;

    if (!bookData.has(fileName)) {
      bookData.set(fileName, {
        title: bookTitle,
        author: authorFullName,
        lastTimestamp: timestamp,
        blocks: [],
      });
    }

    const data = bookData.get(fileName);

    // Since the file is processed sequentially, this holds the most recent timestamp
    data.lastTimestamp = timestamp;

    data.blocks.push({
      isNote,
      content,
    });
  });

  // --- Pass 2: Generate Markdown Files ---
  generateMarkdownFiles(bookData);

  console.log("\n--- Parsing Complete ---");
  console.log(`Markdown files are saved in the '${OUTPUT_DIR}' directory.`);
}

async function getLastInteractionFromFile(fileName) {
  const file = await fs.readFileSync(fileName);
}

/**
 * Parses a single clipping block and extracts title, author, and timestamp.
 */
function parseBlockData(block, index) {
  const lines = block
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0);

  if (lines.length < 2) {
    return null;
  }

  // --- A. Parse Metadata (Title and Author) ---
  const titleAndAuthorLine = lines[0];
  // Captures: 1=Title, 2=Last Name, 3=First Name (optional)
  const match = titleAndAuthorLine.match(/(.*)\s\(([^,]+),?\s?([^)]*)\)/);

  if (!match) {
    console.warn(
      `WARN: Skipping block #${index + 1}. Could not parse title/author.`,
    );
    return null;
  }

  const bookTitle = match[1].trim();
  const authorLastName = match[2].trim();
  const authorFirstName = match[3].trim();
  const authorFullName = authorFirstName
    ? `${authorFirstName} ${authorLastName}`
    : authorLastName;

  // --- FILENAME SANITIZATION ---
  const rawFileName = `${authorLastName}-${bookTitle}.md`;
  const fileName = rawFileName.replace(ILLEGAL_FILENAME_CHARS, "_");
  // ---------------------------

  // --- B. Determine Clipping Type and Content & Extract Timestamp ---
  const metadataLine = lines[1];
  let content = lines.slice(2).join("\n").trim();

  // Timestamp extraction
  const timestampMatch = metadataLine.match(
    /(Hinzugefügt am|Added on) (.*)$/gi,
  );
  let timestamp = "N/A";
  if (timestampMatch[0]?.split(", ")?.length) {
    const rawTimestamp = timestampMatch[0]?.split(", ")[1].trim();
    const translatedTimestamp = translateGermanDate(rawTimestamp);

    timestamp = new Date(translatedTimestamp).toISOString();
  }

  let isNote = false;

  // Robust check using includes for Markierung or Notiz
  if (metadataLine.includes(NOTE_KEYWORD)) {
    isNote = true;
  } else if (!HIGHLIGHT_KEYWORD_REGEX.test(metadataLine)) {
    console.warn(`WARN: Skipping block #${index + 1}. Unknown clipping type.`);
    return null;
  }

  return {
    fileName,
    bookTitle,
    authorFullName,
    timestamp,
    isNote,
    content,
  };
}

/**
 * Generates the final Markdown files using the structured data.
 */
function generateMarkdownFiles(bookData) {
  console.log(`\n--- Pass 2: Generating ${bookData.size} Markdown Files ---`);

  bookData.forEach((data, fileName) => {
    let markdownBody = "";
    let currentLevel = DEFAULT_HEADING_LEVEL;
    const filePath = path.join(OUTPUT_DIR, fileName);

    // 1. Generate YAML Front Matter
    // Escape quotes within title/author strings for valid YAML
    const frontMatter = `---
title: "${data.title.replace(/"/g, '\\"')}"
author: "${data.author.replace(/"/g, '\\"')}"
last_interaction: "${data.lastTimestamp}"
---
\n`;

    // 2. Process blocks to build the Markdown body
    data.blocks.forEach((block) => {
      if (block.isNote && block.content.length > 2) {
        console.log(block.isNote);
        console.log(block.content);
        console.log(block.content.length);
        // this is a note with text from me
        markdownBody += `\n> ${block.content}\n`;
      } else if (block.isNote) {
        // This is a Comment/Note for Hierarchy
        const firstChar = block.content.charAt(0);
        const headingLevel = parseInt(firstChar);

        if (
          !isNaN(headingLevel) &&
          headingLevel >= 1 &&
          headingLevel <= MAX_HEADING_LEVEL
        ) {
          currentLevel = headingLevel;
        }
      } else {
        // This is a Highlight
        let content = block.content;

        if (currentLevel >= 1 && currentLevel <= MAX_HEADING_LEVEL) {
          // Render as a Markdown Heading (H1-H6)
          const headingPrefix = "#".repeat(currentLevel);
          markdownBody += `\n${headingPrefix} ${content}\n`;
        } else {
          // Render as a Blockquote (Default Level 0)
          const blockquoteContent = content
            .split("\n")
            .map((line) => `${line}`)
            .join("\n");
          markdownBody += `\n${blockquoteContent}\n`;
        }

        // Reset the hierarchy level
        currentLevel = DEFAULT_HEADING_LEVEL;
      }
    });

    // 3. Write the final content (Resets the file contents)
    fs.writeFileSync(filePath, frontMatter + markdownBody, "utf8");
    console.log(`- Successfully wrote: ${fileName}`);
  });
}

/**
 * Translates German month names in a string to English.
 * Supports both full names (Januar) and short forms (Jan).
 */
function translateGermanDate(dateString) {
  const monthMap = {
    januar: "January",
    februar: "February",
    märz: "March",
    april: "April",
    mai: "May",
    juni: "June",
    juli: "July",
    august: "August",
    september: "September",
    oktober: "October",
    november: "November",
    dezember: "December",
  };

  // Create a regex pattern from the keys (e.g., /januar|februar|.../gi)
  const pattern = new RegExp(Object.keys(monthMap).join("|"), "gi");

  // Replace the German month with the English one
  const translated = dateString.replace(pattern, (matched) => {
    return monthMap[matched.toLowerCase()];
  });

  return translated;
}

// --- Run the script ---
parseClippings();
