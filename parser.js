const fs = require('fs');
const path = require('path');

// --- Configuration ---
const INPUT_FILE = 'my-clippings.txt';
const OUTPUT_DIR = 'markdown_notes';
const DELIMITER = '==========';
const HIGHLIGHT_PREFIX = '- Ihre Markierung bei Position';
const NOTE_PREFIX = '- Ihre Notiz bei Position';
const MAX_HEADING_LEVEL = 6;
// Level 0 signifies standard paragraph/blockquote text (not a heading)
const DEFAULT_HEADING_LEVEL = 0; 

/**
 * Main function to coordinate the two-pass parsing and generation process.
 */
function parseClippings() {
    console.log(`Starting clipping parsing for: ${INPUT_FILE}`);

    // 1. Read the input file
    let clippingsContent;
    try {
        clippingsContent = fs.readFileSync(INPUT_FILE, 'utf8');
    } catch (error) {
        console.error(`ERROR: Could not read file ${INPUT_FILE}. Make sure it exists in the current directory.`);
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
    const clippingBlocks = clippingsContent.split(DELIMITER)
        .map(block => block.trim())
        .filter(block => block.length > 0);

    console.log(`Found ${clippingBlocks.length} clipping blocks to process.`);

    // Map to hold all structured data: Map<fileName, { title, author, lastTimestamp, blocks: [] }>
    const bookData = new Map(); 

    // --- Pass 1: Parse and Structure Data ---
    clippingBlocks.forEach((block, index) => {
        const parsedBlock = parseBlockData(block, index);
        if (!parsedBlock) return;

        const { fileName, bookTitle, authorFullName, timestamp, isNote, content } = parsedBlock;
        
        if (!bookData.has(fileName)) {
            bookData.set(fileName, {
                title: bookTitle,
                author: authorFullName,
                // Assume the first timestamp is the last until a later one is found
                lastTimestamp: timestamp, 
                blocks: []
            });
        }
        
        const data = bookData.get(fileName);
        
        // Since the file is processed sequentially, this will always hold the most recent timestamp seen so far
        data.lastTimestamp = timestamp; 

        data.blocks.push({
            isNote,
            content
        });
    });

    // --- Pass 2: Generate Markdown Files ---
    generateMarkdownFiles(bookData);

    console.log('\n--- Parsing Complete ---');
    console.log(`Markdown files are saved in the '${OUTPUT_DIR}' directory.`);
}

/**
 * Parses a single clipping block and extracts title, author, and timestamp.
 */
function parseBlockData(block, index) {
    const lines = block.split('\n').map(line => line.trim()).filter(line => line.length > 0);

    if (lines.length < 2) {
        return null; 
    }

    // --- A. Parse Metadata (Title and Author) ---
    const titleAndAuthorLine = lines[0];
    // Captures: 1=Title, 2=Last Name, 3=First Name (optional)
    const match = titleAndAuthorLine.match(/(.*)\s\(([^,]+),?\s?([^)]*)\)/); 

    if (!match) {
        console.warn(`WARN: Skipping block #${index + 1}. Could not parse title/author.`);
        return null;
    }

    const bookTitle = match[1].trim();
    const authorLastName = match[2].trim();
    const authorFirstName = match[3].trim();
    // Combine names for full author name (e.g., "Julie Zhuo")
    const authorFullName = authorFirstName ? `${authorFirstName} ${authorLastName}` : authorLastName;

    const fileName = `${authorLastName} - ${bookTitle}.md`.replace(/[:\/\?\*]/g, '_'); 

    // --- B. Determine Clipping Type and Content & Extract Timestamp ---
    const metadataLine = lines[1];
    let content = lines.slice(2).join('\n').trim();

    // Timestamp extraction: Look for "Hinzugefügt am " followed by anything until end of line
    const timestampMatch = metadataLine.match(/Hinzugefügt am (.*)$/);
    const timestamp = timestampMatch ? timestampMatch[1].trim() : 'N/A';
    
    let isNote = false;
    if (metadataLine.startsWith(NOTE_PREFIX)) {
        isNote = true;
    } else if (!metadataLine.startsWith(HIGHLIGHT_PREFIX)) {
        // Unknown type, skip block
        console.warn(`WARN: Skipping block #${index + 1}. Unknown clipping type.`);
        return null;
    }
    
    return {
        fileName,
        bookTitle,
        authorFullName,
        timestamp,
        isNote,
        content
    };
}


/**
 * Generates the final Markdown files using the structured data.
 */
function generateMarkdownFiles(bookData) {
    console.log(`\n--- Pass 2: Generating ${bookData.size} Markdown Files ---`);

    bookData.forEach((data, fileName) => {
        let markdownBody = '';
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
        data.blocks.forEach(block => {
            if (block.isNote) {
                // This is a Comment/Note for Hierarchy
                const firstChar = block.content.charAt(0);
                const headingLevel = parseInt(firstChar);

                if (!isNaN(headingLevel) && headingLevel >= 1 && headingLevel <= MAX_HEADING_LEVEL) {
                    currentLevel = headingLevel;
                }
            } else {
                // This is a Highlight
                let content = block.content;
                
                if (currentLevel >= 1 && currentLevel <= MAX_HEADING_LEVEL) {
                    // Render as a Markdown Heading (H1-H6)
                    const headingPrefix = '#'.repeat(currentLevel);
                    markdownBody += `\n${headingPrefix} ${content}\n`;
                } else {
                    // Render as a Blockquote (Default Level 0)
                    const blockquoteContent = content.split('\n').map(line => `${line}`).join('\n');
                    markdownBody += `\n${blockquoteContent}\n`;
                }

                // Reset the hierarchy level
                currentLevel = DEFAULT_HEADING_LEVEL;
            }
        });

        // 3. Write the final content (Resets the file contents)
        fs.writeFileSync(filePath, frontMatter + markdownBody, 'utf8');
        console.log(`- Successfully wrote: ${fileName}`);
    });
}

// --- Run the script ---
parseClippings();