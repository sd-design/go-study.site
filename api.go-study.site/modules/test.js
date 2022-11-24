

async function func1(){
    let num = 1
    return num
}

async function func2(n){
    let num = (1 + n)
    return num
}

async function func3(n){
    let num = (1 + n)
    return num
}

async function go(){
    let a = await func1()
    console.log(a)
    let b = await func2(a)
    console.log(b)
    let c = await func3(b)
    console.log(c)
    return c
}

    go().then((res)=>{
        console.log(res)
    });

