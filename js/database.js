import { db } from './firebase-config.js';
import { collection, addDoc, getDocs, deleteDoc, doc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const COLLECTION_NAME = "laptops";

// Helper: Compress and convert image to Base64
function compressImage(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (event) => {
            const img = new Image();
            img.src = event.target.result;
            img.onload = () => {
                const canvas = document.createElement('canvas');
                const MAX_WIDTH = 800;
                const scaleSize = MAX_WIDTH / img.width;
                canvas.width = MAX_WIDTH;
                canvas.height = img.height * scaleSize;

                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

                // Compress to JPEG with 0.7 quality
                const dataUrl = canvas.toDataURL('image/jpeg', 0.7);
                resolve(dataUrl);
            };
            img.onerror = (err) => reject(err);
        };
        reader.onerror = (err) => reject(err);
    });
}

// Add Laptop (Stores image directly in DB as text)
export async function addLaptop(model, price, description, specs, imageFile) {
    try {
        let imageUrl = "images/logo.png"; // fallback

        if (imageFile) {
            console.log("Compressing image...");
            imageUrl = await compressImage(imageFile);
        }

        const docRef = await addDoc(collection(db, COLLECTION_NAME), {
            model: model,
            price: price,
            description: description,
            specs: specs || "", // Add specs field
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

// Get Single Laptop by ID
export async function getLaptopById(id) {
    try {
        const docRef = doc(db, COLLECTION_NAME, id);
        const docSnap = await import("https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js").then(module => module.getDoc(docRef));

        if (docSnap.exists()) {
            return { id: docSnap.id, ...docSnap.data() };
        } else {
            console.log("No such document!");
            return null;
        }
    } catch (e) {
        console.error("Error getting document:", e);
        return null;
    }
}

// Delete Laptop
export async function deleteLaptop(id) {
    await deleteDoc(doc(db, COLLECTION_NAME, id));
}
