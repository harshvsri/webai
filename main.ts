import { Readability } from "jsr:@paoramen/cheer-reader";
import ollama from "npm:ollama";
import * as cheerio from "npm:cheerio@1.0.0";
import { startSpinner, stopSpinner } from "./spinner.ts";

const query = getQury();
const urls = await getNewsUrls(query);
const alltexts = await getCleanedText(urls);
await answerQuery(query, alltexts);

function printError(message: string) {
    console.log(`\x1b[31m${message}\x1b[0m`);
}

function getQury() {
    const query = Deno.args.join(" ");
    if (query.length === 0) {
        printError("Error: Query cannot be empty.");
        console.log("Usage: webai <query>");
        Deno.exit(1);
    }
    return query;
}

async function getNewsUrls(query: string) {
    const searxngUrl = "http://localhost";
    const params = new URLSearchParams({
        q: query,
        format: "json",
    });

    startSpinner();
    let searchResults;
    try {
        searchResults = await fetch(searxngUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: params,
        });

        if (!searchResults.ok) {
            throw new Error(`HTTP error! Status: ${searchResults.status}`);
        }
    } catch (error) {
        if (error instanceof TypeError) {
            printError("Failed to connect to the service. Is localhost running?");
        } else {
            printError(`Error occurred: ${error}`);
        }
        Deno.exit(1);
    }

    const searchResultsJson: { results: Array<{ url: string }> } = await searchResults.json();
    stopSpinner();

    const urls = searchResultsJson.results
        .map((result) => result.url)
        .slice(0, 1);
    return urls;
}

async function getCleanedText(urls: string[]) {
    const MAX_TOKEN = 500;
    let texts = [];
    for await (const url of urls) {
        const getUrl = await fetch(url);
        console.log(`Fetching ${url}`);

        const html = await getUrl.text();
        const text = htmlToText(html);
        texts.push(`Source: ${url}\n${text}\n\n`);
    }

    const maxLen = (MAX_TOKEN / texts.length) * 5;
    texts = texts.map((text) => text.length > maxLen ? text.slice(0, maxLen) : text);
    return texts;
}

function htmlToText(html: string) {
    const $ = cheerio.load(html);
    const text = new Readability($).parse();
    return text.textContent;
}

async function answerQuery(query: string, texts: string[]) {
    console.log("Invoking ollama...");
    const result = await ollama.generate({
        model: "tinyllama",
        prompt: `${query}. Summarize the information and provide an answer.
                Use only the information in the following articles to answer the question: ${texts.join("\n\n")}`,
        stream: true,
        options: {
            num_ctx: 16000,
        },
    });

    for await (const chunk of result) {
        if (chunk.done !== true) {
            await Deno.stdout.write(new TextEncoder().encode(chunk.response));
        }
    }
    console.log("\n");
}
