import React ,{useState} from 'react';
import { authService } from 'fbase' ;


const AuthForm = ()=>{
    const [newAccount , setNewAccount] = useState(true);
    const [error , setError] = useState("");
    const [email, setEmail] = useState("") ;
    const [password, setPassword] = useState("");
    
    const onSubmit = async (event) => {
        event.preventDefault();
        try {
            let data; 
            if(newAccount){
                //Create Account
                data = await authService.createUserWithEmailAndPassword(
                    email,
                    password
                );
            }else {
                //Log in
                data = await authService.signInWithEmailAndPassword(
                    email,
                    password
                );
            }    
            console.log(data);
        } catch (error) {
            setError(error.message);
        }
        
    };
    
    const onChange = (event) => {
        const { 
            target : { name, value },
        } = event ;

        if ( name ==="email"){
            setEmail(value);
        }else if ( name ==="password"){
            setPassword(value);
        }
        
    };
    
    const toggleAccount = () =>{
        setNewAccount( prev => !prev)
    };

    return (
        <>       
            <form onSubmit={onSubmit} className="container">
                <input 
                    name="email" 
                    type="text" 
                    placeholder="Email" 
                    required 
                    value={email}
                    onChange={onChange}
                    className="authInput"        
                    />
                <input 
                    name="password" 
                    type="password" 
                    placeholder="Password" 
                    required 
                    value={password}
                    onChange={onChange}
                    className="authInput"
                    />
                <input 
                    type="submit"   
                    value={newAccount ? "Create New Account" : "Sign in"} 
                    className="authInput authSubmit"
                />                      
                {error && <span className="authError">{error}</span>}
            </form>
            <span onClick={toggleAccount} className="authSwitch">
                {newAccount ? "Sign in" : "Create Account"}
            </span>
        </>
    );
};

export default AuthForm