const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");
const inquirer = require("inquirer");
const path = require("path");
const fs = require("fs");

const OUTPUT_DIR = path.resolve(__dirname, "output");
const outputPath = path.join(OUTPUT_DIR, "team.html");

const render = require("./lib/htmlRenderer");


// Write code to use inquirer to gather information about the development team members,
// and to create objects for each team member (using the correct classes as blueprints!)

let employees = [];

const managerQ = [{
    type: "input",
    name: "name",
    message: "Please enter the manager's name.",
    validate: (input) => {
        if (/\d/.test(input) || input === ""){
            return "Please enter this employee's name";
        } else {
        return true;
        }}
}, {
    type: "input",
    name: "id",
    message: "Enter the manager's ID.",
    validate: (input) => {
        if (/\D/.test(input) || input === ""){
            return "Please enter a number";
        } else {
            return true;
        }}
}, {
    type: "input",
    name: "email",
    message: "Enter their e-mail address.",
    validation: (input) => {
        if (/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/.test(input)){
            return true;
        }
        return "Please enter a valid e-mail address";
        }
}, {
    type: "input",
    name: "officeNumber",
    message: "Enter their office number."
}, {
    type: "list",
    name: "addTeam",
    message: "Would you like to add team members?",
    choices: ["Yes", "No"]
}]

const employeeQ = [{
    type: "list",
    name: "role",
    message: "Please choose this employee's position.",
    choices: ["Intern", "Engineer"]
}, {
    type: "input",
    name: "name",
    message: "Enter this employee's name."
}, {
    type: "input",
    name: "id",
    message: "Enter the employee's ID."
}, {
    type: "input",
    name: "email",
    message: "Enter this employee's e-mail address."
}, {
    when: (answers) => answers.role === "Intern",
    type: "input",
    name: "school",
    message: "Enter this employee's school."
}, {
    when: (answers) => answers.role === "Engineer",
    type: "input",
    name: "github",
    message: "Please enter this employee's GitHub user name."
},{
    type: "list",
    name: "addTeam",
    message: "Would you like to add an additional team member?",
    choices: ["Yes", "No"]
}];

function init(){
    inquirer.prompt(managerQ)
    .then(managerStats => {
        let newEmployee = new Manager(managerStats.name, managerStats.id, managerStats.email, managerStats.officeNumber);
        employees.push(newEmployee);
        if(managerStats.addTeam === "Yes"){
            employeeList();
        } else{
            console.log(employees);
            createDoc();
        }
    });
}

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
            console.log(employees);
            createDoc();
        }
    })
}

init();

// After the user has input all employees desired, call the `render` function (required
// above) and pass in an array containing all employee objects; the `render` function will
// generate and return a block of HTML including templated divs for each employee!

// After you have your html, you're now ready to create an HTML file using the HTML
// returned from the `render` function. Now write it to a file named `team.html` in the
// `output` folder. You can use the variable `outputPath` above target this location.
// Hint: you may need to check if the `output` folder exists and create it if it
// does not.

function createDoc(){
    fs.writeFileSync(outputPath, render(employees), "utf-8");
    console.log("Success! Your page has been created.");
}

// HINT: each employee type (manager, engineer, or intern) has slightly different
// information; write your code to ask different questions via inquirer depending on
// employee type.

// HINT: make sure to build out your classes first! Remember that your Manager, Engineer,
// and Intern classes should all extend from a class named Employee; see the directions
// for further information. Be sure to test out each class and verify it generates an
// object with the correct structure and methods. This structure will be crucial in order
// for the provided `render` function to work! ```