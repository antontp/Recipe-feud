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
