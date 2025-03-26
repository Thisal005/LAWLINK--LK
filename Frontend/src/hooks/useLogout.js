const useLogout = async() => {
    try {
        // Call backend logout endpoint to clear the cookie
        await axios.post(backendUrl + '/api/auth/logout', {}, {
          withCredentials: true
        });
        
        // Update state
        setIsLoggedIn(false);
        setUserData(null);
        
        // Redirect to login
        navigate('/login');
        
        toast.success('Logged out successfully');
      } catch (error) {
        console.error('Logout error:', error);
        toast.error('Error during logout');
      }
    
}

export default useLogout;
