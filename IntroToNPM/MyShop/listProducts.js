var faker = require('faker');
var counter = 0;

// faker storefront
console.log('==========================');
console.log('Welcome to the Fancy Store');
console.log('==========================');

while(counter < 10){
    console.log(faker.fake("{{commerce.productName}}, {{commerce.productAdjective}}: ${{commerce.price}}!"));
    counter++;
}