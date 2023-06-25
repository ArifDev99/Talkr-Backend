const validfirstName=(firstname)=>{
    const nameregx=new RegExp(/[a-zA-Z][a-zA-Z]+[a-zA-Z]$/)
    return nameregx.test(firstname)
}
const validlastName=(lastname)=>{
    const nameregx=new RegExp(/[a-zA-Z][a-zA-Z]+[a-zA-Z]$/)
    return nameregx.test(lastname)
}

const validemail=(email)=>{
    const emailregx=new RegExp(/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/)
    return emailregx.test(email)
}

const validpassword=(password)=>{
    const passregx=new RegExp(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{4,10}$/)
    return passregx.test(password)

}


module.exports={
    validemail,validfirstName,validlastName,validpassword
}