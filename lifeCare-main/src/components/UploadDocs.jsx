// import React, { useState, useEffect, useRef } from "react";
// import { storage, auth, db } from "../firebase";
// import {
//   ref,
//   uploadBytesResumable,
//   getDownloadURL,
//   deleteObject,
// } from "firebase/storage";
// import {
//   collection,
//   addDoc,
//   query,
//   where,
//   getDocs,
//   orderBy,
//   deleteDoc,
//   doc,
//   serverTimestamp,
// } from "firebase/firestore";
// import "./UploadDocs.css";

// const UploadDocs = () => {
//   const [file, setFile] = useState(null);
//   const [uploading, setUploading] = useState(false);
//   const [uploadProgress, setUploadProgress] = useState(0);
//   const [docs, setDocs] = useState([]);
//   const [statusMessage, setStatusMessage] = useState("");
//   const [user, setUser] = useState(null);
//   const fileInputRef = useRef(null);

//   useEffect(() => {
//     const unsubscribe = auth.onAuthStateChanged((firebaseUser) => {
//       if (firebaseUser) {
//         setUser(firebaseUser);
//         fetchDocuments(firebaseUser.uid);
//       }
//     });
//     return () => unsubscribe();
//   }, []);

//   const handleFileChange = (e) => {
//     const selected = e.target.files[0];
//     if (
//       selected &&
//       !["application/pdf", "image/png", "image/jpeg"].includes(selected.type)
//     ) {
//       alert("Only PDF, JPG, or PNG files are allowed.");
//       return;
//     }
//     setFile(selected);
//     setStatusMessage("");
//     setUploadProgress(0);
//   };

//   const handleUpload = () => {
//     if (!file || !user) {
//       alert("Please select a file and log in first.");
//       return;
//     }

//     const storageRef = ref(storage, `medical-docs/${user.uid}/${file.name}`);
//     const uploadTask = uploadBytesResumable(storageRef, file);

//     setUploading(true);
//     setStatusMessage("Uploading...");

//     uploadTask.on(
//       "state_changed",
//       (snapshot) => {
//         const progress =
//           (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
//         setUploadProgress(progress.toFixed(0));
//       },
//       (error) => {
//         console.error("Upload error:", error);
//         setStatusMessage("❌ Upload failed.");
//         setUploading(false);
//       },
//       async () => {
//         const url = await getDownloadURL(storageRef);

//         const docRef = await addDoc(collection(db, "documents"), {
//           uid: user.uid,
//           name: file.name,
//           url,
//           uploadedAt: serverTimestamp(),
//           path: storageRef.fullPath,
//         });

//         setDocs((prev) => [
//           { id: docRef.id, name: file.name, url, path: storageRef.fullPath },
//           ...prev,
//         ]);
//         setStatusMessage("✅ File uploaded!");
//         setUploading(false);
//         setFile(null);
//         fileInputRef.current.value = null;
//         setUploadProgress(0);
//       }
//     );
//   };

//   const fetchDocuments = async (uid) => {
//     const q = query(
//       collection(db, "documents"),
//       where("uid", "==", uid),
//       orderBy("uploadedAt", "desc")
//     );
//     const snapshot = await getDocs(q);
//     const results = snapshot.docs.map((docSnap) => ({
//       id: docSnap.id,
//       ...docSnap.data(),
//     }));
//     setDocs(results);
//   };

//   const handleDelete = async (docId, path) => {
//     try {
//       await deleteObject(ref(storage, path));
//       await deleteDoc(doc(db, "documents", docId));
//       setDocs((prev) => prev.filter((doc) => doc.id !== docId));
//       setStatusMessage("🗑️ Document deleted.");
//     } catch (error) {
//       console.error("Delete error:", error);
//       setStatusMessage("❌ Failed to delete document.");
//     }
//   };

//   return (
//     <div className="upload-docs">
//       <h2>📄 Upload Medical Documents</h2>

//       <input
//         type="file"
//         ref={fileInputRef}
//         onChange={handleFileChange}
//         aria-label="Choose a document"
//       />
//       <button onClick={handleUpload} disabled={uploading} title="Upload your medical file">
//         {uploading ? "Uploading..." : "Upload"}
//       </button>

//       {uploading && (
//         <div className="progress-bar">
//           <div className="progress" style={{ width: `${uploadProgress}%` }}>
//             {uploadProgress}%
//           </div>
//         </div>
//       )}

//       {statusMessage && <p className="status">{statusMessage}</p>}

//       <h3>📁 Your Documents</h3>
//       <ul>
//         {docs.map((doc, index) => (
//           <li key={index}>
//             <a href={doc.url} target="_blank" rel="noopener noreferrer">
//               {doc.name}
//             </a>{" "}
//             <button
//               onClick={() => handleDelete(doc.id, doc.path)}
//               className="delete-btn"
//               title="Delete this document"
//             >
//               ❌
//             </button>
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// };

// export default UploadDocs;

// src/components/UploadDoctorPDF.js
import React, { useState } from "react";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { collection, addDoc } from "firebase/firestore";
import { storage, db } from "../firebase";

const UploadDoctorPDF = () => {
  const [doctorName, setDoctorName] = useState("");
  const [specialization, setSpecialization] = useState("");
  const [pdfFile, setPdfFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!pdfFile) {
      alert("Please select a PDF file.");
      return;
    }

    setLoading(true);
    setSuccessMsg("");

    try {
      // Upload PDF to Firebase Storage
      const storageRef = ref(storage, `doctor_pdfs/${pdfFile.name}`);
      const snapshot = await uploadBytes(storageRef, pdfFile);
      const pdfURL = await getDownloadURL(snapshot.ref);

      // Store metadata to Firestore
      await addDoc(collection(db, "doctors"), {
        name: doctorName,
        specialization: specialization,
        pdfURL: pdfURL,
        createdAt: new Date(),
      });

      setSuccessMsg("Doctor data uploaded successfully!");
      setDoctorName("");
      setSpecialization("");
      setPdfFile(null);
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Upload failed. See console for details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: "auto", padding: 20 }}>
      <h2>Upload Doctor PDF</h2>
      <form onSubmit={handleUpload}>
        <input
          type="text"
          placeholder="Doctor Name"
          value={doctorName}
          onChange={(e) => setDoctorName(e.target.value)}
          required
        />
        <br /><br />
        <input
          type="text"
          placeholder="Specialization"
          value={specialization}
          onChange={(e) => setSpecialization(e.target.value)}
          required
        />
        <br /><br />
        <input
          type="file"
          accept="application/pdf"
          onChange={(e) => setPdfFile(e.target.files[0])}
          required
        />
        <br /><br />
        <button type="submit" disabled={loading}>
          {loading ? "Uploading..." : "Upload"}
        </button>
      </form>
      {successMsg && <p style={{ color: "green" }}>{successMsg}</p>}
    </div>
  );
};

export default UploadDoctorPDF;
