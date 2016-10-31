let sum = (a, b = 6) => (a + b);

let square = (b) => {
    return b * b;
};

let variable = 80;

let variabl = () => variable++;
class MyClass {
    constructor(credentials) {
        this.name = credentials.name;
        this.enrollmentNo = credentials.enrollmentNo
    }
    getName() {
        return this.name;
    }
}

export { sum as sumbig, square, variable, MyClass, variabl};
export var fileName = 'qinchaolover';
