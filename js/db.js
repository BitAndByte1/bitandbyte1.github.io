import { db, storage } from './firebase-config.js';
import { collection, addDoc, getDocs, deleteDoc, doc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { ref, uploadBytes, getDownloadURL, deleteObject } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-storage.js";

const COLLECTION_NAME = "laptops";

// Upload Image
export async function uploadImage(file) {
    const storageRef = ref(storage, 'laptops/' + Date.now() + '-' + file.name);

    // Create a timeout promise
    const timeout = new Promise((_, reject) => {
        setTimeout(() => reject(new Error("Timeout: Сървърът не отговаря. Проверете интернет връзката или защитната стена.")), 15000);
    });

    // Race between upload and timeout
    await Promise.race([
        uploadBytes(storageRef, file),
        timeout
    ]);

    return await getDownloadURL(storageRef);
}

// Add Laptop
export async function addLaptop(model, price, description, imageUrl) {
    try {
        const docRef = await addDoc(collection(db, COLLECTION_NAME), {
            model: model,
            price: price,
            description: description,
            imageUrl: imageUrl,
            createdAt: new Date()
        });
        console.log("Document written with ID: ", docRef.id);
        return docRef.id;
    } catch (e) {
        console.error("Error adding document: ", e);
        throw e;
    }
}

// Get All Laptops
export async function getLaptops() {
    try {
        const querySnapshot = await getDocs(collection(db, COLLECTION_NAME));
        const laptops = [];
        querySnapshot.forEach((doc) => {
            laptops.push({ id: doc.id, ...doc.data() });
        });
        return laptops;
    } catch (e) {
        console.error("Error getting documents: ", e);
        return [];
    }
}

// Delete Laptop
export async function deleteLaptop(id, imageUrl) {
    await deleteDoc(doc(db, COLLECTION_NAME, id));

    // Optional: Delete image from storage if possible
    if (imageUrl) {
        try {
            const imageRef = ref(storage, imageUrl);
            await deleteObject(imageRef);
        } catch (e) {
            console.log("Error deleting image (likely already gone):", e);
        }
    }
}
