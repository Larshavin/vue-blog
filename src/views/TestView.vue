<template>
    <div>
        <div v-html="renderedContent"></div>
        <br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br />
        <br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br />
        <div v-html="tableOfContents"></div>
    </div>
</template>
  
<script setup>
import { marked } from 'marked';

// The Markdown content with headings
const markdown = `
  # Heading 1
  ## Subheading 1.1
  ## Subheading 1.2
  ### Sub-subheading 1.2.1
  # Heading 2
  ## Subheading 2.1
  \`<template>\` 쪽을 살펴봅시다. 
`

// Function to generate the Table of Contents from the Markdown content
const generateTableOfContents = (markdownContent) => {

    const headings = [];
    const tocItems = [];
    const renderer = new marked.Renderer();

    const tokens = marked.lexer(markdownContent);
    console.log(tokens);
    marked.walkTokens(tokens, (token) => {
        if (token.type === 'heading') {
            tocItems.push({
                text: token.text,
                level: token.depth,
            });
        }
    });

    const tableOfContentsHTML = tocItems
        .map((item) => `<li><a href="#${item.text.toLowerCase().replace(/[^\w]+/g, '-')}">${item.text}</a></li>`)
        .join('');

    return tableOfContentsHTML;
};

// Call the function with the Markdown content
const tableOfContents = generateTableOfContents(markdown);

// Render the Markdown content
const renderer = new marked.Renderer();
const renderedContent = marked(markdown, { renderer });
</script>

<style>
/* Your component's styles here */
</style>
