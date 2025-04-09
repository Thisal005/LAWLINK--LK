import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const useGetConversations = () => {
    // State to manage loading status
    const [loading, setLoading] = useState(false);

    // State to store the list of conversations
    const [conversations, setConversations] = useState([]);

    // Fetch conversations when the component mounts
    useEffect(() => {
        const getConversations = async () => {
            setLoading(true); // Set loading state to true
            try {
                // Fetch conversations from the backend API
                const res = await fetch("/api/users");
                const data = await res.json();

                // Handle errors returned from the API
                if (data.error) {
                    throw new Error(data.error);
                }

                // Update the conversations state with the fetched data
                setConversations(data);
            } catch (error) {
                // Show an error toast if the API call fails
                toast.error(error.message);
            } finally {
                // Set loading state to false after the API call completes
                setLoading(false);
            }
        };

        // Call the function to fetch conversations
        getConversations();
    }, []); // Empty dependency array ensures this runs only once on mount

    // Return the loading state and the list of conversations
    return { loading, conversations };
};

export default useGetConversations;