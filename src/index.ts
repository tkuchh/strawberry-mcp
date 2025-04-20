#!/usr/bin/env node
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

// Create server instance
const server = new McpServer({
  name: "strawberry-counter",
  version: "1.0.0",
  capabilities: {
    resources: {},
    tools: {},
  },
});

// Function to count occurrences of a character in a string (case insensitive)
function countCharOccurrences(str: string, char: string): number {
  // Ensure both string and character are lowercase for case-insensitive comparison
  const normalizedStr = str.toLowerCase().trim();
  const normalizedChar = char.toLowerCase().trim();
  
  return normalizedStr.split('').filter(c => c === normalizedChar).length;
}

// Register the count-r tool
server.tool(
  "count-r-in-strawberry",
  "Count occurrences of the letter 'r' in 'strawberry'",
  {
    word: z.string().describe("The word to check - must be 'strawberry'"),
    char: z.string().describe("The character to count - must be 'r'"),
  },
  async ({ word, char }) => {
    // Trim and normalize inputs
    const trimmedWord = word.trim();
    const trimmedChar = char.trim();
    
    // Validation checks
    if (trimmedWord.toLowerCase() !== "strawberry") {
      return {
        content: [
          {
            type: "text",
            text: "Error: This tool can only count letters in the word 'strawberry'.",
          },
        ],
      };
    }
    
    if (trimmedChar.toLowerCase() !== "r") {
      return {
        content: [
          {
            type: "text",
            text: "Error: This tool can only count the letter 'r'.",
          },
        ],
      };
    }
    
    // Count the occurrences
    const count = countCharOccurrences(trimmedWord, trimmedChar);
    
    return {
      content: [
        {
          type: "text",
          text: `The letter 'r' appears ${count} times in the word 'strawberry'.`,
        },
      ],
    };
  }
);

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Strawberry Counter MCP Server running on stdio");
}

main().catch((error) => {
  console.error("Fatal error in main():", error);
  process.exit(1);
});
