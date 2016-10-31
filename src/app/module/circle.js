let area = (radius) => Math.PI * radius * radius;

let circumf = (radius) => 2 * Math.PI * radius;

export { area, circumf};

//返回默认的export模块儿
export default function(){
    console.log("circle default")
}
