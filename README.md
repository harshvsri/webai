WebAI: A Deno-Based Web Scraping and AI-Powered Query Answering Tool
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

1.  **Deno**: Install Deno from [deno.land](https://deno.land/).
    
2.  **Docker**: Install Docker from [docker.com](https://www.docker.com/).
    
3.  **Ollama**: Set up Ollama locally (instructions below).
    
4.  **SearXNG**: Set up SearXNG using Docker (instructions below).
    

Setup
-----

### 1\. Install Deno

If you don't have Deno installed, run the following command:


```bash
curl -fsSL https://deno.land/x/install/install.sh | sh
```

Add Deno to your PATH if it isn't added automatically.

### 2\. Set Up Ollama Locally

Ollama allows you to run large language models (LLMs) locally. Follow these steps to set it up:

#### Step 1: Install Ollama

Download and install Ollama from the official repository:

*   [Ollama GitHub](https://github.com/jmorganca/ollama)
    

#### Step 2: Pull a Model

Ollama supports various models. Replace tinyllama with your preferred model (e.g., llama2, mistral):

```bash
ollama pull llama2   
```


#### Step 3: Run Ollama

Start the Ollama server:

```bash
ollama serve   
```

By default, Ollama runs on http://localhost:11434.

### 3\. Set Up SearXNG Using Docker

SearXNG is a privacy-respecting metasearch engine. We'll use Docker to set it up locally.

#### Step 1: Install Docker

If you don't have Docker installed, download it from [docker.com](https://www.docker.com/).

#### Step 2: Run SearXNG

Use the following command to start a SearXNG instance:

```bash
docker run --name searxng -d -p 8888:8888 searxng/searxng   
```

This will start SearXNG on http://localhost:8888.

#### Step 3: Verify SearXNG

Open your browser and navigate to http://localhost:8888. You should see the SearXNG search interface.

### 4\. Clone the WebAI Repository

Clone the WebAI repository to your local machine:

```bash
git clone https://github.com/harshvsri/webai.git  cd webai   
```

### 5\. Configure WebAI

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

### Flags

*   \--allow-net: Allows network access (required for fetching URLs and Ollama).
    
*   \--allow-env: Allows access to environment variables (if needed).
    

How It Works
------------

1.  **Query Input**: The user provides a query (e.g., "What is the latest NVIDIA GPU?").
    
2.  **Fetch URLs**: WebAI uses SearXNG to fetch relevant URLs for the query.
    
3.  **Scrape and Clean**: WebAI scrapes the content from the URLs and cleans it using Cheerio and Readability.
    
4.  **Generate Answer**: The cleaned content is passed to Ollama, which generates a concise answer.

Troubleshooting
---------------

### 1\. SearXNG Not Running

Ensure SearXNG is running on http://localhost:8888. If not, restart the Docker container:

```bash
docker start searxng   
```

### 2\. Ollama Not Responding

Ensure the Ollama server is running:

```bash
ollama serve   
```

### 3\. Permission Denied

If you encounter permission issues, ensure you're running Deno with the required flags:

```bash
deno run --allow-net --allow-env main.ts "Your query here"   
```

Contributing
------------

Contributions are welcome! If you'd like to improve WebAI, please open an issue or submit a pull request.

Acknowledgments
---------------

*   **Ollama**: For providing a simple way to run LLMs locally.
    
*   **SearXNG**: For offering a privacy-respecting search engine.
    
*   **Deno**: For making it easy to build and run TypeScript applications.
    

Enjoy using WebAI! If you have any questions or issues, feel free to reach out. 🚀
