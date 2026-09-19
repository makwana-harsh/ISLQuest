import { useNavigate } from "react-router-dom";

function LandingPage(){
    const navigate = useNavigate();

    return (<>
        <button onClick={()=>{navigate('/register')}}>Register</button>
        <button onClick={()=>{navigate('/login')}}>Login</button>
    </>)
}

export default LandingPage;