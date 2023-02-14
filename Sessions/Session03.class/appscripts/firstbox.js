//function declaration
function myFunction(p1, p2) { 
	// this function takes in two ARGUMENTS, but any number of arguments are possible
	var prod = p1*p2; // this variable is declared inside the function so it does not exist once the function call ends
 
	console.log(prod);   // The function prints the product of p1 and p2 to the console


}

//function call
myFunction(5,6);
var a = 5;
var b = 6;
myFunction(a,b);
