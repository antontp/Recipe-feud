// main.js

console.log("yo");


// 3.1
let map = function(x, a, b, m, n) {

    let range = n-m;
    let proportion = (x-a)/(b-a);
    return (m + proportion * range);

}

// console.log(map(15, 10, 20, 0, 100))

console.log(map(15, 10, 20, 80, 100))