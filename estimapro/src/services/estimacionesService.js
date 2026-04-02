import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "../firebase/firebase";

const ESTIMACIONES_COLLECTION = "estimaciones";

const estimacionesCollection = collection(db, ESTIMACIONES_COLLECTION);

const logFirestoreError = (operation, error, context = {}) => {
  console.error(`[Firestore][${operation}]`, {
    code: error?.code ?? "unknown",
    message: error?.message ?? "unknown",
    name: error?.name ?? "unknown",
    context,
    fullError: error,
  });
};

const getDateValue = (value) => {
  if (!value) return 0;

  if (typeof value.toMillis === "function") {
    return value.toMillis();
  }

  if (value instanceof Date) {
    return value.getTime();
  }

  if (typeof value === "number") {
    return value;
  }

  if (typeof value === "string") {
    const parsed = new Date(value).getTime();
    return Number.isNaN(parsed) ? 0 : parsed;
  }

  if (typeof value === "object" && "seconds" in value) {
    return Number(value.seconds) * 1000;
  }

  return 0;
};

export const listEstimacionesByUser = async (userId) => {
  try {
    const q = query(estimacionesCollection, where("userId", "==", userId));

    const snapshot = await getDocs(q);

    const estimaciones = snapshot.docs.map((entry) => ({
      id: entry.id,
      ...entry.data(),
    }));

    // Orden local para evitar requerir índice compuesto (userId + createdAt).
    return estimaciones.sort((a, b) => {
      const aDate = getDateValue(a.createdAt ?? a.updatedAt);
      const bDate = getDateValue(b.createdAt ?? b.updatedAt);
      return bDate - aDate;
    });
  } catch (error) {
    logFirestoreError("listEstimacionesByUser", error, { userId });
    throw error;
  }
};

export const createEstimacion = async (payload) => {
  try {
    const docRef = await addDoc(estimacionesCollection, {
      ...payload,
      monto: Number(payload.monto),
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    return docRef.id;
  } catch (error) {
    logFirestoreError("createEstimacion", error, {
      userId: payload?.userId ?? null,
      proyecto: payload?.proyecto ?? null,
    });
    throw error;
  }
};

export const updateEstimacion = async (estimacionId, payload) => {
  try {
    const docRef = doc(db, ESTIMACIONES_COLLECTION, estimacionId);

    await updateDoc(docRef, {
      ...payload,
      monto: Number(payload.monto),
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    logFirestoreError("updateEstimacion", error, {
      estimacionId,
      userId: payload?.userId ?? null,
      proyecto: payload?.proyecto ?? null,
    });
    throw error;
  }
};

export const deleteEstimacion = async (estimacionId) => {
  try {
    const docRef = doc(db, ESTIMACIONES_COLLECTION, estimacionId);
    await deleteDoc(docRef);
  } catch (error) {
    logFirestoreError("deleteEstimacion", error, { estimacionId });
    throw error;
  }
};
