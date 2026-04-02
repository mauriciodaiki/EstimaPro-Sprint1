import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "../firebase/firebase";

const ESTIMACIONES_COLLECTION = "estimaciones";

const estimacionesCollection = collection(db, ESTIMACIONES_COLLECTION);

export const listEstimacionesByUser = async (userId) => {
  const q = query(
    estimacionesCollection,
    where("userId", "==", userId),
    orderBy("createdAt", "desc")
  );

  const snapshot = await getDocs(q);

  return snapshot.docs.map((entry) => ({
    id: entry.id,
    ...entry.data(),
  }));
};

export const createEstimacion = async (payload) => {
  const docRef = await addDoc(estimacionesCollection, {
    ...payload,
    monto: Number(payload.monto),
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  return docRef.id;
};

export const updateEstimacion = async (estimacionId, payload) => {
  const docRef = doc(db, ESTIMACIONES_COLLECTION, estimacionId);

  await updateDoc(docRef, {
    ...payload,
    monto: Number(payload.monto),
    updatedAt: serverTimestamp(),
  });
};

export const deleteEstimacion = async (estimacionId) => {
  const docRef = doc(db, ESTIMACIONES_COLLECTION, estimacionId);
  await deleteDoc(docRef);
};
