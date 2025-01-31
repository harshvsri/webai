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
    const searxngUrl = new URL("http://localhost");
    const params = new URLSearchParams({
        q: query,
        format: "json",
    });
    searxngUrl.search = params.toString();

    startSpinner();
    let searchResults;
    try {
        searchResults = await fetch(searxngUrl);

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

    const searchResultsJson: { results: Array<{ url: string; score: number }> } = await searchResults.json();
    stopSpinner();

    let urlData = searchResultsJson.results.map((result) => ({
        url: result.url,
        score: result.score,
    }));
    urlData.sort((a, b) => b.score - a.score);
    urlData.filter((url) => !url.url.endsWith(".pdf"));
    urlData = urlData.slice(0, 5);

    const urlList = urlData.map((data) => data.url);
    return urlList;
}

async function getCleanedText(urls: string[]) {
    const MAX_TOKEN = 500;
    let texts = [];
    for (const url of urls) {
        console.log(`Fetching ${url}`);

        let getUrl;
        try {
            getUrl = await fetch(url);
            if (!getUrl.ok) {
                throw new Error(`HTTP error! Status: ${getUrl.status}`);
            }
            const html = await getUrl.text();
            const text = htmlToText(html);
            texts.push(`Source: ${url}\nInformation: ${text}\n\n`);
        } catch (error) {
            if (error instanceof TypeError) {
                printError(`Failed to fetch ${url}`);
            } else {
                printError(`Error occurred: ${error}`);
            }
        }
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
        prompt: `${query}. Summarize the information and provide an answer. Also just focus on readble characters.
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
