import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "../firebase/firebase";

const estimationsCollection = collection(db, "estimations");

const createAppError = (code, message) => {
  const error = new Error(message);
  error.code = code;
  return error;
};

const assertUserId = (userId) => {
  if (!userId) {
    throw createAppError(
      "app/missing-user-id",
      "No hay usuario autenticado para esta operación.",
    );
  }
};

const normalizeText = (value) => (value ?? "").trim();

const normalizeAmount = (value) => {
  const amount = Number(value);
  return Number.isFinite(amount) ? amount : 0;
};

const toEstimation = (snapshot) => {
  const data = snapshot.data();

  return {
    id: snapshot.id,
    clientName: data.clientName ?? "",
    projectName: data.projectName ?? "",
    amount: normalizeAmount(data.amount),
    description: data.description ?? "",
    userId: data.userId ?? "",
    createdAt: data.createdAt ?? null,
    updatedAt: data.updatedAt ?? null,
  };
};

export const listEstimationsByUser = async (userId) => {
  assertUserId(userId);

  const q = query(estimationsCollection, where("userId", "==", userId));
  const snapshots = await getDocs(q);

  return snapshots.docs
    .map(toEstimation)
    .filter((item) => item.userId === userId)
    .sort((a, b) => {
      const aTime = a.updatedAt?.toMillis?.() ?? 0;
      const bTime = b.updatedAt?.toMillis?.() ?? 0;
      return bTime - aTime;
    });
};

export const createEstimation = async (userId, estimation) => {
  assertUserId(userId);

  const payload = {
    clientName: normalizeText(estimation.clientName),
    projectName: normalizeText(estimation.projectName),
    amount: normalizeAmount(estimation.amount),
    description: normalizeText(estimation.description),
    userId,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };

  const created = await addDoc(estimationsCollection, payload);
  return created.id;
};

export const updateEstimation = async (id, userId, estimation) => {
  assertUserId(userId);

  const estimationRef = doc(db, "estimations", id);
  const snapshot = await getDoc(estimationRef);

  if (!snapshot.exists()) {
    throw createAppError("not-found", "La estimación no existe.");
  }

  const currentData = snapshot.data();

  if (!currentData.userId) {
    throw createAppError(
      "app/missing-owner",
      "La estimación no tiene userId y no se puede actualizar de forma segura.",
    );
  }

  if (currentData.userId !== userId) {
    throw createAppError(
      "permission-denied",
      "No tienes permisos para actualizar esta estimación.",
    );
  }

  await updateDoc(estimationRef, {
    clientName: normalizeText(estimation.clientName),
    projectName: normalizeText(estimation.projectName),
    amount: normalizeAmount(estimation.amount),
    description: normalizeText(estimation.description),
    userId,
    updatedAt: serverTimestamp(),
  });
};

export const deleteEstimation = async (id, userId) => {
  assertUserId(userId);

  const estimationRef = doc(db, "estimations", id);
  const snapshot = await getDoc(estimationRef);

  if (!snapshot.exists()) {
    throw createAppError("not-found", "La estimación no existe.");
  }

  const currentData = snapshot.data();

  if (!currentData.userId) {
    throw createAppError(
      "app/missing-owner",
      "La estimación no tiene userId y no se puede eliminar de forma segura.",
    );
  }

  if (currentData.userId !== userId) {
    throw createAppError(
      "permission-denied",
      "No tienes permisos para eliminar esta estimación.",
    );
  }

  await deleteDoc(estimationRef);
};
