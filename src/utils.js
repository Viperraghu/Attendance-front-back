export const saveUserRole = (role) =>{
    localStorage.setItem('userRole' , role)
};

export const getUserRole =()=>{
    return localStorage.getItem("userRole");
};

export const clearUserData = () =>{
    localStorage.removeItem('userRole');
    localStorage.removeItem('token')
}


export const isAdmin =()=>{
    return localStorage.getItem("is_admin") === 'true'
}


export const getRole =() => localStorage.getItem("role")

export const getToken =()=>{
    return localStorage.getItem('token')
}