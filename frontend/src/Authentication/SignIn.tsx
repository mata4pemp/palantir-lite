import React, { useState, FormEvent } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import "./Auth.css";

interface FormData {
    email: string;
    password: string;
}

const SignIn: React.FC = () => {
    const navigate = useNavigate();
    const [formData,setFormData]= useState<FormData>({
        email: '',
        password: ''
    });

    const [error, setError] =useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);

    const handleSubmit = async(e: FormEvent<HTMLFormElement>): Promise<void> => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await axios.post(
                `${process.env.REACT_APP_API_URL}/api/auth/signin`,
                formData
            );

            //save the token
            localStorage.setItem('token', response.data.token);

            //redirect to newchat
            navigate('/newchat');
        } catch (err: any) {
            setError(err.response?.data?.error || 'Failed to sign in')
        } finally {
            setLoading(false);
        }
    };

    return(
        <div className="auth-container">
            <div className="auth-box">
                <h1>Sign In</h1>
                {error && <div className="error-message">{error}</div>}

                {/* sign in form */}
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Email</label>
                        <input
                        type='email'
                        value={formData.email}
                        onChange={(e)=> setFormData({...formData, email: e.target.value})}
                        required
                        />
            </div>

            <div className="form-group">
                <label>Password</label>
                <input
                type='password'
                value={formData.password}
                onChange = {(e) => setFormData({...formData,password:e.target.value})}
                required
                minLength={6}
                />
        </div>

        <button type="submit" disabled={loading}>
            {loading ? 'Signing in...': 'Sign in'}
        </button>

        </form>

        <p className="auth-link">
            Don't have an account? <Link to="/signup">Sign Up</Link>
        </p>
            </div>
        </div>
    );
};

export default SignIn;