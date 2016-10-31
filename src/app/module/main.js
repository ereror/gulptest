// 17
console.log(sumbig(10,6));

import {sumbig, square, variable, MyClass, variabl, fileName as first } from './export';
import _ from 'lodash';
import * as circle from './circle';
import circledefault from './circle';
//import 具有变量提升，默认提到文件头部

// 25
console.log(square(9));

let cred = {
    name: 'Johuer',
    age: 40
};

let x = new MyClass(cred);

//Johuer
console.log(x.getName());

//firstName
console.log(first);

//--------------------circle
console.log("面积："+circle.area(4));
console.log("周长："+circle.circumf(4));

circledefault();//circle default

console.log("variable1:"+variable);
variabl();
console.log("variable2:"+variable)
