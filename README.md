WebAI: Web Scraping and AI-Powered Query Answering Tool
====================================================================

WebAI is a Deno-based tool that scrapes web content, cleans it, and uses Ollama (a local LLM) to answer user queries based on the scraped information. It integrates with SearXNG (a privacy-respecting metasearch engine) to fetch relevant URLs and uses Ollama to generate concise answers.

Features
--------

*   **Web Scraping**: Fetches and cleans web content using Cheerio and Readability.
    
*   **AI-Powered Answers**: Uses Ollama to generate answers based on scraped content.
    
*   **Customizable**: Easily switch between different Ollama models.
    
*   **Privacy-First**: Uses SearXNG for search queries, ensuring privacy.
    

Prerequisites
-------------

Before using WebAI, ensure you have the following installed:

*  **Deno**: Install Deno from [deno.land](https://deno.land/).
    
*  **Docker**: Install Docker from [docker.com](https://www.docker.com/).
    
*  **Ollama**: Set up Ollama locally.
    
*  **SearXNG**: Set up SearXNG using Docker.
    

Setup
-----

### 1\. Clone the WebAI Repository

Clone the WebAI repository to your local machine:

```bash
git clone https://github.com/harshvsri/webai.git  cd webai   
```

### 2\. Configure WebAI

Update the following variables in the main.ts file if needed:

```ts
const result = await ollama.generate({
  model: "llama2", // Change to your model
  prompt: \`${query}. Summarize the information and provide an answer.
          Use only the information in the following articles to answer the question:
          ${texts.join("\\n\\n")}\`,
 stream: true, options: { num\_ctx: 16000, },
});
```

```ts
const searxngUrl = "http://localhost:8888";
```
    

Usage
-----

### Run WebAI

To run WebAI, use the following command:

```bash
deno run --allow-net --allow-env main.ts "Your query here"   
```

Example:

```bash
deno run --allow-net --allow-env main.ts "What is the latest NVIDIA GPU?"   
```
    

How It Works
------------

1.  **Query Input**: The user provides a query (e.g., "What is the latest NVIDIA GPU?").
    
2.  **Fetch URLs**: WebAI uses SearXNG to fetch relevant URLs for the query.
    
3.  **Scrape and Clean**: WebAI scrapes the content from the URLs and cleans it using Cheerio and Readability.
    
4.  **Generate Answer**: The cleaned content is passed to Ollama, which generates a concise answer.


Contributing
------------

Contributions are welcome! If you'd like to improve WebAI, please open an issue or submit a pull request.

Acknowledgments
---------------

*   **Ollama**: For providing a simple way to run LLMs locally.
    
*   **SearXNG**: For offering a privacy-respecting search engine.
    
*   **Deno**: For making it easy to build and run TypeScript applications.
    

Enjoy using WebAI! If you have any questions or issues, feel free to reach out. 🚀
