// main.js

//function declaration
function myFunction(p1, p2) { 
	// this function takes in two ARGUMENTS, but any number of arguments are possible
	var prod = p1*p2; // this variable is declared inside the function so it does not exist once the function call ends
 	return prod;   // The function returns the product of p1 and p2
};
//function call
prodValue = myFunction(5,6);
var a = 5;
var b = 6;
alsoValue = myFunction(a,b);
alsoValue = myFunction(a,b);
//what will be printed?
console.log("prodValue + alsoValue");
//what will be printed?
console.log(prodValue + alsoValue);
//what will be printed?
console.log("prodValue + alsoValue" + prodValue + alsoValue);
//what will be printed?
console.log("prodValue + alsoValue" + " " + prodValue + " " + alsoValue);


// Part 3 Objects
// 3.1
// creating two objects with x, y properties
const point1 = {
    x: 123,
    y: 321
};
const point2 = {
    x: 111,
    y: 222
};

// 3.2
var result = {
    sum: null,
    difference: null,
    product: null
};

// 3.3
function multi(a, b) {
    return {
        sum: a + b,
        difference: Math.abs((a-b)),
        product: a*b
    };
}

result = multi(4, 3);

console.log(result)

// 3.4
// fetching article element and clears it
var articleEl = document.getElementById("articleID");
articleEl.innerHTML = null;

// making a header:
var header = document.createElement("h2");
header.innerHTML = "Output of Step 3.6 is:";
articleEl.appendChild(header);

// Posting properties from object
for (prop in result) {
    var pEl = document.createElement("p");
    pEl.innerHTML = `${prop}: ${result[prop]}`;
    articleEl.appendChild(pEl);
    console.log(result[prop])
}


//3.5
function pointsum(p1, p2) {
    return {
        x: p1.x + p2.x,
        y: p1.y + p2.y
    }
}

// Posting object to html
var pEl = document.createElement("p");
pEl.innerHTML = JSON.stringify(pointsum(point1, point2));
articleEl.appendChild(pEl);

// Part 3 (Total 1 hour++)

// 3.1
function sumMaker(a, b) {
    console.log("Output of Step 3.1.3 is : I am in the function");
    console.log("------ You are in function: sumMaker() ------");
}

var x = 1;
var y = 2;
sumMaker();

// 3.4
// returns the difference between two nums
function sumMaker2(a, b) {
    return Math.abs(a-b);
}
// posting to html
var pEl = document.createElement("p");
pEl.innerHTML = "Output of Step 3.2.2 is: The difference between " + x + " and " + y + " is " + sumMaker2(x, y);
articleEl.appendChild(pEl);