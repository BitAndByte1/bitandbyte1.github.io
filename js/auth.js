import { auth } from './firebase-config.js';
import { onAuthStateChanged, signInWithEmailAndPassword, signOut } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

// Check auth state
export function monitorAuth(loginSection, dashboardSection, logoutBtn) {
    onAuthStateChanged(auth, (user) => {
        if (user) {
            // User is signed in
            if (loginSection) loginSection.style.display = 'none';
            if (dashboardSection) dashboardSection.style.display = 'block';
            if (logoutBtn) logoutBtn.classList.remove('hidden');
        } else {
            // User is signed out
            if (loginSection) loginSection.style.display = 'block';
            if (dashboardSection) dashboardSection.style.display = 'none';
            if (logoutBtn) logoutBtn.classList.add('hidden');
        }
    });
}

export async function login(email, password) {
    try {
        await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
        alert("Грешка при вход: " + error.message);
        throw error;
    }
}

export async function logout() {
    try {
        await signOut(auth);
    } catch (error) {
        console.error("Error signing out", error);
    }
}
