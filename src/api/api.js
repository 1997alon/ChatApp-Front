const SERVER_URL = "/";

export const loginUser = async (username, password) => {
    try {
        const response = await fetch(`${SERVER_URL}login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password }),
        });

        if (!response.ok) {
            return { success: false, error: "Invalid username or password." };
        }

        const data = await response.json(); 
        console.log(data)
        if (data.success) {
            return { 
                success: true, 
                users: data.success.users || [], 
                chats: data.success.chats || {}
            };
        } else {
            return { success: false, error: "Login failed." };
        }

    } catch (error) {
        console.error("Login error:", error);
        return { success: false, error: "Could not connect to server." };
    }
};

export const signUpUser = async (username, password, email, appName) => {
    try {
        const response = await fetch(`${SERVER_URL}signUp`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password, email, appName }),
        });

        const data = await response.json();

        if (!response.ok || !data.success) {
            return { success: false, error: data.error || "Signup failed." };
        }

        return { success: true };
    } catch (error) {
        console.error("Signup error:", error);
        return { success: false, error: "Could not connect to server." };
    }
};

export const chatWithServer = async (message, username) => {
    try {
        const response = await fetch(`${SERVER_URL}chatWithServer`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ message, username }),
        });

        const data = await response.json(); 
        console.log('Response data:', data);

        if (!response.ok || !data.success || !data.success.success) {
            return { success: false, error: data.error || "No response from server." };
        }
        return { success: true, response: data.success.response };

    } catch (error) {
        console.error("Chat error:", error);
        return { success: false, error: "Could not connect to server." };
    }
};

export const sendMessage = async ({ username, message, members }) => {
    try {
        const response = await fetch(`${SERVER_URL}sendMessage`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, message, members }),
        });
        const data = await response.json();
        if (!response.ok || !data.success) {
            return { success: false, error: data.error || "Send message failed." };
        }
        else if (data.success) {
            return data;
        }   

        return null;

    } catch (error) {
        console.error("Send message failed:", error);
        return { success: false, error: "Could not sent a message." };
    }
}

export const getMessage = async ({ username, members }) => {
    try {
        const response = await fetch(`${SERVER_URL}getMessages`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, members }),
        });
        const data = await response.json();
        if (!response.ok || !data.success) {
            return { success: false, error: data.error || "Send message failed." };
        }
        else if (data.success) {
            return data;
        }   

        return null;

    } catch (error) {
        console.error("Send message failed:", error);
        return { success: false, error: "Could not sent a message." };
    }
}

export const getConversations = async ({ username }) => {
    try {
        const response = await fetch(`${SERVER_URL}getConversations`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username }),
        });
        const data = await response.json();
        console.log(data, 'helllllllllllllllllllllllllll');
        if (!response.ok || !data.success) {
            return { success: false, error: data.error || "get conversations failed." };
        }
        else if (data.success) {
            return data;
        }   

        return null;

    } catch (error) {
        console.error("Send message failed:", error);
        return { success: false, error: "Could not sent a message." };
    }
}


export const menuUser = async ({ action, username, users }) => {
    try {
        
        const body = users 
            ? JSON.stringify({ action, username, users }) 
            : JSON.stringify({ action, username });

        const response = await fetch(`${SERVER_URL}menuUser`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: body,
        });

        const data = await response.json(); 
        console.log(data);

        if (!response.ok || !data.success) {
            return { success: false, error: data.error || "Action failed." };
        }

        if (data.success) {
            return data;
        }
        return null;

    } catch (error) {
        console.error("Menu user error:", error);
        return { success: false, error: "Could not connect to server." };
    }
};
