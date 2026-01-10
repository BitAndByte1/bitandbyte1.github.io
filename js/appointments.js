import { db } from './firebase-config.js';
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc, orderBy, query } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const COLLECTION_NAME = "appointments";

// Add a new appointment request
export async function addAppointment(appointmentData) {
    try {
        const docRef = await addDoc(collection(db, COLLECTION_NAME), {
            ...appointmentData,
            createdAt: new Date(),
            status: 'new' // new, in-progress, done
        });
        console.log("Appointment scheduled with ID: ", docRef.id);
        return docRef.id;
    } catch (e) {
        console.error("Error adding appointment: ", e);
        throw e;
    }
}

// Get all appointments (ordered by date desc)
export async function getAppointments() {
    try {
        const q = query(collection(db, COLLECTION_NAME), orderBy("createdAt", "desc"));
        const querySnapshot = await getDocs(q);
        const appointments = [];
        querySnapshot.forEach((doc) => {
            appointments.push({ id: doc.id, ...doc.data() });
        });
        return appointments;
    } catch (e) {
        console.error("Error getting appointments: ", e);
        return [];
    }
}

// Update appointment status
export async function updateAppointmentStatus(id, newStatus) {
    try {
        const docRef = doc(db, COLLECTION_NAME, id);
        await updateDoc(docRef, {
            status: newStatus
        });
    } catch (e) {
        console.error("Error updating appointment: ", e);
        throw e;
    }
}

// Delete appointment
export async function deleteAppointment(id) {
    try {
        await deleteDoc(doc(db, COLLECTION_NAME, id));
    } catch (e) {
        console.error("Error deleting appointment: ", e);
        throw e;
    }
}
