const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");
const render = require("./lib/htmlRenderer");
const inquirer = require("inquirer");
const path = require("path");
const fs = require("fs");

const OUTPUT_DIR = path.resolve(__dirname, "output");
const outputPath = path.join(OUTPUT_DIR, "team.html");

// UI variables
var ui = new inquirer.ui.BottomBar();
ui.log.write("__________WELCOME TO THE TEAM CREATOR__________");

// employees array which will contain each employee that the user creates
let employees = [];

// three constants which hold the logic for validating inquirer questions
// validates input using regular expression to ensure only letters were entered
const validateName = (input) => {
    if (/\d/.test(input) || input === ""){
        return "Please enter a valid response using only letters.";
    } else {
    return true;
    }
}

// validates input to ensure only numbers are entered using regular expression
const validateId = (input) => {
    if (isNaN(input) || input === ""){
        return "Please enter a number.";
    } else {
        return true;
    }
}

// validates input to ensure that an e-mail was entered using regular expression
const validateEmail = (input) => {
    if (/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/.test(input)){
        return true;
    } else {
    return "Please enter a valid e-mail address";
    }
}

// constant holding the initial set of questions for the user to enter the manager's information
const managerQ = [{
    type: "input",
    name: "name",
    message: "Please enter the manager's name.",
    validate: validateName
}, {
    type: "input",
    name: "id",
    message: "Enter the manager's ID.",
    validate: validateId
}, {
    type: "input",
    name: "email",
    message: "Enter their e-mail address.",
    validate: validateEmail
}, {
    type: "input",
    name: "officeNumber",
    message: "Enter their office number.",
    validate: validateId
}, {
    type: "list",
    name: "addTeam",
    message: "Would you like to add team members?",
    choices: ["Yes", "No"]
}]

// constant holding the set of questions for additional employees - intern and engineer
// uses when statement to ask specific questions based on the employee's role
const employeeQ = [{
    type: "list",
    name: "role",
    message: "Please choose this employee's position.",
    choices: ["Intern", "Engineer"]
}, {
    type: "input",
    name: "name",
    message: "Enter this employee's name.",
    validate: validateName
}, {
    type: "input",
    name: "id",
    message: "Enter the employee's ID.",
    validate: validateId
}, {
    type: "input",
    name: "email",
    message: "Enter this employee's e-mail address.",
    validate: validateEmail
}, {
    when: (answers) => answers.role === "Intern",
    type: "input",
    name: "school",
    message: "Enter this employee's school.",
    validate: validateName
}, {
    when: (answers) => answers.role === "Engineer",
    type: "input",
    name: "github",
    message: "Please enter this employee's GitHub user name.",
    validate: validateName
},{
    type: "list",
    name: "addTeam",
    message: "Would you like to add an additional team member?",
    choices: ["Yes", "No"]
}];

// init function prompts manager questions, then creates a new Manager object using user input data
// if user wanted to add an additional team members, it runs the employeeList function, else it runs
// the createDoc function.
function init(){
    inquirer.prompt(managerQ)
    .then(managerStats => {
        let newEmployee = new Manager(managerStats.name, managerStats.id, managerStats.email, managerStats.officeNumber);
        employees.push(newEmployee);
        if(managerStats.addTeam === "Yes"){
            employeeList();
        } else{
            createDoc();
        }
    });
}

// prompts the additional employee questions and creates a new Intern or Engineer based on the user input
// and will add them to the team array, will loop back through questions if user chooses to do so, otherwise
// will run the createDoc function. 
function employeeList(){
    inquirer.prompt(employeeQ)
    .then(employeeStats => {
        if(employeeStats.role === "Intern"){
            let newEmployee = new Intern(employeeStats.name, employeeStats.id, employeeStats.email, employeeStats.school);
            employees.push(newEmployee);
        } else {
            let newEmployee = new Engineer(employeeStats.name, employeeStats.id, employeeStats.email, employeeStats.github);
            employees.push(newEmployee);
        }
        if(employeeStats.addTeam === "Yes"){
            employeeList();
        } else {
            createDoc();
        }
    })
}

// function to create the HTML document, calling the render function from htmlRenderer.js while passing
// through the created employees information, then console logs a success message.
function createDoc(){
    fs.writeFileSync(outputPath, render(employees), "utf-8");
    console.log("Success! Your page has been created.");
}

// calls init function to start the application
init();