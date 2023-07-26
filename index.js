const puppeteer = require('puppeteer');
const doist = require('@doist/todoist-api-typescript');

require('dotenv').config();
const API_KEY = process.env.TODOIST_API_KEY;
function getRandomArray(arr, num) {
    // This function gets a specified number of elements at random and returns them as a new array 
    if (!Array.isArray(arr) || arr.length === 0) { throw new Error('Input array must not be empty'); }
    if (num <= 0 || !Number.isInteger(num)) { throw new Error('Number of elements requested must be a positive integer'); }
    
    const randomElements = [];
    for (let i = 0; i < num; i++) {
        const randomIndex = Math.floor(Math.random() * arr.length);
        randomElements.push(arr[randomIndex]);
        arr.splice(randomIndex, 1);
    }
    return randomElements;
}

(async () => {
    try {
        // Open browser
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        // Navigate to trello board
        console.log(TRELLO_URL)
        await page.goto('http://trello.com/b/QvHVksDa/personal-work-goals');
        await page.waitForSelector('.list-card-title');
        // Pull list of tasks
        const taskTitles = await page.$$eval('.list-card-title', elements => elements.map(el => el.textContent));
        // Get page title
        const title = await page.title()
        // Close browser
        await browser.close();
        // Access the Todoist API
        const api = new doist.TodoistApi(API_KEY)
        // Get five cards at random
        const randomCards = getRandomArray(taskTitles, 5);
        // Create a new project
        const project = await api.addProject({ name: title });
        // Create a task for each pulled card
        for (const task_title of randomCards) {
            try {
                const task = await api.addTask({ content: task_title, projectId: project.id });
                console.log(task_title);
            } catch (error) {
                console.log(error);
            }
        }
    } catch (error) {
        console.log(error);
    }
})();